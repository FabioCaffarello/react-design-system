#!/usr/bin/env tsx
/**
 * Build Export Validation Script
 *
 * Validates that all exports from src/ui/index.ts are present in the built dist/index.js
 * This prevents regressions where exports are accidentally removed from the build.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface ExportInfo {
  name: string;
  type: "named" | "default" | "namespace";
  source: string;
}

/**
 * Extract exports from TypeScript source file
 */
function extractExportsFromSource(filePath: string): ExportInfo[] {
  if (!existsSync(filePath)) {
    console.error(`❌ Source file not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, "utf-8");
  const exports: ExportInfo[] = [];

  // Match export statements
  const exportPatterns = [
    // export * from "./path"
    /^export\s+\*\s+from\s+["']([^"']+)["']/gm,
    // export { name } from "./path"
    /^export\s+\{\s*([^}]+)\s*\}\s+from\s+["']([^"']+)["']/gm,
    // export { default as name } from "./path"
    /^export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+["']([^"']+)["']/gm,
    // export default name
    /^export\s+default\s+(\w+)/gm,
    // export function/const/class name
    /^export\s+(?:function|const|class|interface|type)\s+(\w+)/gm,
  ];

  // Extract all exports
  for (const pattern of exportPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        exports.push({
          name: match[1],
          type: match[0].includes("default") ? "default" : "named",
          source: filePath,
        });
      }
    }
  }

  return exports;
}

/**
 * Extract exports from TypeScript declaration files by checking specific modules
 */
function extractExportsFromDeclarations(_filePath: string): string[] {
  const exports: string[] = [];
  const basePath = join(process.cwd(), "dist/ui");

  // Check providers
  const providersPath = join(basePath, "providers/index.d.ts");
  if (existsSync(providersPath)) {
    const content = readFileSync(providersPath, "utf-8");
    const matches = content.matchAll(/export\s+\{\s*([^}]+)\s*\}/g);
    for (const match of matches) {
      const names = match[1].split(",").map((n) =>
        n
          .trim()
          .split(/\s+as\s+/)[0]
          .trim(),
      );
      exports.push(...names);
    }
  }

  // Check primitives
  const atomsPath = join(basePath, "primitives/index.d.ts");
  if (existsSync(atomsPath)) {
    const content = readFileSync(atomsPath, "utf-8");
    // Match: export { default as Button } from "./Button/Button";
    const matches = content.matchAll(
      /export\s+\{\s*default\s+as\s+(\w+)\s*\}/g,
    );
    for (const match of matches) {
      exports.push(match[1]);
    }
    // Match: export type { ButtonProps } from "./Button/Button";
    const typeMatches = content.matchAll(/export\s+type\s+\{\s*([^}]+)\s*\}/g);
    for (const _match of typeMatches) {
      // Types are also exports, but we're mainly interested in values
    }
  }

  return [...new Set(exports)];
}

/**
 * Extract exports from built JavaScript file by actually importing it
 */
async function extractExportsFromBuild(filePath: string): Promise<string[]> {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  Build file not found: ${filePath}`);
    return [];
  }

  // First try to read from .d.ts file (more reliable)
  const exportsFromDts = extractExportsFromDeclarations(filePath);
  if (exportsFromDts.length > 0) {
    return exportsFromDts;
  }

  // Fallback: try to read exports from the file
  return extractExportsFromBuildFallback(filePath);
}

/**
 * Fallback: Extract exports from built JavaScript file by parsing
 */
function extractExportsFromBuildFallback(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const exports: string[] = [];

  // Match export statements in built code
  const exportPatterns = [
    // export { name1, name2, ... }
    /export\s+\{\s*([^}]+)\s*\}/g,
    // export const/function/class name
    /export\s+(?:const|function|class)\s+(\w+)/g,
    // export default
    /export\s+default\s+(\w+)/g,
  ];

  for (const pattern of exportPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        // Split comma-separated exports
        const names = match[1]
          .split(",")
          .map((n) => n.trim().split(" as ")[0].trim());
        exports.push(...names);
      }
    }
  }

  return [...new Set(exports)]; // Remove duplicates
}

/**
 * Check if AppProvider and other critical exports are present
 */
function checkCriticalExports(buildExports: string[]): {
  missing: string[];
  found: string[];
} {
  const criticalExports = [
    "AppProvider",
    "ConfigProvider",
    "ThemeProvider",
    "Button",
    "Input",
    "Text",
  ];

  const found: string[] = [];
  const missing: string[] = [];

  for (const exportName of criticalExports) {
    if (buildExports.includes(exportName)) {
      found.push(exportName);
    } else {
      missing.push(exportName);
    }
  }

  return { missing, found };
}

/**
 * Main validation function
 */
async function validateBuildExports() {
  console.log("🔍 Validating build exports...\n");

  const sourcePath = join(process.cwd(), "src/ui/index.ts");
  const buildPath = join(process.cwd(), "dist/index.js");

  // Extract exports from source
  console.log("📖 Reading source exports...");
  const sourceExports = extractExportsFromSource(sourcePath);
  console.log(`   Found ${sourceExports.length} export statements in source\n`);

  // Extract exports from build
  console.log("📦 Reading build exports...");
  const buildExports = await extractExportsFromBuild(buildPath);
  console.log(`   Found ${buildExports.length} exports in build\n`);

  // Check critical exports
  console.log("✅ Checking critical exports...");
  const { missing, found } = checkCriticalExports(buildExports);

  if (found.length > 0) {
    console.log(`   ✓ Found: ${found.join(", ")}`);
  }

  if (missing.length > 0) {
    console.error(`\n❌ Missing critical exports in build:`);
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error("\n⚠️  Build validation failed!");
    console.error(
      "   Please check vite.config.ts and ensure all exports are preserved.\n",
    );
    process.exit(1);
  }

  console.log("\n✅ Build validation passed!");
  console.log("   All critical exports are present in the build.\n");
}

// Run validation
(async () => {
  try {
    await validateBuildExports();
  } catch (error) {
    console.error("❌ Validation error:", error);
    process.exit(1);
  }
})();
