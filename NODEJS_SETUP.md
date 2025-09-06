# Node.js インストール手順（Windows）

## 方法1: 公式サイトからダウンロード（推奨）

### 1. ダウンロード
1. https://nodejs.org/ にアクセス
2. **LTS版**（左側の緑色ボタン）をクリック
3. **Windows Installer (.msi)** をダウンロード

### 2. インストール
1. ダウンロードした `.msi` ファイルをダブルクリック
2. **「Next」** をクリック
3. ライセンス契約に同意
4. インストール先を選択（デフォルト推奨）
5. **「Install」** をクリック
6. インストール完了後、**PowerShellを再起動**

### 3. 確認
```bash
node --version
npm --version
```

## 方法2: Chocolateyを使用（管理者権限が必要）

### 1. Chocolateyのインストール
PowerShellを管理者として実行：
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 2. Node.jsのインストール
```powershell
choco install nodejs
```

### 3. 確認
```bash
node --version
npm --version
```

## 方法3: wingetを使用（Windows 10/11）

```powershell
winget install OpenJS.NodeJS
```

## インストール後の作業

### 1. プロジェクトディレクトリに移動
```bash
cd "C:\Users\Hideki　Kaneko\OneDrive\ドキュメント\cursor_houeiweb"
```

### 2. 依存関係をインストール
```bash
npm install
```

### 3. ローカルサーバーを起動
```bash
npm start
```

### 4. ブラウザでアクセス
- **URL**: http://localhost:3000
- **お知らせ**: 正常に表示されることを確認

## トラブルシューティング

### パスが通っていない場合
1. **システム環境変数**を開く
2. **Path**に以下を追加：
   - `C:\Program Files\nodejs\`
3. PowerShellを再起動

### 権限エラーが発生する場合
- PowerShellを**管理者として実行**

### ポート3000が使用中の場合
```bash
# 使用中のプロセスを確認
netstat -ano | findstr :3000

# プロセスを終了
taskkill /PID [プロセスID] /F
```

## 確認事項

インストール後、以下が正常に動作することを確認：
- ✅ `node --version` でバージョンが表示される
- ✅ `npm --version` でバージョンが表示される
- ✅ `npm install` で依存関係がインストールされる
- ✅ `npm start` でサーバーが起動する
- ✅ http://localhost:3000 でサイトにアクセスできる
- ✅ お知らせが正常に表示される

## 推奨バージョン

- **Node.js**: 18.x LTS以上
- **npm**: 9.x以上 