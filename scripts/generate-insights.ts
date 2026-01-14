/**
 * Generate Insights Script
 * 
 * Generates insights about the design system.
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface Insights {
  totalComponents: number;
  componentsByCategory: Record<string, number>;
  totalStories: number;
  storiesWithInteractions: number;
  storiesWithAccessibility: number;
}

/**
 * Generate insights
 */
async function generateInsights(): Promise<Insights> {
  const rootDir = process.cwd();
  const srcPath = join(rootDir, 'src', 'ui');

  const insights: Insights = {
    totalComponents: 0,
    componentsByCategory: {},
    totalStories: 0,
    storiesWithInteractions: 0,
    storiesWithAccessibility: 0,
  };

  const categories = ['atoms', 'molecules', 'organisms', 'templates', 'patterns', 'layouts'];

  for (const category of categories) {
    const categoryPath = join(srcPath, category);
    try {
      const files = await readdir(categoryPath, { recursive: true });
      const components = files.filter((f) => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'));
      const stories = files.filter((f) => f.endsWith('.stories.tsx'));

      insights.totalComponents += components.length;
      insights.componentsByCategory[category] = components.length;
      insights.totalStories += stories.length;

      // Check stories for interactions and accessibility
      for (const story of stories) {
        const storyPath = join(categoryPath, story);
        const content = await readFile(storyPath, 'utf-8');
        
        if (content.includes('play:')) {
          insights.storiesWithInteractions++;
        }
        
        if (content.includes('a11y') || content.includes('accessibility')) {
          insights.storiesWithAccessibility++;
        }
      }
    } catch {
      continue;
    }
  }

  return insights;
}

/**
 * Main function
 */
async function main() {
  const insights = await generateInsights();

  console.log('Design System Insights:\n');
  console.log(`Total Components: ${insights.totalComponents}`);
  console.log('\nComponents by Category:');
  Object.entries(insights.componentsByCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  console.log(`\nTotal Stories: ${insights.totalStories}`);
  console.log(`Stories with Interactions: ${insights.storiesWithInteractions}`);
  console.log(`Stories with Accessibility: ${insights.storiesWithAccessibility}`);
}

if (require.main === module) {
  main().catch(console.error);
}
