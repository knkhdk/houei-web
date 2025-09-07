// 画像マッピングを既存のお知らせデータに適用するスクリプト

const fs = require('fs');
const path = require('path');

// ファイルパス
const mappingPath = path.join(__dirname, '../data/image-mappings.json');
const newsPath = path.join(__dirname, '../data/news.json');

// メイン処理
function applyImageMappings() {
    try {
        console.log('画像マッピングを適用中...');
        
        // 画像マッピングデータを読み込み
        if (!fs.existsSync(mappingPath)) {
            console.error('❌ 画像マッピングファイルが見つかりません:', mappingPath);
            return;
        }
        
        const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
        const mappings = mappingData.mappings;
        
        console.log(`読み込んだマッピング: ${mappings.length}件`);
        
        // 既存のお知らせデータを読み込み
        if (!fs.existsSync(newsPath)) {
            console.error('❌ お知らせデータファイルが見つかりません:', newsPath);
            return;
        }
        
        const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
        console.log(`既存のお知らせ: ${newsData.length}件`);
        
        // マッピングを適用
        let updatedCount = 0;
        
        for (const mapping of mappings) {
            // タイトルでマッチング
            const matchingNews = newsData.find(news => 
                news.title === mapping.title && 
                news.details && 
                news.details['元の日付'] === mapping.date
            );
            
            if (matchingNews) {
                if (mapping.selectedImage) {
                    matchingNews.image = mapping.imagePath;
                    matchingNews.imageUrl = mapping.originalImageUrl;
                    console.log(`✅ 画像を適用: ${mapping.title} -> ${mapping.selectedImage}`);
                } else {
                    matchingNews.image = null;
                    matchingNews.imageUrl = mapping.originalImageUrl;
                    console.log(`📷 画像なしを設定: ${mapping.title}`);
                }
                updatedCount++;
            } else {
                console.log(`⚠️ マッチするお知らせが見つかりません: ${mapping.title} (${mapping.date})`);
            }
        }
        
        // 更新されたデータを保存
        fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2));
        
        console.log(`\n=== 適用完了 ===`);
        console.log(`更新されたお知らせ: ${updatedCount}件`);
        console.log(`データファイル: ${newsPath}`);
        
        // 画像が設定されたお知らせの統計
        const withImages = newsData.filter(news => news.image && news.image !== null);
        const withoutImages = newsData.filter(news => !news.image || news.image === null);
        
        console.log(`\n📊 画像統計:`);
        console.log(`  - 画像あり: ${withImages.length}件`);
        console.log(`  - 画像なし: ${withoutImages.length}件`);
        
        // カテゴリ別の画像統計
        const categoryStats = {};
        newsData.forEach(news => {
            if (!categoryStats[news.category]) {
                categoryStats[news.category] = { total: 0, withImage: 0 };
            }
            categoryStats[news.category].total++;
            if (news.image && news.image !== null) {
                categoryStats[news.category].withImage++;
            }
        });
        
        console.log(`\n📋 カテゴリ別画像統計:`);
        Object.entries(categoryStats).forEach(([category, stats]) => {
            const percentage = Math.round((stats.withImage / stats.total) * 100);
            console.log(`  - ${category}: ${stats.withImage}/${stats.total}件 (${percentage}%)`);
        });
        
        console.log('\n🎉 画像マッピングの適用が完了しました！');
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        console.error(error.stack);
    }
}

// スクリプト実行
if (require.main === module) {
    applyImageMappings();
}

module.exports = { applyImageMappings };
