# Figma APIキー取得手順

## 方法1: 公式ドキュメントから

1. **Figma API Documentation** にアクセス
   - https://www.figma.com/developers/api#access-tokens
   - または https://www.figma.com/developers/api

2. **"Get a personal access token"** セクションを確認
   - ページ内で "Get a personal access token" を探す
   - リンクをクリックして直接設定画面に移動

## 方法2: 直接URLアクセス

以下のURLに直接アクセスしてください：
```
https://www.figma.com/settings
```

または

```
https://www.figma.com/account
```

## 方法3: 新しい設定画面での手順

### 最新のFigma設定画面

1. **プロフィールメニュー**
   - 右上のプロフィールアイコンをクリック
   - "Settings" を選択

2. **Account設定**
   - 左側メニューで "Account" をクリック
   - または "Personal" タブを確認

3. **Personal access tokens**
   - ページを下にスクロール
   - "Personal access tokens" セクションを探す
   - 見つからない場合は "Advanced" または "Developer" セクションを確認

## 方法4: 代替手段

### 一時的なテスト用トークン

APIキーが取得できない場合、以下の代替手段があります：

1. **Figma Pluginを使用**
   - FigmaプラグインとしてMCPツールを使用
   - ローカルでのテストが可能

2. **サンプルデザインファイル**
   - 公開されているサンプルファイルを使用
   - テスト用のデザインシステムを構築

## トラブルシューティング

### Personal access tokensが見つからない場合

1. **アカウントタイプの確認**
   - 無料アカウントの場合、APIアクセスが制限されている可能性
   - ProfessionalまたはEnterpriseアカウントが必要な場合があります

2. **権限の確認**
   - アカウントに適切な権限があるか確認
   - 管理者に確認が必要な場合があります

3. **ブラウザの確認**
   - 別のブラウザで試してみる
   - キャッシュをクリアして再試行

### 代替の設定方法

```bash
# 環境変数を設定（テスト用）
set FIGMA_ACCESS_TOKEN=test_token
set FIGMA_FILE_KEY=test_file_key
set FIGMA_PROJECT_ID=test_project_id

# テスト実行
npm run test-figma
```

## サポート

### Figma公式サポート
- **Help Center**: https://help.figma.com
- **Community**: https://www.figma.com/community
- **Developer Support**: https://www.figma.com/developers/support

### 代替のMCPツール

Figma APIキーが取得できない場合、以下の代替ツールも検討できます：

1. **デザインシステムツール**
   - Storybook
   - Chromatic
   - Zeroheight

2. **コード生成ツール**
   - Anima
   - Webflow
   - Framer

## 次のステップ

APIキーを取得できた場合：

1. **トークンの設定**
   ```bash
   set FIGMA_ACCESS_TOKEN=your_token_here
   ```

2. **ファイルキーの取得**
   - Figmaファイルを開く
   - URLからファイルキーをコピー

3. **テスト実行**
   ```bash
   npm run test-figma
   ```

APIキーが取得できない場合：

1. **代替ツールの検討**
2. **手動でのデザインシステム構築**
3. **既存の最適化ツールの活用** 