// お知らせ一覧ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('news-list.js loaded');
    
    loadNewsList();
    setupFilterButtons();
});

// お知らせ一覧を読み込んで表示
async function loadNewsList() {
    try {
        console.log('お知らせ一覧を読み込み中...');
        
        // サーバーからお知らせデータを取得
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newsData = await response.json();
        
        console.log('取得したお知らせデータ:', newsData);
        
        displayNewsData(newsData);
        
    } catch (error) {
        console.error('お知らせ一覧の読み込みに失敗しました:', error);
        
        // フォールバック: ローカルストレージから取得を試行
        try {
            const localData = localStorage.getItem('newsData');
            const newsData = localData ? JSON.parse(localData) : [];
            
            if (newsData.length > 0) {
                console.log('ローカルストレージからお知らせデータを取得しました');
                displayNewsData(newsData);
                return;
            }
        } catch (localError) {
            console.error('ローカルストレージからの読み込みも失敗しました:', localError);
        }
        
        const newsTimeline = document.getElementById('newsTimeline');
        if (newsTimeline) {
            newsTimeline.innerHTML = `
                <div class="error-message">
                    <h3>エラーが発生しました</h3>
                    <p>お知らせの読み込みに失敗しました。ページを再読み込みしてください。</p>
                </div>
            `;
        }
    }
}

// お知らせデータを表示する共通関数
function displayNewsData(newsData) {
    const newsTimeline = document.getElementById('newsTimeline');
    if (!newsTimeline) {
        console.error('newsTimeline要素が見つかりません');
        return;
    }
    
    if (newsData.length === 0) {
        newsTimeline.innerHTML = `
            <div class="no-news-message">
                <h3>お知らせがありません</h3>
                <p>現在、お知らせはありません。新しいお知らせが投稿されると、ここに表示されます。</p>
            </div>
        `;
        return;
    }
    
    // 日付順でソート（新しい順）
    const sortedNewsData = newsData
        .filter(news => news.status === 'published')
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
    
    console.log('ソート済みお知らせデータ:', sortedNewsData);
    
    // お知らせアイテムのHTMLを生成
    const newsItemsHtml = sortedNewsData
        .map(news => generateNewsItemHtml(news))
        .join('');
    
    newsTimeline.innerHTML = newsItemsHtml;
    
    console.log('お知らせ一覧の表示が完了しました');
}

// お知らせアイテムのHTMLを生成
function generateNewsItemHtml(news) {
    const dateObj = new Date(news.date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    
    let detailsHTML = '';
    if (news.details) {
        Object.values(news.details).forEach(detail => {
            if (detail.label && detail.value) {
                detailsHTML += `<p><strong>${detail.label}:</strong> ${detail.value}</p>`;
            }
        });
    }
    
    let imageHTML = '';
    
    // 旧サイトの画像がある場合のみ画像表示領域を表示
    if (news.image && news.image !== null) {
        imageHTML = `
            <div class="timeline-image">
                <img src="${news.image}" alt="${news.title}" onerror="this.src='../images/top/placeholder.jpg'">
            </div>
        `;
    }
    
    return `
        <div class="timeline-item" data-category="${news.category}">
            <div class="timeline-date">
                <span class="timeline-day">${day}</span>
                <span class="timeline-month">${year}.${month.toString().padStart(2, '0')}</span>
            </div>
            <div class="timeline-content">
                <span class="timeline-category">${news.category}</span>
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <p>${news.content}</p>
                ${imageHTML}
                ${detailsHTML ? `<div class="timeline-details">${detailsHTML}</div>` : ''}
                <div class="timeline-link">
                    <a href="detail.html?id=${news.id}" class="btn btn-primary">詳細を見る</a>
                </div>
            </div>
        </div>
    `;
}

// フィルターボタンの設定
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // アクティブ状態を更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // お知らせをフィルタリング
            filterNewsByCategory(category);
        });
    });
}

// カテゴリでお知らせをフィルタリング
function filterNewsByCategory(category) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // フィルタリング結果の表示
    const visibleItems = document.querySelectorAll('.timeline-item[style="display: flex;"]');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleItems.length === 0) {
        if (!noResultsMessage) {
            const newsTimeline = document.getElementById('newsTimeline');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <h3>該当するお知らせがありません</h3>
                <p>選択されたカテゴリには、お知らせがありません。</p>
            `;
            newsTimeline.appendChild(message);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

// ストレージ変更の監視（投稿完了時の自動更新）
window.addEventListener('storage', function(e) {
    if (e.key === 'newsData') {
        console.log('newsDataが更新されました。お知らせ一覧を再読み込みします。');
        loadNewsList();
    }
});

// カスタムイベントの監視（投稿完了時の自動更新）
window.addEventListener('newsUpdated', function(e) {
    console.log('newsUpdatedイベントを受信しました。お知らせ一覧を再読み込みします。');
    loadNewsList();
}); 