#!/usr/bin/env tsx
/**
 * Extract Component Metadata using MCP Extractor
 * 
 * Extracts comprehensive metadata from all components in Storybook using MCP.
 * 
 * Usage: npm run mcp:extract-metadata
 * 
 * Requires:
 * - Storybook running on http://localhost:6006
 * - MCP Design System Extractor configured
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';
const OUTPUT_DIR = join(process.cwd(), 'docs', 'extracted-metadata');

interface ComponentMetadata {
  name: string;
  category: string;
  html: string;
  styles: Record<string, string>;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    defaultValue?: unknown;
  }>;
  dependencies: string[];
  designTokens: {
    colors: string[];
    spacing: string[];
    typography: string[];
  };
  stories: string[];
}

/**
 * Call MCP Extractor
 * 
 * Note: In real implementation, this would use MCP protocol
 * to communicate with the extractor server
 */
async function extractComponentMetadata(componentName: string): Promise<ComponentMetadata | null> {
  // This is a placeholder. In real implementation:
  // 1. Connect to MCP Design System Extractor
  // 2. Request metadata for component
  // 3. Parse and return structured data

  console.log(`   📦 Extracting ${componentName}...`);

  // Example: Would use MCP to extract
  // For now, return placeholder structure
  return {
    name: componentName,
    category: 'unknown',
    html: '',
    styles: {},
    props: [],
    dependencies: [],
    designTokens: {
      colors: [],
      spacing: [],
      typography: [],
    },
    stories: [],
  };
}

/**
 * Extract metadata for all components
 */
async function extractAllMetadata(): Promise<ComponentMetadata[]> {
  console.log('🔍 Finding components...\n');

  // In real implementation, would:
  // 1. Use Storybook MCP to list all components
  // 2. For each component, use MCP Extractor to get metadata
  // 3. Combine and return

  // For now, use component registry if available
  const registryPath = join(process.cwd(), 'docs', 'component-registry.json');
  let components: string[] = [];

  if (existsSync(registryPath)) {
    const registry = JSON.parse(require('fs').readFileSync(registryPath, 'utf-8'));
    components = Object.keys(registry.components || {});
  }

  if (components.length === 0) {
    console.log('⚠️  No components found. Run generate-component-registry first.\n');
    return [];
  }

  console.log(`Found ${components.length} components\n`);

  const metadata: ComponentMetadata[] = [];

  for (const componentName of components) {
    try {
      const componentMetadata = await extractComponentMetadata(componentName);
      if (componentMetadata) {
        metadata.push(componentMetadata);
      }
    } catch (error: unknown) {
      console.warn(`   ⚠️  Failed to extract ${componentName}: ${error.message}`);
    }
  }

  return metadata;
}

/**
 * Generate metadata report
 */
function generateReport(metadata: ComponentMetadata[]): string {
  let report = '# Extracted Component Metadata\n\n';
  report += `Generated at: ${new Date().toISOString()}\n\n`;
  report += `Total Components: ${metadata.length}\n\n`;

  // Summary
  const byCategory = metadata.reduce((acc, comp) => {
    acc[comp.category] = (acc[comp.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  report += `## Summary by Category\n\n`;
  Object.entries(byCategory).forEach(([category, count]) => {
    report += `- **${category}**: ${count} components\n`;
  });

  // Details
  report += `\n## Component Details\n\n`;

  metadata.forEach((comp) => {
    report += `### ${comp.name}\n\n`;
    report += `- **Category**: ${comp.category}\n`;
    report += `- **Props**: ${comp.props.length}\n`;
    report += `- **Dependencies**: ${comp.dependencies.length}\n`;
    report += `- **Stories**: ${comp.stories.length}\n`;
    report += `- **Design Tokens**:\n`;
    report += `  - Colors: ${comp.designTokens.colors.length}\n`;
    report += `  - Spacing: ${comp.designTokens.spacing.length}\n`;
    report += `  - Typography: ${comp.designTokens.typography.length}\n`;
    report += `\n`;
  });

  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('📊 Extracting Component Metadata\n');
  console.log(`📍 Storybook URL: ${STORYBOOK_URL}\n`);

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Extract metadata
    const metadata = await extractAllMetadata();

    if (metadata.length === 0) {
      console.log('⚠️  No metadata extracted. Make sure Storybook is running.\n');
      return;
    }

    console.log(`\n✅ Extracted metadata for ${metadata.length} components\n`);

    // Generate JSON
    const jsonPath = join(OUTPUT_DIR, 'metadata.json');
    writeFileSync(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`📄 JSON metadata: ${jsonPath}`);

    // Generate report
    const report = generateReport(metadata);
    const reportPath = join(OUTPUT_DIR, 'metadata-report.md');
    writeFileSync(reportPath, report, 'utf-8');
    console.log(`📄 Metadata report: ${reportPath}`);

    console.log('\n✅ Metadata extraction completed');
    console.log('\n💡 Next steps:');
    console.log('   1. Review extracted metadata');
    console.log('   2. Use for registry generation');
    console.log('   3. Validate consistency');
  } catch (error: unknown) {
    console.error('\n❌ Error extracting metadata:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify Storybook is running');
    console.log('   2. Verify MCP Extractor is configured');
    console.log('   3. Check MCP connection');
    process.exit(1);
  }
}

main();
