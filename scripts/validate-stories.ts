#!/usr/bin/env tsx
/**
 * Validation Script: Stories Structure
 * 
 * Validates that all stories have:
 * - Events documented in argTypes
 * - States documented
 * - Play functions for interaction testing
 * 
 * Usage: npm run validate-stories
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  file: string;
  hasEvents: boolean;
  hasStates: boolean;
  hasPlayFunctions: boolean;
  errors: string[];
}

/**
 * Find all story files
 */
function findStoryFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      findStoryFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.stories.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Validate a single story file
 */
function validateStoryFile(filePath: string): ValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const errors: string[] = [];

  // Check for events in argTypes
  const hasEventsArgTypes = /argTypes:\s*\{[\s\S]*?on\w+:\s*\{[\s\S]*?action:/m.test(content);
  const hasEventsDocs = /### Events[\s\S]*?\|/m.test(content);
  const hasEvents = hasEventsArgTypes || hasEventsDocs;

  if (!hasEvents) {
    errors.push('Missing events documentation in argTypes or docs');
  }

  // Check for states documentation
  const hasStatesDocs = /### States[\s\S]*?\|/m.test(content);
  const hasStates = hasStatesDocs;

  if (!hasStates) {
    errors.push('Missing states documentation');
  }

  // Check for play functions
  const hasPlayFunctions = /play:\s*async/m.test(content);
  const hasStateStories = /export const \w+State:/m.test(content);

  if (!hasPlayFunctions && !hasStateStories) {
    errors.push('Missing play functions or state stories');
  }

  return {
    file: filePath,
    hasEvents,
    hasStates,
    hasPlayFunctions: hasPlayFunctions || hasStateStories,
    errors,
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

  console.log('Finding story files...');
  const storyFiles = findStoryFiles(srcDir);
  console.log(`Found ${storyFiles.length} story files\n`);

  const results: ValidationResult[] = [];
  let totalErrors = 0;

  for (const file of storyFiles) {
    const result = validateStoryFile(file);
    results.push(result);
    totalErrors += result.errors.length;
  }

  // Print results
  console.log('Validation Results:\n');
  console.log('='.repeat(80));

  const validFiles = results.filter((r) => r.errors.length === 0);
  const invalidFiles = results.filter((r) => r.errors.length > 0);

  console.log(`\n✅ Valid stories: ${validFiles.length}`);
  console.log(`❌ Invalid stories: ${invalidFiles.length}`);
  console.log(`📊 Total errors: ${totalErrors}\n`);

  if (invalidFiles.length > 0) {
    console.log('Invalid Stories:\n');
    for (const result of invalidFiles) {
      const relativePath = result.file.replace(process.cwd(), '');
      console.log(`\n${relativePath}`);
      for (const error of result.errors) {
        console.log(`  ❌ ${error}`);
      }
    }
  }

  // Summary statistics
  const stats = {
    total: results.length,
    withEvents: results.filter((r) => r.hasEvents).length,
    withStates: results.filter((r) => r.hasStates).length,
    withPlayFunctions: results.filter((r) => r.hasPlayFunctions).length,
  };

  console.log('\n' + '='.repeat(80));
  console.log('\nSummary Statistics:');
  console.log(`Total stories: ${stats.total}`);
  console.log(`With events: ${stats.withEvents} (${((stats.withEvents / stats.total) * 100).toFixed(1)}%)`);
  console.log(`With states: ${stats.withStates} (${((stats.withStates / stats.total) * 100).toFixed(1)}%)`);
  console.log(`With play functions: ${stats.withPlayFunctions} (${((stats.withPlayFunctions / stats.total) * 100).toFixed(1)}%)`);

  // Exit with error code if there are validation failures
  if (totalErrors > 0) {
    console.log('\n❌ Validation failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All stories are valid!');
    process.exit(0);
  }
}

// Run main function
main();

export { validateStoryFile, findStoryFiles };
