#!/usr/bin/env tsx
/**
 * Analyze Circular Dependencies
 * 
 * This script analyzes the codebase for circular dependencies and generates
 * a detailed report to help identify and fix initialization issues.
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const REPORT_DIR = join(process.cwd(), '.context', 'analysis');
const REPORT_FILE = join(REPORT_DIR, 'circular-deps-report.json');
const GRAPH_FILE = join(REPORT_DIR, 'deps-graph.svg');

interface CircularDep {
  path: string[];
  files: string[];
}

function log(message: string) {
  console.log(`[analyze-circular-deps] ${message}`);
}

function ensureReportDir() {
  if (!existsSync(REPORT_DIR)) {
    execSync(`mkdir -p "${REPORT_DIR}"`, { stdio: 'inherit' });
  }
}

function analyzeCircularDeps(): CircularDep[] {
  log('Analyzing circular dependencies...');
  
  try {
    const output = execSync(
      'npx madge --circular --json --extensions ts,tsx src/ui',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    const result = JSON.parse(output);
    return result || [];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // madge exits with code 1 when circular deps are found
    if (errorMessage.includes('circular')) {
      try {
        const output = execSync(
          'npx madge --circular --json --extensions ts,tsx src/ui 2>&1 || true',
          { encoding: 'utf-8', cwd: process.cwd() }
        );
        // Try to parse output even if command failed
        const lines = output.split('\n').filter(line => line.trim());
        const jsonLine = lines.find(line => line.startsWith('[') || line.startsWith('{'));
        if (jsonLine) {
          return JSON.parse(jsonLine);
        }
      } catch {
        // Ignore parse errors
      }
    }
    log(`Error analyzing: ${errorMessage}`);
    return [];
  }
}

function generateGraph() {
  log('Generating dependency graph...');
  
  try {
    execSync(
      `npx madge --image "${GRAPH_FILE}" --extensions ts,tsx src/ui`,
      { encoding: 'utf-8', cwd: process.cwd(), stdio: 'pipe' }
    );
    log(`Graph saved to: ${GRAPH_FILE}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Warning: Could not generate graph: ${errorMessage}`);
  }
}

function analyzeProviders() {
  log('Analyzing provider dependencies...');
  
  const providerFiles = [
    'src/ui/providers/AppProvider.tsx',
    'src/ui/providers/ThemeProvider.tsx',
    'src/ui/providers/ConfigProvider.tsx',
    'src/ui/providers/ToastProvider.tsx',
    'src/ui/providers/DialogProvider.tsx',
  ];
  
  const analysis: Record<string, string[]> = {};
  
  for (const file of providerFiles) {
    try {
      const output = execSync(
        `npx madge --json "${file}"`,
        { encoding: 'utf-8', cwd: process.cwd() }
      );
      const deps = JSON.parse(output);
      analysis[file] = Object.keys(deps);
    } catch {
      analysis[file] = [];
    }
  }
  
  return analysis;
}

function generateReport(circularDeps: CircularDep[], providerAnalysis: Record<string, string[]>) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCircularDeps: circularDeps.length,
      providerRelated: circularDeps.filter(dep => 
        dep.path.some(p => p.includes('providers'))
      ).length,
    },
    circularDependencies: circularDeps,
    providerAnalysis,
    recommendations: [] as string[],
  };
  
  // Add recommendations
  if (report.summary.providerRelated === 0) {
    report.recommendations.push(
      'No circular dependencies found in providers. The issue may be related to:',
      '1. Order of initialization during bundling',
      '2. Barrel exports creating implicit circular dependencies',
      '3. Code splitting breaking initialization order',
      '4. ESM/CommonJS interop issues'
    );
  } else {
    report.recommendations.push(
      'Circular dependencies found in providers. Consider:',
      '1. Breaking circular dependencies by extracting shared code',
      '2. Using dependency injection',
      '3. Restructuring provider hierarchy'
    );
  }
  
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report saved to: ${REPORT_FILE}`);
  
  return report;
}

function main() {
  log('Starting circular dependency analysis...');
  
  ensureReportDir();
  
  // Analyze circular dependencies
  const circularDeps = analyzeCircularDeps();
  
  // Generate graph
  generateGraph();
  
  // Analyze providers specifically
  const providerAnalysis = analyzeProviders();
  
  // Generate report
  const report = generateReport(circularDeps, providerAnalysis);
  
  // Print summary
  console.log('\n📊 Analysis Summary:');
  console.log(`   Total circular dependencies: ${report.summary.totalCircularDeps}`);
  console.log(`   Provider-related: ${report.summary.providerRelated}`);
  console.log(`\n📄 Full report: ${REPORT_FILE}`);
  console.log(`📈 Dependency graph: ${GRAPH_FILE}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  // Exit with error if circular deps found
  if (report.summary.totalCircularDeps > 0) {
    process.exit(1);
  }
  
  process.exit(0);
}

// Run main if this is the entry point
main();
