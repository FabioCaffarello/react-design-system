/**
 * Generate Stories Script
 * 
 * Automatically generates stories for components that don't have them.
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { generateStoryFromConfig, getStoryFilePath } from '../src/ui/builders/StorybookIntegration';
import type { ComponentBuilderConfig } from '../src/ui/builders/types';

const UI_DIR = join(process.cwd(), 'src/ui');
const CATEGORIES = ['atoms', 'molecules', 'organisms', 'templates', 'patterns', 'layouts'] as const;

interface ComponentInfo {
  name: string;
  category: typeof CATEGORIES[number];
  path: string;
  hasStory: boolean;
}

/**
 * Get all components
 */
async function getAllComponents(): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];

  for (const category of CATEGORIES) {
    const categoryPath = join(UI_DIR, category);
    
    if (!existsSync(categoryPath)) continue;

    const entries = await readdir(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const componentName = entry.name;
      const componentPath = join(categoryPath, componentName);
      const storyPath = join(componentPath, `${componentName}.stories.tsx`);
      const componentFile = join(componentPath, `${componentName}.tsx`);

      if (!existsSync(componentFile)) continue;

      components.push({
        name: componentName,
        category,
        path: componentPath,
        hasStory: existsSync(storyPath),
      });
    }
  }

  return components;
}

/**
 * Generate story for component
 */
async function generateStoryForComponent(component: ComponentInfo): Promise<void> {
  const config: ComponentBuilderConfig = {
    name: component.name,
    category: component.category.slice(0, -1) as ComponentBuilderConfig['category'], // Remove 's' from plural
  };

  try {
    // Try to read component file to extract variants/sizes
    const componentPath = join(component.path, `${component.name}.tsx`);
    if (existsSync(componentPath)) {
      const content = await readFile(componentPath, 'utf-8');
      
      // Extract variants (simple regex - can be improved)
      const variantMatch = content.match(/variant.*?\[(.*?)\]/s);
      if (variantMatch) {
        const variants = variantMatch[1]
          .split(',')
          .map((v) => v.trim().replace(/['"]/g, ''))
          .filter(Boolean);
        if (variants.length > 0) {
          config.variants = variants;
        }
      }

      // Extract sizes
      const sizeMatch = content.match(/size.*?\[(.*?)\]/s);
      if (sizeMatch) {
        const sizes = sizeMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);
        if (sizes.length > 0) {
          config.sizes = sizes;
        }
      }
    }

    const storyCode = generateStoryFromConfig(config);
    const storyPath = getStoryFilePath(config);

    // Ensure directory exists
    const storyDir = dirname(storyPath);
    if (!existsSync(storyDir)) {
      await writeFile(storyPath, storyCode, 'utf-8');
    } else {
      await writeFile(storyPath, storyCode, 'utf-8');
    }

    console.log(`✓ Generated story for ${component.name}`);
  } catch (error) {
    console.error(`✗ Failed to generate story for ${component.name}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Generating stories for components without stories...\n');

  const components = await getAllComponents();
  const componentsWithoutStories = components.filter((c) => !c.hasStory);

  if (componentsWithoutStories.length === 0) {
    console.log('All components already have stories!');
    return;
  }

  console.log(`Found ${componentsWithoutStories.length} components without stories:\n`);

  for (const component of componentsWithoutStories) {
    console.log(`- ${component.category}/${component.name}`);
  }

  console.log('\nGenerating stories...\n');

  for (const component of componentsWithoutStories) {
    await generateStoryForComponent(component);
  }

  console.log(`\n✓ Generated ${componentsWithoutStories.length} stories`);
}

main().catch(console.error);
