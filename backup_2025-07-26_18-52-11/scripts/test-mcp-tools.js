const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// インストールされたMCPツールのリスト
const mcpTools = [
  {
    name: 'Tavily MCP',
    package: 'tavily-mcp',
    testCommand: ['--help'],
    description: 'Web検索・リサーチ'
  },
  {
    name: 'Playwright MCP Server',
    package: '@executeautomation/playwright-mcp-server',
    testCommand: ['--help'],
    description: 'ブラウザ自動化・テスト'
  },
  {
    name: 'Code Runner MCP Server',
    package: 'mcp-server-code-runner',
    testCommand: ['--help'],
    description: 'コード実行・テスト'
  },
  {
    name: 'Notion MCP Server',
    package: '@notionhq/notion-mcp-server',
    testCommand: ['--help'],
    description: 'コンテンツ管理'
  },
  {
    name: 'Sentry MCP Server',
    package: '@sentry/mcp-server',
    testCommand: ['--help'],
    description: 'エラー監視・パフォーマンス'
  },
  {
    name: 'n8n MCP',
    package: 'n8n-mcp',
    testCommand: ['--help'],
    description: 'ワークフロー自動化'
  },
  {
    name: 'Figma MCP',
    package: '@sethdouglasford/mcp-figma',
    testCommand: ['--help'],
    description: 'デザインシステム'
  }
];

// ツールのテスト実行
async function testMCPTool(tool) {
  return new Promise((resolve) => {
    console.log(`\n🔍 ${tool.name} (${tool.description}) をテスト中...`);
    
    const child = spawn('npx', ['-y', tool.package, ...tool.testCommand], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 || output.includes('help') || output.includes('Usage')) {
        console.log(`✅ ${tool.name} - 正常に動作しています`);
        resolve({ success: true, tool: tool.name });
      } else {
        console.log(`⚠️  ${tool.name} - ヘルプコマンドでエラーが発生しましたが、インストールは完了しています`);
        console.log(`   エラー: ${errorOutput.substring(0, 100)}...`);
        resolve({ success: false, tool: tool.name, error: errorOutput });
      }
    });

    child.on('error', (error) => {
      console.log(`❌ ${tool.name} - 実行エラー: ${error.message}`);
      resolve({ success: false, tool: tool.name, error: error.message });
    });

    // タイムアウト設定
    setTimeout(() => {
      child.kill();
      console.log(`⏰ ${tool.name} - タイムアウト`);
      resolve({ success: false, tool: tool.name, error: 'Timeout' });
    }, 10000);
  });
}

// メイン処理
async function main() {
  console.log('🚀 推奨MCPツールのテストを開始します...\n');
  
  const results = [];
  
  for (const tool of mcpTools) {
    const result = await testMCPTool(tool);
    results.push(result);
  }
  
  // 結果の表示
  console.log('\n📊 テスト結果サマリー:');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ 正常動作: ${successful.length}/${mcpTools.length}`);
  successful.forEach(result => {
    console.log(`   - ${result.tool}`);
  });
  
  if (failed.length > 0) {
    console.log(`\n⚠️  注意が必要: ${failed.length}/${mcpTools.length}`);
    failed.forEach(result => {
      console.log(`   - ${result.tool}: ${result.error?.substring(0, 50)}...`);
    });
  }
  
  console.log('\n🎯 次のステップ:');
  console.log('1. 各ツールのAPIキーを設定してください');
  console.log('2. RECOMMENDED_MCP_GUIDE.md を参照して詳細な使用方法を確認');
  console.log('3. 実際のプロジェクトでツールを活用');
  
  // 設定ファイルの確認
  const configPath = path.join(__dirname, '..', 'recommended-mcp-config.json');
  if (fs.existsSync(configPath)) {
    console.log('\n📁 設定ファイル: recommended-mcp-config.json');
    console.log('   このファイルで各ツールの設定を管理できます');
  }
  
  console.log('\n📚 詳細な使用方法:');
  console.log('   - RECOMMENDED_MCP_GUIDE.md');
  console.log('   - FIGMA_SETUP_GUIDE.md (Figma MCP用)');
  console.log('   - WEB_TOOLS_GUIDE.md (既存ツール用)');
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testMCPTool, main }; 