// ローカルファイル管理用の簡易サーバー機能
class LocalFileServer {
    constructor() {
        this.server = null;
        this.port = 8080;
        this.isRunning = false;
    }

    // サーバーを起動
    async startServer() {
        if (this.isRunning) {
            console.log('サーバーは既に起動しています');
            return true;
        }

        try {
            // 簡易HTTPサーバーを作成
            const http = require('http');
            const fs = require('fs');
            const path = require('path');

            this.server = http.createServer((req, res) => {
                // CORSヘッダーを設定
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                if (req.method === 'OPTIONS') {
                    res.writeHead(200);
                    res.end();
                    return;
                }

                // ファイルパスを取得
                let filePath = req.url;
                if (filePath === '/') {
                    filePath = '/index.html';
                }

                // データファイルの処理
                if (filePath === '/api/news' && req.method === 'GET') {
                    this.handleGetNews(req, res);
                    return;
                }

                if (filePath === '/api/news' && req.method === 'POST') {
                    this.handlePostNews(req, res);
                    return;
                }

                // 通常のファイル配信
                const fullPath = path.join(__dirname, '..', filePath);
                
                fs.readFile(fullPath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('File not found');
                        return;
                    }

                    // ファイルタイプを判定
                    const ext = path.extname(fullPath);
                    const contentType = this.getContentType(ext);
                    
                    res.setHeader('Content-Type', contentType);
                    res.writeHead(200);
                    res.end(data);
                });
            });

            this.server.listen(this.port, () => {
                console.log(`ローカルサーバーが起動しました: http://localhost:${this.port}`);
                this.isRunning = true;
                
                // ブラウザを自動起動
                this.openBrowser();
            });

            return true;
        } catch (error) {
            console.error('サーバー起動エラー:', error);
            return false;
        }
    }

    // お知らせデータを取得
    handleGetNews(req, res) {
        const fs = require('fs');
        const path = require('path');
        const newsPath = path.join(__dirname, '..', 'data', 'news.json');

        fs.readFile(newsPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify([]));
                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(data);
        });
    }

    // お知らせデータを保存
    handlePostNews(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const fs = require('fs');
                const path = require('path');
                const newsPath = path.join(__dirname, '..', 'data', 'news.json');
                const newsData = JSON.parse(body);

                // バックアップを作成
                const backupPath = path.join(__dirname, '..', 'data', `news-backup-${Date.now()}.json`);
                if (fs.existsSync(newsPath)) {
                    fs.copyFileSync(newsPath, backupPath);
                }

                // 新しいデータを保存
                fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2));

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, message: 'データを保存しました' }));
            } catch (error) {
                console.error('データ保存エラー:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: '保存に失敗しました' }));
            }
        });
    }

    // ファイルタイプを判定
    getContentType(ext) {
        const types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon'
        };
        return types[ext] || 'text/plain';
    }

    // ブラウザを自動起動
    openBrowser() {
        const { exec } = require('child_process');
        const url = `http://localhost:${this.port}`;
        
        // Windowsの場合
        exec(`start ${url}`, (error) => {
            if (error) {
                console.log('ブラウザの自動起動に失敗しました。手動で以下のURLを開いてください:');
                console.log(url);
            }
        });
    }

    // サーバーを停止
    stopServer() {
        if (this.server) {
            this.server.close(() => {
                console.log('サーバーを停止しました');
                this.isRunning = false;
            });
        }
    }
}

// グローバルに公開
window.LocalFileServer = LocalFileServer; 