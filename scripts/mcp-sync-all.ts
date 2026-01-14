#!/usr/bin/env tsx
/**
 * Sync All - Comprehensive Sync Script
 * 
 * Synchronizes everything using MCPs:
 * - Figma tokens → Code
 * - Storybook metadata → Registry
 * - Documentation updates
 * 
 * Usage: npm run mcp:sync-all
 */

import { execSync } from 'child_process';

const scripts = [
  {
    name: 'Figma Token Sync',
    script: 'mcp:figma-sync-tokens',
    required: ['FIGMA_ACCESS_TOKEN', 'FIGMA_FILE_KEY'],
  },
  {
    name: 'Component Registry',
    script: 'generate-component-registry',
    required: [],
  },
  {
    name: 'Extract Metadata',
    script: 'mcp:extract-metadata',
    required: [],
  },
  {
    name: 'Generate Documentation',
    script: 'mcp:generate-docs',
    required: [],
  },
];

function checkRequirements(required: string[]): boolean {
  if (required.length === 0) return true;

  const missing = required.filter((env) => !process.env[env]);
  if (missing.length > 0) {
    console.log(`   ⚠️  Missing: ${missing.join(', ')}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('🔄 Comprehensive Sync - All MCP Operations\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const { name, script, required } of scripts) {
    console.log(`📦 ${name}...`);

    if (!checkRequirements(required)) {
      console.log(`   ⏭️  Skipped (missing requirements)\n`);
      skipCount++;
      continue;
    }

    try {
      execSync(`npm run ${script}`, { stdio: 'inherit' });
      console.log(`   ✅ Completed\n`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed: ${error}\n`);
      errorCount++;
    }
  }

  console.log('📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
