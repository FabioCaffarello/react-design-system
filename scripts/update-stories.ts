/**
 * Update Stories Script
 * 
 * Updates existing stories when components change.
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';

/**
 * Find component and story pairs
 */
async function findComponentStoryPairs(dir: string): Promise<Array<{ component: string; story: string }>> {
  const pairs: Array<{ component: string; story: string }> = [];
  const categories = ['atoms', 'molecules', 'organisms', 'templates', 'patterns', 'layouts'];

  for (const category of categories) {
    const categoryPath = join(dir, 'src', 'ui', category);
    try {
      const files = await readdir(categoryPath, { recursive: true });
      
      for (const file of files) {
        if (file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.')) {
          const componentPath = join(categoryPath, file);
          const storyPath = componentPath.replace('.tsx', '.stories.tsx');
          
          try {
            await stat(storyPath);
            // Both exist, add to pairs
            pairs.push({
              component: componentPath,
              story: storyPath,
            });
          } catch {
            // Story doesn't exist, skip
          }
        }
      }
    } catch {
      continue;
    }
  }

  return pairs;
}

/**
 * Check if component was modified more recently than story
 */
async function needsUpdate(componentPath: string, storyPath: string): Promise<boolean> {
  try {
    const componentStat = await stat(componentPath);
    const storyStat = await stat(storyPath);

    return componentStat.mtime > storyStat.mtime;
  } catch {
    return false;
  }
}

/**
 * Update story file
 */
async function updateStory(componentPath: string, storyPath: string): Promise<void> {
  console.log(`Updating story: ${storyPath}`);
  
  // Read current story
  const storyContent = await readFile(storyPath, 'utf-8');
  
  // For now, just update the timestamp comment
  // In a full implementation, this would regenerate the story based on component changes
  const updatedContent = `// Updated: ${new Date().toISOString()}\n${storyContent}`;
  
  await writeFile(storyPath, updatedContent, 'utf-8');
}

/**
 * Main function
 */
async function main() {
  const rootDir = process.cwd();
  const pairs = await findComponentStoryPairs(rootDir);

  console.log(`Found ${pairs.length} component-story pairs\n`);

  let updated = 0;

  for (const { component, story } of pairs) {
    if (await needsUpdate(component, story)) {
      await updateStory(component, story);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} story files`);
}

if (require.main === module) {
  main().catch(console.error);
}
