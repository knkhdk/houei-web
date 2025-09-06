# 邦栄建設Webサイト - 静的バージョン

## 概要

このバージョンは、Node.jsサーバーなしで動作する静的ファイル版です。
インストール不要で、ブラウザで直接HTMLファイルを開くことができます。

## 起動方法

### 方法1: バッチファイルを使用（推奨）
```bash
start-static.bat
```

### 方法2: ブラウザで直接開く
1. `index-static.html` をダブルクリック
2. または、ブラウザで `file:///path/to/cursor_houeiweb/index-static.html` を開く

## 機能

### 利用可能な機能
- ✅ トップページ表示
- ✅ お知らせ表示（サンプルデータ）
- ✅ 施工実績表示（サンプルデータ）
- ✅ 事業内容紹介
- ✅ 技術・工法紹介
- ✅ 採用情報
- ✅ 各ページへのリンク

### 制限事項
- ❌ お知らせの投稿・編集機能
- ❌ データの保存機能
- ❌ リアルタイム更新機能

## ファイル構成

```
cursor_houeiweb/
├── index-static.html      # 静的バージョンのトップページ
├── start-static.bat       # 静的バージョン起動スクリプト
├── css/                   # スタイルシート
├── js/                    # JavaScriptファイル
├── images/                # 画像ファイル
├── news/                  # お知らせページ
├── works/                 # 施工実績ページ
├── services/              # 事業内容ページ
├── technology/            # 技術・工法ページ
├── recruit/               # 採用情報ページ
└── contact/               # お問い合わせページ
```

## ページ一覧

### メインページ
- **トップページ**: `index-static.html`

### お知らせ
- **一覧**: `news/index.html`
- **詳細**: `news/detail.html`

### 施工実績
- **一覧**: `works/index.html`
- **詳細**: `works/detail.html`

### 事業内容
- **上下水道工事**: `services/waterworks.html`
- **構造物工事**: `services/structures.html`
- **河川工事**: `services/river.html`
- **道路工事**: `services/road.html`

### 技術・工法
- **建設DX**: `technology/dx.html`
- **L-Mole工法**: `technology/l-mole.html`
- **SPR工法**: `technology/spr.html`

### 採用情報
- **現場監督**: `recruit/supervisor.html`
- **営業職**: `recruit/sales.html`
- **土木作業員**: `recruit/worker.html`
- **ハーベストクラブ**: `recruit/harvest-club.html`

### その他
- **会社概要**: `about.html`
- **お問い合わせ**: `contact/index.html`

## トラブルシューティング

### 画像が表示されない場合
- 画像ファイルが `images/` フォルダに存在することを確認
- ファイル名とパスが正しいことを確認

### スタイルが適用されない場合
- `css/` フォルダが存在することを確認
- CSSファイルが正しく読み込まれていることを確認

### リンクが機能しない場合
- リンク先のHTMLファイルが存在することを確認
- ファイルパスが正しいことを確認

## 開発者向け情報

### データの更新
お知らせや施工実績のデータを更新する場合は、`index-static.html` 内のJavaScript部分を編集してください：

```javascript
// お知らせデータ
const newsData = [
    {
        "id": "新しいID",
        "title": "新しいタイトル",
        "summary": "新しいサマリー",
        // ... その他のプロパティ
    }
];

// 施工実績データ
const worksData = [
    {
        "id": "新しいID",
        "title": "新しいタイトル",
        // ... その他のプロパティ
    }
];
```

### 新しいページの追加
1. HTMLファイルを作成
2. `index-static.html` のナビゲーションにリンクを追加
3. 必要に応じてCSSスタイルを追加

## 注意事項

- このバージョンは完全に静的ファイルで構成されています
- サーバーサイドの機能は利用できません
- データの永続化は行われません
- セキュリティ機能は限定的です

## サポート

問題が発生した場合は、以下を確認してください：
1. ファイルが正しい場所にあるか
2. ファイル名が正しいか
3. ブラウザのコンソールにエラーが表示されていないか 