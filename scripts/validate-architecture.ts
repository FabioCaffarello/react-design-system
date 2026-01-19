#!/usr/bin/env tsx
/**
 * Validation Script: Component Architecture
 * 
 * Validates that components are correctly categorized according to the architecture:
 * - atoms/ - Basic indivisible components
 * - molecules/ - Combinations of atoms
 * - organisms/ - Complex components
 * - templates/ - Complete page layouts
 * - patterns/ - Design patterns
 * - layouts/ - Structure components
 * - utilities/ - Utility components
 * 
 * Usage: npm run validate-architecture
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface ComponentInfo {
  path: string;
  category: string;
  name: string;
  imports: string[];
  issues: string[];
}

/**
 * Find all component files
 */
function findComponentFiles(dir: string, category: string, files: ComponentInfo[] = []): ComponentInfo[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('__')) {
      // Check if it's a component directory
      const componentName = entry.name;
      const componentFile = join(fullPath, `${componentName}.tsx`);
      
      if (existsSync(componentFile)) {
        const content = readFileSync(componentFile, 'utf-8');
        const imports = extractImports(content, category);
        
        files.push({
          path: componentFile,
          category,
          name: componentName,
          imports,
          issues: [],
        });
      }
      
      // Recursively search subdirectories
      findComponentFiles(fullPath, category, files);
    }
  }

  return files;
}

/**
 * Extract imports from component file
 */
function extractImports(content: string, _currentCategory: string): string[] {
  const imports: string[] = [];
  
  // Match import statements
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Check if it's importing from design system (direct paths or index files)
    if (importPath.includes('../atoms') || importPath.includes('../molecules') || 
        importPath.includes('../organisms') || importPath.includes('../templates') ||
        importPath.includes('../patterns') || importPath.includes('../layouts')) {
      imports.push(importPath);
    }
  }
  
  return imports;
}

/**
 * Validate component architecture rules
 */
function validateComponent(component: ComponentInfo, _allComponents: ComponentInfo[]): string[] {
  const issues: string[] = [];
  const { category, imports } = component;

  // Rule 1: Atoms should not import other atoms/molecules/organisms
  if (category === 'atoms') {
    const invalidImports = imports.filter((imp) => 
      imp.includes('../atoms') || 
      imp.includes('../molecules') || 
      imp.includes('../organisms')
    );
    if (invalidImports.length > 0) {
      issues.push(`Atoms should not import other components. Found: ${invalidImports.join(', ')}`);
    }
  }

  // Rule 2: Molecules should only import atoms
  if (category === 'molecules') {
    const invalidImports = imports.filter((imp) => 
      imp.includes('../molecules') || 
      imp.includes('../organisms')
    );
    if (invalidImports.length > 0) {
      issues.push(`Molecules should only import atoms. Found: ${invalidImports.join(', ')}`);
    }
  }

  // Rule 3: Organisms can import molecules and atoms
  // (No restrictions, this is allowed)

  // Rule 4: Templates should import organisms, molecules, and atoms
  if (category === 'templates') {
    const hasOrganisms = imports.some((imp) => 
      imp.includes('../organisms')
    );
    if (!hasOrganisms) {
      issues.push('Templates should import at least one organism');
    }
  }

  // Rule 5: Patterns should combine multiple components
  if (category === 'patterns') {
    const componentImports = imports.filter((imp) => 
      imp.includes('../atoms') || 
      imp.includes('../molecules') || 
      imp.includes('../organisms')
    );
    if (componentImports.length < 2) {
      issues.push('Patterns should combine at least 2 components');
    }
  }

  // Rule 6: Layouts should not import business logic components
  if (category === 'layouts') {
    const invalidImports = imports.filter((imp) => 
      imp.includes('../organisms/') && 
      !imp.includes('Table') && // Allow Table for structure
      !imp.includes('SideNavbar') // Allow SideNavbar for structure
    );
    if (invalidImports.length > 0) {
      issues.push(`Layouts should focus on structure. Found business logic: ${invalidImports.join(', ')}`);
    }
  }

  return issues;
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

  const categories = ['atoms', 'molecules', 'organisms', 'templates', 'patterns', 'layouts', 'utilities'];
  const allComponents: ComponentInfo[] = [];

  console.log('Finding components...');
  
  for (const category of categories) {
    const categoryDir = join(srcDir, category);
    if (existsSync(categoryDir)) {
      const components = findComponentFiles(categoryDir, category);
      allComponents.push(...components);
      console.log(`  ${category}: ${components.length} components`);
    }
  }

  console.log(`\nTotal components: ${allComponents.length}\n`);

  // Validate each component
  let totalIssues = 0;
  const componentsWithIssues: ComponentInfo[] = [];

  for (const component of allComponents) {
    const issues = validateComponent(component, allComponents);
    component.issues = issues;
    totalIssues += issues.length;
    
    if (issues.length > 0) {
      componentsWithIssues.push(component);
    }
  }

  // Print results
  console.log('Validation Results:\n');
  console.log('='.repeat(80));

  if (componentsWithIssues.length === 0) {
    console.log('\n✅ All components follow architecture rules!');
  } else {
    console.log(`\n❌ Found ${totalIssues} architecture issues in ${componentsWithIssues.length} components:\n`);
    
    for (const component of componentsWithIssues) {
      const relativePath = component.path.replace(process.cwd(), '');
      console.log(`\n${relativePath}`);
      for (const issue of component.issues) {
        console.log(`  ❌ ${issue}`);
      }
    }
  }

  // Exit with error code if there are issues
  if (totalIssues > 0) {
    console.log('\n❌ Architecture validation failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('\n✅ Architecture validation passed!');
    process.exit(0);
  }
}

// Run main function
main();

export { validateComponent, findComponentFiles };
