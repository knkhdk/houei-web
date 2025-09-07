// 手動で画像の対応関係を設定するスクリプト

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ファイルパス
const csvPath = path.join(__dirname, '../oldpage/oshirake-google.csv');
const imageDir = path.join(__dirname, '../oldpage/old newspage');
const outputPath = path.join(__dirname, '../data/news.json');

// readlineインターフェース
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// CSVをパースする関数
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        fields.push(currentField);
        
        if (fields.length >= 4) {
            data.push({
                date: fields[0]?.trim() || '',
                title: fields[1]?.trim() || '',
                content: fields[2]?.trim() || '',
                imageUrl: fields[3]?.trim() || '',
                linkTitle: fields[4]?.trim() || '',
                linkUrl: fields[5]?.trim() || ''
            });
        }
    }
    
    return data;
}

// 画像ファイルの情報を取得
function getImageFiles() {
    const files = fs.readdirSync(imageDir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
}

// 質問を表示して回答を取得
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// 画像選択のメニューを表示
function displayImageMenu(images) {
    console.log('\n利用可能な画像:');
    images.forEach((image, index) => {
        console.log(`  ${index + 1}. ${image}`);
    });
    console.log(`  ${images.length + 1}. 画像なし`);
    console.log(`  ${images.length + 2}. スキップ（後で設定）`);
}

// メイン処理
async function manualImageMapping() {
    try {
        console.log('=== 手動画像対応設定 ===');
        
        // データを読み込み
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvData = parseCSV(csvContent);
        const imageFiles = getImageFiles();
        
        // 画像URLがあるお知らせをフィルタ
        const newsWithImages = csvData.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
        
        console.log(`\n画像URLがあるお知らせ: ${newsWithImages.length}件`);
        console.log(`利用可能な画像: ${imageFiles.length}件`);
        
        const mappings = [];
        
        for (let i = 0; i < newsWithImages.length; i++) {
            const news = newsWithImages[i];
            console.log(`\n=== ${i + 1}/${newsWithImages.length} ===`);
            console.log(`タイトル: ${news.title}`);
            console.log(`日付: ${news.date}`);
            console.log(`元の画像URL: ${news.imageUrl}`);
            
            // 画像選択
            displayImageMenu(imageFiles);
            
            const choice = await askQuestion('\nどの画像を選択しますか？ (番号を入力): ');
            const choiceNum = parseInt(choice);
            
            if (choiceNum >= 1 && choiceNum <= imageFiles.length) {
                const selectedImage = imageFiles[choiceNum - 1];
                mappings.push({
                    title: news.title,
                    date: news.date,
                    originalImageUrl: news.imageUrl,
                    selectedImage: selectedImage,
                    imagePath: `../images/old-news/${selectedImage}`
                });
                console.log(`✅ 選択: ${selectedImage}`);
            } else if (choiceNum === imageFiles.length + 1) {
                mappings.push({
                    title: news.title,
                    date: news.date,
                    originalImageUrl: news.imageUrl,
                    selectedImage: null,
                    imagePath: null
                });
                console.log('✅ 画像なしを選択');
            } else if (choiceNum === imageFiles.length + 2) {
                console.log('⏭️ スキップ');
            } else {
                console.log('❌ 無効な選択');
                i--; // やり直し
            }
        }
        
        // 結果を保存
        const mappingData = {
            mappings: mappings,
            timestamp: new Date().toISOString(),
            totalNews: newsWithImages.length,
            mappedNews: mappings.length
        };
        
        const mappingPath = path.join(__dirname, '../data/image-mappings.json');
        fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
        
        console.log(`\n=== 設定完了 ===`);
        console.log(`対応設定: ${mappings.length}件`);
        console.log(`設定ファイル: ${mappingPath}`);
        
        // 画像ファイルをコピーするか確認
        const copyImages = await askQuestion('\n画像ファイルをimages/old-news/フォルダにコピーしますか？ (y/n): ');
        
        if (copyImages.toLowerCase() === 'y' || copyImages.toLowerCase() === 'yes') {
            await copyImageFiles(mappings, imageFiles);
        }
        
        console.log('\n🎉 画像対応設定が完了しました！');
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
    } finally {
        rl.close();
    }
}

// 画像ファイルをコピー
async function copyImageFiles(mappings, imageFiles) {
    const targetDir = path.join(__dirname, '../images/old-news');
    
    // ターゲットディレクトリを作成
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`📁 ディレクトリを作成: ${targetDir}`);
    }
    
    // 選択された画像をコピー
    const selectedImages = mappings
        .filter(m => m.selectedImage)
        .map(m => m.selectedImage);
    
    const uniqueImages = [...new Set(selectedImages)];
    
    console.log(`\n画像ファイルをコピー中...`);
    
    for (const imageFile of uniqueImages) {
        const sourcePath = path.join(imageDir, imageFile);
        const targetPath = path.join(targetDir, imageFile);
        
        try {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✅ コピー完了: ${imageFile}`);
        } catch (error) {
            console.error(`❌ コピー失敗: ${imageFile} - ${error.message}`);
        }
    }
    
    console.log(`\n📁 コピー先: ${targetDir}`);
}

// スクリプト実行
if (require.main === module) {
    manualImageMapping();
}

module.exports = { manualImageMapping };
