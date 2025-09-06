const fs = require('fs');
const path = require('path');

// 邦栄建設向けデザインシステム
const designSystem = {
  colors: {
    primary: {
      main: '#1e3a8a',
      light: '#3b82f6',
      dark: '#1e40af',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
      contrast: '#ffffff'
    },
    neutral: {
      white: '#ffffff',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',
      black: '#000000'
    }
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem'
  }
};

// CSS変数として出力
function generateCSSVariables() {
  let css = ':root {\n';
  
  // カラー変数
  Object.entries(designSystem.colors).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([name, value]) => {
      css += `  --color-${category}-${name}: ${value};\n`;
    });
  });
  
  // タイポグラフィ変数
  Object.entries(designSystem.typography.fontSize).forEach(([name, value]) => {
    css += `  --font-size-${name}: ${value};\n`;
  });
  
  Object.entries(designSystem.typography.fontWeight).forEach(([name, value]) => {
    css += `  --font-weight-${name}: ${value};\n`;
  });
  
  // スペーシング変数
  Object.entries(designSystem.spacing).forEach(([name, value]) => {
    css += `  --spacing-${name}: ${value};\n`;
  });
  
  css += '}\n\n';
  
  // ユーティリティクラス
  css += generateUtilityClasses();
  
  return css;
}

// ユーティリティクラス生成
function generateUtilityClasses() {
  let css = '';
  
  // カラーユーティリティ
  Object.entries(designSystem.colors).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([name, value]) => {
      css += `.bg-${category}-${name} { background-color: var(--color-${category}-${name}); }\n`;
      css += `.text-${category}-${name} { color: var(--color-${category}-${name}); }\n`;
    });
  });
  
  // タイポグラフィユーティリティ
  Object.entries(designSystem.typography.fontSize).forEach(([name, value]) => {
    css += `.text-${name} { font-size: var(--font-size-${name}); }\n`;
  });
  
  Object.entries(designSystem.typography.fontWeight).forEach(([name, value]) => {
    css += `.font-${name} { font-weight: var(--font-weight-${name}); }\n`;
  });
  
  // スペーシングユーティリティ
  Object.entries(designSystem.spacing).forEach(([name, value]) => {
    css += `.p-${name} { padding: var(--spacing-${name}); }\n`;
    css += `.m-${name} { margin: var(--spacing-${name}); }\n`;
  });
  
  return css;
}

// メイン処理
function main() {
  console.log('デザインシステムを生成中...\n');
  
  // 出力ディレクトリ作成
  const outputDir = path.join(__dirname, '..', 'css', 'design-system');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // CSSファイル生成
  const cssContent = generateCSSVariables();
  const cssPath = path.join(outputDir, 'design-system.css');
  fs.writeFileSync(cssPath, cssContent);
  
  // JSONファイル生成
  const jsonPath = path.join(outputDir, 'design-system.json');
  fs.writeFileSync(jsonPath, JSON.stringify(designSystem, null, 2));
  
  console.log('✅ デザインシステムが生成されました！');
  console.log(`📁 出力ディレクトリ: ${outputDir}`);
  console.log('📄 生成されたファイル:');
  console.log('   - design-system.css (CSS変数とユーティリティクラス)');
  console.log('   - design-system.json (設定データ)');
  
  console.log('\n🎨 使用方法:');
  console.log('1. HTMLファイルで design-system.css を読み込み');
  console.log('2. CSS変数やユーティリティクラスを使用');
  console.log('3. 例: <div class="bg-primary-main text-white p-lg">');
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { designSystem, generateCSSVariables, main }; 