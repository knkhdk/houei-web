// お知らせ投稿フォーム用のJavaScript

// セキュリティ設定
const SECURITY_CONFIG = {
    // 認証が必要なページかどうか
    requireAuth: true,
    // 有効な認証トークン（本番環境では環境変数から取得）
    validTokens: ['houei2024admin', 'houei2024post'],
    // セッション有効期限（24時間）
    sessionTimeout: 24 * 60 * 60 * 1000
};

// 認証チェック関数
function checkAuthentication() {
    // 開発環境では認証をスキップ（localhostの場合）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('開発環境: 認証をスキップします');
        return true;
    }
    
    // URLパラメータからトークンをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const adminToken = urlParams.get('admin');
    
    // 有効なトークンがあるかチェック
    const validToken = token && SECURITY_CONFIG.validTokens.includes(token);
    const validAdminToken = adminToken && SECURITY_CONFIG.validTokens.includes(adminToken);
    
    if (validToken || validAdminToken) {
        // セッションに認証情報を保存
        sessionStorage.setItem('newsAuth', JSON.stringify({
            authenticated: true,
            timestamp: Date.now(),
            token: token || adminToken
        }));
        return true;
    }
    
    // セッションから認証情報をチェック
    const sessionAuth = sessionStorage.getItem('newsAuth');
    if (sessionAuth) {
        try {
            const authData = JSON.parse(sessionAuth);
            const now = Date.now();
            
            // セッションが有効期限内かチェック
            if (authData.authenticated && (now - authData.timestamp) < SECURITY_CONFIG.sessionTimeout) {
                return true;
            } else {
                // セッション期限切れ
                sessionStorage.removeItem('newsAuth');
            }
        } catch (error) {
            console.error('セッション認証エラー:', error);
            sessionStorage.removeItem('newsAuth');
        }
    }
    
    return false;
}

// 認証要求画面を表示
function showAuthenticationRequired() {
    const body = document.body;
    body.innerHTML = `
        <div class="auth-required-container">
            <div class="auth-required-content">
                <div class="auth-icon">🔒</div>
                <h1>認証が必要です</h1>
                <p>お知らせ投稿ページにアクセスするには、認証が必要です。</p>
                <div class="auth-form">
                    <input type="password" id="authPassword" placeholder="認証パスワードを入力してください" class="auth-input">
                    <button id="authSubmit" class="btn btn-primary">認証</button>
                </div>
                <div class="auth-info">
                    <p>※ 認証パスワードは管理者にお問い合わせください。</p>
                    <p>※ 開発環境では認証は不要です。</p>
                </div>
                <div class="auth-error" id="authError" style="display: none;">
                    <p>認証に失敗しました。正しいパスワードを入力してください。</p>
                </div>
            </div>
        </div>
        <style>
            .auth-required-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Noto Sans JP', sans-serif;
            }
            .auth-required-content {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            .auth-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .auth-form {
                margin: 30px 0;
            }
            .auth-input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 15px;
                box-sizing: border-box;
            }
            .auth-input:focus {
                outline: none;
                border-color: #2c5aa0;
            }
            .btn {
                background: #2c5aa0;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .btn:hover {
                background: #1e4a8c;
            }
            .auth-info {
                margin-top: 20px;
                color: #666;
                font-size: 14px;
            }
            .auth-error {
                color: #e74c3c;
                background: #fdf2f2;
                padding: 10px;
                border-radius: 5px;
                margin-top: 15px;
            }
        </style>
    `;
    
    // 認証フォームのイベントリスナー
    const authPassword = document.getElementById('authPassword');
    const authSubmit = document.getElementById('authSubmit');
    const authError = document.getElementById('authError');
    
    authSubmit.addEventListener('click', function() {
        const password = authPassword.value;
        
        // 簡単な認証（本番環境ではより複雑な認証システムを使用）
        if (password === 'houei2024admin' || password === 'houei2024post') {
            // 認証成功
            sessionStorage.setItem('newsAuth', JSON.stringify({
                authenticated: true,
                timestamp: Date.now(),
                token: password
            }));
            
            // ページを再読み込み
            window.location.reload();
        } else {
            // 認証失敗
            authError.style.display = 'block';
            authPassword.value = '';
        }
    });
    
    // Enterキーで認証
    authPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authSubmit.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('news-post.js loaded');
    
    // セキュリティチェック: 認証なしでのアクセスを制限
    if (!checkAuthentication()) {
        showAuthenticationRequired();
        return;
    }
    
    // URLパラメータからトークンをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const adminToken = urlParams.get('admin');
    
    // 管理トークンが正しい場合、管理モードを自動有効化
    if (adminToken === 'houei2024admin') {
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'block';
            // loadAdminNewsList関数は後で定義されるので、setTimeoutで遅延実行
            setTimeout(() => {
                if (typeof loadAdminNewsList === 'function') {
                    loadAdminNewsList();
                }
            }, 100);
        }
    }
    
    const form = document.getElementById('newsPostForm');
    const previewBtn = document.getElementById('previewBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const newsDateInput = document.getElementById('newsDate');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const syncDataBtn = document.getElementById('syncDataBtn');
    const generateHtmlBtn = document.getElementById('generateHtmlBtn');

    // 要素が見つからない場合のデバッグ
    if (!form) {
        console.error('Form not found: newsPostForm');
        return;
    }
    
    if (!previewBtn) {
        console.error('Preview button not found');
    }
    
    if (!saveDraftBtn) {
        console.error('Save draft button not found');
    }

    console.log('Form elements found:', {
        form: !!form,
        previewBtn: !!previewBtn,
        saveDraftBtn: !!saveDraftBtn,
        newsDateInput: !!newsDateInput
    });

    // 今日の日付をデフォルトに設定
    const today = new Date().toISOString().split('T')[0];
    if (newsDateInput) {
        newsDateInput.value = today;
    }

    // プレビューボタンの処理
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            console.log('Preview button clicked');
            generatePreview();
            if (previewContainer) {
                previewContainer.style.display = 'block';
                previewContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 下書き保存ボタンの処理
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            console.log('Save draft button clicked');
            saveAsDraft();
        });
    }

    // エクスポートボタンの処理
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            console.log('Export button clicked');
            exportNewsData();
        });
    }

    // インポートボタンの処理
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function() {
            console.log('Import button clicked');
            importNewsData();
        });
    }

    // データ同期ボタンの処理
    if (syncDataBtn) {
        syncDataBtn.addEventListener('click', function() {
            console.log('Sync data button clicked');
            syncAllData();
        });
    }

    // HTML生成ボタンの処理
    if (generateHtmlBtn) {
        generateHtmlBtn.addEventListener('click', function() {
            console.log('Generate HTML button clicked');
            generateHtmlFiles();
        });
    }

    // フォーム送信の処理
    if (form) {
        form.addEventListener('submit', function(e) {
            console.log('Form submitted');
            e.preventDefault();
            submitNews();
        });
    }

    // プレビュー生成
    function generatePreview() {
        const formData = new FormData(form);
        const title = formData.get('title');
        const category = formData.get('category');
        const date = formData.get('date');
        const summary = formData.get('summary');
        const content = formData.get('content');
        const imageFile = formData.get('image');

        // 日付のフォーマット
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        // 詳細情報の取得
        const details = [];
        for (let i = 1; i <= 3; i++) {
            const label = formData.get(`detail${i}_label`);
            const value = formData.get(`detail${i}_value`);
            if (label && value) {
                details.push({ label, value });
            }
        }

        // プレビューHTMLの生成
        let previewHTML = `
            <div class="preview-accordion-item">
                <div class="preview-accordion-header">
                    <div class="preview-accordion-date">
                        <span class="preview-date-day">${day}</span>
                        <span class="preview-date-month">${year}.${month.toString().padStart(2, '0')}</span>
                    </div>
                    <div class="preview-accordion-title">
                        <span class="preview-accordion-category">${category}</span>
                        <h3>${title}</h3>
                    </div>
                </div>
                <div class="preview-accordion-content">
                    <p>${summary}</p>
                    <p>${content}</p>
        `;

        // 画像プレビュー
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewHTML += `
                    <div class="news-image">
                        <img src="${e.target.result}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
                    </div>
                `;
                completePreview();
            };
            reader.readAsDataURL(imageFile);
        } else {
            completePreview();
        }

        function completePreview() {
            // 詳細情報の追加
            if (details.length > 0) {
                previewHTML += '<div class="preview-news-details">';
                details.forEach(detail => {
                    previewHTML += `<p><strong>${detail.label}:</strong> ${detail.value}</p>`;
                });
                previewHTML += '</div>';
            }

            previewHTML += '</div></div>';
            previewContent.innerHTML = previewHTML;
        }
    }

    // 下書き保存
    async function saveAsDraft() {
        const formData = new FormData(form);
        
        // バリデーション
        if (!validateForm(formData)) {
            return;
        }

        // 画像の処理
        const imageFile = formData.get('image');
        let imageData = null;
        
        if (imageFile && imageFile.size > 0) {
            imageData = await processImage(imageFile);
        }

        // 下書きデータの作成
        const draftData = {
            id: Date.now().toString(), // 一時的なID生成
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            details: {
                detail1: { label: formData.get('detail1_label'), value: formData.get('detail1_value') },
                detail2: { label: formData.get('detail2_label'), value: formData.get('detail2_value') },
                detail3: { label: formData.get('detail3_label'), value: formData.get('detail3_value') }
            },
            image: imageData,
            status: 'draft',
            timestamp: new Date().toISOString()
        };

        console.log('下書きデータ:', draftData);

        // fileManagerが利用できる場合はそれを使用、そうでなければローカルストレージに直接保存
        let savedDraft = null;
        
        if (window.fileManager) {
            console.log('fileManagerを使用して下書き保存');
            savedDraft = await window.fileManager.saveDraft(draftData);
        } else {
            console.log('ローカルストレージに下書きを直接保存');
            try {
                // 既存の下書きデータを取得
                const existingDrafts = JSON.parse(localStorage.getItem('draftsData') || '[]');
                
                // 新しい下書きを先頭に追加
                existingDrafts.unshift(draftData);
                
                // ローカルストレージに保存
                localStorage.setItem('draftsData', JSON.stringify(existingDrafts));
                
                savedDraft = draftData;
                console.log('下書きをローカルストレージに保存完了');
            } catch (error) {
                console.error('下書き保存エラー:', error);
                showMessage('下書き保存に失敗しました: ' + error.message, 'error');
                return;
            }
        }
        
        if (savedDraft) {
            showMessage('下書きを保存しました', 'success');
            form.reset();
            if (newsDateInput) {
                newsDateInput.value = today;
            }
        } else {
            showMessage('下書き保存に失敗しました', 'error');
        }
    }

    // お知らせ投稿
    async function submitNews() {
        const formData = new FormData(form);
        
        // バリデーション
        if (!validateForm(formData)) {
            return;
        }

        // 画像の処理
        const imageFile = formData.get('image');
        let imageData = null;
        
        if (imageFile && imageFile.size > 0) {
            imageData = await processImage(imageFile);
        }

        // お知らせデータの作成
        const newsData = {
            id: Date.now().toString(), // 一時的なID生成
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            details: {
                detail1: { label: formData.get('detail1_label'), value: formData.get('detail1_value') },
                detail2: { label: formData.get('detail2_label'), value: formData.get('detail2_value') },
                detail3: { label: formData.get('detail3_label'), value: formData.get('detail3_value') }
            },
            image: imageData,
            status: 'published',
            timestamp: new Date().toISOString()
        };

        console.log('投稿データ:', newsData);

        // ローカルストレージとサーバーAPIの両方に保存
        let savedNews = null;
        let saveSuccess = false;
        
        try {
            console.log('データを保存中...');
            
            // 1. ローカルストレージに保存
            console.log('ローカルストレージに保存');
            const existingData = JSON.parse(localStorage.getItem('newsData') || '[]');
            existingData.unshift(newsData);
            localStorage.setItem('newsData', JSON.stringify(existingData));
            console.log('ローカルストレージに保存完了');
            
            // 2. サーバーAPIに送信（全データを送信）
            try {
                console.log('サーバーAPIに送信中...');
                const response = await fetch('/api/news', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(existingData) // 全データを送信
                });
                
                if (response.ok) {
                    console.log('サーバーAPIに送信完了');
                } else {
                    console.warn('サーバーAPI送信に失敗しました:', response.status);
                }
            } catch (apiError) {
                console.warn('サーバーAPI送信エラー:', apiError);
                // API送信失敗でもローカル保存は成功しているので続行
            }
            
            savedNews = newsData;
            saveSuccess = true;
            
        } catch (error) {
            console.error('データ保存エラー:', error);
            showMessage('投稿に失敗しました: ' + error.message, 'error');
            return;
        }
        
        if (saveSuccess && savedNews) {
            showMessage('お知らせを投稿しました', 'success');
            form.reset();
            if (newsDateInput) {
                newsDateInput.value = today;
            }
            
            // 投稿完了後、自動でHTMLファイルを生成
            setTimeout(() => {
                try {
                    generateHtmlFiles();
                } catch (error) {
                    console.error('自動HTML生成エラー:', error);
                }
            }, 1000);
            
            // JSONファイルを直接更新（別PCでの同期のため）
            setTimeout(() => {
                try {
                    updateJsonFile();
                } catch (error) {
                    console.error('JSONファイル更新エラー:', error);
                }
            }, 2000);
            
            // トップページが開いている場合は更新を通知
            if (window.opener && window.opener.loadTopNews) {
                try {
                    window.opener.loadTopNews();
                    console.log('トップページのお知らせを更新しました');
                } catch (error) {
                    console.error('トップページ更新エラー:', error);
                }
            }
            
            // カスタムイベントで更新を通知（より確実）
            try {
                const updateEvent = new CustomEvent('newsUpdated', {
                    detail: { newsData: savedNews }
                });
                window.dispatchEvent(updateEvent);
                
                // 親ウィンドウにも通知
                if (window.opener) {
                    window.opener.dispatchEvent(updateEvent);
                }
                console.log('カスタムイベントで更新を通知しました');
            } catch (error) {
                console.error('カスタムイベント通知エラー:', error);
            }
            
            // 投稿完了後、お知らせ一覧ページにリダイレクト
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 5000);
        } else {
            showMessage('投稿に失敗しました。データの保存に問題が発生しました。', 'error');
        }
    }

    // 画像処理
    async function processImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // データエクスポート
    async function exportNewsData() {
        try {
            const newsData = await window.fileManager.loadNews();
            if (newsData.length > 0) {
                window.fileManager.exportData(newsData, 'news-data.json');
                showMessage('データをエクスポートしました', 'success');
            } else {
                showMessage('エクスポートするデータがありません', 'warning');
            }
        } catch (error) {
            console.error('Export error:', error);
            showMessage('エクスポートに失敗しました', 'error');
        }
    }

    // データインポート
    async function importNewsData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const importedData = await window.fileManager.importData(file);
                    
                    if (Array.isArray(importedData)) {
                        // 既存データとマージ
                        const existingData = await window.fileManager.loadNews();
                        const mergedData = [...existingData, ...importedData];
                        
                        // 重複を除去（IDベース）
                        const uniqueData = mergedData.filter((item, index, self) => 
                            index === self.findIndex(t => t.id === item.id)
                        );
                        
                        await window.fileManager.saveNews(uniqueData);
                        showMessage('データをインポートしました', 'success');
                        
                        // ページをリロード
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        showMessage('無効なデータ形式です', 'error');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    showMessage('インポートに失敗しました', 'error');
                }
            }
        };
        
        input.click();
    }

    // フォームバリデーション
    function validateForm(formData) {
        const requiredFields = ['title', 'category', 'date', 'summary', 'content'];
        
        for (const field of requiredFields) {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                const label = getFieldLabel(field);
                showMessage(`${label}は必須項目です`, 'error');
                return false;
            }
        }
        
        return true;
    }

    // フィールドラベル取得
    function getFieldLabel(fieldName) {
        const labels = {
            title: 'タイトル',
            category: 'カテゴリ',
            date: '日付',
            summary: '概要',
            content: '本文'
        };
        return labels[fieldName] || fieldName;
    }

    // HTMLファイル生成機能（Node.js不要）
    function generateHtmlFiles() {
        if (!window.HtmlGenerator) {
            showMessage('HTML生成機能が利用できません', 'error');
            return;
        }

        try {
            showMessage('HTMLファイルを生成しています...', 'info');
            
            // ローカルストレージから投稿データを取得
            const localData = localStorage.getItem('newsData');
            const newsData = localData ? JSON.parse(localData) : [];

            if (newsData.length === 0) {
                showMessage('生成するお知らせデータがありません', 'warning');
                return;
            }

            const htmlGenerator = new window.HtmlGenerator();
            
            // お知らせ一覧のHTMLを生成
            const newsListHtml = htmlGenerator.generateNewsListHtml(newsData);
            htmlGenerator.downloadHtml(newsListHtml, 'news-index.html');
            
            // 各お知らせの詳細ページを生成
            const publishedNews = newsData.filter(news => news.status === 'published');
            
            publishedNews.forEach(news => {
                const detailHtml = htmlGenerator.generateDetailHtml(news);
                const filename = `detail-${news.id}.html`;
                htmlGenerator.downloadHtml(detailHtml, filename);
            });

            showMessage(`HTMLファイルの生成が完了しました。一覧ページ1件、詳細ページ${publishedNews.length}件をダウンロードしました。`, 'success');
            
        } catch (error) {
            console.error('HTML生成エラー:', error);
            showMessage('HTMLファイルの生成に失敗しました: ' + error.message, 'error');
        }
    }

    // JSONファイルを直接更新する機能（別PCでの同期のため）
    async function updateJsonFile() {
        try {
            console.log('JSONファイル更新開始');
            
            // ローカルストレージから最新データを取得
            const localData = localStorage.getItem('newsData');
            const newsData = localData ? JSON.parse(localData) : [];
            
            if (newsData.length === 0) {
                console.log('更新するデータがありません');
                return;
            }
            
            // サーバーAPIを使用してJSONファイルを更新
            const response = await fetch('/api/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsData)
            });
            
            if (response.ok) {
                console.log('JSONファイルの更新が完了しました');
                showMessage('JSONファイルの更新が完了しました', 'success');
            } else {
                console.warn('JSONファイルの更新に失敗しました:', response.status);
                showMessage('JSONファイルの更新に失敗しました（サーバーが利用できません）', 'warning');
            }
            
        } catch (error) {
            console.error('JSONファイル更新エラー:', error);
            showMessage('JSONファイルの更新に失敗しました: ' + error.message, 'warning');
        }
    }

    // データ同期機能（Node.js不要）
    async function syncAllData() {
        if (!window.DataSync) {
            showMessage('データ同期機能が利用できません', 'error');
            return;
        }

        try {
            showMessage('データ同期を開始しています...', 'info');
            
            const dataSync = new window.DataSync();
            
            // 同期状況を表示（非同期）
            const status = await dataSync.showSyncStatus();
            
            // データを同期
            const result = await dataSync.syncData();
            
            if (result.success) {
                showMessage(`データ同期が完了しました。合計${result.totalItems}件のデータを同期しました。`, 'success');
                
                // 管理モードが有効な場合は、管理リストを更新
                if (document.getElementById('adminSection').style.display !== 'none') {
                    loadAdminNewsList();
                }
            } else {
                showMessage('データ同期に失敗しました', 'error');
            }
        } catch (error) {
            console.error('データ同期エラー:', error);
            showMessage('データ同期中にエラーが発生しました: ' + error.message, 'error');
        }
    }

    // メッセージ表示
    function showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            // メッセージコンテナが存在しない場合は作成
            const container = document.createElement('div');
            container.id = 'messageContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
        
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        
        // メッセージタイプに応じたスタイル
        switch (type) {
            case 'success':
                messageElement.style.backgroundColor = '#4caf50';
                break;
            case 'error':
                messageElement.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                messageElement.style.backgroundColor = '#ff9800';
                break;
            default:
                messageElement.style.backgroundColor = '#2196f3';
        }
        
        messageElement.textContent = message;
        
        const container = document.getElementById('messageContainer');
        container.appendChild(messageElement);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    // 下書き読み込み
    async function loadDraft() {
        try {
            const draftsData = await window.fileManager.loadDrafts();
            if (draftsData.length > 0) {
                const latestDraft = draftsData[0]; // 最新の下書き
                
                // フォームに値を設定
                if (form) {
                    form.querySelector('[name="title"]').value = latestDraft.title || '';
                    form.querySelector('[name="category"]').value = latestDraft.category || '';
                    form.querySelector('[name="date"]').value = latestDraft.date || today;
                    form.querySelector('[name="summary"]').value = latestDraft.summary || '';
                    form.querySelector('[name="content"]').value = latestDraft.content || '';
                    
                    // 詳細情報の設定
                    if (latestDraft.details) {
                        Object.keys(latestDraft.details).forEach(key => {
                            const detail = latestDraft.details[key];
                            if (detail.label) {
                                form.querySelector(`[name="${key}_label"]`).value = detail.label;
                            }
                            if (detail.value) {
                                form.querySelector(`[name="${key}_value"]`).value = detail.value;
                            }
                        });
                    }
                }
                
                showMessage('最新の下書きを読み込みました', 'success');
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }

    // 管理者モード切り替え
    function toggleAdminMode() {
        // パスワード認証を要求
        const password = prompt('管理モードにアクセスするにはパスワードが必要です:');
        if (password === 'houei2024') { // 簡単なパスワード（本番ではより複雑に）
            const adminSection = document.getElementById('adminSection');
            if (adminSection) {
                const isVisible = adminSection.style.display !== 'none';
                adminSection.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    loadAdminNewsList();
                }
            }
        } else if (password !== null) {
            alert('パスワードが正しくありません');
        }
    }

    // 管理者用お知らせ一覧読み込み（APIから取得）
    async function loadAdminNewsList() {
        try {
            console.log('管理モード: お知らせ一覧を読み込み中...');
            
            const adminList = document.getElementById('adminNewsList');
            const loadingMessage = document.getElementById('adminLoadingMessage');
            
            // ローディング表示を表示
            if (loadingMessage) {
                loadingMessage.style.display = 'block';
            }
            
            // サーバーからお知らせデータを取得
            const response = await fetch('/api/news');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newsData = await response.json();
            
            console.log('管理モード: 取得したお知らせデータ:', newsData);
            
            // ローディング表示を非表示
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            if (adminList && newsData.length > 0) {
                let listHTML = '';
                newsData.forEach(news => {
                    const date = new Date(news.date).toLocaleDateString('ja-JP');
                    const statusClass = news.status === 'published' ? 'published' : 'draft';
                    const statusText = news.status === 'published' ? '公開中' : '下書き';
                    
                    listHTML += `
                        <div class="admin-news-item ${statusClass}">
                            <div class="admin-news-info">
                                <span class="admin-news-date">${date}</span>
                                <span class="admin-news-category">${news.category}</span>
                                <span class="admin-news-status">${statusText}</span>
                                <span class="admin-news-title">${news.title}</span>
                            </div>
                            <div class="admin-news-actions">
                                <button onclick="showEditForm('${news.id}')" class="btn btn-secondary">編集</button>
                                <button onclick="showDeleteConfirmation('${news.id}')" class="btn btn-danger">削除</button>
                            </div>
                        </div>
                    `;
                });
                adminList.innerHTML = listHTML;
                console.log('管理モード: お知らせ一覧を表示しました');
            } else if (adminList) {
                adminList.innerHTML = '<p class="no-news-message">お知らせがありません</p>';
                console.log('管理モード: お知らせがありません');
            }
        } catch (error) {
            console.error('管理モード: お知らせ一覧の読み込みエラー:', error);
            
            // ローディング表示を非表示
            const loadingMessage = document.getElementById('adminLoadingMessage');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            // フォールバック: ローカルストレージから取得
            try {
                const localData = localStorage.getItem('newsData');
                const newsData = localData ? JSON.parse(localData) : [];
                const adminList = document.getElementById('adminNewsList');
                
                if (adminList && newsData.length > 0) {
                    let listHTML = '';
                    newsData.forEach(news => {
                        const date = new Date(news.date).toLocaleDateString('ja-JP');
                        listHTML += `
                            <div class="admin-news-item">
                                <div class="admin-news-info">
                                    <span class="admin-news-date">${date}</span>
                                    <span class="admin-news-category">${news.category}</span>
                                    <span class="admin-news-title">${news.title}</span>
                                </div>
                                <div class="admin-news-actions">
                                    <button onclick="showEditForm('${news.id}')" class="btn btn-secondary">編集</button>
                                    <button onclick="showDeleteConfirmation('${news.id}')" class="btn btn-danger">削除</button>
                                </div>
                            </div>
                        `;
                    });
                    adminList.innerHTML = listHTML;
                    console.log('管理モード: ローカルストレージからお知らせ一覧を表示しました');
                } else if (adminList) {
                    adminList.innerHTML = '<p class="no-news-message">お知らせがありません</p>';
                }
            } catch (localError) {
                console.error('管理モード: ローカルストレージからの読み込みも失敗:', localError);
                const adminList = document.getElementById('adminNewsList');
                if (adminList) {
                    adminList.innerHTML = '<p class="error-message">お知らせの読み込みに失敗しました</p>';
                }
            }
        }
    }

    // 削除確認
    function showDeleteConfirmation(newsId) {
        if (confirm('このお知らせを削除しますか？')) {
            deleteNews(newsId);
        }
    }

    // お知らせ削除（Node.js不要）
    function deleteNews(newsId) {
        try {
            const localData = localStorage.getItem('newsData');
            const newsData = localData ? JSON.parse(localData) : [];
            
            // 指定されたIDのお知らせを削除
            const filteredData = newsData.filter(news => news.id !== newsId);
            
            // ローカルストレージに保存
            localStorage.setItem('newsData', JSON.stringify(filteredData));
            
            showMessage('お知らせを削除しました', 'success');
            loadAdminNewsList(); // リストを更新
        } catch (error) {
            console.error('Error deleting news:', error);
            showMessage('削除に失敗しました', 'error');
        }
    }

    // 編集フォーム表示
    function showEditForm(newsId) {
        // 編集フォームの実装（必要に応じて）
        console.log('Edit form for news ID:', newsId);
    }

    // 下書き読み込みボタンのイベントリスナー
    const loadDraftBtn = document.getElementById('loadDraftBtn');
    if (loadDraftBtn) {
        loadDraftBtn.addEventListener('click', loadDraft);
    }

    // 管理者モード切り替えボタンのイベントリスナー
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', toggleAdminMode);
    }
});

// CSS アニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 