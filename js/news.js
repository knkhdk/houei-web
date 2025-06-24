// お知らせ一覧ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // カテゴリフィルター機能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // ニュースアイテムの表示/非表示
            newsItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
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

    // ニュースアイテムのホバーエフェクト
    newsItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
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
}); 