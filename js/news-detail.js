// お知らせ詳細ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    const newsDetailContent = document.getElementById('newsDetailContent');
    const prevNewsBtn = document.getElementById('prevNewsBtn');
    const nextNewsBtn = document.getElementById('nextNewsBtn');
    
    // URLパラメータからお知らせIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    if (newsId) {
        loadNewsDetail(newsId);
        setupNavigation(newsId);
    } else {
        showNotFound();
    }
    
    // お知らせ詳細を読み込む
    async function loadNewsDetail(id) {
        try {
            console.log('お知らせ詳細を読み込み中... ID:', id);
            
            // サーバーからお知らせデータを取得
            const response = await fetch('/api/news');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newsData = await response.json();
            
            console.log('取得したお知らせデータ:', newsData);
            
            const news = newsData.find(item => item.id == id);
            
            if (news && news.status === 'published') {
                console.log('お知らせが見つかりました:', news);
                displayNewsDetail(news);
            } else {
                console.log('お知らせが見つかりませんでした');
                showNotFound();
            }
        } catch (error) {
            console.error('Error loading news detail:', error);
            // フォールバック: ローカルストレージから読み込み
            loadFromLocalStorage(id);
        }
    }
    
    // ローカルストレージから読み込み（フォールバック）
    function loadFromLocalStorage(id) {
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        const news = newsData.find(item => item.id == id);
        
        if (news && news.status === 'published') {
            displayNewsDetail(news);
        } else {
            showNotFound();
        }
    }
    
    // お知らせ詳細を表示
    function displayNewsDetail(news) {
        const dateObj = new Date(news.date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                           '7月', '8月', '9月', '10月', '11月', '12月'];
        
        let detailsHTML = '';
        if (news.details) {
            Object.values(news.details).forEach(detail => {
                if (detail.label && detail.value) {
                    detailsHTML += `<p><strong>${detail.label}:</strong> ${detail.value}</p>`;
                }
            });
        }
        
        let imageHTML = '';
        // カテゴリに応じて画像パスを決定（お知らせ詳細ページはnews/ディレクトリにあるため、../を追加）
        let imagePath = '../images/top/placeholder.jpg';
        if (news.category === '技術・工法') {
            imagePath = '../images/top/top1.jpg';
        } else if (news.category === '採用情報') {
            imagePath = '../images/top/top2.jpg';
        } else if (news.category === '会社情報') {
            imagePath = '../images/top/top3.JPG';
        }
        
        console.log('お知らせ詳細画像設定:', {
            category: news.category,
            imagePath: imagePath,
            title: news.title
        });
        
        imageHTML = `
            <div class="news-detail-image">
                <img src="${imagePath}" alt="${news.title}" 
                     onerror="console.error('画像読み込みエラー:', this.src); this.src='../images/top/placeholder.jpg';"
                     onload="console.log('画像読み込み成功:', this.src);">
            </div>
        `;
        
        const detailHTML = `
            <div class="news-detail-header">
                <div class="news-detail-date">
                    <span class="detail-date-day">${day}</span>
                    <span class="detail-date-month">${year}.${month.toString().padStart(2, '0')}</span>
                </div>
                <div class="news-detail-meta">
                    <span class="news-detail-category">${news.category}</span>
                    <h1 class="news-detail-title">${news.title}</h1>
                </div>
            </div>
            
            <div class="news-detail-body">
                <div class="news-detail-summary">
                    <h3>概要</h3>
                    <p>${news.summary}</p>
                </div>
                
                <div class="news-detail-content">
                    <h3>詳細内容</h3>
                    <p>${news.content}</p>
                </div>
                
                ${imageHTML}
                
                ${detailsHTML ? `
                <div class="news-detail-info">
                    <h3>詳細情報</h3>
                    <div class="news-detail-details">
                        ${detailsHTML}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        newsDetailContent.innerHTML = detailHTML;
        
        // ページタイトルを更新
        document.title = `${news.title} - お知らせ詳細 - 邦栄建設株式会社`;
    }
    
    // お知らせが見つからない場合の表示
    function showNotFound() {
        newsDetailContent.innerHTML = `
            <div class="news-not-found">
                <h2>お知らせが見つかりません</h2>
                <p>指定されたお知らせは存在しないか、削除された可能性があります。</p>
                <a href="index.html" class="btn btn-primary">お知らせ一覧に戻る</a>
            </div>
        `;
    }
    
    // ナビゲーション設定
    async function setupNavigation(currentId) {
        try {
            console.log('ナビゲーション設定中... ID:', currentId);
            
            // サーバーからお知らせデータを取得
            const response = await fetch('/api/news');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newsData = await response.json();
            
            const publishedNews = newsData.filter(news => news.status === 'published');
            const currentIndex = publishedNews.findIndex(news => news.id == currentId);
            
            console.log('現在のインデックス:', currentIndex, '総数:', publishedNews.length);
            
            if (currentIndex > 0) {
                const prevNews = publishedNews[currentIndex - 1];
                prevNewsBtn.style.display = 'inline-block';
                prevNewsBtn.addEventListener('click', () => {
                    window.location.href = `detail.html?id=${prevNews.id}`;
                });
                console.log('前のお知らせボタンを設定:', prevNews.title);
            }
            
            if (currentIndex < publishedNews.length - 1) {
                const nextNews = publishedNews[currentIndex + 1];
                nextNewsBtn.style.display = 'inline-block';
                nextNewsBtn.addEventListener('click', () => {
                    window.location.href = `detail.html?id=${nextNews.id}`;
                });
                console.log('次のお知らせボタンを設定:', nextNews.title);
            }
        } catch (error) {
            console.error('Error setting up navigation:', error);
            // フォールバック: ローカルストレージから読み込み
            setupNavigationFromLocalStorage(currentId);
        }
    }
    
    // ローカルストレージからナビゲーション設定（フォールバック）
    function setupNavigationFromLocalStorage(currentId) {
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        const publishedNews = newsData.filter(news => news.status === 'published');
        const currentIndex = publishedNews.findIndex(news => news.id == currentId);
        
        if (currentIndex > 0) {
            const prevNews = publishedNews[currentIndex - 1];
            prevNewsBtn.style.display = 'inline-block';
            prevNewsBtn.addEventListener('click', () => {
                window.location.href = `detail.html?id=${prevNews.id}`;
            });
        }
        
        if (currentIndex < publishedNews.length - 1) {
            const nextNews = publishedNews[currentIndex + 1];
            nextNewsBtn.style.display = 'inline-block';
            nextNewsBtn.addEventListener('click', () => {
                window.location.href = `detail.html?id=${nextNews.id}`;
            });
        }
    }
}); 