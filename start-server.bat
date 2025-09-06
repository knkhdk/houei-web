@echo off
echo 邦栄建設Webサイト - ローカルサーバー起動
echo ========================================

REM Node.jsがインストールされているかチェック
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo エラー: Node.jsがインストールされていません。
    echo.
    echo Node.jsのインストール方法:
    echo 1. https://nodejs.org/ にアクセス
    echo 2. LTS版をダウンロードしてインストール
    echo 3. PowerShellを再起動
    echo.
    echo 詳細は NODEJS_SETUP.md を参照してください。
    echo.
    pause
    exit /b 1
)

echo Node.jsが見つかりました。
node --version

REM npmが利用可能かチェック
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo エラー: npmが利用できません。
    echo Node.jsのインストールを確認してください。
    pause
    exit /b 1
)

echo npmが見つかりました。
npm --version

REM 必要なパッケージをインストール
if not exist "node_modules" (
    echo.
    echo 必要なパッケージをインストール中...
    npm install
    if %errorlevel% neq 0 (
        echo エラー: パッケージのインストールに失敗しました。
        pause
        exit /b 1
    )
    echo パッケージのインストールが完了しました。
) else (
    echo node_modulesが見つかりました。
)

REM データディレクトリの確認
if not exist "data" (
    echo データディレクトリを作成中...
    mkdir data
)

if not exist "data\news.json" (
    echo サンプルお知らせデータを作成中...
    echo [] > data\news.json
)

if not exist "data\drafts.json" (
    echo 下書きデータファイルを作成中...
    echo [] > data\drafts.json
)

REM ポート3000が使用中かチェック
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo 警告: ポート3000が既に使用されています。
    echo 使用中のプロセスを確認中...
    netstat -ano | findstr :3000
    echo.
    echo プロセスを終了する場合は、上記のPIDを使用して以下を実行してください:
    echo taskkill /PID [PID] /F
    echo.
    set /p choice="続行しますか？ (y/n): "
    if /i not "%choice%"=="y" (
        echo サーバー起動をキャンセルしました。
        pause
        exit /b 1
    )
)

REM サーバーを起動
echo.
echo サーバーを起動中...
echo ブラウザで http://localhost:3000 にアクセスしてください。
echo.
echo 終了するには Ctrl+C を押してください。
echo ========================================
node server.js

pause 