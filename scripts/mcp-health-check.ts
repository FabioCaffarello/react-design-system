#!/usr/bin/env tsx
/**
 * MCP Health Check
 * Verifica se o Storybook MCP server está disponível
 * 
 * Usage: npm run mcp:health-check
 */

const MCP_URL = process.env.STORYBOOK_MCP_URL || 'http://localhost:6006/mcp';

async function healthCheck() {
  console.log('🔍 Checking MCP Server health...\n');
  console.log(`📍 MCP URL: ${MCP_URL}\n`);

  try {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.error) {
        console.error('❌ MCP Server returned error:', data.error);
        return false;
      }

      const tools = data.result?.tools || [];
      console.log('✅ MCP Server is available');
      console.log(`📦 Available tools: ${tools.length}\n`);
      
      if (tools.length > 0) {
        console.log('Available tools:');
        tools.forEach((tool: { name: string; description?: string }) => {
          console.log(`  - ${tool.name}${tool.description ? `: ${tool.description}` : ''}`);
        });
      }
      
      return true;
    } else {
      console.error(`❌ MCP Server returned error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error: unknown) {
    console.error('❌ MCP Server is not available');
    console.error(`   Error: ${error.message}\n`);
    console.log('💡 Make sure Storybook is running:');
    console.log('   npm run storybook\n');
    console.log('💡 Or set custom URL:');
    console.log('   STORYBOOK_MCP_URL=http://localhost:6006/mcp npm run mcp:health-check\n');
    return false;
  }
}

healthCheck().then((success) => {
  process.exit(success ? 0 : 1);
});
