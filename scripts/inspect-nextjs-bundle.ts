#!/usr/bin/env tsx
/**
 * Inspect Next.js Bundle
 * 
 * This script inspects the Next.js bundle to understand the initialization issue.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const TEST_APP_DIR = join(process.cwd(), '.test-nextjs', 'nextjs-app');
const CHUNK_FILE = join(TEST_APP_DIR, '.next', 'server', 'chunks', '325.js');

function log(message: string) {
  console.log(`[inspect-nextjs-bundle] ${message}`);
}

function main() {
  log('Inspecting Next.js bundle...');
  
  if (!existsSync(CHUNK_FILE)) {
    log('❌ Chunk file not found. Run test:nextjs first.');
    process.exit(1);
  }
  
  try {
    const content = readFileSync(CHUNK_FILE, 'utf-8');
    
    // Look for initialization patterns
    const initPattern = /(?:const|let|var)\s+(\w+)\s*=/g;
    const accessPattern = /(\w+)\s*(?:\[|\.|\(|,|;|\s)/g;
    
    // Find variable declarations
    const declarations = new Set<string>();
    let match;
    
    while ((match = initPattern.exec(content)) !== null) {
      declarations.add(match[1]);
    }
    
    // Look for "aN" or similar minified variables
    const minifiedVars = Array.from(declarations).filter(v => /^[a-z][A-Z]?$/.test(v));
    
    log(`Found ${minifiedVars.length} minified variables`);
    log(`Sample: ${minifiedVars.slice(0, 10).join(', ')}`);
    
    // Look for the specific error pattern
    const errorLine = content.match(/Cannot access '[^']+' before initialization/);
    if (errorLine) {
      log(`Error pattern found: ${errorLine[0]}`);
    }
    
    // Extract relevant section around line 29760 (from error)
    const lines = content.split('\n');
    const targetLine = 29760;
    const start = Math.max(0, targetLine - 50);
    const end = Math.min(lines.length, targetLine + 50);
    
    log(`\nContext around error location (lines ${start}-${end}):`);
    console.log(lines.slice(start, end).join('\n'));
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`❌ Error: ${errorMessage}`);
    process.exit(1);
  }
}

main();
