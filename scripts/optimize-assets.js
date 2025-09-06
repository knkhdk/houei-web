const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

// 設定
const config = {
  html: {
    inputDir: './',
    outputDir: './optimized',
    extensions: ['.html']
  },
  css: {
    inputDir: './css',
    outputDir: './css/optimized',
    extensions: ['.css']
  },
  js: {
    inputDir: './js',
    outputDir: './js/optimized',
    extensions: ['.js']
  }
};

// HTML最適化
async function optimizeHTML() {
  console.log('HTML最適化を開始します...');
  
  if (!fs.existsSync(config.html.outputDir)) {
    fs.mkdirSync(config.html.outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(config.html.inputDir);
  
  for (const file of files) {
    if (config.html.extensions.some(ext => file.endsWith(ext))) {
      const inputPath = path.join(config.html.inputDir, file);
      const outputPath = path.join(config.html.outputDir, file);
      
      try {
        const content = fs.readFileSync(inputPath, 'utf8');
        
        const minified = minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: false,
          removeEmptyAttributes: true,
          removeOptionalTags: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        });
        
        fs.writeFileSync(outputPath, minified);
        console.log(`✓ ${file} を最適化しました`);
      } catch (error) {
        console.error(`✗ ${file} の最適化に失敗しました:`, error.message);
      }
    }
  }
}

// CSS最適化
async function optimizeCSS() {
  console.log('CSS最適化を開始します...');
  
  if (!fs.existsSync(config.css.outputDir)) {
    fs.mkdirSync(config.css.outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(config.css.inputDir);
  
  for (const file of files) {
    if (config.css.extensions.some(ext => file.endsWith(ext))) {
      const inputPath = path.join(config.css.inputDir, file);
      const outputPath = path.join(config.css.outputDir, file);
      
      try {
        const content = fs.readFileSync(inputPath, 'utf8');
        
        // PostCSSで処理
        const result = await postcss([
          autoprefixer({
            overrideBrowserslist: [
              '> 1%',
              'last 2 versions',
              'not dead'
            ]
          }),
          cssnano({
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: true,
              colormin: true,
              minifyFontValues: true,
              minifySelectors: true
            }]
          })
        ]).process(content, { from: inputPath, to: outputPath });
        
        fs.writeFileSync(outputPath, result.css);
        console.log(`✓ ${file} を最適化しました`);
      } catch (error) {
        console.error(`✗ ${file} の最適化に失敗しました:`, error.message);
      }
    }
  }
}

// JavaScript最適化（簡易版）
async function optimizeJS() {
  console.log('JavaScript最適化を開始します...');
  
  if (!fs.existsSync(config.js.outputDir)) {
    fs.mkdirSync(config.js.outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(config.js.inputDir);
  
  for (const file of files) {
    if (config.js.extensions.some(ext => file.endsWith(ext))) {
      const inputPath = path.join(config.js.inputDir, file);
      const outputPath = path.join(config.js.outputDir, file);
      
      try {
        let content = fs.readFileSync(inputPath, 'utf8');
        
        // 簡易的な最適化
        // コメント削除（// と /* */）
        content = content.replace(/\/\*[\s\S]*?\*\//g, ''); // /* */ コメント
        content = content.replace(/\/\/.*$/gm, ''); // // コメント
        
        // 不要な空白削除
        content = content.replace(/\s+/g, ' ');
        content = content.replace(/\s*{\s*/g, '{');
        content = content.replace(/\s*}\s*/g, '}');
        content = content.replace(/\s*;\s*/g, ';');
        content = content.replace(/\s*,\s*/g, ',');
        content = content.replace(/\s*=\s*/g, '=');
        content = content.replace(/\s*\+\s*/g, '+');
        content = content.replace(/\s*-\s*/g, '-');
        content = content.replace(/\s*\*\s*/g, '*');
        content = content.replace(/\s*\/\s*/g, '/');
        
        // 前後の空白削除
        content = content.trim();
        
        fs.writeFileSync(outputPath, content);
        console.log(`✓ ${file} を最適化しました`);
      } catch (error) {
        console.error(`✗ ${file} の最適化に失敗しました:`, error.message);
      }
    }
  }
}

// ファイルサイズ比較
function compareFileSizes() {
  console.log('\nファイルサイズ比較:');
  console.log('='.repeat(50));
  
  const compareDir = (inputDir, outputDir, type) => {
    if (!fs.existsSync(outputDir)) return;
    
    const files = fs.readdirSync(outputDir);
    
    files.forEach(file => {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      if (fs.existsSync(inputPath) && fs.existsSync(outputPath)) {
        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(1);
        
        console.log(`${type} ${file}:`);
        console.log(`  元サイズ: ${(inputSize / 1024).toFixed(1)} KB`);
        console.log(`  最適化後: ${(outputSize / 1024).toFixed(1)} KB`);
        console.log(`  削減率: ${reduction}%`);
        console.log('');
      }
    });
  };
  
  compareDir(config.html.inputDir, config.html.outputDir, 'HTML');
  compareDir(config.css.inputDir, config.css.outputDir, 'CSS');
  compareDir(config.js.inputDir, config.js.outputDir, 'JS');
}

// メイン処理
async function main() {
  console.log('アセット最適化を開始します...\n');
  
  try {
    await optimizeHTML();
    console.log('');
    
    await optimizeCSS();
    console.log('');
    
    await optimizeJS();
    console.log('');
    
    compareFileSizes();
    
    console.log('アセット最適化が完了しました！');
    console.log(`最適化されたファイルは以下のディレクトリに保存されました:`);
    console.log(`- HTML: ${config.html.outputDir}`);
    console.log(`- CSS: ${config.css.outputDir}`);
    console.log(`- JS: ${config.js.outputDir}`);
  } catch (error) {
    console.error('アセット最適化中にエラーが発生しました:', error.message);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { optimizeHTML, optimizeCSS, optimizeJS, main }; 