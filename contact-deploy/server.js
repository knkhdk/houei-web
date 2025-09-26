const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');

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

// お問い合わせ設定の読み込み
let contactConfig = {};
try {
    const contactConfigPath = path.join(__dirname, 'contact-config.json');
    if (fs.existsSync(contactConfigPath)) {
        contactConfig = JSON.parse(fs.readFileSync(contactConfigPath, 'utf8'));
        console.log('お問い合わせ設定を読み込みました');
    } else {
        console.log('お問い合わせ設定ファイルが見つかりません。デフォルト設定を使用します。');
    }
} catch (error) {
    console.error('お問い合わせ設定の読み込みエラー:', error);
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

// お問い合わせフォーム用のレート制限
const rateLimitMap = new Map();

function checkRateLimit(ip) {
    if (!contactConfig.rateLimit?.enabled) return true;
    
    const now = Date.now();
    const windowMs = contactConfig.rateLimit.windowMs || 60000;
    const maxRequests = contactConfig.rateLimit.maxRequests || 5;
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }
    
    const requests = rateLimitMap.get(ip);
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
        return false;
    }
    
    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);
    return true;
}

// メール送信機能
function createTransporter() {
    if (!contactConfig.email?.enabled) return null;
    
    const smtp = contactConfig.email.smtp;
    return nodemailer.createTransporter({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: smtp.auth
    });
}

// お問い合わせデータの保存
function saveContactData(contactData) {
    if (!contactConfig.database?.enabled) return;
    
    const contactsPath = path.join(__dirname, contactConfig.database.file || 'data/contacts.json');
    
    // データディレクトリの確認
    const dataDir = path.dirname(contactsPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 既存データの読み込み
    let contacts = [];
    if (fs.existsSync(contactsPath)) {
        try {
            contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
        } catch (error) {
            console.error('お問い合わせデータの読み込みエラー:', error);
        }
    }
    
    // 新しいデータを追加
    contacts.push({
        ...contactData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'new'
    });
    
    // データを保存
    try {
        fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
        console.log('お問い合わせデータを保存しました');
    } catch (error) {
        console.error('お問い合わせデータの保存エラー:', error);
    }
}

// お問い合わせフォームの送信
app.post('/api/contact', (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // レート制限チェック
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ 
            error: '送信回数が上限に達しました。しばらく時間をおいてから再度お試しください。' 
        });
    }
    
    const { name, company, email, phone, category, subject, message, preferred_contact, urgency, privacy } = req.body;
    
    // バリデーション
    const validation = contactConfig.validation || {};
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('お名前は必須です');
    } else if (name.length > (validation.maxNameLength || 50)) {
        errors.push('お名前は50文字以内で入力してください');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('有効なメールアドレスを入力してください');
    }
    
    if (!phone || phone.trim().length === 0) {
        errors.push('電話番号は必須です');
    }
    
    if (!category || category.trim().length === 0) {
        errors.push('お問い合わせ種別を選択してください');
    }
    
    if (!subject || subject.trim().length === 0) {
        errors.push('件名は必須です');
    } else if (subject.length > (validation.maxSubjectLength || 100)) {
        errors.push('件名は100文字以内で入力してください');
    }
    
    if (!message || message.trim().length === 0) {
        errors.push('お問い合わせ内容は必須です');
    } else if (message.length > (validation.maxMessageLength || 2000)) {
        errors.push('お問い合わせ内容は2000文字以内で入力してください');
    }
    
    if (!privacy) {
        errors.push('プライバシーポリシーに同意してください');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ error: '入力内容にエラーがあります', details: errors });
    }
    
    // お問い合わせデータの準備
    const contactData = {
        name: name.trim(),
        company: company ? company.trim() : '',
        email: email.trim(),
        phone: phone.trim(),
        category,
        subject: subject.trim(),
        message: message.trim(),
        preferred_contact: preferred_contact || 'email',
        urgency: urgency || 'normal',
        ip: clientIP,
        userAgent: req.headers['user-agent']
    };
    
    // データベースに保存
    saveContactData(contactData);
    
    // メール送信
    if (contactConfig.email?.enabled) {
        const transporter = createTransporter();
        if (transporter) {
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
            
            const mailOptions = {
                from: contactConfig.email.from,
                to: contactConfig.email.to,
                subject: contactConfig.email.subject
                    .replace('{subject}', subject)
                    .replace('{name}', name),
                html: `
                    <h2>お問い合わせが送信されました</h2>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>お名前</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${name}</td></tr>
                        ${company ? `<tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>会社名・組織名</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${company}</td></tr>` : ''}
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>メールアドレス</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${email}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>電話番号</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${phone}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>お問い合わせ種別</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${categoryLabels[category] || category}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>件名</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${subject}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>お問い合わせ内容</strong></td><td style="border: 1px solid #ddd; padding: 8px; white-space: pre-wrap;">${message}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>ご希望の連絡方法</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${preferred_contact === 'phone' ? '電話' : 'メール'}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>緊急度</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${urgencyLabels[urgency] || urgency}</td></tr>
                        <tr><td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;"><strong>送信日時</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleString('ja-JP')}</td></tr>
                    </table>
                `
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('メール送信エラー:', error);
                } else {
                    console.log('メール送信成功:', info.messageId);
                }
            });
        }
    }
    
    res.json({ 
        success: true, 
        message: 'お問い合わせを送信しました。担当者よりご連絡いたします。' 
    });
});

// お問い合わせデータの取得（管理用）
app.get('/api/contacts', (req, res) => {
    if (!contactConfig.database?.enabled) {
        return res.status(404).json({ error: 'お問い合わせデータベースが無効です' });
    }
    
    const contactsPath = path.join(__dirname, contactConfig.database.file || 'data/contacts.json');
    
    if (!fs.existsSync(contactsPath)) {
        return res.json([]);
    }
    
    try {
        const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
        res.json(contacts);
    } catch (error) {
        console.error('お問い合わせデータの読み込みエラー:', error);
        res.status(500).json({ error: 'データの読み込みに失敗しました' });
    }
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
    console.log(`📋 利用可能なページ一覧:`);
    console.log(`┌─────────────────────────────────────────────────────────┐`);
    console.log(`│ ページ名           │ URL                                    │`);
    console.log(`├─────────────────────────────────────────────────────────┤`);
    console.log(`│ 🏠 メインページ      │ http://${localIP}:${PORT}                    │`);
    console.log(`│ 📰 お知らせ一覧      │ http://${localIP}:${PORT}/news/index.html     │`);
    console.log(`│ 🏗️ 施工実績一覧      │ http://${localIP}:${PORT}/works/index.html    │`);
    console.log(`│ ✏️ お知らせ投稿      │ http://${localIP}:${PORT}/news/post.html      │`);
    console.log(`│ 📞 お問い合わせ      │ http://${localIP}:${PORT}/contact/index.html  │`);
    console.log(`│ 🏢 会社概要          │ http://${localIP}:${PORT}/about.html          │`);
    console.log(`│ 💼 採用情報          │ http://${localIP}:${PORT}/recruit/            │`);
    console.log(`│ 🔧 技術・サービス    │ http://${localIP}:${PORT}/technology/         │`);
    console.log(`│ 🏭 施工実績詳細      │ http://${localIP}:${PORT}/works/              │`);
    console.log(`│ 📊 ヘルスチェック    │ http://${localIP}:${PORT}/api/health          │`);
    console.log(`└─────────────────────────────────────────────────────────┘`);
    console.log(`========================================`);
    console.log(`🔐 セキュリティ情報:`);
    console.log(`  • お知らせ投稿ページは認証が必要です`);
    console.log(`  • その他のページは一般公開されています`);
    console.log(`========================================`);
    console.log(`🌐 LAN内アクセス:`);
    console.log(`  同じWi-Fiネットワークの他のデバイスからもアクセス可能です`);
    console.log(`  スマートフォンやタブレットからも閲覧できます`);
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