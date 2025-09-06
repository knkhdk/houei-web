@echo off
echo 推奨MCPツールのインストールを開始します...
echo.

echo 1. Tavily MCP (Web検索・リサーチ) をインストール中...
npm install --save-dev tavily-mcp
if %errorlevel% equ 0 (
    echo ✓ Tavily MCP のインストールが完了しました
) else (
    echo ✗ Tavily MCP のインストールに失敗しました
)

echo.
echo 2. Playwright MCP Server (ブラウザ自動化) をインストール中...
npm install --save-dev @executeautomation/playwright-mcp-server
if %errorlevel% equ 0 (
    echo ✓ Playwright MCP Server のインストールが完了しました
) else (
    echo ✗ Playwright MCP Server のインストールに失敗しました
)

echo.
echo 3. Code Runner MCP Server (コード実行) をインストール中...
npm install --save-dev mcp-server-code-runner
if %errorlevel% equ 0 (
    echo ✓ Code Runner MCP Server のインストールが完了しました
) else (
    echo ✗ Code Runner MCP Server のインストールに失敗しました
)

echo.
echo 4. Notion MCP Server (コンテンツ管理) をインストール中...
npm install --save-dev @notionhq/notion-mcp-server
if %errorlevel% equ 0 (
    echo ✓ Notion MCP Server のインストールが完了しました
) else (
    echo ✗ Notion MCP Server のインストールに失敗しました
)

echo.
echo 5. Sentry MCP Server (エラー監視) をインストール中...
npm install --save-dev @sentry/mcp-server
if %errorlevel% equ 0 (
    echo ✓ Sentry MCP Server のインストールが完了しました
) else (
    echo ✗ Sentry MCP Server のインストールに失敗しました
)

echo.
echo 6. n8n MCP (ワークフロー自動化) をインストール中...
npm install --save-dev n8n-mcp
if %errorlevel% equ 0 (
    echo ✓ n8n MCP のインストールが完了しました
) else (
    echo ✗ n8n MCP のインストールに失敗しました
)

echo.
echo 推奨MCPツールのインストールが完了しました！
echo.
echo 利用可能なMCPツール:
echo - Tavily MCP: Web検索・リサーチ
echo - Playwright MCP Server: ブラウザ自動化・テスト
echo - Code Runner MCP Server: コード実行・テスト
echo - Notion MCP Server: コンテンツ管理
echo - Sentry MCP Server: エラー監視・パフォーマンス
echo - n8n MCP: ワークフロー自動化
echo.
echo 設定ファイル: recommended-mcp-config.json
echo 使用方法: RECOMMENDED_MCP_GUIDE.md
echo.
pause 