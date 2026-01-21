#!/usr/bin/env tsx
/**
 * Storybook Audit Script
 * 
 * Comprehensive audit of Storybook stories and MDX documentation:
 * - Maps all stories and MDX files
 * - Detects duplicates
 * - Identifies orphaned files
 * - Analyzes quality
 * - Checks dependencies
 * 
 * Usage: npm run audit:storybook
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';

interface StoryMetadata {
  path: string;
  relativePath: string;
  fileName: string;
  title?: string;
  componentName?: string;
  category?: string;
  hasPlayFunctions: boolean;
  hasDocumentation: boolean;
  hasEvents: boolean;
  hasStates: boolean;
  isDeprecated: boolean;
  isExperimental: boolean;
  componentExists: boolean;
  componentPath?: string;
  issues: string[];
}

interface MDXMetadata {
  path: string;
  relativePath: string;
  fileName: string;
  title?: string;
  category?: string;
  hasContent: boolean;
  isReferenced: boolean;
  references: string[];
  issues: string[];
}

interface AuditReport {
  generatedAt: string;
  stories: {
    total: number;
    withComponent: number;
    orphaned: number;
    duplicates: number;
    deprecated: number;
    experimental: number;
    issues: number;
  };
  mdx: {
    total: number;
    referenced: number;
    orphaned: number;
    duplicates: number;
    issues: number;
  };
  duplicates: {
    stories: Array<{ title: string; files: string[] }>;
    mdx: Array<{ title: string; files: string[] }>;
  };
  candidatesForRemoval: {
    stories: string[];
    mdx: string[];
  };
  details: {
    stories: StoryMetadata[];
    mdx: MDXMetadata[];
  };
}

/**
 * Find all story files
 */
function findStoryFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.storybook'].includes(entry.name)) {
        findStoryFiles(fullPath, files);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.stories.tsx') || entry.name.endsWith('.stories.ts'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Find all MDX files
 */
function findMDXFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.storybook'].includes(entry.name)) {
        findMDXFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract story metadata
 */
function analyzeStory(filePath: string, componentMap: Map<string, string>): StoryMetadata {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(process.cwd(), filePath);
  const fileName = basename(filePath);
  const issues: string[] = [];
  
  // Extract title from Meta or title property
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const metaTitleMatch = content.match(/<Meta\s+title=["']([^"']+)["']/);
  const title = titleMatch?.[1] || metaTitleMatch?.[1];
  
  // Extract component name from imports or title
  const componentImportMatch = content.match(/import\s+(?:\{[^}]*\})?\s*(\w+)\s+from\s+['"]\.\/(\w+)/);
  const componentName = componentImportMatch?.[2] || title?.split('/').pop();
  
  // Extract category from title or path
  const category = title?.split('/')[0] || 
    (filePath.includes('/atoms/') ? 'Atoms' :
     filePath.includes('/molecules/') ? 'Molecules' :
     filePath.includes('/organisms/') ? 'Organisms' :
     filePath.includes('/templates/') ? 'Templates' :
     filePath.includes('/patterns/') ? 'Patterns' :
     filePath.includes('/layouts/') ? 'Layouts' :
     filePath.includes('/utilities/') ? 'Utilities' :
     filePath.includes('/providers/') ? 'Providers' :
     filePath.includes('/extensions/') ? 'Extensions' :
     filePath.includes('/tools/') ? 'Tools' :
     filePath.includes('/playgrounds/') ? 'Playgrounds' :
     'Other');
  
  // Check for play functions
  const hasPlayFunctions = /play:\s*async|play:\s*\(/m.test(content);
  
  // Check for documentation
  const hasDocumentation = /description:|docs:|argTypes:/m.test(content);
  
  // Check for events
  const hasEvents = /argTypes:\s*\{[\s\S]*?on\w+:|### Events/m.test(content);
  
  // Check for states
  const hasStates = /### States|export const \w+State:/m.test(content);
  
  // Check if deprecated or experimental
  const isDeprecated = /@deprecated|deprecated|status:\s*['"]deprecated['"]/i.test(content);
  const isExperimental = /@experimental|experimental|status:\s*['"]experimental['"]/i.test(content);
  
  // Check if component exists
  let componentExists = false;
  let componentPath: string | undefined;
  
  if (componentName) {
    const componentDir = dirname(filePath);
    const possiblePaths = [
      join(componentDir, `${componentName}.tsx`),
      join(componentDir, `${componentName}.ts`),
      join(componentDir, 'index.tsx'),
      join(componentDir, 'index.ts'),
    ];
    
    for (const possiblePath of possiblePaths) {
      if (existsSync(possiblePath)) {
        componentExists = true;
        componentPath = relative(process.cwd(), possiblePath);
        break;
      }
    }
    
    // Also check component map
    if (!componentExists && componentMap.has(componentName)) {
      componentExists = true;
      componentPath = componentMap.get(componentName);
    }
  }
  
  // Identify issues
  if (!componentExists && !fileName.includes('Playground') && !fileName.includes('Builder')) {
    issues.push('Component not found');
  }
  
  if (!hasPlayFunctions && !hasStates) {
    issues.push('Missing play functions or state stories');
  }
  
  if (!hasDocumentation) {
    issues.push('Missing documentation');
  }
  
  if (!hasEvents) {
    issues.push('Missing events documentation');
  }
  
  if (isDeprecated) {
    issues.push('Component is deprecated');
  }
  
  if (isExperimental) {
    issues.push('Component is experimental');
  }
  
  return {
    path: filePath,
    relativePath,
    fileName,
    title,
    componentName,
    category,
    hasPlayFunctions,
    hasDocumentation,
    hasEvents,
    hasStates,
    isDeprecated,
    isExperimental,
    componentExists,
    componentPath,
    issues,
  };
}

/**
 * Analyze MDX file
 */
function analyzeMDX(filePath: string, allFiles: string[]): MDXMetadata {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(process.cwd(), filePath);
  const fileName = basename(filePath);
  const issues: string[] = [];
  
  // Extract title from Meta
  const metaTitleMatch = content.match(/<Meta\s+title=["']([^"']+)["']/);
  const title = metaTitleMatch?.[1];
  
  // Extract category from title or path
  const category = title?.split('/')[0] || 
    (filePath.includes('/docs/') ? 'Docs' : 'Other');
  
  // Check if has meaningful content
  const hasContent = content.trim().length > 200 && 
    !content.includes('TODO') && 
    !content.includes('PLACEHOLDER');
  
  // Check references (simple check for imports or links)
  const references: string[] = [];
  const importMatches = content.matchAll(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
  for (const match of importMatches) {
    references.push(match[1]);
  }
  
  // Check if referenced by other files
  let isReferenced = false;
  for (const otherFile of allFiles) {
    if (otherFile !== filePath) {
      const otherContent = readFileSync(otherFile, 'utf-8');
      if (otherContent.includes(fileName) || otherContent.includes(relativePath)) {
        isReferenced = true;
        break;
      }
    }
  }
  
  // Identify issues
  if (!hasContent) {
    issues.push('Empty or placeholder content');
  }
  
  if (!isReferenced && !fileName.includes('GettingStarted') && !fileName.includes('DesignSystem')) {
    issues.push('Not referenced by other files');
  }
  
  if (!title) {
    issues.push('Missing Meta title');
  }
  
  return {
    path: filePath,
    relativePath,
    fileName,
    title,
    category,
    hasContent,
    isReferenced,
    references,
    issues,
  };
}

/**
 * Build component map
 */
function buildComponentMap(srcDir: string): Map<string, string> {
  const map = new Map<string, string>();
  
  function scanDir(dir: string) {
    if (!existsSync(dir)) return;
    
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git', '.storybook'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        if (!entry.name.includes('.stories.') && !entry.name.includes('.test.')) {
          const name = basename(entry.name, '.tsx').replace('.ts', '');
          if (name !== 'index') {
            map.set(name, relative(process.cwd(), fullPath));
          }
        }
      }
    }
  }
  
  scanDir(srcDir);
  return map;
}

/**
 * Find duplicates
 */
function findDuplicates<T extends { title?: string; fileName: string }>(
  items: T[]
): Array<{ title: string; files: string[] }> {
  const duplicates: Array<{ title: string; files: string[] }> = [];
  const titleMap = new Map<string, string[]>();
  
  for (const item of items) {
    const key = item.title || item.fileName;
    if (!titleMap.has(key)) {
      titleMap.set(key, []);
    }
    titleMap.get(key)!.push(item.fileName);
  }
  
  for (const [title, files] of titleMap.entries()) {
    if (files.length > 1) {
      duplicates.push({ title, files });
    }
  }
  
  return duplicates;
}

/**
 * Generate audit report
 */
function generateReport(
  stories: StoryMetadata[],
  mdx: MDXMetadata[]
): AuditReport {
  const storyDuplicates = findDuplicates(stories);
  const mdxDuplicates = findDuplicates(mdx);
  
  const orphanedStories = stories.filter(s => !s.componentExists && s.issues.includes('Component not found'));
  const orphanedMDX = mdx.filter(m => !m.isReferenced && m.issues.includes('Not referenced by other files'));
  
  const candidatesForRemoval = {
    stories: [
      ...orphanedStories.map(s => s.relativePath),
      ...stories.filter(s => s.isDeprecated).map(s => s.relativePath),
      ...stories.filter(s => s.issues.length > 2).map(s => s.relativePath),
    ],
    mdx: [
      ...orphanedMDX.map(m => m.relativePath),
      ...mdx.filter(m => !m.hasContent).map(m => m.relativePath),
    ],
  };
  
  return {
    generatedAt: new Date().toISOString(),
    stories: {
      total: stories.length,
      withComponent: stories.filter(s => s.componentExists).length,
      orphaned: orphanedStories.length,
      duplicates: storyDuplicates.reduce((sum, d) => sum + d.files.length - 1, 0),
      deprecated: stories.filter(s => s.isDeprecated).length,
      experimental: stories.filter(s => s.isExperimental).length,
      issues: stories.filter(s => s.issues.length > 0).length,
    },
    mdx: {
      total: mdx.length,
      referenced: mdx.filter(m => m.isReferenced).length,
      orphaned: orphanedMDX.length,
      duplicates: mdxDuplicates.reduce((sum, d) => sum + d.files.length - 1, 0),
      issues: mdx.filter(m => m.issues.length > 0).length,
    },
    duplicates: {
      stories: storyDuplicates,
      mdx: mdxDuplicates,
    },
    candidatesForRemoval,
    details: {
      stories,
      mdx,
    },
  };
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report: AuditReport): string {
  let md = `# Storybook Audit Report\n\n`;
  md += `Generated at: ${report.generatedAt}\n\n`;
  
  md += `## Summary\n\n`;
  md += `### Stories\n`;
  md += `- **Total**: ${report.stories.total}\n`;
  md += `- **With Component**: ${report.stories.withComponent}\n`;
  md += `- **Orphaned**: ${report.stories.orphaned}\n`;
  md += `- **Duplicates**: ${report.stories.duplicates}\n`;
  md += `- **Deprecated**: ${report.stories.deprecated}\n`;
  md += `- **Experimental**: ${report.stories.experimental}\n`;
  md += `- **With Issues**: ${report.stories.issues}\n\n`;
  
  md += `### MDX Documents\n`;
  md += `- **Total**: ${report.mdx.total}\n`;
  md += `- **Referenced**: ${report.mdx.referenced}\n`;
  md += `- **Orphaned**: ${report.mdx.orphaned}\n`;
  md += `- **Duplicates**: ${report.mdx.duplicates}\n`;
  md += `- **With Issues**: ${report.mdx.issues}\n\n`;
  
  if (report.duplicates.stories.length > 0) {
    md += `## Duplicate Stories\n\n`;
    for (const dup of report.duplicates.stories) {
      md += `### ${dup.title}\n\n`;
      md += `Found in:\n`;
      for (const file of dup.files) {
        md += `- \`${file}\`\n`;
      }
      md += `\n`;
    }
  }
  
  if (report.duplicates.mdx.length > 0) {
    md += `## Duplicate MDX Documents\n\n`;
    for (const dup of report.duplicates.mdx) {
      md += `### ${dup.title || 'Untitled'}\n\n`;
      md += `Found in:\n`;
      for (const file of dup.files) {
        md += `- \`${file}\`\n`;
      }
      md += `\n`;
    }
  }
  
  if (report.candidatesForRemoval.stories.length > 0) {
    md += `## Stories Candidates for Removal\n\n`;
    for (const story of report.candidatesForRemoval.stories) {
      md += `- \`${story}\`\n`;
    }
    md += `\n`;
  }
  
  if (report.candidatesForRemoval.mdx.length > 0) {
    md += `## MDX Documents Candidates for Removal\n\n`;
    for (const mdx of report.candidatesForRemoval.mdx) {
      md += `- \`${mdx}\`\n`;
    }
    md += `\n`;
  }
  
  md += `## Detailed Analysis\n\n`;
  md += `### Stories with Issues\n\n`;
  const storiesWithIssues = report.details.stories.filter(s => s.issues.length > 0);
  for (const story of storiesWithIssues) {
    md += `#### ${story.fileName}\n`;
    md += `- **Path**: \`${story.relativePath}\`\n`;
    md += `- **Title**: ${story.title || 'N/A'}\n`;
    md += `- **Component**: ${story.componentName || 'N/A'}\n`;
    md += `- **Component Exists**: ${story.componentExists ? 'Yes' : 'No'}\n`;
    md += `- **Issues**:\n`;
    for (const issue of story.issues) {
      md += `  - ${issue}\n`;
    }
    md += `\n`;
  }
  
  md += `### MDX Documents with Issues\n\n`;
  const mdxWithIssues = report.details.mdx.filter(m => m.issues.length > 0);
  for (const mdx of mdxWithIssues) {
    md += `#### ${mdx.fileName}\n`;
    md += `- **Path**: \`${mdx.relativePath}\`\n`;
    md += `- **Title**: ${mdx.title || 'N/A'}\n`;
    md += `- **Referenced**: ${mdx.isReferenced ? 'Yes' : 'No'}\n`;
    md += `- **Issues**:\n`;
    for (const issue of mdx.issues) {
      md += `  - ${issue}\n`;
    }
    md += `\n`;
  }
  
  return md;
}

/**
 * Main function
 */
function main() {
  const srcDir = join(process.cwd(), 'src');
  const outputDir = join(process.cwd(), 'docs', 'audit');
  
  if (!existsSync(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    process.exit(1);
  }
  
  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('🔍 Building component map...\n');
  const componentMap = buildComponentMap(srcDir);
  console.log(`Found ${componentMap.size} components\n`);
  
  console.log('📚 Finding story files...\n');
  const storyFiles = findStoryFiles(srcDir);
  console.log(`Found ${storyFiles.length} story files\n`);
  
  console.log('📄 Finding MDX files...\n');
  const mdxFiles = findMDXFiles(srcDir);
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  console.log('🔬 Analyzing stories...\n');
  const stories = storyFiles.map(file => analyzeStory(file, componentMap));
  
  console.log('🔬 Analyzing MDX documents...\n');
  const mdx = mdxFiles.map(file => analyzeMDX(file, [...storyFiles, ...mdxFiles]));
  
  console.log('📊 Generating report...\n');
  const report = generateReport(stories, mdx);
  
  // Write JSON report
  const jsonPath = join(outputDir, 'storybook-audit-report.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ JSON report generated: ${jsonPath}`);
  
  // Write Markdown report
  const mdPath = join(outputDir, 'storybook-audit-report.md');
  const mdReport = generateMarkdownReport(report);
  writeFileSync(mdPath, mdReport, 'utf-8');
  console.log(`✅ Markdown report generated: ${mdPath}`);
  
  // Write candidates for removal
  const candidatesPath = join(outputDir, 'candidates-for-removal.md');
  let candidatesMd = `# Candidates for Removal\n\n`;
  candidatesMd += `Generated at: ${report.generatedAt}\n\n`;
  
  candidatesMd += `## Stories\n\n`;
  if (report.candidatesForRemoval.stories.length > 0) {
    for (const story of report.candidatesForRemoval.stories) {
      candidatesMd += `- \`${story}\`\n`;
    }
  } else {
    candidatesMd += `No stories identified for removal.\n`;
  }
  
  candidatesMd += `\n## MDX Documents\n\n`;
  if (report.candidatesForRemoval.mdx.length > 0) {
    for (const mdx of report.candidatesForRemoval.mdx) {
      candidatesMd += `- \`${mdx}\`\n`;
    }
  } else {
    candidatesMd += `No MDX documents identified for removal.\n`;
  }
  
  writeFileSync(candidatesPath, candidatesMd, 'utf-8');
  console.log(`✅ Candidates for removal generated: ${candidatesPath}`);
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Audit Summary:\n');
  console.log(`Stories: ${report.stories.total} total, ${report.stories.orphaned} orphaned, ${report.stories.duplicates} duplicates`);
  console.log(`MDX: ${report.mdx.total} total, ${report.mdx.orphaned} orphaned, ${report.mdx.duplicates} duplicates`);
  console.log(`\nCandidates for removal: ${report.candidatesForRemoval.stories.length} stories, ${report.candidatesForRemoval.mdx.length} MDX`);
  console.log('\n' + '='.repeat(80));
}

main();
