# MCPサーバー ガイド

## 概要

このプロジェクトでは、ホームページ作成を効率化するためのMCP（Model Context Protocol）サーバーを導入しています。

## インストール済みMCPサーバー

### 1. File System MCP Server
**機能**: ファイル操作とプロジェクト管理
- ファイル作成・編集・削除
- ディレクトリ構造管理
- ファイル検索
- バックアップ作成

**使用方法**:
```bash
# ファイル作成
npx @modelcontextprotocol/server-filesystem create --path=news/new-article.html --template=article

# ディレクトリ作成
npx @modelcontextprotocol/server-filesystem mkdir --path=news/2024

# ファイル検索
npx @modelcontextprotocol/server-filesystem search --pattern=*.html --recursive
```

### 2. Code Runner MCP Server
**機能**: コード実行とテスト支援
- JavaScriptコード実行
- Node.jsスクリプト実行
- テスト実行
- デバッグ支援

**使用方法**:
```bash
# JavaScriptファイル実行
npx mcp-server-code-runner run --file=js/main.js

# Node.jsスクリプト実行
npx mcp-server-code-runner run --file=server.js

# テスト実行
npx mcp-server-code-runner test --pattern=*.test.js
```

### 3. YouTube Data MCP Server
**機能**: YouTubeデータ取得と分析
- 動画情報取得
- チャンネル情報取得
- コメント分析
- 統計データ取得

**使用方法**:
```bash
# 動画情報取得
npx youtube-data-mcp-server get-video --id=VIDEO_ID

# チャンネル情報取得
npx youtube-data-mcp-server get-channel --id=CHANNEL_ID

# 検索結果取得
npx youtube-data-mcp-server search --query="建設業界"
```

### 4. Notion MCP Server
**機能**: Notionデータベース連携
- ページ作成・編集
- データベース操作
- コンテンツ同期
- プロジェクト管理

**使用方法**:
```bash
# ページ作成
npx @notionhq/notion-mcp-server create-page --database-id=DATABASE_ID --title="新しいお知らせ"

# データベース取得
npx @notionhq/notion-mcp-server get-database --id=DATABASE_ID

# ページ更新
npx @notionhq/notion-mcp-server update-page --id=PAGE_ID --content="更新内容"
```

## インストール方法

### 自動インストール
```bash
# バッチファイルを実行
install-mcp-servers.bat
```

### 手動インストール
```bash
# 各サーバーを個別にインストール
npx -y @modelcontextprotocol/server-filesystem
npx -y mcp-server-code-runner
npx -y youtube-data-mcp-server
npx -y @notionhq/notion-mcp-server
```

## 設定ファイル

`mcp-config.json` でMCPサーバーの設定を管理しています：

```json
{
  "mcpServers": {
    "file-system": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {
        "MCP_FILESYSTEM_ROOT": "."
      }
    },
    "code-runner": {
      "command": "npx",
      "args": ["-y", "mcp-server-code-runner"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## よくある使用例

### 新しいお知らせページの作成
```bash
# 1. ファイル作成
npx @modelcontextprotocol/server-filesystem create --path=news/new-article.html --template=article

# 2. コード実行テスト
npx mcp-server-code-runner run --file=js/news-post.js

# 3. Notionに同期（オプション）
npx @notionhq/notion-mcp-server create-page --database-id=DATABASE_ID --title="新しいお知らせ"
```

### YouTube動画情報の取得
```bash
# 1. 建設業界関連動画を検索
npx youtube-data-mcp-server search --query="建設業界 最新技術"

# 2. 特定の動画情報を取得
npx youtube-data-mcp-server get-video --id=VIDEO_ID
```

### コードの実行とテスト
```bash
# JavaScriptファイル実行
npx mcp-server-code-runner run --file=js/main.js

# サーバーテスト
npx mcp-server-code-runner test --pattern=*.test.js
```

## トラブルシューティング

### MCPサーバーが起動しない
```bash
# Node.jsバージョンを確認
node --version

# npmキャッシュをクリア
npm cache clean --force

# 再インストール
npx -y @modelcontextprotocol/server-filesystem
```

### 権限エラー
```bash
# PowerShellを管理者として実行
# または
# ファイルの権限を確認
dir mcp-config.json
```

### ネットワークエラー
```bash
# プロキシ設定を確認
npm config get proxy
npm config get https-proxy

# 必要に応じて設定
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port
```

## カスタマイズ

### 新しいMCPサーバーの追加
1. `mcp-config.json` に新しいサーバー設定を追加
2. インストールスクリプトを更新
3. 使用方法をドキュメントに追加

### 既存サーバーの設定変更
`mcp-config.json` の該当サーバー設定を編集

## サポート

問題が発生した場合は以下を確認してください：
1. Node.jsが正しくインストールされているか
2. ネットワーク接続が正常か
3. ファイル権限が適切か
4. 設定ファイルの構文が正しいか

詳細なログは以下で確認できます：
```bash
npx @modelcontextprotocol/server-filesystem --debug
``` 