#!/usr/bin/env tsx
/**
 * Generate Component Registry
 * 
 * Generates a comprehensive registry of all components with metadata:
 * - Category (atoms, molecules, organisms, etc.)
 * - Dependencies
 * - Status
 * - Props
 * - Stories
 * 
 * Usage: npm run generate-component-registry
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

interface ComponentMetadata {
  name: string;
  category: string;
  path: string;
  file: string;
  dependencies: string[];
  props: PropInfo[];
  stories: string[];
  status: 'stable' | 'beta' | 'deprecated' | 'experimental';
  description?: string;
}

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

/**
 * Extract category from path
 */
function getCategory(path: string): string {
  if (path.includes('/atoms/')) return 'atoms';
  if (path.includes('/molecules/')) return 'molecules';
  if (path.includes('/organisms/')) return 'organisms';
  if (path.includes('/templates/')) return 'templates';
  if (path.includes('/patterns/')) return 'patterns';
  if (path.includes('/layouts/')) return 'layouts';
  if (path.includes('/utilities/')) return 'utilities';
  if (path.includes('/providers/')) return 'providers';
  if (path.includes('/extensions/')) return 'extensions';
  return 'unknown';
}

/**
 * Extract imports from file content
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match import statements
  const importRegex = /import\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Only include internal imports (from src/ui)
    if (importPath.startsWith('../') || importPath.startsWith('./') || importPath.startsWith('@/')) {
      imports.push(importPath);
    }
  }
  
  return imports;
}

/**
 * Extract component name from file
 */
function extractComponentName(filePath: string, content: string): string | null {
  // Try to find export default or named export
  const defaultExportMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
  if (defaultExportMatch) {
    return defaultExportMatch[1];
  }
  
  const namedExportMatch = content.match(/export\s+(?:function\s+)?(?:const\s+)?(\w+)/);
  if (namedExportMatch) {
    return namedExportMatch[1];
  }
  
  // Fallback to filename
  return basename(filePath, '.tsx');
}

/**
 * Extract props from TypeScript interface or type
 */
function extractProps(content: string): PropInfo[] {
  const props: PropInfo[] = [];
  
  // Match interface or type definitions
  const interfaceRegex = /(?:interface|type)\s+\w+Props\s*[={]\s*\{([^}]+)\}/s;
  const match = content.match(interfaceRegex);
  
  if (match) {
    const propsContent = match[1];
    // Simple extraction - can be enhanced
    const propRegex = /(\w+)(\??):\s*([^;]+);/g;
    let propMatch;
    
    while ((propMatch = propRegex.exec(propsContent)) !== null) {
      props.push({
        name: propMatch[1],
        type: propMatch[3].trim(),
        required: !propMatch[2],
      });
    }
  }
  
  return props;
}

/**
 * Find story files for a component
 */
function findStories(componentPath: string): string[] {
  const stories: string[] = [];
  const dir = dirname(componentPath);
  
  if (!existsSync(dir)) return stories;
  
  const files = readdirSync(dir);
  const componentName = basename(componentPath, '.tsx');
  
  files.forEach((file) => {
    if (file.includes('.stories.') && file.includes(componentName)) {
      stories.push(file);
    }
  });
  
  return stories;
}

/**
 * Determine component status from file content or path
 */
function determineStatus(content: string, path: string): ComponentMetadata['status'] {
  if (content.includes('@deprecated') || path.includes('deprecated')) {
    return 'deprecated';
  }
  if (content.includes('@beta') || path.includes('beta')) {
    return 'beta';
  }
  if (content.includes('@experimental') || path.includes('experimental')) {
    return 'experimental';
  }
  return 'stable';
}

/**
 * Find all component files
 */
function findComponentFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', 'dist', '.git', '.storybook'].includes(entry.name)) {
        findComponentFiles(fullPath, files);
      }
    } else if (entry.isFile()) {
      // Look for component files (not stories, tests, or index files)
      if (
        entry.name.endsWith('.tsx') &&
        !entry.name.includes('.stories.') &&
        !entry.name.includes('.test.') &&
        entry.name !== 'index.tsx' &&
        entry.name !== 'index.ts'
      ) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * Process a component file and extract metadata
 */
function processComponent(filePath: string): ComponentMetadata | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const category = getCategory(filePath);
    const componentName = extractComponentName(filePath, content);
    
    if (!componentName) {
      return null;
    }
    
    const imports = extractImports(content);
    const props = extractProps(content);
    const stories = findStories(filePath);
    const status = determineStatus(content, filePath);
    
    // Extract description from JSDoc
    const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
    const description = jsdocMatch ? jsdocMatch[1].trim() : undefined;
    
    return {
      name: componentName,
      category,
      path: filePath.replace(process.cwd(), ''),
      file: basename(filePath),
      dependencies: imports,
      props,
      stories,
      status,
      description,
    };
  } catch (error) {
    console.warn(`Failed to process ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate registry JSON
 */
function generateRegistry(components: ComponentMetadata[]): string {
  return JSON.stringify(
    {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalComponents: components.length,
      byCategory: components.reduce((acc, comp) => {
        if (!acc[comp.category]) {
          acc[comp.category] = [];
        }
        acc[comp.category].push(comp.name);
        return acc;
      }, {} as Record<string, string[]>),
      components: components.reduce((acc, comp) => {
        acc[comp.name] = {
          category: comp.category,
          path: comp.path,
          status: comp.status,
          description: comp.description,
          propsCount: comp.props.length,
          storiesCount: comp.stories.length,
          dependenciesCount: comp.dependencies.length,
        };
        return acc;
      }, {} as Record<string, any>),
      fullMetadata: components,
    },
    null,
    2
  );
}

/**
 * Generate registry markdown
 */
function generateRegistryMarkdown(components: ComponentMetadata[]): string {
  const byCategory = components.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, ComponentMetadata[]>);
  
  let markdown = `# Component Registry\n\n`;
  markdown += `Generated at: ${new Date().toISOString()}\n\n`;
  markdown += `Total Components: ${components.length}\n\n`;
  
  // Summary by category
  markdown += `## Summary by Category\n\n`;
  Object.entries(byCategory).forEach(([category, comps]) => {
    markdown += `- **${category}**: ${comps.length} components\n`;
  });
  
  markdown += `\n## Components by Category\n\n`;
  
  // Details by category
  Object.entries(byCategory).forEach(([category, comps]) => {
    markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${comps.length})\n\n`;
    
    comps.forEach((comp) => {
      markdown += `#### ${comp.name}\n\n`;
      markdown += `- **Status**: ${comp.status}\n`;
      markdown += `- **Path**: \`${comp.path}\`\n`;
      if (comp.description) {
        markdown += `- **Description**: ${comp.description}\n`;
      }
      markdown += `- **Props**: ${comp.props.length}\n`;
      markdown += `- **Stories**: ${comp.stories.length}\n`;
      markdown += `- **Dependencies**: ${comp.dependencies.length}\n`;
      
      if (comp.props.length > 0) {
        markdown += `\n**Props**:\n`;
        comp.props.forEach((prop) => {
          markdown += `- \`${prop.name}\`: ${prop.type}${prop.required ? ' (required)' : ' (optional)'}\n`;
        });
      }
      
      markdown += `\n`;
    });
  });
  
  return markdown;
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
  
  console.log('🔍 Finding component files...\n');
  const componentFiles = findComponentFiles(srcDir);
  console.log(`Found ${componentFiles.length} component files\n`);
  
  console.log('📝 Processing components...\n');
  const components: ComponentMetadata[] = [];
  
  for (const file of componentFiles) {
    const metadata = processComponent(file);
    if (metadata) {
      components.push(metadata);
      console.log(`  ✅ ${metadata.name} (${metadata.category})`);
    }
  }
  
  console.log(`\n✅ Processed ${components.length} components\n`);
  
  // Generate JSON registry
  const jsonRegistry = generateRegistry(components);
  const jsonPath = join(process.cwd(), 'docs', 'component-registry.json');
  writeFileSync(jsonPath, jsonRegistry, 'utf-8');
  console.log(`📄 JSON registry generated: ${jsonPath}`);
  
  // Generate Markdown registry
  const mdRegistry = generateRegistryMarkdown(components);
  const mdPath = join(process.cwd(), 'docs', 'component-registry.md');
  writeFileSync(mdPath, mdRegistry, 'utf-8');
  console.log(`📄 Markdown registry generated: ${mdPath}`);
  
  console.log('\n✅ Component registry generation completed');
}

main();
