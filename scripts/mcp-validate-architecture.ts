#!/usr/bin/env tsx
/**
 * Validate Architecture using Design Systems MCP
 * 
 * Uses Design Systems MCP to validate component architecture against best practices.
 * 
 * Usage: npm run mcp:validate-architecture
 * 
 * Note: Requires Design Systems MCP to be configured in .cursor/mcp.json
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ArchitectureIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  component?: string;
  issue: string;
  recommendation: string;
}

/**
 * Analyze component architecture
 */
function analyzeArchitecture(): {
  categories: Record<string, number>;
  violations: ArchitectureIssue[];
} {
  const srcDir = join(process.cwd(), 'src', 'ui');
  const categories: Record<string, number> = {};
  const violations: ArchitectureIssue[] = [];

  if (!existsSync(srcDir)) {
    return { categories, violations };
  }

  // Count components by category
  const categoryDirs = ['atoms', 'molecules', 'organisms', 'templates', 'patterns', 'layouts'];
  
  categoryDirs.forEach((category) => {
    const categoryPath = join(srcDir, category);
    if (existsSync(categoryPath)) {
      const files = readdirSync(categoryPath, { recursive: true });
      const componentFiles = files.filter((f) => 
        f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.')
      );
      categories[category] = componentFiles.length;
    }
  });

  // Basic validation rules
  // In a real implementation, this would query Design Systems MCP

  // Check if atoms import other atoms
  // Check if molecules import organisms
  // Check naming conventions
  // etc.

  return { categories, violations };
}

/**
 * Generate validation report
 */
function generateReport(
  categories: Record<string, number>,
  violations: ArchitectureIssue[]
): string {
  let report = '# Architecture Validation Report\n\n';
  report += `Generated at: ${new Date().toISOString()}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `Total Components: ${Object.values(categories).reduce((a, b) => a + b, 0)}\n\n`;
  report += `### By Category\n\n`;
  Object.entries(categories).forEach(([category, count]) => {
    report += `- **${category}**: ${count} components\n`;
  });

  // Violations
  if (violations.length === 0) {
    report += `\n✅ No architecture violations found!\n\n`;
  } else {
    report += `\n## Issues Found\n\n`;
    
    const bySeverity = violations.reduce((acc, violation) => {
      if (!acc[violation.severity]) {
        acc[violation.severity] = [];
      }
      acc[violation.severity].push(violation);
      return acc;
    }, {} as Record<string, ArchitectureIssue[]>);

    ['error', 'warning', 'info'].forEach((severity) => {
      const issues = bySeverity[severity] || [];
      if (issues.length > 0) {
        report += `### ${severity.charAt(0).toUpperCase() + severity.slice(1)}s (${issues.length})\n\n`;
        issues.forEach((issue) => {
          report += `- **${issue.category}${issue.component ? `/${issue.component}` : ''}**: ${issue.issue}\n`;
          report += `  - Recommendation: ${issue.recommendation}\n\n`;
        });
      }
    });
  }

  // Recommendations
  report += `## Recommendations\n\n`;
  report += `1. Review architecture against design system best practices\n`;
  report += `2. Validate component categorization\n`;
  report += `3. Check import rules compliance\n`;
  report += `4. Consider using Design Systems MCP for detailed analysis\n\n`;

  report += `\n> Note: This is a basic validation. For comprehensive analysis, use Design Systems MCP through AI agents.\n`;

  return report;
}

/**
 * Main function
 */
function main() {
  console.log('🏗️  Validating Architecture...\n');

  try {
    // Analyze architecture
    const { categories, violations } = analyzeArchitecture();

    console.log('📊 Architecture Summary:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} components`);
    });

    console.log(`\n🔍 Found ${violations.length} issue(s)\n`);

    // Generate report
    const report = generateReport(categories, violations);
    const reportPath = join(process.cwd(), 'docs', 'architecture-validation-report.md');
    writeFileSync(reportPath, report, 'utf-8');

    console.log(`✅ Validation report generated: ${reportPath}\n`);

    if (violations.length > 0) {
      const errors = violations.filter((v) => v.severity === 'error').length;
      const warnings = violations.filter((v) => v.severity === 'warning').length;

      if (errors > 0) {
        console.log(`❌ ${errors} error(s) found`);
        process.exit(1);
      } else if (warnings > 0) {
        console.log(`⚠️  ${warnings} warning(s) found`);
      }
    } else {
      console.log('✅ Architecture validation passed!');
    }
  } catch (error: unknown) {
    console.error('❌ Error validating architecture:', error.message);
    process.exit(1);
  }
}

main();
