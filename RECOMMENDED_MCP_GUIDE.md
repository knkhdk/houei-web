# 推奨MCPツール ガイド

## 概要

ホームページ作成に役立つ推奨MCPツールの使用方法を説明します。これらのツールを組み合わせることで、高品質なWebサイトの開発と運用が可能になります。

## インストール済みMCPツール

### 1. Tavily MCP - Web検索・リサーチ
**機能**: 高度なWeb検索とリサーチ
- 競合他社のWebサイト分析
- 最新のWebデザイントレンド調査
- SEOキーワードリサーチ
- 建設業界の最新情報収集

**設定**:
```bash
# Tavily APIキーの取得
# https://tavily.com/ にアクセスしてAPIキーを取得

# 環境変数設定
set TAVILY_API_KEY=your_api_key_here
```

**使用方法**:
```bash
# 競合他社のWebサイト分析
npx tavily-mcp search --query="建設会社 ホームページ デザイン" --searchDepth=advanced

# 最新トレンド調査
npx tavily-mcp search --query="2024年 Webデザイン トレンド" --includeDomains=dezeen.com

# SEOキーワードリサーチ
npx tavily-mcp search --query="建設業界 SEO キーワード" --searchDepth=advanced
```

### 2. Playwright MCP Server - ブラウザ自動化・テスト
**機能**: クロスブラウザテストとパフォーマンス監視
- レスポンシブデザインテスト
- パフォーマンステスト
- スクリーンショット取得
- アクセシビリティテスト

**使用方法**:
```bash
# レスポンシブテスト
npx @executeautomation/playwright-mcp-server test-responsive --url=http://localhost:3000

# パフォーマンステスト
npx @executeautomation/playwright-mcp-server test-performance --url=http://localhost:3000

# スクリーンショット取得
npx @executeautomation/playwright-mcp-server screenshot --url=http://localhost:3000 --viewport=375,667
```

### 3. Code Runner MCP Server - コード実行・テスト
**機能**: コードの実行とテスト
- JavaScriptコードのテスト実行
- ビルドプロセスの自動化
- デバッグ支援
- コード品質チェック

**使用方法**:
```bash
# JavaScriptファイル実行
npx mcp-server-code-runner run --file=js/main.js

# テスト実行
npx mcp-server-code-runner test --pattern=*.test.js

# ビルドプロセス実行
npx mcp-server-code-runner run --file=scripts/build.js
```

### 4. Notion MCP Server - コンテンツ管理
**機能**: コンテンツの一元管理
- お知らせコンテンツの管理
- プロジェクト文書の整理
- チーム連携
- コンテンツの自動同期

**設定**:
```bash
# Notion APIキーの取得
# https://www.notion.so/my-integrations でAPIキーを取得

# 環境変数設定
set NOTION_TOKEN=your_notion_token_here
```

**使用方法**:
```bash
# お知らせの作成
npx @notionhq/notion-mcp-server create-page --database=news --title="新しいお知らせ"

# データベースの取得
npx @notionhq/notion-mcp-server get-database --id=news-database-id

# ページの更新
npx @notionhq/notion-mcp-server update-page --id=page-id --content="更新内容"
```

### 5. Sentry MCP Server - エラー監視・パフォーマンス
**機能**: Webサイトの監視と改善
- エラー監視
- パフォーマンス追跡
- ユーザー体験の改善
- リアルタイムアラート

**設定**:
```bash
# Sentryプロジェクトの作成
# https://sentry.io/ でプロジェクトを作成

# 環境変数設定
set SENTRY_DSN=your_sentry_dsn_here
set SENTRY_ORG=your_org_name
set SENTRY_PROJECT=your_project_name
```

**使用方法**:
```bash
# エラー監視の開始
npx @sentry/mcp-server monitor --dsn=your_dsn

# パフォーマンスメトリクスの取得
npx @sentry/mcp-server performance --project=your_project

# エラーレポートの取得
npx @sentry/mcp-server errors --project=your_project --timeframe=24h
```

### 6. n8n MCP - ワークフロー自動化
**機能**: 業務プロセスの自動化
- お知らせ投稿の自動化
- ソーシャルメディア連携
- データ同期の自動化
- バックアップ自動化

**設定**:
```bash
# n8nのセットアップ
# https://n8n.io/ でワークフローを作成

# 環境変数設定
set N8N_WEBHOOK_URL=your_webhook_url
set N8N_API_KEY=your_api_key
```

**使用方法**:
```bash
# ワークフローの実行
npx n8n-mcp execute --workflow=news-posting

# ワークフロー状態の確認
npx n8n-mcp status --workflow=news-posting

# 新しいワークフローの作成
npx n8n-mcp create --name=social-media-sync
```

## 実用的な使用例

### 1. 競合分析ワークフロー
```bash
# 1. 競合他社の調査
npx tavily-mcp search --query="建設会社 ホームページ" --searchDepth=advanced

# 2. デザインの分析
npx @executeautomation/playwright-mcp-server screenshot --url=competitor-url

# 3. 結果をNotionに保存
npx @notionhq/notion-mcp-server create-page --database=research --title="競合分析結果"
```

### 2. パフォーマンス監視ワークフロー
```bash
# 1. パフォーマンステスト実行
npx @executeautomation/playwright-mcp-server test-performance --url=http://localhost:3000

# 2. 結果をSentryに送信
npx @sentry/mcp-server report --data=performance-data

# 3. 問題があればアラート
npx n8n-mcp trigger --workflow=performance-alert
```

### 3. コンテンツ管理ワークフロー
```bash
# 1. お知らせをNotionで作成
npx @notionhq/notion-mcp-server create-page --database=news --title="新しいお知らせ"

# 2. 自動的にWebサイトに反映
npx n8n-mcp execute --workflow=news-sync

# 3. ソーシャルメディアに投稿
npx n8n-mcp execute --workflow=social-media-post
```

## 設定ファイル

`recommended-mcp-config.json` で各ツールの設定を管理：

```json
{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp"],
      "env": {
        "TAVILY_API_KEY": "your_api_key"
      }
    }
  },
  "webDevelopment": {
    "research": {
      "tavily": {
        "searchDepth": "advanced",
        "includeDomains": ["construction.com", "architecturaldigest.com"]
      }
    }
  }
}
```

## トラブルシューティング

### APIキーエラー
```bash
# 環境変数の確認
echo %TAVILY_API_KEY%
echo %NOTION_TOKEN%
echo %SENTRY_DSN%

# 再設定
set TAVILY_API_KEY=your_new_key
```

### ネットワークエラー
```bash
# プロキシ設定の確認
npm config get proxy
npm config get https-proxy

# 必要に応じて設定
npm config set proxy http://proxy-server:port
```

### 権限エラー
```bash
# ファイル権限の確認
dir recommended-mcp-config.json

# 管理者権限で実行
# PowerShellを管理者として実行
```

## ベストプラクティス

### 1. 段階的導入
- 1つずつツールを導入
- 各ツールの動作確認
- チームの学習時間を確保

### 2. セキュリティ
- APIキーの安全な管理
- 環境変数の使用
- 定期的なキーの更新

### 3. 監視と改善
- 定期的なパフォーマンスチェック
- エラーログの確認
- 継続的な改善

## サポート

問題が発生した場合は以下を確認：

1. **APIキーの有効性**
2. **ネットワーク接続**
3. **設定ファイルの構文**
4. **依存関係のバージョン**

詳細なドキュメント：
- [Tavily API Documentation](https://tavily.com/docs)
- [Playwright Documentation](https://playwright.dev/)
- [Notion API Documentation](https://developers.notion.com/)
- [Sentry Documentation](https://docs.sentry.io/)
- [n8n Documentation](https://docs.n8n.io/) 