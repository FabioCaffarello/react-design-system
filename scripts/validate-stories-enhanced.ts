/**
 * Enhanced Story Validation Script
 * 
 * Validates stories with advanced checks.
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

const STORIES_DIR = join(process.cwd(), 'src');

interface ValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a story file
 */
async function validateStoryFile(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: filePath,
    errors: [],
    warnings: [],
  };

  try {
    const content = await readFile(filePath, 'utf-8');

    // Check for required imports
    if (!content.includes("import type { Meta, StoryObj }")) {
      result.errors.push('Missing required imports (Meta, StoryObj)');
    }

    // Check for meta export
    if (!content.includes('export default meta') && !content.includes('export default')) {
      result.errors.push('Missing default meta export');
    }

    // Check for title
    if (!content.includes('title:')) {
      result.errors.push('Missing title in meta');
    }

    // Check for component
    if (!content.includes('component:')) {
      result.errors.push('Missing component in meta');
    }

    // Check for autodocs tag
    if (!content.includes("tags: ['autodocs']") && !content.includes('tags: ["autodocs"]')) {
      result.warnings.push('Missing autodocs tag');
    }

    // Check for description
    if (!content.includes('description:')) {
      result.warnings.push('Missing description in docs');
    }

    // Check for Events table
    if (!content.includes('### Events')) {
      result.warnings.push('Missing Events documentation');
    }

    // Check for States table
    if (!content.includes('### States')) {
      result.warnings.push('Missing States documentation');
    }

    // Check for at least one story
    if (!content.includes('export const') || !content.match(/export const \w+: Story/)) {
      result.errors.push('No stories exported');
    }

    // Check for syntax errors (basic check)
    if (content.includes('await waitFor(() => {') && content.includes('await waitFor(() => {')) {
      const nestedAwaitMatch = content.match(/await waitFor\(\(\) => \{\s*await waitFor/);
      if (nestedAwaitMatch) {
        result.errors.push('Nested await waitFor detected (syntax error)');
      }
    }
  } catch (error) {
    result.errors.push(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Main function
 */
async function main() {
  console.log('Validating stories...\n');

  const storyFiles = await glob('**/*.stories.{ts,tsx}', {
    cwd: STORIES_DIR,
    absolute: true,
  });

  if (storyFiles.length === 0) {
    console.log('No story files found');
    return;
  }

  console.log(`Found ${storyFiles.length} story files\n`);

  const results: ValidationResult[] = [];

  for (const file of storyFiles) {
    const result = await validateStoryFile(file);
    results.push(result);
  }

  // Report results
  const filesWithErrors = results.filter((r) => r.errors.length > 0);
  const filesWithWarnings = results.filter((r) => r.warnings.length > 0);

  if (filesWithErrors.length === 0 && filesWithWarnings.length === 0) {
    console.log('✓ All stories are valid!\n');
    return;
  }

  if (filesWithErrors.length > 0) {
    console.log('❌ Files with errors:\n');
    filesWithErrors.forEach((result) => {
      console.log(`  ${result.file}`);
      result.errors.forEach((error) => {
        console.log(`    - ${error}`);
      });
      console.log();
    });
  }

  if (filesWithWarnings.length > 0) {
    console.log('⚠️  Files with warnings:\n');
    filesWithWarnings.forEach((result) => {
      console.log(`  ${result.file}`);
      result.warnings.forEach((warning) => {
        console.log(`    - ${warning}`);
      });
      console.log();
    });
  }

  if (filesWithErrors.length > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
