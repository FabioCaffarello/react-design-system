#!/usr/bin/env tsx
/**
 * Token Migration Script
 * 
 * Helps migrate design tokens between versions by:
 * - Detecting usage of deprecated/removed tokens
 * - Suggesting replacements
 * - Generating migration report
 * 
 * Usage: npm run migrate:tokens
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getBreakingChangesBetweenVersions,
  generateMigrationGuide,
  CURRENT_TOKENS_VERSION,
} from '../src/ui/tokens/versioning';

interface TokenUsage {
  file: string;
  line: number;
  token: string;
  category: string;
  context: string;
}

/**
 * Find token usage in codebase
 */
function findTokenUsage(dir: string, usages: TokenUsage[] = []): TokenUsage[] {
  if (!existsSync(dir)) return usages;

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.storybook'].includes(entry.name)) {
        findTokenUsage(fullPath, usages);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          // Look for token usage patterns
          // This is a simplified version - can be enhanced
          const tokenPatterns = [
            /getColorClass\(['"]([^'"]+)['"]/g,
            /getSpacingClass\(['"]([^'"]+)['"]/g,
            /COLOR_TOKENS\.([\w]+)/g,
            /SPACING_TOKENS\.([\w]+)/g,
          ];

          tokenPatterns.forEach((pattern) => {
            let match;
            while ((match = pattern.exec(line)) !== null) {
              usages.push({
                file: fullPath.replace(process.cwd(), ''),
                line: index + 1,
                token: match[1],
                category: 'unknown', // Would need more context to determine
                context: line.trim(),
              });
            }
          });
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }

  return usages;
}

/**
 * Check for deprecated/removed tokens
 */
function checkTokenUsage(
  usages: TokenUsage[],
  breakingChanges: any[]
): { affected: TokenUsage[]; report: string } {
  const affected: TokenUsage[] = [];
  let report = '# Token Migration Report\n\n';

  breakingChanges.forEach((change) => {
    const matchingUsages = usages.filter(
      (usage) => usage.token === change.token || usage.category === change.category
    );

    if (matchingUsages.length > 0) {
      affected.push(...matchingUsages);
      report += `## ${change.category}.${change.token}\n\n`;
      report += `**Reason**: ${change.reason}\n\n`;
      report += `**Migration**:\n\n\`\`\`typescript\n${change.migration}\n\`\`\`\n\n`;
      report += `**Affected Files** (${matchingUsages.length}):\n\n`;

      matchingUsages.forEach((usage) => {
        report += `- \`${usage.file}:${usage.line}\`\n`;
        report += `  \`\`\`typescript\n  ${usage.context}\n  \`\`\`\n\n`;
      });
    }
  });

  return { affected, report };
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const fromVersion = args[0] || '1.7.0';
  const toVersion = args[1] || CURRENT_TOKENS_VERSION;

  console.log(`🔄 Token Migration: ${fromVersion} → ${toVersion}\n`);

  // Get breaking changes
  const breakingChanges = getBreakingChangesBetweenVersions(fromVersion, toVersion);

  if (breakingChanges.length === 0) {
    console.log('✅ No breaking changes detected. Safe to upgrade!\n');
    return;
  }

  console.log(`⚠️  Found ${breakingChanges.length} breaking change(s)\n`);

  // Generate migration guide
  const guide = generateMigrationGuide(fromVersion, toVersion);
  const guidePath = join(process.cwd(), 'docs', `token-migration-${fromVersion}-to-${toVersion}.md`);
  writeFileSync(guidePath, guide, 'utf-8');
  console.log(`📄 Migration guide generated: ${guidePath}\n`);

  // Find token usage
  console.log('🔍 Scanning codebase for token usage...\n');
  const srcDir = join(process.cwd(), 'src');
  const usages = findTokenUsage(srcDir);

  console.log(`Found ${usages.length} token usages\n`);

  // Check for affected usage
  const { affected, report } = checkTokenUsage(usages, breakingChanges);

  if (affected.length > 0) {
    const reportPath = join(process.cwd(), 'docs', `token-migration-report-${toVersion}.md`);
    writeFileSync(reportPath, report, 'utf-8');
    console.log(`📊 Migration report generated: ${reportPath}`);
    console.log(`\n⚠️  ${affected.length} file(s) may need updates\n`);
  } else {
    console.log('✅ No affected token usage found\n');
  }

  console.log('✅ Migration analysis completed');
}

main();
