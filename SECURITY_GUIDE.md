# セキュリティガイド

## 概要

お知らせ投稿ページのセキュリティを強化し、不正アクセスを防止します。

## セキュリティ機能

### 1. 認証システム

- **開発環境**: localhostでは認証をスキップ
- **本番環境**: 認証トークンが必要

### 2. 有効な認証トークン

- `houei2024admin`: 管理者用（全機能アクセス可能）
- `houei2024post`: 投稿者用（投稿・編集のみ）

### 3. アクセス方法

#### 開発環境（localhost）

```text
http://localhost:3000/news/post.html
```

認証なしでアクセス可能

#### 本番環境

```text
http://yourdomain.com/news/post.html?token=houei2024admin
http://yourdomain.com/news/post.html?admin=houei2024post
```

### 4. セッション管理

- 認証後24時間有効
- セッションはブラウザのsessionStorageに保存
- 期限切れ時は自動的に再認証が必要

## 設定ファイル

### security-config.json

```json
{
  "security": {
    "enabled": true,
    "developmentMode": {
      "allowLocalhost": true,
      "skipAuthentication": true
    },
    "productionMode": {
      "requireAuthentication": true,
      "validTokens": ["houei2024admin", "houei2024post"],
      "sessionTimeout": 86400000
    }
  }
}
```

## セキュリティログ

### ログファイル

- `security.log`: 不正アクセス試行を記録

### ログ内容

- アクセス時刻
- IPアドレス
- User-Agent
- アクセス結果

## 本番環境での設定

### 1. 環境変数の設定

```bash
export NODE_ENV=production
```

### 2. トークンの変更

本番環境では必ずトークンを変更してください：

1. `security-config.json`を編集
2. `js/news-post.js`の`SECURITY_CONFIG.validTokens`を更新
3. `server.js`の`validTokens`配列を更新

### 3. 推奨設定

- 強力なパスワードを使用
- 定期的なトークン更新
- アクセスログの監視
- HTTPSの使用

## トラブルシューティング

### 認証エラーが発生する場合

1. トークンが正しいか確認
2. セッションが期限切れでないか確認
3. ブラウザのsessionStorageをクリア

### 開発環境で認証が要求される場合

1. `security-config.json`の`developmentMode.skipAuthentication`が`true`か確認
2. localhostでアクセスしているか確認

## 注意事項

- セキュリティ設定ファイルは本番環境では適切に保護してください
- トークンは定期的に変更することを推奨します
- ログファイルは定期的に確認し、不正アクセスを監視してください
