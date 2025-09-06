# 邦栄建設Webサイト - クイックスタートガイド

## 前提条件

Node.jsがインストールされている必要があります。
インストールされていない場合は、`NODEJS_SETUP.md`を参照してください。

## 1. Node.jsの確認

```bash
node --version
npm --version
```

両方のコマンドでバージョンが表示されることを確認してください。

## 2. 依存関係のインストール

```bash
npm install
```

## 3. サーバーの起動

```bash
npm start
```

または

```bash
node server.js
```

または

```bash
start-server.bat
```

## 4. ブラウザでアクセス

- **メインページ**: http://localhost:3000
- **お知らせ一覧**: http://localhost:3000/news/index.html
- **お知らせ投稿**: http://localhost:3000/news/post.html
- **施工実績一覧**: http://localhost:3000/works/index.html

## 5. 機能確認

### お知らせ機能
1. お知らせ投稿ページで新しいお知らせを作成
2. 一覧ページで投稿したお知らせを確認
3. 編集・削除機能をテスト

### 施工実績機能
1. 施工実績一覧ページで実績を確認
2. 詳細ページで個別の実績を確認

## トラブルシューティング

### ポート3000が使用中
```bash
# 使用中のプロセスを確認
netstat -ano | findstr :3000

# プロセスを終了
taskkill /PID [プロセスID] /F
```

### 依存関係のエラー
```bash
# node_modulesを削除して再インストール
rmdir /s node_modules
npm install
```

### データファイルのエラー
```bash
# データファイルの権限を確認
dir data
```

## 開発者向け情報

### ファイル構成
```
cursor_houeiweb/
├── server.js              # Expressサーバー
├── package.json           # 依存関係
├── data/
│   ├── news.json         # お知らせデータ
│   └── drafts.json       # 下書きデータ
├── js/
│   ├── news-post.js      # お知らせ投稿機能
│   ├── news.js           # お知らせ表示機能
│   └── works.js          # 施工実績機能
└── news/
    ├── index.html        # お知らせ一覧
    ├── post.html         # お知らせ投稿
    └── detail.html       # お知らせ詳細
```

### API エンドポイント
- `GET /api/news` - お知らせ一覧取得
- `POST /api/news` - お知らせ投稿
- `GET /api/drafts` - 下書き一覧取得
- `POST /api/drafts` - 下書き保存

### データ形式
```json
{
  "id": "1703123456789",
  "title": "タイトル",
  "summary": "サマリー",
  "content": "本文",
  "category": "カテゴリ",
  "date": "2023-12-21T10:00:00.000Z",
  "status": "published",
  "details": {
    "項目1": "値1",
    "項目2": "値2"
  }
}
```

## サポート

問題が発生した場合は、以下を確認してください：
1. Node.jsが正しくインストールされているか
2. 依存関係が正しくインストールされているか
3. ポート3000が使用されていないか
4. データファイルが正しい形式か 