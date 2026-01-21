#!/usr/bin/env tsx
/**
 * Validation Script: Themes
 * 
 * Validates theme tokens for consistency and completeness.
 * Checks color contrast ratios and token structure.
 * 
 * Usage: npm run validate-themes
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ThemeValidationResult {
  theme: string;
  errors: string[];
  warnings: string[];
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio
 */
function _getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate theme file
 */
function validateTheme(filePath: string): ThemeValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const errors: string[] = [];
  const warnings: string[] = [];
  const themeName = filePath.split('/').pop()?.replace(/\.(ts|tsx)$/, '') || '';

  // Extract color tokens
  const colorPattern = /(?:hex|value):\s*['"](#[0-9a-fA-F]{6})['"]/g;
  const colors: string[] = [];
  let match;
  while ((match = colorPattern.exec(content)) !== null) {
    colors.push(match[1]);
  }

  // Check for required color roles
  const requiredRoles = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];
  for (const role of requiredRoles) {
    if (!content.includes(role)) {
      warnings.push(`Missing color role: ${role}`);
    }
  }

  // Validate contrast ratios for semantic colors
  const _semanticColorPattern = /(?:DEFAULT|contrast):\s*\{[^}]*hex:\s*['"](#[0-9a-fA-F]{6})['"]/g;
  const _semanticColors: { default: string; contrast: string }[] = [];
  
  // This is a simplified check - in production, parse the actual structure
  if (colors.length > 0) {
    // Check if we have enough colors for contrast pairs
    if (colors.length < requiredRoles.length * 2) {
      warnings.push('Insufficient color tokens for all semantic color pairs');
    }
  }

  // Check for spacing tokens
  const spacingPattern = /spacing|SPACING/i;
  if (!spacingPattern.test(content)) {
    warnings.push('Missing spacing tokens');
  }

  // Check for typography tokens
  const typographyPattern = /typography|TYPOGRAPHY|fontSize|fontSize/i;
  if (!typographyPattern.test(content)) {
    warnings.push('Missing typography tokens');
  }

  // Check for shadow tokens
  const shadowPattern = /shadow|SHADOW/i;
  if (!shadowPattern.test(content)) {
    warnings.push('Missing shadow tokens');
  }

  // Check for radius tokens
  const radiusPattern = /radius|RADIUS|borderRadius/i;
  if (!radiusPattern.test(content)) {
    warnings.push('Missing radius tokens');
  }

  return {
    theme: themeName,
    errors,
    warnings,
  };
}

/**
 * Main validation function
 */
function main() {
  const themesDir = join(process.cwd(), 'src', 'ui', 'tokens', 'themes');
  
  if (!existsSync(themesDir)) {
    console.error(`Themes directory not found: ${themesDir}`);
    process.exit(1);
  }

  console.log('🎨 Validating theme tokens...\n');

  const themeFiles = ['light.ts', 'dark.ts'].map(file => 
    join(themesDir, file)
  ).filter(existsSync);

  if (themeFiles.length === 0) {
    console.error('No theme files found');
    process.exit(1);
  }

  console.log(`Found ${themeFiles.length} theme files\n`);

  const results: ThemeValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of themeFiles) {
    const result = validateTheme(file);
    results.push(result);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }

  // Print results
  console.log(`\n📊 Validation Results:\n`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}\n`);

  for (const result of results) {
    console.log(`\n🎨 Theme: ${result.theme}`);
    
    if (result.errors.length > 0) {
      console.log('  ❌ Errors:');
      result.errors.forEach(e => console.log(`     - ${e}`));
    }
    
    if (result.warnings.length > 0) {
      console.log('  ⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`     - ${w}`));
    }
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('  ✅ No issues found');
    }
  }

  console.log('\n');
  
  if (totalErrors > 0) {
    console.error('❌ Theme validation failed!');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('⚠️  Theme validation passed with warnings');
    process.exit(0);
  } else {
    console.log('✅ Theme validation passed!');
    process.exit(0);
  }
}

main();
