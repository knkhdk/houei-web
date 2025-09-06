// 施工実績編集機能
document.addEventListener('DOMContentLoaded', function() {
    loadWorkData();
    
    const form = document.getElementById('worksEditForm');
    if (form) {
        form.addEventListener('submit', handleWorksEdit);
    }
});

// URLパラメータからIDを取得
function getWorkIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 施工実績データを読み込み
function loadWorkData() {
    const workId = getWorkIdFromUrl();
    
    if (!workId) {
        showMessage('施工実績IDが指定されていません。', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // localStorageから施工実績データを取得
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    const work = works.find(w => w.id === workId);
    
    if (!work) {
        showMessage('指定された施工実績が見つかりません。', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // フォームにデータを設定
    populateForm(work);
    
    // ローディングメッセージを非表示にしてフォームを表示
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('worksEditForm').style.display = 'block';
}

// フォームにデータを設定
function populateForm(work) {
    document.getElementById('workId').value = work.id;
    document.getElementById('title').value = work.title;
    document.getElementById('category').value = work.category;
    document.getElementById('location').value = work.location;
    document.getElementById('description').value = work.description;
    document.getElementById('year').value = work.year;
    
    // 現在の画像を表示
    const currentImageDiv = document.getElementById('currentImage');
    currentImageDiv.innerHTML = `
        <p><strong>現在の画像:</strong></p>
        <img src="../images/${work.image}" alt="${work.title}" style="max-width: 200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">
    `;
    
    // 詳細情報を設定
    const details = work.details || {};
    const detailKeys = Object.keys(details);
    
    for (let i = 1; i <= 4; i++) {
        const keyInput = document.getElementById(`detail${i}_key`);
        const valueInput = document.getElementById(`detail${i}_value`);
        
        if (detailKeys[i - 1]) {
            keyInput.value = detailKeys[i - 1];
            valueInput.value = details[detailKeys[i - 1]];
        } else {
            keyInput.value = '';
            valueInput.value = '';
        }
    }
}

// フォーム送信処理
function handleWorksEdit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const workId = formData.get('id');
    
    const updatedWorkData = {
        id: workId,
        title: formData.get('title'),
        category: formData.get('category'),
        location: formData.get('location'),
        description: formData.get('description'),
        year: parseInt(formData.get('year')),
        image: formData.get('image') ? 'works/' + formData.get('image').name : getCurrentImagePath(workId),
        details: {},
        createdAt: getCurrentWorkData(workId).createdAt,
        updatedAt: new Date().toISOString()
    };

    // 詳細情報を追加
    for (let i = 1; i <= 4; i++) {
        const key = formData.get(`detail${i}_key`);
        const value = formData.get(`detail${i}_value`);
        if (key && value) {
            updatedWorkData.details[key] = value;
        }
    }

    // 既存の施工実績データを取得
    let works = JSON.parse(localStorage.getItem('works') || '[]');
    
    // 該当する施工実績を更新
    const workIndex = works.findIndex(w => w.id === workId);
    if (workIndex !== -1) {
        works[workIndex] = updatedWorkData;
        
        // localStorageに保存
        localStorage.setItem('works', JSON.stringify(works));
        
        // 成功メッセージを表示
        showMessage('施工実績が正常に更新されました。', 'success');
        
        // 3秒後に施工実績一覧ページにリダイレクト
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        showMessage('施工実績の更新に失敗しました。', 'error');
    }
}

// 現在の画像パスを取得
function getCurrentImagePath(workId) {
    const work = getCurrentWorkData(workId);
    return work ? work.image : 'works/placeholder.jpg';
}

// 現在の施工実績データを取得
function getCurrentWorkData(workId) {
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    return works.find(w => w.id === workId);
}

// 削除機能
function deleteWork() {
    const workId = getWorkIdFromUrl();
    
    if (!workId) {
        showMessage('施工実績IDが指定されていません。', 'error');
        return;
    }

    if (confirm('この施工実績を削除しますか？この操作は取り消せません。')) {
        // 既存の施工実績データを取得
        let works = JSON.parse(localStorage.getItem('works') || '[]');
        
        // 該当する施工実績を削除
        works = works.filter(w => w.id !== workId);
        
        // localStorageに保存
        localStorage.setItem('works', JSON.stringify(works));
        
        // 成功メッセージを表示
        showMessage('施工実績が正常に削除されました。', 'success');
        
        // 3秒後に施工実績一覧ページにリダイレクト
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

// プレビュー機能
function previewWorkEdit() {
    const form = document.getElementById('worksEditForm');
    const formData = new FormData(form);
    
    const previewData = {
        title: formData.get('title') || '工事名が入力されていません',
        category: formData.get('category') || 'カテゴリが選択されていません',
        location: formData.get('location') || '施工場所が入力されていません',
        description: formData.get('description') || '工事概要が入力されていません',
        year: formData.get('year') || '施工年が入力されていません',
        image: getCurrentImagePath(getWorkIdFromUrl()),
        details: {}
    };

    // 詳細情報を追加
    for (let i = 1; i <= 4; i++) {
        const key = formData.get(`detail${i}_key`);
        const value = formData.get(`detail${i}_value`);
        if (key && value) {
            previewData.details[key] = value;
        }
    }

    // プレビューHTMLを生成
    const previewHTML = generateWorksPreviewHTML(previewData);
    
    // プレビューを表示
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = previewHTML;
    previewContainer.style.display = 'block';
    
    // プレビューまでスクロール
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// プレビューHTML生成
function generateWorksPreviewHTML(data) {
    let detailsHTML = '';
    for (const [key, value] of Object.entries(data.details)) {
        detailsHTML += `<div class="detail-item"><strong>${key}:</strong> ${value}</div>`;
    }

    return `
        <div class="works-card preview-card">
            <div class="works-card-image">
                <img src="../images/${data.image}" alt="${data.title}">
            </div>
            <div class="works-card-content">
                <div class="works-card-header">
                    <h3>${data.title}</h3>
                    <span class="works-category">${data.category}</span>
                </div>
                <div class="works-card-info">
                    <p><strong>施工場所:</strong> ${data.location}</p>
                    <p><strong>施工年:</strong> ${data.year}</p>
                </div>
                <div class="works-card-description">
                    <p>${data.description}</p>
                </div>
                ${detailsHTML ? `<div class="works-card-details">${detailsHTML}</div>` : ''}
            </div>
        </div>
    `;
}

// メッセージ表示
function showMessage(message, type = 'info') {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // スタイルを適用
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
    } else {
        messageDiv.style.backgroundColor = '#2196F3';
    }

    document.body.appendChild(messageDiv);

    // 3秒後に自動削除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
} 