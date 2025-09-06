// 施工実績一覧ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // デフォルトの施工実績データ
    const defaultWorksData = [
        {
            id: 1,
            title: "下水道開削工事",
            category: "下水道工事",
            location: "川口市大字峯地内",
            description: "下水道管の開削工事を実施。安全で確実な施工により、地域の生活インフラを整備しました。",
            image: "jisseki/works06-4.jpg",
            year: "2023",
            details: {
                "工期": "3ヶ月",
                "延長": "500m",
                "管径": "φ300mm"
            }
        },
        {
            id: 2,
            title: "下水道推進工事",
            category: "上下水道",
            location: "川口市大字安行慈林地内",
            description: "無振動・低騒音の推進工法により、周辺環境に配慮した下水道工事を実施しました。",
            image: "jisseki/works08-1.jpg",
            year: "2023",
            details: {
                "工期": "2ヶ月",
                "延長": "300m",
                "管径": "φ400mm"
            }
        },
        {
            id: 3,
            title: "上水道工事",
            category: "上水道工事",
            location: "川口市上青木西４丁目",
            description: "地域の安全な水供給を確保するため、上水道管の敷設工事を実施しました。",
            image: "jisseki/works09-1.jpg",
            year: "2023",
            details: {
                "工期": "4ヶ月",
                "延長": "800m",
                "管径": "φ200mm"
            }
        },
        {
            id: 4,
            title: "宅地造成工事",
            category: "宅地造成工事",
            location: "さいたま市緑区内",
            description: "宅地開発に伴う造成工事を実施。安全で快適な居住環境の整備に貢献しました。",
            image: "works/placeholder.jpg",
            year: "2023",
            details: {
                "工期": "6ヶ月",
                "面積": "5,000㎡",
                "盛土量": "10,000㎥"
            }
        },
        {
            id: 5,
            title: "河川工事",
            category: "河川工事",
            location: "さいたま市大宮区桜木町",
            description: "河川の治水機能向上のため、護岸工事と河道掘削工事を実施しました。",
            image: "works/placeholder.jpg",
            year: "2023",
            details: {
                "工期": "8ヶ月",
                "延長": "1,200m",
                "掘削量": "15,000㎥"
            }
        },
        {
            id: 6,
            title: "墓地造成工事",
            category: "墓地造成工事",
            location: "埼玉県さいたま市内",
            description: "静寂で美しい墓地環境を整備するため、造成工事を実施しました。",
            image: "works/placeholder.jpg",
            year: "2023",
            details: {
                "工期": "5ヶ月",
                "面積": "3,000㎡",
                "区画数": "200区画"
            }
        }
    ];

    // localStorageから施工実績データを取得、なければデフォルトデータを使用
    let worksData = JSON.parse(localStorage.getItem('works') || '[]');
    if (worksData.length === 0) {
        worksData = defaultWorksData;
        localStorage.setItem('works', JSON.stringify(worksData));
    }

    const worksGrid = document.getElementById('worksGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // 施工実績カードを表示
    function displayWorks(works) {
        worksGrid.innerHTML = works.map(work => `
            <div class="work-card" data-category="${work.category}" data-id="${work.id}">
                <div class="work-card-image">
                    <img src="../images/${work.image}" alt="${work.title}" onerror="this.src='../images/works/placeholder.jpg'">
                    <div class="work-card-overlay">
                        <div class="work-card-category">${work.category}</div>
                        <div class="work-card-year">${work.year}年施工</div>
                    </div>
                </div>
                <div class="work-card-content">
                    <h3>${work.title}</h3>
                    <p class="work-card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${work.location}
                    </p>
                    <p class="work-card-description">${work.description}</p>
                    <div class="work-card-details">
                        ${Object.entries(work.details || {}).map(([key, value]) => 
                            `<div class="detail-item">
                                <span class="detail-label">${key}</span>
                                <span class="detail-value">${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                    <div class="work-card-actions">
                        <button class="btn-detail" onclick="viewWorkDetail(${work.id})">
                            <i class="fas fa-eye"></i>
                            詳細を見る
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 統計情報を更新
        updateStats(works);
    }

    // 統計情報を更新
    function updateStats(works) {
        const totalWorks = document.getElementById('total-works');
        const currentYear = document.getElementById('current-year');
        const locations = document.getElementById('locations');
        
        if (totalWorks) totalWorks.textContent = works.length;
        
        if (currentYear) {
            const years = works.map(work => work.year).sort((a, b) => b - a);
            currentYear.textContent = years[0] || '2023';
        }
        
        if (locations) {
            const uniqueLocations = new Set(works.map(work => work.location.split('市')[0] + '市'));
            locations.textContent = uniqueLocations.size;
        }
    }

    // フィルターカウントを更新
    function updateFilterCounts() {
        const categories = ['all', '下水道工事', '上下水道', '上水道工事', '宅地造成工事', '河川工事', '墓地造成工事'];
        
        categories.forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                const count = category === 'all' 
                    ? worksData.length 
                    : worksData.filter(work => work.category === category).length;
                countElement.textContent = count;
            }
        });
    }

    // フィルター機能
    function filterWorks(category) {
        currentFilter = category;
        const filteredWorks = category === 'all' 
            ? worksData 
            : worksData.filter(work => work.category === category);
        
        displayWorks(filteredWorks);
        
        // フィルターボタンのアクティブ状態を更新
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
    }

    // フィルターボタンのイベントリスナー
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterWorks(category);
        });
    });

    // 初期表示
    displayWorks(worksData);
    updateFilterCounts();

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
});

// 詳細表示機能
function viewWorkDetail(workId) {
    // localStorageから施工実績データを取得
    let works = JSON.parse(localStorage.getItem('works') || '[]');
    const work = works.find(w => w.id === workId);
    
    if (work) {
        // モーダルで詳細を表示
        showWorkModal(work);
    }
}

// モーダル表示
function showWorkModal(work) {
    const modal = document.createElement('div');
    modal.className = 'work-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeWorkModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${work.title}</h3>
                <button class="modal-close" onclick="closeWorkModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="../images/${work.image}" alt="${work.title}" onerror="this.src='../images/works/placeholder.jpg'">
                </div>
                <div class="modal-info">
                    <div class="info-section">
                        <h4><i class="fas fa-info-circle"></i> 基本情報</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">カテゴリ</span>
                                <span class="info-value">${work.category}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">施工場所</span>
                                <span class="info-value">${work.location}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">施工年</span>
                                <span class="info-value">${work.year}年</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-clipboard-list"></i> 工事詳細</h4>
                        <div class="details-grid">
                            ${Object.entries(work.details || {}).map(([key, value]) => 
                                `<div class="detail-item">
                                    <span class="detail-label">${key}</span>
                                    <span class="detail-value">${value}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-file-alt"></i> 工事概要</h4>
                        <p class="work-description">${work.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// モーダルを閉じる
function closeWorkModal() {
    const modal = document.querySelector('.work-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// 編集機能
function editWork(workId) {
    window.location.href = `edit.html?id=${workId}`;
}

// 削除機能
function deleteWork(workId) {
    if (confirm('この施工実績を削除しますか？この操作は取り消せません。')) {
        // localStorageから施工実績データを取得
        let works = JSON.parse(localStorage.getItem('works') || '[]');
        
        // 該当する施工実績を削除
        works = works.filter(w => w.id !== workId);
        
        // localStorageに保存
        localStorage.setItem('works', JSON.stringify(works));
        
        // ページをリロード
        location.reload();
    }
} 