// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // スライドショー機能
    const hero = document.querySelector('.hero');
    const images = [
        'images/top/top1.jpg',
        'images/top/top2.jpg',
        'images/top/top3.jpg'
    ];
    let currentImageIndex = 0;
    
    function changeBackgroundImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(44, 90, 160, 0.3) 0%, rgba(30, 74, 138, 0.3) 100%), url('${images[currentImageIndex]}')`;
    }
    
    // 5秒ごとに背景画像を切り替え
    setInterval(changeBackgroundImage, 5000);
    
    // 施工実績スライダー機能
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slideWidth = 380; // カード幅 + gap
        const maxSlides = 6;
        
        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // ボタンの有効/無効状態を更新
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === maxSlides - 1;
            
            // ドットのアクティブ状態を更新
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // 前のスライド
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
        
        // 次のスライド
        nextBtn.addEventListener('click', () => {
            if (currentSlide < maxSlides - 1) {
                currentSlide++;
                updateSlider();
            }
        });
        
        // ドットクリック
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        // 初期状態を設定
        updateSlider();
    }
    
    // ハンバーガーメニューの制御
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ヘッダーの背景色変更
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // お問合せフォームの処理
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // バリデーション
            if (!name || !email || !message) {
                alert('必須項目を入力してください。');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('正しいメールアドレスを入力してください。');
                return;
            }
            
            // 送信処理（実際の実装ではサーバーサイドに送信）
            showSuccessMessage();
            this.reset();
        });
    }
    
    // メールアドレスのバリデーション
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 成功メッセージの表示
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <h3>お問合せありがとうございます</h3>
                <p>内容を確認の上、担当者よりご連絡いたします。</p>
                <button onclick="this.parentElement.parentElement.remove()">閉じる</button>
            </div>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        successDiv.querySelector('.success-content').style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        `;
        
        successDiv.querySelector('button').style.cssText = `
            background: #2c5aa0;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
        `;
        
        document.body.appendChild(successDiv);
    }
    
    // アニメーション効果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素の監視
    const animateElements = document.querySelectorAll('.service-card, .tech-card, .work-item, .recruit-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 電話番号のクリックイベント
    const phoneNumbers = document.querySelectorAll('.phone, .phone-number');
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function() {
            const number = this.textContent.replace(/[^\d]/g, '');
            if (confirm('電話をかけますか？')) {
                window.location.href = `tel:${number}`;
            }
        });
    });
    
    // ページ読み込み時のアニメーション
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // エラーハンドリング
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    // パフォーマンス最適化
    let ticking = false;
    
    function updateOnScroll() {
        // スクロール時の処理をここに追加
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // アクセシビリティの向上
    document.addEventListener('keydown', function(e) {
        // ESCキーでモバイルメニューを閉じる
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
    
    // フォーカス管理
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
});

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// リサイズ時の処理
window.addEventListener('resize', debounce(function() {
    // リサイズ時の処理をここに追加
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768 && nav && hamburger) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
    }
}, 250));

// メインビジュアルのスライドショー
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// 5秒ごとにスライドを切り替え
setInterval(nextSlide, 5000);

// 初期表示
showSlide(0);

// 施工実績のスライダー
let currentProject = 0;
const projectSlides = document.querySelectorAll('.project-slide');
const totalProjects = projectSlides.length;

function showProjectSlide(index) {
    projectSlides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
}

function nextProject() {
    currentProject = (currentProject + 1) % totalProjects;
    showProjectSlide(currentProject);
}

function prevProject() {
    currentProject = (currentProject - 1 + totalProjects) % totalProjects;
    showProjectSlide(currentProject);
}

// 初期表示
showProjectSlide(0);

// 自動スライド（8秒ごと）
setInterval(nextProject, 8000);

// ナビゲーション矢印のイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.slider-nav .prev');
    const nextBtn = document.querySelector('.slider-nav .next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevProject);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextProject);
    }
}); 