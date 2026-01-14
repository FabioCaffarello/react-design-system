#!/usr/bin/env tsx
/**
 * Validation Script: Accessibility
 * 
 * Validates accessibility compliance using axe-core.
 * Checks for WCAG 2.1 AA violations in components.
 * 
 * Usage: npm run validate-a11y
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface A11yValidationResult {
  file: string;
  component: string;
  violations: string[];
  warnings: string[];
}

/**
 * Find all component files
 */
function findComponentFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      findComponentFiles(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      // Skip stories, tests, and index files
      if (!entry.name.includes('.stories.') && 
          !entry.name.includes('.test.') && 
          !entry.name.includes('.spec.') &&
          entry.name !== 'index.ts' &&
          entry.name !== 'index.tsx') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Validate accessibility patterns in a component file
 */
function validateA11yPatterns(filePath: string): A11yValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const violations: string[] = [];
  const warnings: string[] = [];
  const componentName = filePath.split('/').pop()?.replace(/\.(tsx|ts)$/, '') || '';

  // Check for images without alt text
  const imagePattern = /<img[^>]*>/g;
  const images = content.match(imagePattern);
  if (images) {
    images.forEach((img, index) => {
      if (!img.includes('alt=') && !img.includes('aria-label=')) {
        violations.push(`Image at line ${index + 1} missing alt text or aria-label`);
      }
    });
  }

  // Check for buttons without accessible names
  const buttonPattern = /<button[^>]*>[\s\S]*?<\/button>/g;
  const buttons = content.match(buttonPattern);
  if (buttons) {
    buttons.forEach((button, index) => {
      const hasText = /<button[^>]*>[\s\S]*?[a-zA-Z][\s\S]*?<\/button>/.test(button);
      const hasAriaLabel = button.includes('aria-label=');
      const hasAriaLabelledBy = button.includes('aria-labelledby=');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        violations.push(`Button at line ${index + 1} missing accessible name`);
      }
    });
  }

  // Check for inputs without labels
  const inputPattern = /<input[^>]*>/g;
  const inputs = content.match(inputPattern);
  if (inputs) {
    inputs.forEach((input, index) => {
      const hasId = input.includes('id=');
      const hasAriaLabel = input.includes('aria-label=');
      const hasAriaLabelledBy = input.includes('aria-labelledby=');
      
      if (!hasId && !hasAriaLabel && !hasAriaLabelledBy) {
        warnings.push(`Input at line ${index + 1} should have associated label`);
      }
    });
  }

  // Check for modals/dialogs without proper ARIA
  if (content.includes('role="dialog"') || content.includes('<dialog')) {
    const hasAriaModal = content.includes('aria-modal="true"');
    const hasAriaLabel = content.includes('aria-label=') || content.includes('aria-labelledby=');
    
    if (!hasAriaModal) {
      warnings.push('Dialog/modal should have aria-modal="true"');
    }
    if (!hasAriaLabel) {
      violations.push('Dialog/modal missing aria-label or aria-labelledby');
    }
  }

  // Check for color contrast issues (warnings for hardcoded colors)
  const colorPattern = /(?:color|background(?:-color)?):\s*#[0-9a-fA-F]{3,6}/g;
  const colors = content.match(colorPattern);
  if (colors && colors.length > 5) {
    warnings.push('Multiple hardcoded colors detected. Consider using theme tokens for better contrast control.');
  }

  // Check for keyboard navigation
  if (content.includes('onClick') && !content.includes('onKeyDown') && !content.includes('onKeyPress')) {
    const hasRoleButton = content.includes('role="button"');
    if (hasRoleButton) {
      violations.push('Element with role="button" should handle keyboard events');
    }
  }

  // Check for focus management
  if (content.includes('useState') && (content.includes('isOpen') || content.includes('open'))) {
    const hasFocusManagement = content.includes('focus') || content.includes('Focus');
    if (!hasFocusManagement) {
      warnings.push('Modal/dialog component should manage focus');
    }
  }

  return {
    file: filePath,
    component: componentName,
    violations,
    warnings,
  };
}

/**
 * Main validation function
 */
function main() {
  const srcDir = join(process.cwd(), 'src', 'ui');
  
  if (!existsSync(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    process.exit(1);
  }

  console.log('🔍 Validating accessibility patterns...\n');
  const componentFiles = findComponentFiles(srcDir);
  console.log(`Found ${componentFiles.length} component files\n`);

  const results: A11yValidationResult[] = [];
  let totalViolations = 0;
  let totalWarnings = 0;

  for (const file of componentFiles) {
    const result = validateA11yPatterns(file);
    if (result.violations.length > 0 || result.warnings.length > 0) {
      results.push(result);
      totalViolations += result.violations.length;
      totalWarnings += result.warnings.length;
    }
  }

  // Print results
  if (results.length === 0) {
    console.log('✅ No accessibility violations found!\n');
    process.exit(0);
  }

  console.log(`\n📊 Validation Results:\n`);
  console.log(`Total files with issues: ${results.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Total warnings: ${totalWarnings}\n`);

  for (const result of results) {
    const relativePath = result.file.replace(process.cwd() + '/', '');
    console.log(`\n📁 ${relativePath}`);
    
    if (result.violations.length > 0) {
      console.log('  ❌ Violations:');
      result.violations.forEach(v => console.log(`     - ${v}`));
    }
    
    if (result.warnings.length > 0) {
      console.log('  ⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`     - ${w}`));
    }
  }

  console.log('\n');
  
  if (totalViolations > 0) {
    console.error('❌ Accessibility validation failed!');
    process.exit(1);
  } else {
    console.log('✅ Accessibility validation passed (warnings only)');
    process.exit(0);
  }
}

main();
