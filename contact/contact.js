document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeModal = document.getElementById('closeModal');
    const editBtn = document.getElementById('editBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const previewContent = document.getElementById('previewContent');

    // フォームバリデーション
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message') || createErrorMessage(formGroup);
            
            if (!field.value.trim()) {
                showError(formGroup, errorMessage, 'この項目は必須です');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                showError(formGroup, errorMessage, '有効なメールアドレスを入力してください');
                isValid = false;
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                showError(formGroup, errorMessage, '有効な電話番号を入力してください');
                isValid = false;
            } else {
                hideError(formGroup, errorMessage);
            }
        });
        
        return isValid;
    }

    function createErrorMessage(formGroup) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
        return errorMessage;
    }

    function showError(formGroup, errorMessage, message) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError(formGroup, errorMessage) {
        formGroup.classList.remove('error');
        errorMessage.style.display = 'none';
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        return phoneRegex.test(phone) && phone.replace(/[\d\-\+\(\)\s]/g, '').length >= 10;
    }

    // プレビュー機能
    previewBtn.addEventListener('click', function() {
        if (!validateForm()) {
            alert('入力内容にエラーがあります。修正してください。');
            return;
        }
        
        const formData = new FormData(contactForm);
        const previewData = {};
        
        for (let [key, value] of formData.entries()) {
            previewData[key] = value;
        }
        
        displayPreview(previewData);
        previewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    function displayPreview(data) {
        const categoryLabels = {
            'road': '道路工事について',
            'river': '河川工事について',
            'structure': '構造物工事について',
            'waterworks': '上下水道工事について',
            'studio': 'スタジオ利用について',
            'recruit': '採用について',
            'other': 'その他'
        };

        const urgencyLabels = {
            'normal': '通常',
            'urgent': '緊急',
            'very_urgent': '至急'
        };

        const contactLabels = {
            'email': 'メール',
            'phone': '電話'
        };

        previewContent.innerHTML = `
            <div class="preview-item">
                <h4>お名前</h4>
                <p>${data.name}</p>
            </div>
            ${data.company ? `
            <div class="preview-item">
                <h4>会社名・組織名</h4>
                <p>${data.company}</p>
            </div>
            ` : ''}
            <div class="preview-item">
                <h4>メールアドレス</h4>
                <p>${data.email}</p>
            </div>
            <div class="preview-item">
                <h4>電話番号</h4>
                <p>${data.phone}</p>
            </div>
            <div class="preview-item">
                <h4>お問い合わせ種別</h4>
                <p>${categoryLabels[data.category] || data.category}</p>
            </div>
            <div class="preview-item">
                <h4>件名</h4>
                <p>${data.subject}</p>
            </div>
            <div class="preview-item">
                <h4>お問い合わせ内容</h4>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="preview-item">
                <h4>ご希望の連絡方法</h4>
                <p>${contactLabels[data.preferred_contact] || data.preferred_contact}</p>
            </div>
            <div class="preview-item">
                <h4>緊急度</h4>
                <p>${urgencyLabels[data.urgency] || data.urgency}</p>
            </div>
        `;
    }

    // モーダル制御
    closeModal.addEventListener('click', function() {
        previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    editBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // モーダル外クリックで閉じる
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 送信処理
    confirmBtn.addEventListener('click', function() {
        submitForm();
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });

    function submitForm() {
        if (!validateForm()) {
            alert('入力内容にエラーがあります。修正してください。');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // ローディング状態
        submitBtn.classList.add('loading');
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        
        // 実際の送信処理（ここではシミュレーション）
        setTimeout(() => {
            // 成功時の処理
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // モーダルを閉じる
            previewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // 成功メッセージを表示
            showSuccessMessage();
            
            // フォームをリセット
            contactForm.reset();
            
        }, 2000);
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3>お問い合わせを送信しました</h3>
            <p>ご入力いただいた内容を確認の上、担当者よりご連絡いたします。<br>
            通常2-3営業日以内にご返信いたします。</p>
        `;
        
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.insertBefore(successMessage, formContainer.firstChild);
        
        // アニメーション表示
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // 5秒後にメッセージを削除
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // リアルタイムバリデーション
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formGroup = this.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message') || createErrorMessage(formGroup);
            
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(formGroup, errorMessage, 'この項目は必須です');
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                showError(formGroup, errorMessage, '有効なメールアドレスを入力してください');
            } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
                showError(formGroup, errorMessage, '有効な電話番号を入力してください');
            } else {
                hideError(formGroup, errorMessage);
            }
        });
        
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage && errorMessage.style.display === 'block') {
                hideError(formGroup, errorMessage);
            }
        });
    });

    // 電話番号の自動フォーマット
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 7) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        }
        e.target.value = value;
    });

    // 文字数カウンター（お問い合わせ内容）
    const messageTextarea = document.getElementById('message');
    const maxLength = 2000;
    
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const counter = this.parentNode.querySelector('.char-counter') || createCharCounter(this.parentNode);
        
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#e74c3c';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#6c757d';
        }
    });

    function createCharCounter(parent) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; font-size: 0.8rem; color: #6c757d; margin-top: 5px;';
        counter.textContent = '0/' + maxLength;
        parent.appendChild(counter);
        return counter;
    }

    // カテゴリ選択時の動的プレースホルダー
    const categorySelect = document.getElementById('category');
    const messageTextarea = document.getElementById('message');
    
    categorySelect.addEventListener('change', function() {
        const placeholders = {
            'road': '道路工事の詳細（工事場所、工事内容、工期など）をお聞かせください',
            'river': '河川工事の詳細（河川名、工事内容、規模など）をお聞かせください',
            'structure': '構造物工事の詳細（構造物の種類、規模、工期など）をお聞かせください',
            'waterworks': '上下水道工事の詳細（工事場所、工事内容、工期など）をお聞かせください',
            'studio': 'スタジオ利用について（利用目的、利用期間、人数など）をお聞かせください',
            'recruit': '採用について（希望職種、経験年数、ご質問など）をお聞かせください',
            'other': 'その他のご質問やご要望をお聞かせください'
        };
        
        messageTextarea.placeholder = placeholders[this.value] || '工事の詳細やご要望をお聞かせください';
    });
}); 