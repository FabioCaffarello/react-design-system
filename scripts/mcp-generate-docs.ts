#!/usr/bin/env tsx
/**
 * Generate Documentation using MCP
 * Usa Storybook MCP para extrair informações e gerar documentação
 * 
 * Usage: npm run mcp:generate-docs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const MCP_URL = process.env.STORYBOOK_MCP_URL || 'http://localhost:6006/mcp';
const OUTPUT_DIR = join(process.cwd(), 'docs', 'generated');

async function callMCP(method: string, params: unknown) {
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`MCP error: ${data.error.message}`);
  }

  return data.result;
}

function generateComponentDoc(component: unknown, info: unknown): string {
  const props = info.props || [];
  const stories = info.stories || [];

  return `# ${component.name}

${info.description || `Component from ${component.category} category.`}

## Props

${props.length > 0 ? generatePropsTable(props) : 'No props available.'}

## Stories

${stories.length > 0 ? generateStoriesList(stories) : 'No stories available.'}

## Usage

\`\`\`tsx
import { ${component.name} } from '@fabio.caffarello/react-design-system';

function Example() {
  return <${component.name} />;
}
\`\`\`

## Category

${component.category}

## Path

\`${component.path}\`
`;
}

function generatePropsTable(props: unknown[]): string {
  if (props.length === 0) return 'No props available.';

  let table = '| Prop | Type | Default | Required | Description |\n';
  table += '|------|------|---------|----------|-------------|\n';

  props.forEach((prop: unknown) => {
    const name = prop.name || 'unknown';
    const type = prop.type || 'unknown';
    const defaultValue = prop.defaultValue || '-';
    const required = prop.required ? '✅' : '❌';
    const description = prop.description || '-';

    table += `| \`${name}\` | \`${type}\` | ${defaultValue} | ${required} | ${description} |\n`;
  });

  return table;
}

function generateStoriesList(stories: unknown[]): string {
  if (stories.length === 0) return 'No stories available.';

  return stories
    .map((story: unknown) => `- **${story.name}**: ${story.description || 'No description'}`)
    .join('\n');
}

async function generateDocs() {
  console.log('📚 Generating documentation using MCP...\n');
  console.log(`📍 MCP URL: ${MCP_URL}\n`);

  try {
    // List all components
    console.log('🔍 Fetching components list...');
    const componentsResult = await callMCP('tools/call', {
      name: 'list-all-components',
      arguments: {},
    });

    const components = componentsResult.components || [];
    console.log(`✅ Found ${components.length} components\n`);

    // Create output directory
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate docs for each component
    let successCount = 0;
    let errorCount = 0;

    for (const component of components) {
      try {
        console.log(`📝 Processing ${component.name}...`);

        const info = await callMCP('tools/call', {
          name: 'get-component-info',
          arguments: { componentName: component.name },
        });

        const doc = generateComponentDoc(component, info);
        const filename = `${component.name}.md`;
        const filepath = join(OUTPUT_DIR, filename);

        writeFileSync(filepath, doc, 'utf-8');
        console.log(`   ✅ Generated: ${filename}`);
        successCount++;
      } catch (error: unknown) {
        console.error(`   ❌ Error processing ${component.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n📁 Documentation generated in: ${OUTPUT_DIR}`);
    console.log('\n✅ Documentation generation completed');
  } catch (error: unknown) {
    console.error('\n❌ Error generating documentation:', error.message);
    console.log('\n💡 Make sure Storybook is running:');
    console.log('   npm run storybook\n');
    process.exit(1);
  }
}

generateDocs();
