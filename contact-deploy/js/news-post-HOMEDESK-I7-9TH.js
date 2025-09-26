// お知らせ投稿フォーム用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsPostForm');
    const previewBtn = document.getElementById('previewBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const newsDateInput = document.getElementById('newsDate');

    // 今日の日付をデフォルトに設定
    const today = new Date().toISOString().split('T')[0];
    newsDateInput.value = today;

    // プレビューボタンの処理
    previewBtn.addEventListener('click', function() {
        generatePreview();
        previewContainer.style.display = 'block';
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // 下書き保存ボタンの処理
    saveDraftBtn.addEventListener('click', function() {
        saveAsDraft();
    });

    // フォーム送信の処理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitNews();
    });

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
    function saveAsDraft() {
        const formData = new FormData(form);
        formData.set('status', 'draft');

        // ローカルストレージに保存（実際の実装ではサーバーに送信）
        const draftData = {
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
            status: 'draft',
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('newsDraft', JSON.stringify(draftData));
        showMessage('下書きを保存しました', 'success');
    }

    // フォーム送信
    function submitNews() {
        const formData = new FormData(form);
        
        // バリデーション
        if (!validateForm(formData)) {
            return;
        }

        // 送信処理（実際の実装ではサーバーに送信）
        const newsData = {
            id: Date.now(), // ユニークID
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
            status: formData.get('status'),
            timestamp: new Date().toISOString()
        };

        // 画像の処理（実際の実装ではサーバーにアップロード）
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            // 画像をBase64形式で保存（実際の実装ではサーバーにアップロード）
            const reader = new FileReader();
            reader.onload = function(e) {
                newsData.image = e.target.result;
                saveNewsData(newsData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveNewsData(newsData);
        }
    }

    // お知らせデータを保存
    function saveNewsData(newsData) {
        // 既存のお知らせデータを取得
        let existingNews = JSON.parse(localStorage.getItem('newsData') || '[]');
        
        // 新しいお知らせを先頭に追加
        existingNews.unshift(newsData);
        
        // 最大50件まで保存
        if (existingNews.length > 50) {
            existingNews = existingNews.slice(0, 50);
        }
        
        // ローカルストレージに保存
        localStorage.setItem('newsData', JSON.stringify(existingNews));
        
        // 成功メッセージ表示
        showMessage('お知らせを投稿しました', 'success');
        
        // フォームリセット
        form.reset();
        newsDateInput.value = today;
        
        // プレビューを非表示
        previewContainer.style.display = 'none';
        
        // お知らせ一覧ページに遷移
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // フォームバリデーション
    function validateForm(formData) {
        const requiredFields = ['title', 'category', 'date', 'summary', 'content'];
        
        for (let field of requiredFields) {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                showMessage(`${getFieldLabel(field)}は必須項目です`, 'error');
                return false;
            }
        }

        // 画像ファイルのバリデーション
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(imageFile.type)) {
                showMessage('画像ファイルは JPG, PNG, GIF 形式のみ対応しています', 'error');
                return false;
            }

            if (imageFile.size > maxSize) {
                showMessage('画像ファイルサイズは5MB以下にしてください', 'error');
                return false;
            }
        }

        return true;
    }

    // フィールドラベル取得
    function getFieldLabel(fieldName) {
        const labels = {
            'title': 'タイトル',
            'category': 'カテゴリ',
            'date': '投稿日',
            'summary': '概要',
            'content': '詳細内容'
        };
        return labels[fieldName] || fieldName;
    }

    // メッセージ表示
    function showMessage(message, type) {
        // 既存のメッセージを削除
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#dc3545';
        }

        document.body.appendChild(messageDiv);

        // 3秒後に自動削除
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
    }

    // 下書きの復元
    function loadDraft() {
        const draftData = localStorage.getItem('newsDraft');
        if (draftData) {
            try {
                const draft = JSON.parse(draftData);
                document.getElementById('newsTitle').value = draft.title || '';
                document.getElementById('newsCategory').value = draft.category || '';
                document.getElementById('newsDate').value = draft.date || today;
                document.getElementById('newsSummary').value = draft.summary || '';
                document.getElementById('newsContent').value = draft.content || '';
                
                if (draft.details) {
                    document.querySelector('input[name="detail1_label"]').value = draft.details.detail1?.label || '';
                    document.querySelector('input[name="detail1_value"]').value = draft.details.detail1?.value || '';
                    document.querySelector('input[name="detail2_label"]').value = draft.details.detail2?.label || '';
                    document.querySelector('input[name="detail2_value"]').value = draft.details.detail2?.value || '';
                    document.querySelector('input[name="detail3_label"]').value = draft.details.detail3?.label || '';
                    document.querySelector('input[name="detail3_value"]').value = draft.details.detail3?.value || '';
                }

                showMessage('下書きを復元しました', 'success');
            } catch (error) {
                console.error('下書きの復元に失敗しました:', error);
            }
        }
    }

    // ページ読み込み時に下書きを確認
    loadDraft();

    // 管理機能
    let isAdminMode = false;
    
    // 管理モード切り替え
    const toggleAdminModeBtn = document.getElementById('toggleAdminMode');
    const adminNotice = document.getElementById('adminNotice');
    const exitAdminModeBtn = document.getElementById('exitAdminMode');
    const adminSection = document.getElementById('adminSection');
    const adminNewsList = document.getElementById('adminNewsList');
    
    if (toggleAdminModeBtn) {
        toggleAdminModeBtn.addEventListener('click', function() {
            isAdminMode = !isAdminMode;
            toggleAdminMode();
        });
    }
    
    if (exitAdminModeBtn) {
        exitAdminModeBtn.addEventListener('click', function() {
            isAdminMode = false;
            toggleAdminMode();
        });
    }
    
    function toggleAdminMode() {
        if (isAdminMode) {
            adminNotice.style.display = 'block';
            adminSection.style.display = 'block';
            loadAdminNewsList();
        } else {
            adminNotice.style.display = 'none';
            adminSection.style.display = 'none';
        }
    }
    
    // 管理対象のお知らせ一覧を読み込み
    function loadAdminNewsList() {
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        
        if (newsData.length === 0) {
            adminNewsList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">投稿されたお知らせがありません。</p>';
            return;
        }
        
        let adminHTML = '';
        newsData.forEach(news => {
            const dateObj = new Date(news.date);
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
            
            adminHTML += `
                <div class="admin-news-item" data-id="${news.id}">
                    <div class="admin-news-date">
                        <span class="day">${day}</span>
                        <span class="month">${year}.${month.toString().padStart(2, '0')}</span>
                    </div>
                    <div class="admin-news-content">
                        <span class="admin-news-category">${news.category}</span>
                        <div class="admin-news-title">${news.title}</div>
                        <div class="admin-news-summary">${news.summary}</div>
                        <span class="admin-news-status ${news.status}">${news.status === 'published' ? '公開' : '下書き'}</span>
                    </div>
                    <div class="admin-news-actions">
                        <button class="btn btn-edit" onclick="editNews('${news.id}')">編集</button>
                        <button class="btn btn-delete" onclick="deleteNews('${news.id}')">削除</button>
                    </div>
                </div>
            `;
        });
        
        adminNewsList.innerHTML = adminHTML;
    }
    
    // 削除機能
    window.deleteNews = function(newsId) {
        showDeleteConfirmation(newsId);
    };
    
    function showDeleteConfirmation(newsId) {
        const modal = document.createElement('div');
        modal.className = 'delete-modal';
        modal.innerHTML = `
            <div class="delete-modal-content">
                <h3>お知らせを削除</h3>
                <p>このお知らせを削除してもよろしいですか？<br>この操作は取り消すことができません。</p>
                <div class="delete-modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.delete-modal').remove()">キャンセル</button>
                    <button class="btn btn-delete" onclick="confirmDeleteNews('${newsId}')">削除する</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    window.confirmDeleteNews = function(newsId) {
        // ローカルストレージから削除
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        const updatedNewsData = newsData.filter(news => news.id !== newsId);
        localStorage.setItem('newsData', JSON.stringify(updatedNewsData));
        
        // DOMから削除
        const newsElement = document.querySelector(`[data-id="${newsId}"]`);
        if (newsElement) {
            newsElement.style.opacity = '0';
            setTimeout(() => {
                newsElement.remove();
            }, 300);
        }
        
        // モーダルを閉じる
        const modal = document.querySelector('.delete-modal');
        if (modal) {
            modal.remove();
        }
        
        // 成功メッセージを表示
        showMessage('お知らせを削除しました', 'success');
    };
    
    // 編集機能
    window.editNews = function(newsId) {
        // ローカルストレージからお知らせデータを取得
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        const news = newsData.find(n => n.id === newsId);
        
        if (!news) {
            showMessage('お知らせが見つかりません', 'error');
            return;
        }
        
        showEditForm(news);
    };
    
    function showEditForm(news) {
        const overlay = document.createElement('div');
        overlay.className = 'edit-form-overlay';
        
        let detailsHTML = '';
        if (news.details) {
            Object.entries(news.details).forEach(([key, detail], index) => {
                if (detail.label && detail.value) {
                    detailsHTML += `
                        <div class="detail-row">
                            <input type="text" name="detail${index + 1}_label" value="${detail.label}" placeholder="項目名">
                            <input type="text" name="detail${index + 1}_value" value="${detail.value}" placeholder="内容">
                        </div>
                    `;
                }
            });
        }
        
        // 空の詳細フィールドを追加
        for (let i = Object.keys(news.details || {}).length + 1; i <= 3; i++) {
            detailsHTML += `
                <div class="detail-row">
                    <input type="text" name="detail${i}_label" placeholder="項目名">
                    <input type="text" name="detail${i}_value" placeholder="内容">
                </div>
            `;
        }
        
        overlay.innerHTML = `
            <div class="edit-form-container">
                <div class="edit-form-header">
                    <h3>お知らせを編集</h3>
                    <button class="edit-form-close" onclick="this.closest('.edit-form-overlay').remove()">&times;</button>
                </div>
                <form class="edit-form-body" id="editNewsForm">
                    <input type="hidden" name="id" value="${news.id}">
                    
                    <div class="form-group">
                        <label for="editTitle">タイトル *</label>
                        <input type="text" id="editTitle" name="title" value="${news.title}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editCategory">カテゴリ *</label>
                            <select id="editCategory" name="category" required>
                                <option value="採用情報" ${news.category === '採用情報' ? 'selected' : ''}>採用情報</option>
                                <option value="工事実績" ${news.category === '工事実績' ? 'selected' : ''}>工事実績</option>
                                <option value="技術情報" ${news.category === '技術情報' ? 'selected' : ''}>技術情報</option>
                                <option value="会社情報" ${news.category === '会社情報' ? 'selected' : ''}>会社情報</option>
                                <option value="お知らせ" ${news.category === 'お知らせ' ? 'selected' : ''}>お知らせ</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="editDate">投稿日 *</label>
                            <input type="date" id="editDate" name="date" value="${news.date}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editSummary">概要 *</label>
                        <textarea id="editSummary" name="summary" rows="3" required>${news.summary}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="editContent">詳細内容 *</label>
                        <textarea id="editContent" name="content" rows="8" required>${news.content}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="editImage">画像URL</label>
                        <input type="text" id="editImage" name="image" value="${news.image || ''}" placeholder="画像のURLを入力してください">
                    </div>
                    
                    <div class="form-group">
                        <label>詳細情報（オプション）</label>
                        <div class="details-inputs">
                            ${detailsHTML}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editStatus">公開状態</label>
                        <select id="editStatus" name="status">
                            <option value="published" ${news.status === 'published' ? 'selected' : ''}>公開</option>
                            <option value="draft" ${news.status === 'draft' ? 'selected' : ''}>下書き保存</option>
                        </select>
                    </div>
                </form>
                <div class="edit-form-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.edit-form-overlay').remove()">キャンセル</button>
                    <button class="btn btn-primary" onclick="saveEditedNews()">保存する</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    window.saveEditedNews = function() {
        const form = document.getElementById('editNewsForm');
        const formData = new FormData(form);
        
        const newsData = {
            id: formData.get('id'),
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            image: formData.get('image'),
            status: formData.get('status'),
            details: {}
        };
        
        // 詳細情報を処理
        for (let i = 1; i <= 3; i++) {
            const label = formData.get(`detail${i}_label`);
            const value = formData.get(`detail${i}_value`);
            if (label && value) {
                newsData.details[`detail${i}`] = { label, value };
            }
        }
        
        // ローカルストレージを更新
        const existingNewsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        const updatedNewsData = existingNewsData.map(news => 
            news.id === newsData.id ? newsData : news
        );
        localStorage.setItem('newsData', JSON.stringify(updatedNewsData));
        
        // 管理一覧を更新
        loadAdminNewsList();
        
        // 編集フォームを閉じる
        const overlay = document.querySelector('.edit-form-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        showMessage('お知らせを更新しました', 'success');
    };
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