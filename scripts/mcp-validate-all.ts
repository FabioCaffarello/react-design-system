#!/usr/bin/env tsx
/**
 * Validate All - Comprehensive Validation
 * 
 * Runs all validations using MCPs:
 * - Architecture validation
 * - Component validation
 * - Metadata validation
 * 
 * Usage: npm run mcp:validate-all
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

const validations = [
  {
    name: 'Architecture Validation',
    script: 'mcp:validate-architecture',
  },
  {
    name: 'Standard Validations',
    script: 'validate:all',
  },
  {
    name: 'Component Registry',
    script: 'generate-component-registry',
  },
];

interface ValidationResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  output?: string;
  error?: string;
}

async function main() {
  console.log('✅ Comprehensive Validation - All Checks\n');

  const results: ValidationResult[] = [];

  for (const { name, script } of validations) {
    console.log(`🔍 ${name}...`);

    try {
      const output = execSync(`npm run ${script}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      });

      console.log(`   ✅ Passed\n`);
      results.push({
        name,
        status: 'passed',
        output,
      });
    } catch (error: unknown) {
      console.error(`   ❌ Failed\n`);
      results.push({
        name,
        status: 'failed',
        error: error.message,
        output: error.stdout || error.stderr,
      });
    }
  }

  // Generate report
  const report = generateReport(results);
  const reportPath = join(process.cwd(), 'docs', 'validation-report.md');
  writeFileSync(reportPath, report, 'utf-8');

  console.log('📊 Summary:');
  const passed = results.filter((r) => r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n📄 Report: ${reportPath}`);

  if (failed > 0) {
    process.exit(1);
  }
}

function generateReport(results: ValidationResult[]): string {
  let report = '# Comprehensive Validation Report\n\n';
  report += `Generated at: ${new Date().toISOString()}\n\n`;

  results.forEach((result) => {
    report += `## ${result.name}\n\n`;
    report += `**Status**: ${result.status === 'passed' ? '✅ Passed' : '❌ Failed'}\n\n`;

    if (result.error) {
      report += `**Error**:\n\`\`\`\n${result.error}\n\`\`\`\n\n`;
    }

    if (result.output) {
      report += `**Output**:\n\`\`\`\n${result.output.slice(0, 500)}\n\`\`\`\n\n`;
    }
  });

  return report;
}

main();
