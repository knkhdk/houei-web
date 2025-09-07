const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// セキュリティ設定の読み込み
let securityConfig = {};
try {
    const configPath = path.join(__dirname, 'security-config.json');
    if (fs.existsSync(configPath)) {
        securityConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('セキュリティ設定を読み込みました');
    } else {
        console.log('セキュリティ設定ファイルが見つかりません。デフォルト設定を使用します。');
    }
} catch (error) {
    console.error('セキュリティ設定の読み込みエラー:', error);
}

// ミドルウェアの設定
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// セキュリティミドルウェア: 投稿ページへのアクセス制限
app.use('/news/post.html', (req, res, next) => {
    // セキュリティが無効化されている場合はスキップ
    if (!securityConfig.security || !securityConfig.security.enabled) {
        next();
        return;
    }
    
    // 開発環境では制限をスキップ
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         req.hostname === 'localhost' || 
                         req.hostname === '127.0.0.1';
    
    if (isDevelopment && securityConfig.security.developmentMode?.skipAuthentication) {
        console.log('開発環境: 投稿ページアクセス制限をスキップ');
        next();
        return;
    }
    
    // 本番環境では認証トークンをチェック
    const token = req.query.token || req.query.admin;
    const validTokens = securityConfig.security.productionMode?.validTokens || 
                       securityConfig.tokens ? Object.keys(securityConfig.tokens) : 
                       ['houei2024admin', 'houei2024post'];
    
    if (!token || !validTokens.includes(token)) {
        const clientInfo = {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date().toISOString()
        };
        
        console.log('投稿ページへの不正アクセスを検出:', clientInfo);
        
        // ログファイルに記録（オプション）
        if (securityConfig.security.logging?.logFailedAttempts) {
            const logEntry = `[${clientInfo.timestamp}] FAILED_ACCESS: ${clientInfo.ip} - ${clientInfo.userAgent}\n`;
            fs.appendFileSync(path.join(__dirname, 'security.log'), logEntry);
        }
        
        res.status(403).send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>アクセス拒否 - 邦栄建設株式会社</title>
                <style>
                    body { font-family: 'Noto Sans JP', sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                    .error-container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
                    .error-icon { font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #e74c3c; margin-bottom: 20px; }
                    p { color: #666; margin-bottom: 30px; }
                    .btn { background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-icon">🚫</div>
                    <h1>アクセスが拒否されました</h1>
                    <p>このページにアクセスするには適切な認証が必要です。</p>
                    <a href="/" class="btn">トップページに戻る</a>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    console.log('投稿ページへの認証済みアクセス:', req.ip);
    next();
});

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
    try {
        // お知らせデータを読み込み
        const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/news.json'), 'utf8'));
        console.log('読み込んだお知らせデータ件数:', newsData.length);
        
        // index.htmlを読み込み
        let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        // お知らせデータをscriptタグに埋め込み（シンプルな置換）
        const newsDataScript = `<script id="newsData" type="application/json">${JSON.stringify(newsData)}</script>`;
        html = html.replace('<script id="newsData" type="application/json">[]</script>', newsDataScript);
        
        res.send(html);
    } catch (error) {
        console.error('index.htmlの読み込みエラー:', error);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
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
app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    // LAN内のIPアドレスを取得
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address;
                break;
            }
        }
        if (localIP !== 'localhost') break;
    }
    
    console.log(`========================================`);
    console.log(`邦栄建設Webサイト - ローカルサーバー`);
    console.log(`========================================`);
    console.log(`サーバーが起動しました:`);
    console.log(`  ローカル: http://localhost:${PORT}`);
    console.log(`  LAN内:   http://${localIP}:${PORT}`);
    console.log(`========================================`);
    console.log(`アクセス可能なURL:`);
    console.log(`  お知らせ投稿: http://${localIP}:${PORT}/news/post.html`);
    console.log(`  お知らせ一覧: http://${localIP}:${PORT}/news/index.html`);
    console.log(`  施工実績一覧: http://${localIP}:${PORT}/works/index.html`);
    console.log(`  ヘルスチェック: http://${localIP}:${PORT}/api/health`);
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