@echo off
echo MCPサーバーのインストールを開始します...
echo.

echo 1. File System MCP Server をインストール中...
npx -y @modelcontextprotocol/server-filesystem --help >nul 2>&1
if %errorlevel% neq 0 (
    echo File System MCP Server のインストールに失敗しました。
    pause
    exit /b 1
)

echo.
echo 2. Code Runner MCP Server をインストール中...
npx -y mcp-server-code-runner --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Code Runner MCP Server のインストールに失敗しました。
    pause
    exit /b 1
)

echo.
echo 3. YouTube Data MCP Server をインストール中...
npx -y youtube-data-mcp-server --help >nul 2>&1
if %errorlevel% neq 0 (
    echo YouTube Data MCP Server のインストールに失敗しました。
    pause
    exit /b 1
)

echo.
echo 4. Notion MCP Server をインストール中...
npx -y @notionhq/notion-mcp-server --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Notion MCP Server のインストールに失敗しました。
    pause
    exit /b 1
)

echo.
echo 5. 画像処理用ディレクトリを作成中...
if not exist "images\processed" mkdir "images\processed"

echo.
echo MCPサーバーのインストールが完了しました！
echo.
echo 利用可能なMCPサーバー:
echo - File System MCP Server: ファイル操作支援
echo - Code Runner MCP Server: コード実行支援
echo - YouTube Data MCP Server: YouTubeデータ取得支援
echo - Notion MCP Server: Notion連携支援
echo.
echo 設定ファイル: mcp-config.json
echo.
pause 