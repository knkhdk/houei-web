// 旧サイトのお知らせデータを現在のシステムに取り込むスクリプト

const fs = require('fs');
const path = require('path');

// CSVファイルのパス
const csvPath = path.join(__dirname, '../oldpage/oshirake-google.csv');
const outputPath = path.join(__dirname, '../data/news.json');

// カテゴリ推測のキーワードマッピング
const categoryKeywords = {
    '採用情報': ['採用', '募集', '求人', '新卒', '中途', 'アルバイト', 'パート'],
    '工事実績': ['工事', '施工', '完成', '竣工', '建設', '土木', '建築', '護岸', '道路', '橋梁'],
    '技術情報': ['技術', '工法', 'DX', 'i-Construction', 'ICT', 'デジタル', 'システム', 'AI'],
    '会社情報': ['寄付', 'SDGs', '社会貢献', '地域', '美化', '清掃', 'フードパントリー', 'ネーミングライツ', 'プレスリリース'],
    'お知らせ': ['お知らせ', '報告', '連絡', '案内', '通知']
};

// 日付フォーマットを変換する関数
function formatDate(dateStr) {
    // 25.9.1 や 2025.8.22 の形式を ISO 形式に変換
    if (dateStr.includes('.')) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            let year, month, day;
            
            if (parts[0].length === 2) {
                // 25.9.1 形式
                year = '20' + parts[0];
                month = parts[1].padStart(2, '0');
                day = parts[2].padStart(2, '0');
            } else {
                // 2025.8.22 形式
                year = parts[0];
                month = parts[1].padStart(2, '0');
                day = parts[2].padStart(2, '0');
            }
            
            return `${year}-${month}-${day}T10:00:00.000Z`;
        }
    }
    
    // デフォルトは現在の日付
    return new Date().toISOString();
}

// カテゴリを推測する関数
function guessCategory(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }
    
    return 'お知らせ'; // デフォルト
}

// 概要を生成する関数（詳細内容の最初の100文字程度）
function generateSummary(content) {
    // HTMLタグを除去
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    // 改行を除去して1行に
    const singleLine = cleanContent.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // 100文字程度で切り取り
    if (singleLine.length <= 100) {
        return singleLine;
    }
    
    // 100文字以内で文の区切りを探す
    const truncated = singleLine.substring(0, 100);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastComma = truncated.lastIndexOf('、');
    
    if (lastPeriod > 50) {
        return truncated.substring(0, lastPeriod + 1);
    } else if (lastComma > 50) {
        return truncated.substring(0, lastComma + 1);
    } else {
        return truncated + '...';
    }
}

// CSVをパースする関数
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // CSVの解析（カンマ区切りだが、詳細内容にカンマが含まれる可能性がある）
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
        
        if (fields.length >= 3) {
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

// メイン処理
function importOldNews() {
    try {
        console.log('旧サイトのお知らせデータを読み込み中...');
        
        // CSVファイルを読み込み
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const csvData = parseCSV(csvContent);
        
        console.log(`${csvData.length}件のお知らせデータを読み込みました`);
        
        // 既存のお知らせデータを読み込み
        let existingNews = [];
        if (fs.existsSync(outputPath)) {
            const existingData = fs.readFileSync(outputPath, 'utf8');
            existingNews = JSON.parse(existingData);
        }
        
        // 新しいお知らせデータを生成
        const newNews = csvData.map((item, index) => {
            const category = guessCategory(item.title, item.content);
            const summary = generateSummary(item.content);
            const formattedDate = formatDate(item.date);
            
            return {
                id: `old-news-${Date.now()}-${index}`,
                title: item.title,
                summary: summary,
                content: item.content,
                category: category,
                date: formattedDate,
                status: 'published',
                details: {
                    '元の日付': item.date,
                    '画像URL': item.imageUrl || 'なし',
                    'リンクタイトル': item.linkTitle || 'なし',
                    'リンクURL': item.linkUrl || 'なし'
                },
                image: item.imageUrl || null,
                timestamp: new Date().toISOString()
            };
        });
        
        // 既存データと新しいデータをマージ（新しいデータを先頭に）
        const mergedNews = [...newNews, ...existingNews];
        
        // 重複を除去（タイトルが同じもの）
        const uniqueNews = mergedNews.filter((item, index, self) => 
            index === self.findIndex(t => t.title === item.title)
        );
        
        // JSONファイルに保存
        fs.writeFileSync(outputPath, JSON.stringify(uniqueNews, null, 2));
        
        console.log('✅ お知らせデータの取り込みが完了しました');
        console.log(`📊 統計:`);
        console.log(`  - 新規追加: ${newNews.length}件`);
        console.log(`  - 既存データ: ${existingNews.length}件`);
        console.log(`  - 合計: ${uniqueNews.length}件`);
        console.log(`  - 重複除去後: ${uniqueNews.length}件`);
        
        // カテゴリ別の統計
        const categoryStats = {};
        newNews.forEach(item => {
            categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
        });
        
        console.log(`📋 カテゴリ別統計:`);
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count}件`);
        });
        
        console.log(`\n💾 データファイル: ${outputPath}`);
        console.log('🎉 取り込み完了！サーバーを再起動して確認してください。');
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        console.error(error.stack);
    }
}

// スクリプト実行
if (require.main === module) {
    importOldNews();
}

module.exports = { importOldNews };
