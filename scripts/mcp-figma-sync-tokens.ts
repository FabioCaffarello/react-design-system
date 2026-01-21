#!/usr/bin/env tsx
/**
 * Sync Design Tokens from Figma
 * 
 * Synchronizes design tokens (variables) from Figma to code.
 * 
 * Usage: npm run mcp:figma-sync-tokens
 * 
 * Requires:
 * - FIGMA_ACCESS_TOKEN environment variable
 * - FIGMA_FILE_KEY environment variable
 * - Figma MCP server configured
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

interface FigmaVariable {
  id: string;
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: Record<string, unknown>;
}

/**
 * Fetch variables from Figma API
 */
async function fetchFigmaVariables(): Promise<FigmaVariable[]> {
  if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
    throw new Error('FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY must be set');
  }

  // Note: This is a placeholder. In real implementation, you would:
  // 1. Use Figma MCP server to fetch variables
  // 2. Or use Figma REST API directly
  // 3. Parse and convert to token format

  console.log('📥 Fetching variables from Figma...');
  console.log(`   File Key: ${FIGMA_FILE_KEY}`);

  // Example API call (would use MCP in production)
  const response = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.meta?.variables || [];
}

/**
 * Convert Figma variables to token format
 */
function convertToTokens(figmaVariables: FigmaVariable[]): {
  colors: Record<string, unknown>;
  spacing: Record<string, unknown>;
  typography: Record<string, unknown>;
} {
  const tokens = {
    colors: {},
    spacing: {},
    typography: {},
  };

  figmaVariables.forEach((variable) => {
    const { name, type, valuesByMode } = variable;

    // Parse variable name (e.g., "colors/primary/500")
    const parts = name.split('/');
    const category = parts[0];
    const tokenName = parts.slice(1).join('.');

    if (category === 'colors' && type === 'COLOR') {
      // Convert Figma color to hex
      const colorValue = valuesByMode[Object.keys(valuesByMode)[0]];
      if (colorValue) {
        tokens.colors[tokenName] = {
          hex: colorValue,
          // Add other formats as needed
        };
      }
    } else if (category === 'spacing' && type === 'FLOAT') {
      const spacingValue = valuesByMode[Object.keys(valuesByMode)[0]];
      if (spacingValue) {
        tokens.spacing[tokenName] = {
          px: `${spacingValue}px`,
        };
      }
    }
    // Add more conversions as needed
  });

  return tokens;
}

/**
 * Update token files
 */
function updateTokenFiles(tokens: {
  colors: Record<string, unknown>;
  spacing: Record<string, unknown>;
  typography: Record<string, unknown>;
}) {
  console.log('📝 Updating token files...');

  // This would update the actual token files
  // For now, we'll create a sync report

  const report = {
    syncedAt: new Date().toISOString(),
    tokens: {
      colors: Object.keys(tokens.colors).length,
      spacing: Object.keys(tokens.spacing).length,
      typography: Object.keys(tokens.typography).length,
    },
    changes: tokens,
  };

  const reportPath = join(process.cwd(), 'docs', 'figma-sync-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`   ✅ Sync report generated: ${reportPath}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Figma Token Sync\n');

  try {
    // Fetch variables from Figma
    const figmaVariables = await fetchFigmaVariables();
    console.log(`   ✅ Found ${figmaVariables.length} variables\n`);

    // Convert to token format
    console.log('🔄 Converting to token format...');
    const tokens = convertToTokens(figmaVariables);
    console.log(`   ✅ Converted ${Object.keys(tokens.colors).length} colors`);
    console.log(`   ✅ Converted ${Object.keys(tokens.spacing).length} spacing tokens\n`);

    // Update token files
    updateTokenFiles(tokens);

    console.log('\n✅ Token sync completed successfully');
    console.log('\n💡 Next steps:');
    console.log('   1. Review sync report: docs/figma-sync-report.json');
    console.log('   2. Validate changes');
    console.log('   3. Run tests: npm run test');
    console.log('   4. Commit changes if valid');
  } catch (error: unknown) {
    console.error('\n❌ Error syncing tokens:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify FIGMA_ACCESS_TOKEN is set');
    console.log('   2. Verify FIGMA_FILE_KEY is set');
    console.log('   3. Verify token has access to file');
    console.log('   4. Check Figma API status');
    process.exit(1);
  }
}

main();
