// 施工実績一覧ページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // デフォルトの施工実績データ
    const defaultWorksData = [
        {
            id: 1,
            title: "河川嵩上げ工事",
            category: "河川工事",
            location: "川口市柳崎１丁目地内",
            description: "河川の嵩上げ工事を実施。治水機能の向上と地域の安全確保を図るため、高品質な施工により河川の水位管理能力を向上させました。",
            image: "old-news/20250818_063500339_iOS.jpg",
            year: "2025",
            details: {
                "工期": "2025.3.5~2025.8.29",
                "延長": "217m",
                "嵩上げ高": "最大590mm"
            }
        },
        {
            id: 2,
            title: "河川嵩上げ工事",
            category: "河川工事",
            location: "一級河川菖蒲川／戸田市内",
            description: "河川の嵩上げ工事を実施。治水機能の向上と地域の安全確保を図るため、高品質な施工により河川の水位管理能力を向上させました。",
            image: "jisseki/shoubugawa.jpg",
            year: "2025",
            details: {
                "工期": "2024.11.19～2025.3.31",
                "施工延長": "215.0m",
                "パネル設置工": "220.0m",
                "コンクリート嵩上工": "215.0m",
                "ひび割れ補修工": "1.0式",
                "護岸工": "40.0m2",
                "フェンス設置撤去工": "73.0m",
                "仮囲い工": "107.0m"
            }
        },
        {
            id: 3,
            title: "下水道管更生工事",
            category: "下水道工事",
            location: "川口市並木４丁目地内",
            description: "外径700mm管更生工（自立管型反転・形成工法）を112.41mにわたって実施。下水道管の耐震化を目的とした管更生工事により、地域の防災機能向上とインフラの長寿命化を図りました。",
            image: "../oldpage/old newspage/kankousei.jpg",
            year: "2025",
            details: {
                "工事番号": "224-01-008",
                "登録番号": "4058315390",
                "契約日": "2024.12.19",
                "工期": "2024.12.19～2025.5.16",
                "竣工日": "2025.5.16",
                "工事内容": "外径700mm管更生工 自立管型 反転・形成工法 112.41m 1式",
                "契約金額": "64,046,400円（税込み）",
                "落札価格": "58,224,000円（税抜き）",
                "前払金": "24,060,000円（税込み）",
                "発注機関": "埼玉県川口市上下水道局",
                "契約方式": "一般競争入札方式（価格）",
                "受注形態": "単独",
                "役所担当": "川口市上下水道局下水道維持課"
            }
        },
        {
            id: 4,
            title: "河川浚渫工事",
            category: "河川工事",
            location: "一級河川菖蒲川／戸田市内",
            description: "緊急浚渫推進工事を実施。概算数量発注方式により施工延長90m、浚渫量2,221.5m³の工事を完了。河川の治水機能向上と地域の安全確保を図りました。",
            image: "shoubugawa/shoubugawashunsetsu.JPG",
            year: "2025",
            details: {
                "登録番号": "4057037619",
                "契約日": "2024.08.23",
                "工期": "2024.08.23～2025.06.30",
                "竣工日": "2025.06.30",
                "工事内容": "緊急浚渫推進工事（菖蒲川浚渫工その10）",
                "契約金額": "171,804,600円（税込み）",
                "施工延長": "90m",
                "浚渫量": "2,221.5m³",
                "発注機関": "埼玉県さいたま県土整備事務所",
                "契約方式": "一般競争入札方式（総合評価）",
                "受注形態": "単独"
            }
        },
        {
            id: 5,
            title: "福祉会館解体工事",
            category: "解体工事",
            location: "川口市弥平地内",
            description: "老朽化した福祉会館の安全な解体工事を実施。周辺住民への配慮を最優先に、騒音・振動対策を講じながら計画的に工事を完了。地域の安全確保と環境保全に貢献しました。",
            image: "sonota/fukushikaikan.jpg",
            year: "2025",
            details: {
                "工事内容": "福祉会館解体工事",
                "施工場所": "川口市弥平地内",
                "施工年": "2025年",
                "工事概要": "老朽化した福祉会館の安全な解体工事",
                "特記事項": "騒音・振動対策を実施し、周辺住民への配慮を最優先に工事を実施"
            }
        },
        {
            id: 6,
            title: "水道管付設工事",
            category: "上水道工事",
            location: "川口市芝１丁目地内",
            description: "消防署が近い住宅街での水道管付設工事を実施。住民の生活に支障をきたさないよう、騒音対策を徹底し、安全で確実な施工を完了。地域の給水インフラの整備に貢献しました。",
            image: "../oldpage/old newspage/27gou.jpg",
            year: "2024",
            details: {
                "工事内容": "水道管付設工事",
                "施工場所": "川口市芝１丁目地内",
                "施工年": "2024年",
                "工事概要": "消防署近隣の住宅街での水道管付設工事",
                "特記事項": "騒音対策を実施し、住民への配慮を最優先に工事を実施"
            }
        }
    ];

    // localStorageから施工実績データを取得、なければデフォルトデータを使用
    // デバッグ用: 既存のlocalStorageをクリアして最新データを使用
    localStorage.removeItem('works');
    let worksData = JSON.parse(localStorage.getItem('works') || '[]');
    if (worksData.length === 0) {
        worksData = defaultWorksData;
        localStorage.setItem('works', JSON.stringify(worksData));
        // トップページに更新を通知
        window.dispatchEvent(new CustomEvent('worksUpdated'));
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