// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: 開始');
    
    // 初期化完了フラグ
    let initializationComplete = false;
    
    // 重複初期化を防ぐフラグ
    if (window.pageInitialized) {
        console.log('ページは既に初期化済みです');
        return;
    }
    window.pageInitialized = true;
    
    // fileManagerの初期化（重複防止）
    if (typeof FileManager !== 'undefined' && !window.fileManager) {
        try {
            window.fileManager = new FileManager();
            console.log('fileManager初期化完了');
        } catch (error) {
            console.error('fileManager初期化エラー:', error);
        }
    } else if (window.fileManager) {
        console.log('fileManagerは既に初期化済みです');
    } else {
        console.warn('FileManagerクラスが見つかりません');
    }
    
    // スライダー機能の初期化
    console.log('スライダー初期化を開始します');
    initSliders();
    
    // スライドショー機能（最適化版）
    const hero = document.querySelector('.hero');
    if (hero) {
        console.log('スライドショー機能初期化開始');
        const images = [
            'images/top/top1.jpg',
            'images/top/top2.jpg',
            'images/top/top3.JPG'
        ];
        let currentImageIndex = 0;
        let slideShowInterval;
        
        // 初期画像を即座に設定
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(44, 90, 160, 0.3) 0%, rgba(30, 74, 138, 0.3) 100%), url('${images[0]}')`;
        
        function changeBackgroundImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            hero.style.backgroundImage = `linear-gradient(135deg, rgba(44, 90, 160, 0.3) 0%, rgba(30, 74, 138, 0.3) 100%), url('${images[currentImageIndex]}')`;
        }
        
        // スライドショーを開始（8秒間隔に延長）
        slideShowInterval = setInterval(changeBackgroundImage, 8000);
        
        // ページが非表示になった時にタイマーを停止
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (slideShowInterval) {
                    clearInterval(slideShowInterval);
                    slideShowInterval = null;
                }
            } else {
                if (!slideShowInterval) {
                    slideShowInterval = setInterval(changeBackgroundImage, 8000);
                }
            }
        });
    } else {
        console.warn('hero要素が見つかりません');
    }
    
    // お知らせの読み込み（重複防止）
    if (!window.newsLoaded) {
        console.log('お知らせ読み込み開始');
        window.newsLoaded = true;
        loadTopNews().finally(() => {
            console.log('お知らせ読み込み処理完了');
            checkInitializationComplete();
        }).catch((error) => {
            console.error('お知らせ読み込みエラー:', error);
            checkInitializationComplete();
        });
    } else {
        console.log('お知らせは既に読み込み済みです');
    }
    
    // ストレージ変更の監視（投稿完了時の自動更新）
    window.addEventListener('storage', function(e) {
        if (e.key === 'newsData') {
            console.log('newsDataが更新されました。お知らせを再読み込みします。');
            loadTopNews();
        }
    });
    
    // カスタムイベントの監視（投稿完了時の自動更新）
    window.addEventListener('newsUpdated', function(e) {
        console.log('newsUpdatedイベントを受信しました。お知らせを再読み込みします。');
        loadTopNews();
    });
    
    // 手動更新ボタンの追加（別PCでの同期のため）
    setTimeout(() => {
        addManualRefreshButton();
    }, 2000);
    
    // 自動更新を無効化（パフォーマンス向上のため）
    let autoRefreshInterval;
    // setTimeout(() => {
    //     startAutoRefresh();
    // }, 10000); // 10秒後に開始
    
    // 自動更新を開始する関数（無効化）
    function startAutoRefresh() {
        // 自動更新を無効化してパフォーマンスを向上
        console.log('自動更新は無効化されています（パフォーマンス向上のため）');
    }
    
    // ページが非表示になった時に自動更新を停止
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
                console.log('ページが非表示のため自動更新を停止しました');
            }
        } else {
            if (!autoRefreshInterval) {
                startAutoRefresh();
            }
        }
    });
    
    // 手動更新ボタンを追加する関数
    function addManualRefreshButton() {
        const newsSection = document.querySelector('.news-section');
        if (newsSection) {
            // 既存のボタンがあれば削除
            const existingButton = document.getElementById('manualRefreshButton');
            if (existingButton) {
                existingButton.remove();
            }
            
            // 新しい更新ボタンを作成
            const refreshButton = document.createElement('button');
            refreshButton.id = 'manualRefreshButton';
            refreshButton.innerHTML = '🔄 お知らせを更新';
            refreshButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(44, 90, 160, 0.8);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                z-index: 1000;
                transition: background 0.3s ease;
            `;
            
            refreshButton.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(44, 90, 160, 1)';
            });
            
            refreshButton.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(44, 90, 160, 0.8)';
            });
            
            refreshButton.addEventListener('click', function() {
                console.log('手動更新ボタンがクリックされました');
                loadTopNews();
                
                // ボタンを一時的に無効化
                this.disabled = true;
                this.innerHTML = '更新中...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '🔄 お知らせを更新';
                }, 2000);
            });
            
            newsSection.style.position = 'relative';
            newsSection.appendChild(refreshButton);
            console.log('手動更新ボタンを追加しました');
        }
    }
    
    // ハンバーガーメニュー
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        console.log('ハンバーガーメニュー初期化完了');
    }
    
    // スムーススクロール（最適化版）
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    console.log(`スムーススクロール初期化完了: ${smoothScrollLinks.length}個のリンク`);
    
    // 初期化完了チェック関数
    function checkInitializationComplete() {
        if (!initializationComplete) {
            initializationComplete = true;
            console.log('DOMContentLoaded: 初期化完了');
            window.domInitialized = true;
        }
    }
    
    // 初期化完了を設定（2秒後）
    setTimeout(() => {
        checkInitializationComplete();
    }, 2000);
    
    // 3Dカードの初期化を追加
    setTimeout(() => {
        initialize3DCards();
    }, 100);
    
    console.log('DOMContentLoaded: 処理開始完了');
});

// ページの完全な読み込み完了を検知（最適化版）
window.addEventListener('load', function() {
    console.log('ページ読み込み完了: すべてのリソースが読み込まれました');
    
    // 読み込み完了のフラグを設定
    window.pageLoaded = true;
    
    // DOM初期化完了を確認
    setTimeout(() => {
        if (window.domInitialized) {
            console.log('✅ ページの読み込みと初期化が正常に完了しました');
        } else {
            console.warn('⚠️ DOM初期化が完了していません');
        }
    }, 1000);
});

// より確実な読み込み完了検知のための追加処理
if (document.readyState === 'complete') {
    console.log('document.readyState: complete - 即座に読み込み完了フラグを設定');
    window.pageLoaded = true;
}

// 最終的な強制読み込み完了通知（5秒後）
setTimeout(() => {
    console.log('5秒後の最終強制読み込み完了通知');
    window.pageLoaded = true;
    window.domInitialized = true;
}, 5000);

// お知らせの読み込み関数（最適化版・重複防止）
async function loadTopNews() {
    // 重複実行を防ぐ
    if (window.newsLoading) {
        console.log('お知らせの読み込みは既に実行中です');
        return;
    }
    window.newsLoading = true;
    
    try {
        console.log('お知らせの読み込みを開始します');
        
        // HTML内のscriptタグからデータを取得
        const newsDataScript = document.getElementById('newsData');
        if (newsDataScript) {
            const newsData = JSON.parse(newsDataScript.textContent);
            console.log('HTML内からお知らせデータを取得しました:', newsData);
            displayNews(newsData);
            return;
        }
        
        // フォールバック: ローカルストレージから取得
        const localData = localStorage.getItem('newsData');
        if (localData) {
            try {
                const newsData = JSON.parse(localData);
                console.log('localStorageから取得したデータ:', newsData);
                displayNews(newsData);
            } catch (parseError) {
                console.log('localStorageのデータが不正です:', parseError);
                displayNews([]);
            }
        } else {
            console.log('データがありません');
            displayNews([]);
        }
    } catch (error) {
        console.log('お知らせデータの読み込みに失敗:', error);
        displayNews([]);
    } finally {
        // 重複防止フラグをリセット
        window.newsLoading = false;
    }
}

// 画像エラーハンドリング関数
function handleImageError(img, category) {
    console.log(`画像読み込みエラー: ${img.src}, カテゴリ: ${category}`);
    
    // シンプルにプレースホルダー画像に変更
    img.src = 'images/top/placeholder.jpg';
    img.alt = `${category} - お知らせ`;
}

// お知らせの表示関数（最適化版）
function displayNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('newsContainerが見つかりません');
        return;
    }
    
    // 日付順でソートしてから最新の3件を表示
    const sortedNewsData = newsData
        .filter(news => news.status === 'published')
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // 新しい順（降順）
        });
    
    const latestNews = sortedNewsData.slice(0, 3);
    console.log('表示する最新3件（日付順）:', latestNews);
    
    if (latestNews.length === 0) {
        console.log('お知らせがないため、デフォルト表示を設定');
        // お知らせがない場合のデフォルト表示
        newsContainer.innerHTML = `
            <div class="news-card-3d" onclick="window.location.href='news/index.html'" style="cursor: pointer;">
                <div class="news-card-inner">
                    <div class="news-card-front">
                        <div class="news-card-image">
                            <img src="images/top/placeholder.jpg" alt="お知らせ" onerror="this.src='images/top/placeholder.jpg'">
                        </div>
                        <div class="news-card-overlay">
                            <div class="news-card-category">お知らせ</div>
                            <h3>お知らせがありません</h3>
                            <p>現在、お知らせはありません。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    console.log('お知らせカードを生成中...');
    newsContainer.innerHTML = latestNews.map(news => {
        const date = new Date(news.date);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const monthName = month + '月';
        
        // 画像パスの決定（旧サイトの画像を優先、なければカテゴリに応じて選択）
        let imagePath = 'images/top/placeholder.jpg';
        
        if (news.image && news.image !== null) {
            // 旧サイトの画像がある場合は使用（パスを調整）
            imagePath = news.image.replace('../', '');
        } else {
            // カテゴリに応じてデフォルト画像を選択
            if (news.category === '技術・工法') {
                imagePath = 'images/top/top1.jpg';
            } else if (news.category === '採用情報') {
                imagePath = 'images/top/top2.jpg';
            } else if (news.category === '会社情報') {
                imagePath = 'images/top/top3.JPG';
            }
        }
        
        return `
            <div class="news-card-3d" onclick="window.location.href='news/detail.html?id=${news.id}'" style="cursor: pointer;">
                <div class="news-card-inner">
                    <div class="news-card-front">
                        <div class="news-card-image">
                            <img src="${imagePath}" alt="${news.title}" onerror="this.src='images/top/placeholder.jpg'">
                        </div>
                        <div class="news-card-overlay">
                            <div class="news-card-category">${news.category}</div>
                            <h3>${news.title}</h3>
                            <p>${news.summary}</p>
                            <div class="news-card-date" style="margin: 10px 0;">
                                <span class="news-day">${day}</span>
                                <span class="news-month">${monthName}</span>
                            </div>
                            <div class="news-card-link" onclick="event.stopPropagation(); window.location.href='news/detail.html?id=${news.id}'">詳細を見る</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('お知らせの表示が完了しました');
}

// About.html 専用アニメーション機能（最適化版）
function initAboutPageAnimations() {
    // ページがabout.htmlかどうかを確認
    if (!window.location.pathname.includes('about.html')) {
        return;
    }
    
    console.log('About.html アニメーション機能を初期化中...');
    
    // Intersection Observer の設定
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // セクションアニメーション
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // セクション内の要素を順次アニメーション
                const animatedElements = entry.target.querySelectorAll('.content-card, .detail-card, .business-card, .timeline-item, .facility-card');
                animatedElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // セクション要素を監視
    const sections = document.querySelectorAll('.detail-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // カード要素の初期状態設定
    const cards = document.querySelectorAll('.content-card, .detail-card, .business-card, .facility-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // タイムライン要素の初期状態設定
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // ホバーエフェクトの強化
    const hoverElements = document.querySelectorAll('.content-card, .detail-card, .business-card, .facility-card, .license-item, .bank-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // transformプロパティを直接操作せず、CSSクラスを使用
            this.classList.add('hover-lift');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-lift');
        });
    });
    
    // スムーススクロールの強化
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // カウンターアニメーション（沿革の年数など）
    const counterElements = document.querySelectorAll('.year');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // 数字が含まれている場合のみアニメーション
                if (/\d/.test(text)) {
                    element.style.color = '#ffd700';
                    element.style.transform = 'scale(1.1)';
                    element.style.transition = 'color 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        element.style.color = '';
                        element.style.transform = '';
                    }, 1000);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(element => {
        counterObserver.observe(element);
    });
    
    // アイコンアニメーション
    const iconElements = document.querySelectorAll('.section-icon, .card-icon, .detail-icon, .business-icon');
    iconElements.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(360deg) scale(1.1)';
            this.style.transition = 'transform 0.6s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    
    // 動画セクションの特別なアニメーション
    const videoContainer = document.querySelector('.youtube-container');
    if (videoContainer) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'scale(1.02)';
                    entry.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                    entry.target.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(videoContainer);
    }
    
    // 地図セクションのアニメーション
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1.02)';
                    entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                }
            });
        }, { threshold: 0.3 });
        
        mapContainer.style.opacity = '0';
        mapContainer.style.transform = 'scale(0.98)';
        mapObserver.observe(mapContainer);
    }
    
    // ページ読み込み完了時の特別なアニメーション
    setTimeout(() => {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.style.animation = 'fadeInDown 1s ease-out';
        }
        
        // 各セクションを順次表示
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
    
    console.log('About.html アニメーション機能の初期化が完了しました');
}

// ページ読み込み完了後にアニメーション機能を初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPageAnimations);
} else {
    initAboutPageAnimations();
}

// ページが完全に読み込まれた後にも初期化を試行
window.addEventListener('load', initAboutPageAnimations);

// スライダー初期化フラグ
let slidersInitialized = false;

// スライダー機能の実装
function initSliders() {
    // 既に初期化済みの場合はスキップ
    if (slidersInitialized) {
        console.log('スライダーは既に初期化済みです');
        return;
    }
    
    console.log('=== スライダー機能初期化開始 ===');
    
    // 事業内容スライダー
    const servicesSlider = document.querySelector('.services-slider .slider-track');
    const worksSlider = document.querySelector('.works-slider .slider-track');
    
    console.log('検出されたスライダー:');
    console.log('- servicesSlider:', servicesSlider);
    console.log('- worksSlider:', worksSlider);
    
    if (servicesSlider) {
        const slides = servicesSlider.querySelectorAll('.slide');
        console.log(`事業内容スライダー: ${slides.length}個のスライドを検出`);
        console.log('スライド内容:', Array.from(slides).map(slide => slide.querySelector('h3')?.textContent));
        initSimpleSlider(servicesSlider, 'services');
    } else {
        console.error('事業内容スライダーが見つかりません');
    }
    
    if (worksSlider) {
        const workItems = worksSlider.querySelectorAll('.work-item');
        console.log(`施工実績スライダー: ${workItems.length}個のアイテムを検出`);
        initSimpleSlider(worksSlider, 'works');
    } else {
        console.error('施工実績スライダーが見つかりません');
    }
    
    slidersInitialized = true;
    console.log('=== スライダー機能初期化完了 ===');
}

// シンプルなスライダー機能
function initSimpleSlider(sliderTrack, type) {
    const slides = sliderTrack.querySelectorAll('.slide, .work-item');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
    console.log(`=== ${type}スライダー初期化 ===`);
    console.log(`総スライド数: ${totalSlides}`);
    
    // 表示枚数を計算
    function getVisibleSlides() {
        const width = window.innerWidth;
        if (type === 'services') {
            if (width > 1200) return 3;
            if (width > 800) return 2;
            return 1;
        } else {
            if (width > 768) return 3;
            if (width > 480) return 2;
            return 1;
        }
    }
    
    function updateSlider() {
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        const translateX = -currentSlide * slideWidth;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        console.log(`${type}スライダー更新: スライド${currentSlide + 1}, translateX(${translateX}%)`);
        
        // ボタンの有効/無効状態を更新
        updateButtonStates();
    }
    
    function updateButtonStates() {
        const visibleSlides = getVisibleSlides();
        const maxSlides = Math.max(1, totalSlides - visibleSlides + 1);
        
        const sliderControls = sliderTrack.closest('.services-slider, .works-slider').querySelector('.slider-controls');
        const prevBtn = sliderControls ? sliderControls.querySelector('.prev-btn') : null;
        const nextBtn = sliderControls ? sliderControls.querySelector('.next-btn') : null;
        
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentSlide >= maxSlides - 1;
            nextBtn.style.opacity = currentSlide >= maxSlides - 1 ? '0.5' : '1';
        }
    }
    
    function nextSlide() {
        const visibleSlides = getVisibleSlides();
        const maxSlides = Math.max(1, totalSlides - visibleSlides + 1);
        currentSlide = (currentSlide + 1) % maxSlides;
        updateSlider();
    }
    
    function prevSlide() {
        const visibleSlides = getVisibleSlides();
        const maxSlides = Math.max(1, totalSlides - visibleSlides + 1);
        currentSlide = (currentSlide - 1 + maxSlides) % maxSlides;
        updateSlider();
    }
    
    // ボタンイベントの設定
    const sliderContainer = sliderTrack.closest('.slider-container');
    const sliderControls = sliderTrack.closest('.services-slider, .works-slider').querySelector('.slider-controls');
    const prevBtn = sliderControls ? sliderControls.querySelector('.prev-btn') : null;
    const nextBtn = sliderControls ? sliderControls.querySelector('.next-btn') : null;
    
    console.log(`ボタン検出: prevBtn=${!!prevBtn}, nextBtn=${!!nextBtn}`);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
        });
        console.log(`${type}スライダー: 前へボタンイベント設定完了`);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
        console.log(`${type}スライダー: 次へボタンイベント設定完了`);
    }
    
    // カードのリンクが正常に機能するように、スライダーのクリックイベントを調整
    if (type === 'services') {
        const slides = sliderTrack.querySelectorAll('.slide');
        slides.forEach(slide => {
            const link = slide.querySelector('.slide-link');
            if (link) {
                // リンクのクリックイベントを保護
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('カードリンクがクリックされました:', link.href);
                });
            }
        });
    }
    
    // ウィンドウリサイズ時の処理
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentSlide = 0; // リサイズ時は最初のスライドに戻す
            updateSlider();
        }, 300);
    });
    
    // 初期表示
    currentSlide = 0;
    updateSlider();
    
    // 自動スライド機能を無効化（パフォーマンス向上のため）
    // if (type === 'services') {
    //     setInterval(() => {
    //         const visibleSlides = getVisibleSlides();
    //         const maxSlides = Math.max(1, totalSlides - visibleSlides + 1);
    //         if (currentSlide < maxSlides - 1) {
    //             nextSlide();
    //         } else {
    //             currentSlide = 0;
    //             updateSlider();
    //         }
    //     }, 5000);
    // }
    
    console.log(`${type}スライダー初期化完了`);
}

// グローバル関数としてmoveSlideを定義（HTMLからの呼び出し用）
window.moveSlide = function(direction) {
    console.log(`moveSlide呼び出し: direction=${direction}`);
    
    const servicesSlider = document.querySelector('.services-slider .slider-track');
    const worksSlider = document.querySelector('.works-slider .slider-track');
    const activeSlider = servicesSlider || worksSlider;
    
    if (activeSlider) {
        const slides = activeSlider.querySelectorAll('.slide, .work-item');
        const totalSlides = slides.length;
        let currentSlide = 0;
        
        // 表示枚数を計算
        const width = window.innerWidth;
        let visibleSlides;
        if (activeSlider.closest('.services-slider')) {
            if (width > 900) visibleSlides = 3;
            else if (width > 600) visibleSlides = 2;
            else visibleSlides = 1;
        } else {
            if (width > 768) visibleSlides = 3;
            else if (width > 480) visibleSlides = 2;
            else visibleSlides = 1;
        }
        
        // 現在のスライド位置を計算
        const transform = activeSlider.style.transform;
        if (transform) {
            const match = transform.match(/translateX\(([-\d.]+)%\)/);
            if (match) {
                const translateX = parseFloat(match[1]);
                const slideWidth = 100 / visibleSlides;
                currentSlide = Math.abs(Math.round(translateX / slideWidth));
            }
        }
        
        // 新しいスライド位置を計算
        const maxSlides = Math.max(1, totalSlides - visibleSlides + 1);
        let newSlide = currentSlide + direction;
        if (newSlide < 0) newSlide = maxSlides - 1;
        if (newSlide >= maxSlides) newSlide = 0;
        
        // スライダーを更新
        const slideWidth = 100 / visibleSlides;
        const translateX = -newSlide * slideWidth;
        activeSlider.style.transform = `translateX(${translateX}%)`;
        
        console.log(`スライダー移動: ${currentSlide + 1} → ${newSlide + 1}（表示枚数: ${visibleSlides}枚）`);
    } else {
        console.error('スライダーが見つかりません');
    }
};

// 3Dカードの初期化と改善
function initialize3DCards() {
    const cards = document.querySelectorAll('.gallery-3d-card');
    
    cards.forEach(card => {
        // カードのホバー効果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // タッチデバイス対応
        let isFlipped = false;
        
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const inner = this.querySelector('.gallery-card-inner');
            isFlipped = !isFlipped;
            
            if (isFlipped) {
                inner.style.transform = 'rotateY(180deg)';
            } else {
                inner.style.transform = 'rotateY(0deg)';
            }
        });
        
        // クリック時の動作を改善
        card.addEventListener('click', function(e) {
            // カードが回転中または回転済みの場合はモーダルを開かない
            const inner = this.querySelector('.gallery-card-inner');
            const computedStyle = window.getComputedStyle(inner);
            const transform = computedStyle.getPropertyValue('transform');
            
            if (transform.includes('rotateY(180deg)') || transform.includes('matrix')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        });
    });
    
    console.log('3Dカードが初期化されました');
}

// 重複したDOMContentLoadedイベントリスナーを削除（パフォーマンス向上のため）
// メインの初期化処理は最初のDOMContentLoadedで実行済み

// ページ完全読み込み後の初期化（バックアップ・重複防止）
if (!window.loadEventFired) {
    window.addEventListener('load', function() {
        console.log('window.load: スライダー初期化開始');
        window.loadEventFired = true;
        // 少し遅延させてから初期化を試行
        setTimeout(() => {
            if (!slidersInitialized) {
                console.log('スライダーが初期化されていないため、再初期化を実行');
                initSliders();
            }
        }, 100);
    });
}

// リサイズ時の再初期化
// ウィンドウリサイズ時のスライダー再初期化を無効化（パフォーマンス向上のため）
// window.addEventListener('resize', function() {
//     console.log('window.resize: スライダー再初期化');
//     slidersInitialized = false;
//     setTimeout(initSliders, 100);
// }); 