# サーバー環境確認手順

## Node.jsのインストール確認

```bash
# Node.jsのバージョン確認
node --version

# npmのバージョン確認
npm --version
```

## プロジェクトのセットアップ確認

```bash
# プロジェクトディレクトリに移動
cd /path/to/cursor_houeiweb

# 依存関係のインストール
npm install

# サーバーの起動テスト
npm start
```

## 動作確認

1. ブラウザで `http://your-server-ip:3000` にアクセス
2. お知らせが表示されることを確認
3. 管理画面でお知らせを投稿できることを確認

## トラブルシューティング

### Node.jsがインストールされていない場合
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### ポートが使用中の場合
```bash
# 使用中のポートを確認
netstat -tulpn | grep :3000

# プロセスを終了
sudo kill -9 [PID]
```

### ファイル権限の問題
```bash
# ファイルの所有者を変更
sudo chown -R www-data:www-data /path/to/cursor_houeiweb

# 権限を設定
sudo chmod -R 755 /path/to/cursor_houeiweb
``` 