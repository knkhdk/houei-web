# npm実行エラーの解決方法

## 問題の説明

Node.jsは正常にインストールされていますが、PowerShellの実行ポリシーが原因でnpmが実行できない状態です。

## 解決手順

### 1. PowerShellを再起動

現在のPowerShellウィンドウを閉じて、新しいPowerShellウィンドウを開いてください。

### 2. プロジェクトディレクトリに移動

```powershell
cd "C:\Users\Hideki　Kaneko\OneDrive\ドキュメント\cursor_houeiweb"
```

### 3. Node.jsとnpmの確認

```powershell
node --version
npm --version
```

両方のコマンドでバージョンが表示されることを確認してください。

### 4. 依存関係のインストール

```powershell
npm install
```

### 5. サーバーの起動

```powershell
npm start
```

または

```powershell
start-server.bat
```

## 代替方法

### 方法1: コマンドプロンプトを使用

PowerShellで問題が続く場合は、コマンドプロンプト（cmd）を使用してください：

1. **Windowsキー + R** を押す
2. **cmd** と入力してEnter
3. プロジェクトディレクトリに移動：
   ```cmd
   cd "C:\Users\Hideki　Kaneko\OneDrive\ドキュメント\cursor_houeiweb"
   ```
4. 依存関係をインストール：
   ```cmd
   npm install
   ```
5. サーバーを起動：
   ```cmd
   npm start
   ```

### 方法2: 管理者権限でPowerShellを実行

1. **Windowsキー + X** を押す
2. **Windows PowerShell (管理者)** を選択
3. プロジェクトディレクトリに移動
4. 依存関係をインストール

### 方法3: 実行ポリシーを変更

PowerShellで以下のコマンドを実行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 確認事項

正常に動作している場合、以下のコマンドが実行できるはずです：

```powershell
node --version    # v22.17.0 などが表示される
npm --version     # 10.x.x などが表示される
npm install       # 依存関係がインストールされる
npm start         # サーバーが起動する
```

## トラブルシューティング

### npmが認識されない場合

1. **Node.jsを再インストール**
   - https://nodejs.org/ からLTS版をダウンロード
   - インストール時に「Add to PATH」オプションを確認

2. **環境変数を確認**
   - システム環境変数のPathに以下が含まれているか確認：
     - `C:\Program Files\nodejs\`

3. **PowerShellを管理者として実行**
   - Windowsキー + X → Windows PowerShell (管理者)

### 実行ポリシーの問題が続く場合

```powershell
# 現在のユーザーのみに適用
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# または、より緩い設定（推奨しない）
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

## 成功の確認

すべてが正常に動作している場合：

1. `npm install` が完了する
2. `npm start` でサーバーが起動する
3. ブラウザで http://localhost:3000 にアクセスできる
4. お知らせページが正常に表示される 