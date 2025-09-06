@echo off
echo ホームページ作成支援ツールのインストールを開始します...
echo.

echo 1. Playwright MCP (ブラウザ自動化) をインストール中...
npx -y @playwright/mcp --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Playwright MCP のインストールが完了しました
) else (
    echo ✗ Playwright MCP のインストールに失敗しました
)

echo.
echo 2. Browser MCP (ブラウザ操作) をインストール中...
npx -y @browsermcp/mcp --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Browser MCP のインストールが完了しました
) else (
    echo ✗ Browser MCP のインストールに失敗しました
)

echo.
echo 3. MCP Framework (MCPサーバー開発) をインストール中...
npx -y mcp-framework --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MCP Framework のインストールが完了しました
) else (
    echo ✗ MCP Framework のインストールに失敗しました
)

echo.
echo 4. MCP Proxy (MCPサーバープロキシ) をインストール中...
npx -y mcp-proxy --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MCP Proxy のインストールが完了しました
) else (
    echo ✗ MCP Proxy のインストールに失敗しました
)

echo.
echo 5. 画像処理用ディレクトリを作成中...
if not exist "images\processed" mkdir "images\processed"
if not exist "images\optimized" mkdir "images\optimized"

echo.
echo 6. 開発用ツールをインストール中...
npm install --save-dev sharp imagemin imagemin-mozjpeg imagemin-pngquant
if %errorlevel% equ 0 (
    echo ✓ 画像最適化ツールのインストールが完了しました
) else (
    echo ✗ 画像最適化ツールのインストールに失敗しました
)

echo.
echo 7. HTML/CSS最適化ツールをインストール中...
npm install --save-dev html-minifier cssnano autoprefixer
if %errorlevel% equ 0 (
    echo ✓ HTML/CSS最適化ツールのインストールが完了しました
) else (
    echo ✗ HTML/CSS最適化ツールのインストールに失敗しました
)

echo.
echo ホームページ作成支援ツールのインストールが完了しました！
echo.
echo 利用可能なツール:
echo - Playwright MCP: ブラウザ自動化・テスト
echo - Browser MCP: ブラウザ操作・スクリーンショット
echo - MCP Framework: カスタムMCPサーバー開発
echo - MCP Proxy: MCPサーバー間通信
echo - Sharp: 画像処理・最適化
echo - HTML/CSS最適化ツール: パフォーマンス向上
echo.
echo 設定ファイル: web-tools-config.json
echo 使用方法: WEB_TOOLS_GUIDE.md
echo.
pause 