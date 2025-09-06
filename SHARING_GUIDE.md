# 宝栄建設Webサイト - 共有ガイド

## プロジェクト概要
このプロジェクトは宝栄建設株式会社の公式Webサイトです。お知らせ機能を含む完全なWebサイトが含まれています。

## 共有時の注意事項

### ✅ 共有可能なファイル
- `index.html` - メインページ
- `css/` - スタイルシート
- `js/` - JavaScriptファイル
- `images/` - 画像ファイル
- `data/news-public.json` - 公開用お知らせデータ
- `services/` - サービス紹介ページ
- `about.html` - 会社概要
- `contact/` - お問い合わせ

### ⚠️ 共有前に確認すべきファイル
- `data/news-admin.json` - 管理用データ（機密情報を含む可能性）
- `backups/` - バックアップファイル
- `config.json` - 設定ファイル（パスワード等）
- `node_modules/` - 開発用ライブラリ

### 🚫 共有してはいけないファイル
- 個人情報を含むデータ
- パスワードやAPIキー
- 未公開の下書きデータ

## 共有手順

### 1. 公開用データの準備
```bash
# 公開用データのみをコピー
cp data/news.json data/news-public.json
```

### 2. 不要ファイルの削除
```bash
# 管理用ファイルを削除
rm -rf data/news-admin.json
rm -rf backups/
rm -rf node_modules/
```

### 3. フォルダの圧縮
```bash
# 共有用フォルダを作成
mkdir cursor_houeiweb_shared
cp -r index.html css/ js/ images/ data/news-public.json services/ about.html contact/ cursor_houeiweb_shared/
```

## 評価者向け情報

### 動作確認方法
1. `index.html`をブラウザで開く
2. お知らせセクションの「🔄 お知らせを更新」ボタンをクリック
3. 各ページのリンクを確認

### 主要機能
- レスポンシブデザイン
- お知らせ投稿・表示機能
- スライドショー
- お問い合わせフォーム

### 技術仕様
- HTML5 + CSS3 + JavaScript
- ローカルストレージ対応
- JSON形式のデータ管理

## トラブルシューティング

### お知らせが表示されない場合
1. ブラウザのコンソールでエラーを確認
2. `data/news-public.json`ファイルの存在を確認
3. 手動更新ボタンをクリック

### 画像が表示されない場合
1. `images/`フォルダの存在を確認
2. ファイルパスが正しいか確認

## 連絡先
ご質問や問題がございましたら、開発者までお問い合わせください。 