const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images/optimized';

// ディレクトリ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 画像ファイルを処理する関数
async function optimizeImage(filePath, outputPath, options = {}) {
  try {
    const { width, height, quality = 80, format = 'webp' } = options;
    
    let pipeline = sharp(filePath);
    
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }
    
    await pipeline.toFile(outputPath);
    console.log(`✓ ${path.basename(filePath)} を最適化しました -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ ${path.basename(filePath)} の最適化に失敗しました:`, error.message);
  }
}

// メイン処理
async function main() {
  console.log('画像最適化を開始します...\n');
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff)$/i;
  const processedFiles = new Set();
  
  // 入力ディレクトリを再帰的に探索
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 最適化ディレクトリはスキップ
        if (path.basename(filePath) !== 'optimized') {
          processDirectory(filePath);
        }
      } else if (imageExtensions.test(file)) {
        const relativePath = path.relative(inputDir, filePath);
        const nameWithoutExt = path.parse(file).name;
        const ext = path.parse(file).ext.toLowerCase();
        
        // 既に処理済みのファイルはスキップ
        if (processedFiles.has(relativePath)) {
          return;
        }
        
        processedFiles.add(relativePath);
        
        // 複数サイズとフォーマットで最適化
        const optimizations = [
          // サムネイル
          {
            outputPath: path.join(outputDir, `${nameWithoutExt}-thumb.webp`),
            options: { width: 300, height: 200, quality: 80, format: 'webp' }
          },
          // 中サイズ
          {
            outputPath: path.join(outputDir, `${nameWithoutExt}-medium.webp`),
            options: { width: 800, height: 600, quality: 80, format: 'webp' }
          },
          // 大サイズ
          {
            outputPath: path.join(outputDir, `${nameWithoutExt}-large.webp`),
            options: { width: 1200, height: 800, quality: 80, format: 'webp' }
          },
          // AVIF形式（最新ブラウザ対応）
          {
            outputPath: path.join(outputDir, `${nameWithoutExt}-thumb.avif`),
            options: { width: 300, height: 200, quality: 80, format: 'avif' }
          }
        ];
        
        // 最適化実行
        optimizations.forEach(async (opt) => {
          await optimizeImage(filePath, opt.outputPath, opt.options);
        });
      }
    });
  }
  
  try {
    processDirectory(inputDir);
    console.log('\n画像最適化が完了しました！');
    console.log(`出力ディレクトリ: ${outputDir}`);
  } catch (error) {
    console.error('画像最適化中にエラーが発生しました:', error.message);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, main }; 