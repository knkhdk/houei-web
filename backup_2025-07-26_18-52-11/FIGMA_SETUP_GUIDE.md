# Figma MCPツール セットアップガイド

## 概要

Figma MCPツールを使用して、デザインからコードへの自動変換とデザインシステムの構築を行います。

## セットアップ手順

### 1. Figma APIキーの取得

1. **Figmaアカウントにログイン**
   - https://www.figma.com にアクセス
   - アカウントにログイン

2. **Personal Access Tokenの作成**
   - Settings > Account settings に移動
   - Personal access tokens セクションを開く
   - "Create new token" をクリック
   - トークン名を入力（例: "MCP Tool Access"）
   - トークンをコピーして安全な場所に保存

### 2. Figmaファイルの準備

1. **デザインファイルの作成**
   - 新しいFigmaファイルを作成
   - または既存のデザインファイルを使用

2. **ファイルキーの取得**
   - Figmaファイルを開く
   - URLからファイルキーを取得
   - 例: `https://www.figma.com/file/XXXXXXXXXXXXXX/` の `XXXXXXXXXXXXXX` 部分

3. **プロジェクトIDの取得**
   - FigmaプロジェクトページでプロジェクトIDを確認
   - またはファイルの共有設定から取得

### 3. 環境変数の設定

```bash
# 環境変数を設定
set FIGMA_ACCESS_TOKEN=your_access_token_here
set FIGMA_FILE_KEY=your_file_key_here
set FIGMA_PROJECT_ID=your_project_id_here
```

### 4. 設定ファイルの更新

`figma-mcp-config.json` を編集：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@sethdouglasford/mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_access_token_here",
        "FIGMA_FILE_KEY": "your_file_key_here",
        "FIGMA_PROJECT_ID": "your_project_id_here"
      }
    }
  }
}
```

## 使用方法

### 基本的な使用方法

```bash
# Figma MCPサーバーを起動
npx @sethdouglasford/mcp-figma

# デザインシステムを取得
npx @sethdouglasford/mcp-figma get-design-system

# コンポーネントをコードに変換
npx @sethdouglasford/mcp-figma generate-code --component=button
```

### デザインシステムの構築

1. **カラーパレットの取得**
   ```bash
   npx @sethdouglasford/mcp-figma get-colors
   ```

2. **タイポグラフィの取得**
   ```bash
   npx @sethdouglasford/mcp-figma get-typography
   ```

3. **コンポーネントの取得**
   ```bash
   npx @sethdouglasford/mcp-figma get-components
   ```

### コード生成

1. **HTML/CSS生成**
   ```bash
   npx @sethdouglasford/mcp-figma generate-html --component=header
   npx @sethdouglasford/mcp-figma generate-css --component=button
   ```

2. **レスポンシブデザイン**
   ```bash
   npx @sethdouglasford/mcp-figma generate-responsive --component=card
   ```

## 邦栄建設向けの活用例

### 1. 企業ブランディング

- **ロゴとカラーパレット**
  - 企業カラーの統一
  - ブランドガイドラインの自動適用

- **タイポグラフィ**
  - 統一されたフォントシステム
  - 階層構造の明確化

### 2. コンポーネントライブラリ

- **ナビゲーション**
  - ヘッダー・フッターの統一
  - モバイル対応の自動生成

- **ボタンとフォーム**
  - 一貫したUIコンポーネント
  - アクセシビリティ対応

### 3. レスポンシブデザイン

- **ブレークポイント**
  - デスクトップ・タブレット・モバイル対応
  - 自動的なレイアウト調整

## トラブルシューティング

### よくある問題

1. **APIキーエラー**
   ```bash
   # トークンの有効性を確認
   curl -H "X-Figma-Token: YOUR_TOKEN" https://api.figma.com/v1/me
   ```

2. **ファイルアクセスエラー**
   - ファイルの共有設定を確認
   - 適切な権限が設定されているか確認

3. **ネットワークエラー**
   - プロキシ設定を確認
   - ファイアウォールの設定を確認

### デバッグモード

```bash
# デバッグ情報を表示
npx @sethdouglasford/mcp-figma --debug

# 詳細ログを出力
npx @sethdouglasford/mcp-figma --verbose
```

## ベストプラクティス

### 1. デザインシステムの管理

- **命名規則の統一**
  - コンポーネント名の一貫性
  - カラー名の標準化

- **バージョン管理**
  - デザインの変更履歴を記録
  - コードとの同期を維持

### 2. パフォーマンス最適化

- **画像の最適化**
  - WebP形式の使用
  - 適切なサイズ設定

- **CSSの最適化**
  - 不要なスタイルの削除
  - 効率的なセレクタの使用

### 3. アクセシビリティ

- **WCAG準拠**
  - カラーコントラストの確保
  - キーボードナビゲーション対応

- **セマンティックHTML**
  - 適切なHTMLタグの使用
  - ARIA属性の追加

## サポート

問題が発生した場合は以下を確認してください：

1. **Figma APIの制限**
   - レート制限の確認
   - ファイルサイズの制限

2. **ネットワーク接続**
   - インターネット接続の確認
   - プロキシ設定の確認

3. **権限設定**
   - Figmaファイルの共有設定
   - APIトークンの権限

詳細なドキュメントは以下を参照：
- [Figma API Documentation](https://www.figma.com/developers/api)
- [MCP Figma Server GitHub](https://github.com/sethford/mcp-figma) 