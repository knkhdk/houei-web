const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Figma MCPツールのテスト
async function testFigmaMCP() {
  console.log('Figma MCPツールのテストを開始します...\n');

  // 設定ファイルの確認
  const configPath = path.join(__dirname, '..', 'figma-mcp-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ figma-mcp-config.json が見つかりません');
    return;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('✅ 設定ファイルを読み込みました');

    // 環境変数の確認
    const requiredEnvVars = [
      'FIGMA_ACCESS_TOKEN',
      'FIGMA_FILE_KEY',
      'FIGMA_PROJECT_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => 
      !process.env[varName] && !config.mcpServers?.figma?.env?.[varName]
    );

    if (missingVars.length > 0) {
      console.log('⚠️  以下の環境変数が設定されていません:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\nFIGMA_SETUP_GUIDE.md を参照して設定してください。\n');
      return;
    }

    console.log('✅ 環境変数の設定を確認しました');

    // Figma MCPツールのテスト実行
    console.log('🔄 Figma MCPツールをテスト中...\n');

    const testCommands = [
      {
        name: 'バージョン確認',
        command: 'npx',
        args: ['@sethdouglasford/mcp-figma', '--version']
      },
      {
        name: 'ヘルプ表示',
        command: 'npx',
        args: ['@sethdouglasford/mcp-figma', '--help']
      }
    ];

    for (const test of testCommands) {
      try {
        console.log(`📋 ${test.name}...`);
        
        const result = await new Promise((resolve, reject) => {
          const child = spawn(test.command, test.args, {
            stdio: 'pipe',
            shell: true
          });

          let output = '';
          let error = '';

          child.stdout.on('data', (data) => {
            output += data.toString();
          });

          child.stderr.on('data', (data) => {
            error += data.toString();
          });

          child.on('close', (code) => {
            if (code === 0) {
              resolve(output);
            } else {
              reject(new Error(error || `Exit code: ${code}`));
            }
          });

          child.on('error', (err) => {
            reject(err);
          });
        });

        console.log(`✅ ${test.name} - 成功`);
        if (output.trim()) {
          console.log(`   出力: ${output.trim()}`);
        }
      } catch (error) {
        console.log(`❌ ${test.name} - 失敗`);
        console.log(`   エラー: ${error.message}`);
      }
      console.log('');
    }

    // デザインシステムのテスト（APIキーが設定されている場合）
    if (process.env.FIGMA_ACCESS_TOKEN || config.mcpServers?.figma?.env?.FIGMA_ACCESS_TOKEN) {
      console.log('🎨 デザインシステムのテスト...');
      
      try {
        const designSystemTest = await new Promise((resolve, reject) => {
          const child = spawn('npx', ['@sethdouglasford/mcp-figma', 'get-design-system'], {
            stdio: 'pipe',
            shell: true,
            env: {
              ...process.env,
              FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN || config.mcpServers.figma.env.FIGMA_ACCESS_TOKEN
            }
          });

          let output = '';
          let error = '';

          child.stdout.on('data', (data) => {
            output += data.toString();
          });

          child.stderr.on('data', (data) => {
            error += data.toString();
          });

          child.on('close', (code) => {
            if (code === 0) {
              resolve(output);
            } else {
              reject(new Error(error || `Exit code: ${code}`));
            }
          });
        });

        console.log('✅ デザインシステムの取得 - 成功');
        console.log(`   出力: ${designSystemTest.trim()}`);
      } catch (error) {
        console.log('❌ デザインシステムの取得 - 失敗');
        console.log(`   エラー: ${error.message}`);
        console.log('   Figmaファイルの設定を確認してください。');
      }
    }

  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error.message);
  }

  console.log('\n📚 詳細な使用方法は FIGMA_SETUP_GUIDE.md を参照してください。');
}

// スクリプト実行
if (require.main === module) {
  testFigmaMCP();
}

module.exports = { testFigmaMCP }; 