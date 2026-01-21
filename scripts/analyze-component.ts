#!/usr/bin/env tsx
/**
 * Analyze Component
 * 
 * Analyzes a component and provides recommendations for evolution
 * 
 * Usage: tsx scripts/analyze-component.ts <component-path>
 * Example: tsx scripts/analyze-component.ts src/ui/atoms/Button/Button.tsx
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';

interface AnalysisResult {
  component: string;
  hasTests: boolean;
  hasStories: boolean;
  hasE2E: boolean;
  hasMemo: boolean;
  hasForwardRef: boolean;
  hasAccessibility: boolean;
  hasJSDoc: boolean;
  recommendations: string[];
  score: number;
}

function analyzeComponent(componentPath: string): AnalysisResult {
  const fullPath = join(process.cwd(), componentPath);
  
  if (!existsSync(fullPath)) {
    throw new Error(`Component file not found: ${fullPath}`);
  }

  const content = readFileSync(fullPath, 'utf-8');
  const componentName = basename(componentPath, '.tsx');
  const componentDir = dirname(componentPath);
  
  // Check for test file
  const testPath = join(componentDir, `${componentName}.test.tsx`);
  const hasTests = existsSync(join(process.cwd(), testPath));
  
  // Check for stories file
  const storiesPath = join(componentDir, `${componentName}.stories.tsx`);
  const hasStories = existsSync(join(process.cwd(), storiesPath));
  
  // Check for E2E tests
  const e2ePath = join(process.cwd(), 'tests/e2e', `${componentName.toLowerCase()}.spec.ts`);
  const hasE2E = existsSync(e2ePath);
  
  // Analyze code
  const hasMemo = /React\.memo|memo\(/i.test(content);
  const hasForwardRef = /forwardRef/i.test(content);
  const hasAccessibility = /aria-|role=|tabIndex/i.test(content);
  const hasJSDoc = /\/\*\*[\s\S]*?\*\//.test(content);
  
  const recommendations: string[] = [];
  let score = 0;
  
  // Scoring
  if (hasTests) {
    score += 20;
  } else {
    recommendations.push('Add unit tests (*.test.tsx)');
  }
  
  if (hasStories) {
    score += 20;
  } else {
    recommendations.push('Add Storybook stories (*.stories.tsx)');
  }
  
  if (hasE2E) {
    score += 15;
  } else {
    recommendations.push('Add E2E tests (tests/e2e/*.spec.ts)');
  }
  
  if (hasMemo) {
    score += 10;
  } else {
    recommendations.push('Consider using React.memo for performance');
  }
  
  if (hasForwardRef) {
    score += 10;
  } else {
    recommendations.push('Consider using forwardRef for ref forwarding');
  }
  
  if (hasAccessibility) {
    score += 15;
  } else {
    recommendations.push('Add ARIA attributes for accessibility');
  }
  
  if (hasJSDoc) {
    score += 10;
  } else {
    recommendations.push('Add JSDoc documentation');
  }
  
  // Check for useMemo/useCallback
  const hasUseMemo = /useMemo/i.test(content);
  const hasUseCallback = /useCallback/i.test(content);
  
  if (!hasUseMemo && content.includes('const') && content.includes('=')) {
    recommendations.push('Consider using useMemo for computed values');
  }
  
  if (!hasUseCallback && content.includes('onClick') || content.includes('onChange')) {
    recommendations.push('Consider using useCallback for event handlers');
  }
  
  return {
    component: componentName,
    hasTests,
    hasStories,
    hasE2E,
    hasMemo,
    hasForwardRef,
    hasAccessibility,
    hasJSDoc,
    recommendations,
    score,
  };
}

function main() {
  const componentPath = process.argv[2];
  
  if (!componentPath) {
    console.error('Usage: tsx scripts/analyze-component.ts <component-path>');
    console.error('Example: tsx scripts/analyze-component.ts src/ui/atoms/Button/Button.tsx');
    process.exit(1);
  }
  
  try {
    const result = analyzeComponent(componentPath);
    
    console.log(`\n📊 Analysis: ${result.component}\n`);
    console.log('✅ Features:');
    console.log(`   Tests: ${result.hasTests ? '✅' : '❌'}`);
    console.log(`   Stories: ${result.hasStories ? '✅' : '❌'}`);
    console.log(`   E2E: ${result.hasE2E ? '✅' : '❌'}`);
    console.log(`   React.memo: ${result.hasMemo ? '✅' : '❌'}`);
    console.log(`   forwardRef: ${result.hasForwardRef ? '✅' : '❌'}`);
    console.log(`   Accessibility: ${result.hasAccessibility ? '✅' : '❌'}`);
    console.log(`   JSDoc: ${result.hasJSDoc ? '✅' : '❌'}`);
    
    console.log(`\n📈 Score: ${result.score}/100\n`);
    
    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      result.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    } else {
      console.log('🎉 Component is well-evolved!');
    }
    
    console.log('');
  } catch (error: unknown) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
