#!/usr/bin/env tsx
/**
 * Generate Story Index
 * 
 * Generates an index of all stories in the design system for documentation purposes.
 * 
 * Usage: npm run generate-story-index
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface StoryInfo {
  title: string;
  file: string;
  category: string;
  component: string;
}

/**
 * Find all story files and extract metadata
 */
function findStories(dir: string, stories: StoryInfo[] = []): StoryInfo[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      findStories(fullPath, stories);
    } else if (entry.isFile() && entry.name.endsWith('.stories.tsx')) {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        
        // Extract title from meta
        const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
        const title = titleMatch ? titleMatch[1] : 'Unknown';
        
        // Extract category and component from title
        const [category, ...componentParts] = title.split('/');
        const component = componentParts.join('/');
        
        stories.push({
          title,
          file: fullPath.replace(process.cwd(), ''),
          category,
          component,
        });
      } catch (error) {
        console.warn(`Failed to parse ${fullPath}:`, error);
      }
    }
  }

  return stories;
}

/**
 * Generate markdown index
 */
function generateIndex(stories: StoryInfo[]): string {
  const byCategory = new Map<string, StoryInfo[]>();
  
  for (const story of stories) {
    if (!byCategory.has(story.category)) {
      byCategory.set(story.category, []);
    }
    byCategory.get(story.category)!.push(story);
  }

  const lines: string[] = [];
  lines.push('# Story Index');
  lines.push('');
  lines.push(`Generated on ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`Total stories: ${stories.length}`);
  lines.push('');

  // Sort categories
  const sortedCategories = Array.from(byCategory.keys()).sort();

  for (const category of sortedCategories) {
    const categoryStories = byCategory.get(category)!;
    lines.push(`## ${category}`);
    lines.push('');
    lines.push(`**${categoryStories.length} stories**`);
    lines.push('');

    // Sort stories within category
    categoryStories.sort((a, b) => a.component.localeCompare(b.component));

    for (const story of categoryStories) {
      lines.push(`- [${story.component}](${story.file})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  const srcDir = join(process.cwd(), 'src', 'ui');
  
  if (!existsSync(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    process.exit(1);
  }

  console.log('Finding stories...');
  const stories = findStories(srcDir);
  console.log(`Found ${stories.length} stories\n`);

  console.log('Generating index...');
  const index = generateIndex(stories);

  const outputPath = join(process.cwd(), 'docs', 'STORY_INDEX.md');
  writeFileSync(outputPath, index, 'utf-8');

  console.log(`\n✅ Story index generated at: ${outputPath}`);
}

// Run main function
main();

export { findStories, generateIndex };
