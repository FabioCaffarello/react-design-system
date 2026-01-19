#!/usr/bin/env tsx
/**
 * Check Duplicates Script
 * 
 * Quickly checks for duplicate stories and MDX documents
 * 
 * Usage: npm run check:duplicates
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';

interface DuplicateInfo {
  title: string;
  files: string[];
  paths: string[];
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
 * Extract title from story file
 */
function extractStoryTitle(_filePath: string): string | null {
  try {
    const content = readFileSync(_filePath, 'utf-8');
    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    const metaTitleMatch = content.match(/<Meta\s+title=["']([^"']+)["']/);
    return titleMatch?.[1] || metaTitleMatch?.[1] || null;
  } catch {
    return null;
  }
}

/**
 * Extract title from MDX file
 */
function extractMDXTitle(_filePath: string): string | null {
  try {
    const content = readFileSync(_filePath, 'utf-8');
    const metaTitleMatch = content.match(/<Meta\s+title=["']([^"']+)["']/);
    return metaTitleMatch?.[1] || null;
  } catch {
    return null;
  }
}

/**
 * Find duplicates by title
 */
function findDuplicatesByTitle(
  files: string[],
  extractTitle: (file: string) => string | null
): DuplicateInfo[] {
  const titleMap = new Map<string, string[]>();
  
  for (const file of files) {
    const title = extractTitle(file);
    const key = title || basename(file);
    
    if (!titleMap.has(key)) {
      titleMap.set(key, []);
    }
    titleMap.get(key)!.push(file);
  }
  
  const duplicates: DuplicateInfo[] = [];
  
  for (const [title, fileList] of titleMap.entries()) {
    if (fileList.length > 1) {
      duplicates.push({
        title,
        files: fileList.map(f => basename(f)),
        paths: fileList,
      });
    }
  }
  
  return duplicates;
}

/**
 * Find duplicates by filename
 */
function findDuplicatesByFilename(files: string[]): DuplicateInfo[] {
  const nameMap = new Map<string, string[]>();
  
  for (const file of files) {
    const name = basename(file);
    
    if (!nameMap.has(name)) {
      nameMap.set(name, []);
    }
    nameMap.get(name)!.push(file);
  }
  
  const duplicates: DuplicateInfo[] = [];
  
  for (const [name, fileList] of nameMap.entries()) {
    if (fileList.length > 1) {
      duplicates.push({
        title: name,
        files: fileList.map(f => basename(f)),
        paths: fileList,
      });
    }
  }
  
  return duplicates;
}

/**
 * Main function
 */
function main() {
  const srcDir = join(process.cwd(), 'src');
  
  if (!existsSync(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    process.exit(1);
  }
  
  console.log('🔍 Checking for duplicates...\n');
  
  // Find story files
  const storyFiles = findStoryFiles(srcDir);
  console.log(`Found ${storyFiles.length} story files`);
  
  // Find MDX files
  const mdxFiles = findMDXFiles(srcDir);
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  // Check story duplicates by title
  const storyDuplicatesByTitle = findDuplicatesByTitle(storyFiles, extractStoryTitle);
  
  // Check story duplicates by filename
  const storyDuplicatesByFilename = findDuplicatesByFilename(storyFiles);
  
  // Check MDX duplicates by title
  const mdxDuplicatesByTitle = findDuplicatesByTitle(mdxFiles, extractMDXTitle);
  
  // Check MDX duplicates by filename
  const mdxDuplicatesByFilename = findDuplicatesByFilename(mdxFiles);
  
  // Report results
  let hasDuplicates = false;
  
  if (storyDuplicatesByTitle.length > 0) {
    hasDuplicates = true;
    console.log('❌ Story duplicates by title:\n');
    for (const dup of storyDuplicatesByTitle) {
      console.log(`  Title: "${dup.title}"`);
      for (const path of dup.paths) {
        console.log(`    - ${path}`);
      }
      console.log();
    }
  }
  
  if (storyDuplicatesByFilename.length > 0) {
    hasDuplicates = true;
    console.log('❌ Story duplicates by filename:\n');
    for (const dup of storyDuplicatesByFilename) {
      console.log(`  Filename: "${dup.title}"`);
      for (const path of dup.paths) {
        console.log(`    - ${path}`);
      }
      console.log();
    }
  }
  
  if (mdxDuplicatesByTitle.length > 0) {
    hasDuplicates = true;
    console.log('❌ MDX duplicates by title:\n');
    for (const dup of mdxDuplicatesByTitle) {
      console.log(`  Title: "${dup.title}"`);
      for (const path of dup.paths) {
        console.log(`    - ${path}`);
      }
      console.log();
    }
  }
  
  if (mdxDuplicatesByFilename.length > 0) {
    hasDuplicates = true;
    console.log('❌ MDX duplicates by filename:\n');
    for (const dup of mdxDuplicatesByFilename) {
      console.log(`  Filename: "${dup.title}"`);
      for (const path of dup.paths) {
        console.log(`    - ${path}`);
      }
      console.log();
    }
  }
  
  if (!hasDuplicates) {
    console.log('✅ No duplicates found!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Duplicates found. Please review and remove duplicates.\n');
    process.exit(1);
  }
}

main();
