// プレビュー環境でのちらつき軽減用スクリプト

(function() {
    'use strict';
    
    // プレビュー環境かどうかを判定
    const isPreview = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:';
    
    if (isPreview) {
        console.log('プレビュー環境を検出: ちらつき軽減を適用');
        
        // DOM読み込み完了後に実行
        document.addEventListener('DOMContentLoaded', function() {
            optimizeForPreview();
        });
        
        // ページ読み込み完了後にも実行
        window.addEventListener('load', function() {
            optimizeForPreview();
        });
    }
    
    function optimizeForPreview() {
        // 1. スライドショーの間隔を長くする
        const hero = document.querySelector('.hero');
        if (hero) {
            // スライドショーの間隔を8秒に延長
            const existingInterval = window.slideShowInterval;
            if (existingInterval) {
                clearInterval(existingInterval);
                window.slideShowInterval = setInterval(() => {
                    // スライドショー関数が存在する場合のみ実行
                    if (typeof window.changeBackgroundImage === 'function') {
                        window.changeBackgroundImage();
                    }
                }, 8000);
            }
        }
        
        // 2. CSSトランジションを最適化
        const style = document.createElement('style');
        style.textContent = `
            .hero {
                transition: background-image 0.3s ease-in-out !important;
                will-change: background-image !important;
                backface-visibility: hidden !important;
                transform: translateZ(0) !important;
            }
            
            .hero::before {
                transition: opacity 0.2s ease-in-out !important;
            }
            
            /* 画像のちらつきを軽減 */
            img {
                backface-visibility: hidden !important;
                transform: translateZ(0) !important;
            }
            
            /* アニメーションのちらつきを軽減 */
            * {
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
        `;
        document.head.appendChild(style);
        
        // 3. 画像のプリロードを最適化
        optimizeImagePreloading();
        
        // 4. スクロール時のちらつきを軽減
        optimizeScrollPerformance();
    }
    
    function optimizeImagePreloading() {
        // 重要な画像を優先的にプリロード
        const criticalImages = [
            'images/top/logo.png',
            'images/top/top1.jpg',
            'images/top/top2.jpg',
            'images/top/top3.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    function optimizeScrollPerformance() {
        // スクロールイベントの最適化
        let ticking = false;
        
        function updateOnScroll() {
            // スクロール時の処理を最適化
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // グローバル関数として公開（他のスクリプトから呼び出し可能）
    window.optimizeForPreview = optimizeForPreview;
    
})(); 