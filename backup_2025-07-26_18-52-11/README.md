# 邦栄建設株式会社 - Webサイト

## 概要

邦栄建設株式会社の公式Webサイトです。お知らせ管理システム、施工実績紹介、採用情報などを含む包括的なWebサイトです。

## 機能

### お知らせ管理システム
- ✅ お知らせの投稿・編集・削除
- ✅ カテゴリ別フィルタリング
- ✅ 下書き保存機能
- ✅ データのエクスポート・インポート
- ✅ リアルタイム更新

### 施工実績
- ✅ 施工実績の一覧表示
- ✅ 詳細情報の表示
- ✅ カテゴリ別分類

### その他の機能
- ✅ レスポンシブデザイン
- ✅ モバイル対応
- ✅ 検索機能
- ✅ お問い合わせフォーム

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **バックエンド**: Node.js, Express.js
- **データ管理**: JSONファイル
- **スタイリング**: カスタムCSS
- **最適化ツール**: Sharp, CSSnano, HTML-minifier, Autoprefixer
- **開発支援**: MCPサーバー, 画像最適化, アセット最適化

## セットアップ

### 前提条件

- Node.js 16.0.0以上
- npm 8.0.0以上

### インストール手順

1. **Node.jsのインストール**
   ```bash
   # Node.jsがインストールされているか確認
   node --version
   npm --version
   ```
   
   Node.jsがインストールされていない場合は、[NODEJS_SETUP.md](./NODEJS_SETUP.md)を参照してください。

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **サーバーの起動**
   ```bash
   npm start
   ```
   
   または
   
   ```bash
   start-server.bat
   ```

4. **ブラウザでアクセス**
   - メインページ: http://localhost:3000
   - お知らせ一覧: http://localhost:3000/news/index.html
   - お知らせ投稿: http://localhost:3000/news/post.html

## 使用方法

### お知らせの投稿

1. http://localhost:3000/news/post.html にアクセス
2. フォームに必要事項を入力
3. 「投稿」ボタンをクリック
4. 投稿されたお知らせは一覧ページで確認可能

### お知らせの編集・削除

1. お知らせ一覧ページで「編集」または「削除」ボタンをクリック
2. 編集の場合は内容を変更して保存
3. 削除の場合は確認後に削除実行

### 下書き機能

1. 投稿フォームで「下書き保存」ボタンをクリック
2. 下書きは自動的に保存される
3. 「下書き読み込み」で保存した下書きを復元

## 最適化ツール

### 画像最適化
```bash
# 画像を最適化（WebP/AVIF形式に変換）
npm run optimize-images
```

### アセット最適化
```bash
# HTML/CSS/JSファイルを最適化
npm run optimize-assets
```

### 全体ビルド
```bash
# 画像とアセットの両方を最適化
npm run build
```

## ファイル構成

```
cursor_houeiweb/
├── server.js              # Expressサーバー
├── package.json           # 依存関係
├── start-server.bat       # サーバー起動スクリプト
├── install-web-tools.bat  # Web開発ツールインストール
├── web-tools-config.json  # Web開発ツール設定
├── WEB_TOOLS_GUIDE.md     # Web開発ツールガイド
├── data/
│   ├── news.json         # お知らせデータ
│   ├── drafts.json       # 下書きデータ
│   └── backups/          # バックアップファイル
├── css/
│   ├── style.css         # メインスタイル
│   ├── style-optimized.css # 最適化スタイル
│   └── responsive.css    # レスポンシブスタイル
├── js/
│   ├── news-post.js      # お知らせ投稿機能
│   ├── news.js           # お知らせ表示機能
│   ├── works.js          # 施工実績機能
│   └── fileManager.js    # ファイル管理
├── scripts/
│   ├── optimize-images.js # 画像最適化スクリプト
│   └── optimize-assets.js # アセット最適化スクリプト
├── news/
│   ├── index.html        # お知らせ一覧
│   ├── post.html         # お知らせ投稿
│   └── detail.html       # お知らせ詳細
├── works/
│   ├── index.html        # 施工実績一覧
│   └── detail.html       # 施工実績詳細
└── images/               # 画像ファイル
    └── optimized/        # 最適化された画像
```

## API エンドポイント

### お知らせ関連
- `GET /api/news` - お知らせ一覧取得
- `POST /api/news` - お知らせ投稿・更新

### 下書き関連
- `GET /api/drafts` - 下書き一覧取得
- `POST /api/drafts` - 下書き保存

### その他
- `GET /api/health` - サーバー状態確認
- `POST /api/upload` - ファイルアップロード（準備中）

## データ形式

### お知らせデータ
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

### Node.jsがインストールされていない
1. https://nodejs.org/ にアクセス
2. LTS版をダウンロードしてインストール
3. PowerShellを再起動
4. `node --version` で確認

## 開発者向け情報

### 開発モードでの起動
```bash
npm run dev
```

### 依存関係の確認
```bash
npm run check-node
```

### 新しい機能の追加
1. 必要なHTMLファイルを作成
2. CSSスタイルを追加
3. JavaScript機能を実装
4. 必要に応じてAPIエンドポイントを追加
5. 画像最適化: `npm run optimize-images`
6. アセット最適化: `npm run optimize-assets`
7. 全体ビルド: `npm run build`

## セキュリティ

- 入力データのバリデーション
- XSS対策
- CSRF対策（実装予定）
- ファイルアップロード制限

## パフォーマンス

- 画像の最適化（WebP/AVIF形式対応）
- CSS/JSの圧縮と最適化
- キャッシュ機能
- レスポンシブデザイン
- 自動最適化スクリプト
- ファイルサイズ削減

## ライセンス

MIT License

## サポート

問題が発生した場合は、以下を確認してください：
1. Node.jsが正しくインストールされているか
2. 依存関係が正しくインストールされているか
3. ポート3000が使用されていないか
4. データファイルが正しい形式か

詳細なトラブルシューティングは [QUICK_START.md](./QUICK_START.md) を参照してください。

## 追加ドキュメント

- [WEB_TOOLS_GUIDE.md](./WEB_TOOLS_GUIDE.md) - Web開発ツールの詳細な使用方法
- [MCP_SERVERS_GUIDE.md](./MCP_SERVERS_GUIDE.md) - MCPサーバーの使用方法
- [NODEJS_SETUP.md](./NODEJS_SETUP.md) - Node.jsセットアップガイド 