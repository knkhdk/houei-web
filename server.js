const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// ログミドルウェア
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// データディレクトリの確認と作成
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('データディレクトリを作成しました:', dataDir);
}

// データファイルの初期化
const newsPath = path.join(dataDir, 'news.json');
const draftsPath = path.join(dataDir, 'drafts.json');

if (!fs.existsSync(newsPath)) {
    fs.writeFileSync(newsPath, '[]');
    console.log('お知らせデータファイルを初期化しました');
}

if (!fs.existsSync(draftsPath)) {
    fs.writeFileSync(draftsPath, '[]');
    console.log('下書きデータファイルを初期化しました');
}

// お知らせデータの取得
app.get('/api/news', (req, res) => {
    fs.readFile(newsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('お知らせファイル読み込みエラー:', err);
            res.status(500).json({ error: 'データの読み込みに失敗しました' });
            return;
        }
        
        try {
            const newsData = JSON.parse(data);
            res.json(newsData);
        } catch (parseError) {
            console.error('お知らせデータの解析エラー:', parseError);
            res.status(500).json({ error: 'データの解析に失敗しました' });
        }
    });
});

// お知らせデータの保存
app.post('/api/news', (req, res) => {
    const newsData = req.body;
    
    if (!Array.isArray(newsData)) {
        res.status(400).json({ error: 'データ形式が正しくありません' });
        return;
    }
    
    try {
        // バックアップを作成
        const backupDir = path.join(dataDir, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `news-backup-${timestamp}.json`);
        
        if (fs.existsSync(newsPath)) {
            fs.copyFileSync(newsPath, backupPath);
            console.log(`バックアップを作成しました: ${backupPath}`);
        }
        
        // 新しいデータを保存
        fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2));
        console.log('お知らせデータを保存しました');
        
        res.json({ success: true, message: 'データを保存しました' });
    } catch (error) {
        console.error('データ保存エラー:', error);
        res.status(500).json({ error: '保存に失敗しました' });
    }
});

// 下書きデータの取得
app.get('/api/drafts', (req, res) => {
    fs.readFile(draftsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('下書きファイル読み込みエラー:', err);
            res.status(500).json({ error: '下書きデータの読み込みに失敗しました' });
            return;
        }
        
        try {
            const draftsData = JSON.parse(data);
            res.json(draftsData);
        } catch (parseError) {
            console.error('下書きデータの解析エラー:', parseError);
            res.status(500).json({ error: '下書きデータの解析に失敗しました' });
        }
    });
});

// 下書きデータの保存
app.post('/api/drafts', (req, res) => {
    const draftsData = req.body;
    
    if (!Array.isArray(draftsData)) {
        res.status(400).json({ error: 'データ形式が正しくありません' });
        return;
    }
    
    try {
        fs.writeFileSync(draftsPath, JSON.stringify(draftsData, null, 2));
        console.log('下書きデータを保存しました');
        res.json({ success: true, message: '下書きを保存しました' });
    } catch (error) {
        console.error('下書き保存エラー:', error);
        res.status(500).json({ error: '保存に失敗しました' });
    }
});

// ファイルアップロード
app.post('/api/upload', (req, res) => {
    // 画像アップロード機能（必要に応じて実装）
    res.json({ success: true, message: 'アップロード機能は準備中です' });
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// メインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404エラーハンドラー
app.use((req, res) => {
    res.status(404).json({ error: 'ページが見つかりません' });
});

// エラーハンドラー
app.use((err, req, res, next) => {
    console.error('サーバーエラー:', err);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました' });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`邦栄建設Webサイト - ローカルサーバー`);
    console.log(`========================================`);
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    console.log(`お知らせ投稿: http://localhost:${PORT}/news/post.html`);
    console.log(`お知らせ一覧: http://localhost:${PORT}/news/index.html`);
    console.log(`施工実績一覧: http://localhost:${PORT}/works/index.html`);
    console.log(`ヘルスチェック: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
    console.log(`終了するには Ctrl+C を押してください`);
    console.log(`========================================`);
    
    // ブラウザを自動起動
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`, (error) => {
        if (error) {
            console.log('ブラウザの自動起動に失敗しました。手動で以下のURLを開いてください:');
            console.log(`http://localhost:${PORT}`);
        }
    });
});

// プロセス終了時の処理
process.on('SIGINT', () => {
    console.log('\n========================================');
    console.log('サーバーを終了しています...');
    console.log('========================================');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('未処理の例外が発生しました:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未処理のPromise拒否が発生しました:', reason);
    process.exit(1);
}); 