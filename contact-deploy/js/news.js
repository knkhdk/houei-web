// お知らせ一覧ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 投稿データを読み込んで表示
    loadPostedNews();
    
    // カテゴリフィルター機能
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // タイムラインアイテムの表示/非表示
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ページネーション機能
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブページの切り替え
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // ここでページ切り替えの処理を実装
            // 実際の実装では、サーバーサイドでページネーションを処理
            console.log('ページ切り替え:', this.textContent);
        });
    });

    // タイムラインアイテムのホバーエフェクト
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // スムーススクロール（ページ内リンク用）
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ローカルストレージから投稿データを読み込んで表示する関数（Node.js不要）
    function loadPostedNews() {
        try {
            const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
            const newsTimeline = document.querySelector('.news-timeline');
            
            if (newsData.length > 0) {
                // データを日付順でソート（新しい順）
                const sortedNewsData = newsData
                    .filter(news => news.status === 'published')
                    .sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        return dateB - dateA; // 新しい順（降順）
                    });
                
                // 既存のタイムラインアイテムをクリア
                newsTimeline.innerHTML = '';
                
                // ソートされたデータを表示
                sortedNewsData.forEach(news => {
                    const newsElement = createTimelineElement(news);
                    newsTimeline.appendChild(newsElement);
                });
                
                // タイムライン機能を再初期化
                initializeTimeline();
            }
        } catch (error) {
            console.error('Error loading news from localStorage:', error);
        }
    }

    // データエクスポート機能（Node.js不要）
    function exportNewsData() {
        try {
            const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
            if (newsData.length > 0) {
                const dataStr = JSON.stringify(newsData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = 'news-data.json';
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                alert('データをエクスポートしました');
            } else {
                alert('エクスポートするデータがありません');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('エクスポートに失敗しました');
        }
    }

    // お知らせ要素を作成する関数（タイムライン形式）
    function createTimelineElement(news) {
        const dateObj = new Date(news.date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const newsElement = document.createElement('div');
        newsElement.className = 'timeline-item';
        newsElement.setAttribute('data-category', news.category);
        newsElement.setAttribute('data-id', news.id);

        let detailsHTML = '';
        if (news.details) {
            Object.values(news.details).forEach(detail => {
                if (detail.label && detail.value) {
                    detailsHTML += `<p><strong>${detail.label}:</strong> ${detail.value}</p>`;
                }
            });
        }

        let imageHTML = '';
        if (news.image) {
            imageHTML = `
                <div class="timeline-image">
                    <img src="${news.image}" alt="${news.title}" onerror="this.style.display='none'">
                </div>
            `;
        }

        newsElement.innerHTML = `
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
        `;

        return newsElement;
    }

    // タイムライン機能の初期化
    function initializeTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // アニメーション効果を追加
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}); 