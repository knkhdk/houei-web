# お問い合わせ機能 デプロイパッケージ

## 含まれるファイル

### 必須ファイル
- `server.js` - メインサーバーファイル（お問い合わせAPI含む）
- `package.json` - Node.js依存関係
- `contact-config.json` - お問い合わせ設定（メール設定済み）
- `security-config.json` - セキュリティ設定

### フォルダ
- `contact/` - お問い合わせページ
- `css/` - スタイルシート
- `js/` - JavaScriptファイル
- `data/` - データ保存用

### HTMLファイル
- `index.html` - メインページ
- `about.html` - 会社概要
- その他のHTMLファイル

## アップロード手順

1. **このフォルダ内の全てのファイルをさくらインターネットのサーバーにアップロード**
2. **Node.jsアプリケーションの設定**
   - エントリーポイント: `server.js`
   - ポート: 3000（または指定されたポート）
3. **依存関係のインストール**
   ```bash
   npm install
   ```
4. **アプリケーションの起動**
   ```bash
   npm start
   ```

## 設定確認

### メール設定（contact-config.json）
```json
{
  "email": {
    "enabled": true,
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "houeiconstruction@gmail.com",
        "pass": "HvoBDG7sDVUuY8uf"
      }
    },
    "from": "邦栄建設株式会社 <noreply@houeikensetsu.co.jp>",
    "to": "info@houeikensetsu.co.jp"
  }
}
```

## 動作確認

1. **お問い合わせフォーム**: `https://your-domain.com/contact/index.html`
2. **APIヘルスチェック**: `https://your-domain.com/api/health`
3. **フォーム送信テスト**

## トラブルシューティング

- 404エラーが発生する場合：server.jsが正しくアップロードされているか確認
- メール送信エラー：contact-config.jsonの設定を確認
- データ保存エラー：data/フォルダの書き込み権限を確認
