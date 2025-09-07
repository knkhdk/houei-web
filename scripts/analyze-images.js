// 旧サイトの画像URLとローカル画像ファイルの対応関係を分析するスクリプト

const fs = require('fs');
const path = require('path');

// ファイルパス
const csvPath = path.join(__dirname, '../oldpage/oshirake-google.csv');
const imageDir = path.join(__dirname, '../oldpage/old newspage');

// CSVをパースする関数
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // CSVの解析
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

// 画像の対応関係を推測する関数
function analyzeImageMapping(csvData, imageFiles) {
    console.log('=== 画像URL分析 ===');
    
    const imageUrlData = csvData.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
    console.log(`画像URLがあるお知らせ: ${imageUrlData.length}件`);
    
    // Google Drive URLのパターン分析
    const driveUrls = imageUrlData.filter(item => item.imageUrl.includes('drive.google.com'));
    console.log(`Google Drive URL: ${driveUrls.length}件`);
    
    // 画像ファイルの分析
    console.log(`\n=== ローカル画像ファイル ===`);
    console.log(`画像ファイル数: ${imageFiles.length}件`);
    
    // ファイル名のパターン分析
    const patterns = {
        date: imageFiles.filter(f => /^\d{4}\.\d{1,2}\.\d{1,2}/.test(f)),
        dsc: imageFiles.filter(f => /^DSC/.test(f)),
        img: imageFiles.filter(f => /^IMG/.test(f)),
        other: imageFiles.filter(f => !/^\d{4}\.\d{1,2}\.\d{1,2}|^DSC|^IMG/.test(f))
    };
    
    console.log(`日付パターン: ${patterns.date.length}件`);
    console.log(`DSCパターン: ${patterns.dsc.length}件`);
    console.log(`IMGパターン: ${patterns.img.length}件`);
    console.log(`その他: ${patterns.other.length}件`);
    
    // 日付ベースの対応関係を推測
    console.log(`\n=== 日付ベースの対応関係推測 ===`);
    const dateMappings = [];
    
    for (const item of imageUrlData) {
        if (item.imageUrl.includes('drive.google.com')) {
            // 日付から対応する画像ファイルを推測
            const itemDate = item.date;
            const matchingFiles = patterns.date.filter(file => {
                const fileDate = file.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})/);
                if (!fileDate) return false;
                
                const fileYear = fileDate[1];
                const fileMonth = fileDate[2];
                const fileDay = fileDate[3];
                
                // 日付の比較（簡易版）
                if (itemDate.includes(fileYear) && itemDate.includes(fileMonth)) {
                    return true;
                }
                
                return false;
            });
            
            if (matchingFiles.length > 0) {
                dateMappings.push({
                    title: item.title,
                    date: item.date,
                    imageUrl: item.imageUrl,
                    suggestedFiles: matchingFiles
                });
            }
        }
    }
    
    console.log(`日付ベースで推測できた対応関係: ${dateMappings.length}件`);
    
    return {
        imageUrlData,
        imageFiles,
        patterns,
        dateMappings
    };
}

// メイン処理
function analyzeImages() {
    try {
        console.log('旧サイトの画像分析を開始...');
        
        // CSVデータを読み込み
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvData = parseCSV(csvContent);
        
        // 画像ファイルを取得
        const imageFiles = getImageFiles();
        
        // 分析実行
        const analysis = analyzeImageMapping(csvData, imageFiles);
        
        // 結果を表示
        console.log(`\n=== 分析結果サマリー ===`);
        console.log(`お知らせ総数: ${csvData.length}件`);
        console.log(`画像URLがあるお知らせ: ${analysis.imageUrlData.length}件`);
        console.log(`ローカル画像ファイル: ${analysis.imageFiles.length}件`);
        console.log(`日付ベース推測: ${analysis.dateMappings.length}件`);
        
        // 詳細な対応関係を表示
        console.log(`\n=== 推測された対応関係 ===`);
        analysis.dateMappings.forEach((mapping, index) => {
            console.log(`\n${index + 1}. ${mapping.title}`);
            console.log(`   日付: ${mapping.date}`);
            console.log(`   推測画像: ${mapping.suggestedFiles.join(', ')}`);
        });
        
        // 未対応の画像ファイル
        const usedFiles = new Set();
        analysis.dateMappings.forEach(mapping => {
            mapping.suggestedFiles.forEach(file => usedFiles.add(file));
        });
        
        const unusedFiles = analysis.imageFiles.filter(file => !usedFiles.has(file));
        console.log(`\n=== 未対応の画像ファイル ===`);
        console.log(`未対応ファイル数: ${unusedFiles.length}件`);
        unusedFiles.forEach(file => console.log(`  - ${file}`));
        
        // 結果をJSONファイルに保存
        const result = {
            analysis: analysis,
            mappings: analysis.dateMappings,
            unusedFiles: unusedFiles,
            timestamp: new Date().toISOString()
        };
        
        const outputPath = path.join(__dirname, '../data/image-analysis.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`\n分析結果を保存しました: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        console.error(error.stack);
    }
}

// スクリプト実行
if (require.main === module) {
    analyzeImages();
}

module.exports = { analyzeImages };
