# Web開発ツール ガイド

## 概要

このプロジェクトでは、ホームページ作成を効率化するためのWeb開発ツールを導入しています。MCPサーバーと実用的な開発ツールを組み合わせて、高品質なWebサイトの開発を支援します。

## インストール済みツール

### 1. Playwright MCP
**機能**: ブラウザ自動化とテスト
- クロスブラウザテスト
- スクリーンショット取得
- パフォーマンステスト
- レスポンシブデザインテスト

**使用方法**:
```bash
# ブラウザテスト実行
npx @playwright/mcp test --browser=chromium

# スクリーンショット取得
npx @playwright/mcp screenshot --url=http://localhost:3000 --output=screenshot.png

# パフォーマンステスト
npx @playwright/mcp performance --url=http://localhost:3000
```

### 2. Browser MCP
**機能**: ブラウザ操作とスクリーンショット
- ブラウザ制御
- ページ操作
- スクリーンショット
- 要素検証

**使用方法**:
```bash
# ブラウザ起動
npx @browsermcp/mcp launch --browser=chrome

# ページ操作
npx @browsermcp/mcp navigate --url=http://localhost:3000

# スクリーンショット
npx @browsermcp/mcp screenshot --selector=.main-content
```

### 3. MCP Framework
**機能**: カスタムMCPサーバー開発
- MCPサーバー作成
- プロトコル実装
- カスタムツール開発

**使用方法**:
```bash
# 新しいMCPサーバー作成
npx mcp-framework create --name=web-development-server

# サーバー開発
npx mcp-framework dev --server=web-development-server
```

### 4. MCP Proxy
**機能**: MCPサーバー間通信
- サーバー間通信
- プロキシ設定
- 負荷分散

**使用方法**:
```bash
# プロキシサーバー起動
npx mcp-proxy start --port=3002

# サーバー接続
npx mcp-proxy connect --server=playwright --port=3001
```

## 画像処理ツール

### Sharp
**機能**: 高性能画像処理
- 画像リサイズ
- フォーマット変換
- 最適化
- WebP/AVIF変換

**使用方法**:
```javascript
// 画像最適化スクリプト
const sharp = require('sharp');

// サムネイル作成
sharp('images/photo.jpg')
  .resize(300, 200)
  .webp({ quality: 80 })
  .toFile('images/optimized/photo-thumb.webp');

// 複数サイズ生成
const sizes = [
  { width: 300, height: 200, suffix: 'thumb' },
  { width: 800, height: 600, suffix: 'medium' },
  { width: 1200, height: 800, suffix: 'large' }
];

sizes.forEach(size => {
  sharp('images/photo.jpg')
    .resize(size.width, size.height)
    .webp({ quality: 80 })
    .toFile(`images/optimized/photo-${size.suffix}.webp`);
});
```

## 最適化ツール

### HTML最適化
```bash
# HTMLファイルの最適化
npx html-minifier --collapse-whitespace --remove-comments --minify-css --minify-js index.html -o index.min.html
```

### CSS最適化
```bash
# CSSファイルの最適化
npx cssnano css/style.css -o css/style.min.css

# Autoprefixer適用
npx autoprefixer css/style.css -o css/style.prefixed.css
```

### JavaScript最適化
```bash
# JavaScriptファイルの最適化
npx terser js/main.js -o js/main.min.js --compress --mangle
```

## 実用的な使用例

### 1. 新しいページのテスト
```bash
# 1. ページ作成
# (手動でHTMLファイルを作成)

# 2. ブラウザテスト
npx @playwright/mcp test --browser=chromium --url=http://localhost:3000/new-page.html

# 3. スクリーンショット取得
npx @playwright/mcp screenshot --url=http://localhost:3000/new-page.html --output=screenshots/new-page.png

# 4. レスポンシブテスト
npx @playwright/mcp test --browser=chromium --viewport=375,667 --url=http://localhost:3000/new-page.html
```

### 2. 画像最適化ワークフロー
```bash
# 1. 画像アップロード
# (images/uploaded/ に画像を配置)

# 2. 画像最適化スクリプト実行
node scripts/optimize-images.js

# 3. 最適化された画像を確認
dir images\optimized
```

### 3. パフォーマンス最適化
```bash
# 1. 現在のパフォーマンス測定
npx @playwright/mcp performance --url=http://localhost:3000

# 2. HTML/CSS/JS最適化
npx html-minifier --collapse-whitespace index.html -o index.min.html
npx cssnano css/style.css -o css/style.min.css
npx terser js/main.js -o js/main.min.js

# 3. 最適化後のパフォーマンス測定
npx @playwright/mcp performance --url=http://localhost:3000
```

## 設定ファイル

`web-tools-config.json` でツールの設定を管理しています：

```json
{
  "webTools": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {
        "NODE_ENV": "development",
        "PLAYWRIGHT_BROWSERS_PATH": "./browsers"
      }
    }
  },
  "imageProcessing": {
    "sharp": {
      "outputDir": "./images/optimized",
      "formats": ["webp", "avif"],
      "quality": 80
    }
  }
}
```

## 便利なスクリプト

### 画像最適化スクリプト
```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images/uploaded';
const outputDir = './images/optimized';

// ディレクトリ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 画像ファイルを処理
fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const inputPath = path.join(inputDir, file);
    const nameWithoutExt = path.parse(file).name;
    
    // WebP形式に変換
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${nameWithoutExt}.webp`));
    
    // AVIF形式に変換
    sharp(inputPath)
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `${nameWithoutExt}.avif`));
    
    console.log(`✓ ${file} を最適化しました`);
  }
});
```

### パフォーマンステストスクリプト
```javascript
// scripts/performance-test.js
const { chromium } = require('playwright');

async function testPerformance() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // パフォーマンス測定開始
  await page.goto('http://localhost:3000');
  
  // メトリクス取得
  const metrics = await page.evaluate(() => {
    return {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime
    };
  });
  
  console.log('パフォーマンスメトリクス:', metrics);
  
  await browser.close();
}

testPerformance();
```

## トラブルシューティング

### Playwrightが起動しない
```bash
# ブラウザをインストール
npx playwright install

# 環境変数を設定
set PLAYWRIGHT_BROWSERS_PATH=./browsers
```

### 画像処理エラー
```bash
# Sharpを再インストール
npm uninstall sharp
npm install sharp

# キャッシュをクリア
npm cache clean --force
```

### 最適化ツールエラー
```bash
# 依存関係を確認
npm list html-minifier cssnano autoprefixer

# 再インストール
npm install --save-dev html-minifier cssnano autoprefixer
```

## ベストプラクティス

### 1. 画像最適化
- アップロード前に画像サイズを確認
- WebP/AVIF形式を優先使用
- 適切な品質設定（80%推奨）
- 複数サイズの生成

### 2. パフォーマンス
- 定期的なパフォーマンステスト
- 画像の遅延読み込み
- CSS/JSの最小化
- キャッシュの活用

### 3. テスト
- 複数ブラウザでのテスト
- レスポンシブデザインテスト
- アクセシビリティテスト
- パフォーマンステスト

## サポート

問題が発生した場合は以下を確認してください：
1. Node.jsが正しくインストールされているか
2. 依存関係が正しくインストールされているか
3. 設定ファイルの構文が正しいか
4. ポートが使用されていないか

詳細なログは以下で確認できます：
```bash
npx @playwright/mcp --debug
npx mcp-proxy --verbose
``` 