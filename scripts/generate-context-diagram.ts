#!/usr/bin/env tsx
/**
 * Generate Context Hierarchy Diagram
 * 
 * Generates a Mermaid diagram showing the context provider hierarchy.
 * 
 * Usage: npm run generate-context-diagram
 */

import { readFileSync, existsSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ProviderInfo {
  name: string;
  file: string;
  children: string[];
  level: number;
}

/**
 * Find all provider files
 */
function findProviderFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        findProviderFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.includes('Provider') && entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory might not exist
  }

  return files;
}

/**
 * Extract provider information
 */
function extractProviderInfo(filePath: string): ProviderInfo | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const fileName = filePath.split('/').pop()?.replace(/\.tsx$/, '') || '';
    
    // Extract provider name
    const exportMatch = content.match(/export\s+(?:function|const)\s+(\w+Provider)/);
    if (!exportMatch) return null;

    const providerName = exportMatch[1];
    
    // Find child providers (simplified - looks for JSX children)
    const children: string[] = [];
    const providerPattern = /<(\w+Provider)[^>]*>/g;
    let match;
    while ((match = providerPattern.exec(content)) !== null) {
      if (match[1] !== providerName) {
        children.push(match[1]);
      }
    }

    return {
      name: providerName,
      file: fileName,
      children: [...new Set(children)],
      level: 0,
    };
  } catch {
    return null;
  }
}

/**
 * Generate Mermaid diagram
 */
function generateMermaidDiagram(providers: ProviderInfo[]): string {
  const lines: string[] = [
    '```mermaid',
    'graph TB',
  ];

  // Add nodes
  for (const provider of providers) {
    lines.push(`    ${provider.name}[${provider.name}]`);
  }

  // Add edges
  const appProvider = providers.find(p => p.name === 'AppProvider');
  if (appProvider) {
    for (const child of appProvider.children) {
      const childProvider = providers.find(p => p.name === child);
      if (childProvider) {
        lines.push(`    ${appProvider.name} --> ${childProvider.name}`);
      }
    }
  }

  // Add other relationships
  for (const provider of providers) {
    if (provider.name !== 'AppProvider') {
      for (const child of provider.children) {
        const childProvider = providers.find(p => p.name === child);
        if (childProvider) {
          lines.push(`    ${provider.name} --> ${childProvider.name}`);
        }
      }
    }
  }

  lines.push('```');
  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  const srcDir = join(process.cwd(), 'src', 'ui');
  const outputFile = join(process.cwd(), 'docs', 'CONTEXT_HIERARCHY.md');

  // eslint-disable-next-line no-console
  console.log('🔍 Finding provider files...\n');

  const providerFiles = findProviderFiles(srcDir);
  // eslint-disable-next-line no-console
  console.log(`Found ${providerFiles.length} provider files\n`);

  const providers: ProviderInfo[] = [];
  for (const file of providerFiles) {
    const info = extractProviderInfo(file);
    if (info) {
      providers.push(info);
    }
  }

  if (providers.length === 0) {
    // eslint-disable-next-line no-console
    console.error('No providers found');
    process.exit(1);
  }

  // Sort by hierarchy
  const appProvider = providers.find(p => p.name === 'AppProvider');
  if (appProvider) {
    appProvider.level = 0;
    const setLevels = (parent: ProviderInfo, level: number) => {
      for (const childName of parent.children) {
        const child = providers.find(p => p.name === childName);
        if (child && child.level === 0) {
          child.level = level + 1;
          setLevels(child, level + 1);
        }
      }
    };
    setLevels(appProvider, 0);
  }

  const diagram = generateMermaidDiagram(providers);

  // Create output directory if it doesn't exist
  const outputDir = join(process.cwd(), 'docs');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const markdown = `# Context Provider Hierarchy

This diagram shows the hierarchy of context providers in the design system.

${diagram}

## Provider Details

${providers.map(p => `### ${p.name}
- File: \`${p.file}.tsx\`
- Level: ${p.level}
- Children: ${p.children.length > 0 ? p.children.join(', ') : 'None'}
`).join('\n')}
`;

  writeFileSync(outputFile, markdown);
  // eslint-disable-next-line no-console
  console.log(`✅ Context hierarchy diagram generated: ${outputFile}\n`);
  // eslint-disable-next-line no-console
  console.log(`Found ${providers.length} providers:`);
  providers.forEach(p => {
    // eslint-disable-next-line no-console
    console.log(`  - ${p.name} (level ${p.level})`);
  });
}

main();
