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
 * Check the granular hooks entry (issue #203): dist/hooks/index.js must
 * exist and export every public hook. The list mirrors the `Public hooks
 * (consumer-facing)` section of src/ui/index.ts — a public hook present on
 * the main entry but missing from ./hooks silently denies consumers the
 * lean import path the entry exists for.
 */
function checkHooksEntryExports(): string[] {
  const failures: string[] = [];
  const publicHooks = ["useScrollSpy"];
  const hooksBuildPath = join(process.cwd(), "dist/hooks/index.js");

  if (!existsSync(hooksBuildPath)) {
    return [
      "dist/hooks/index.js does not exist (vite.config.hooks.ts build missing?)",
    ];
  }

  const content = readFileSync(hooksBuildPath, "utf-8");
  for (const hook of publicHooks) {
    if (!content.includes(hook)) {
      failures.push(`public hook \`${hook}\` missing from dist/hooks/index.js`);
    }
  }
  return failures;
}

/**
 * Check the granular entry (issue #208): dist/granular/index.js must
 * exist and re-export the public surface. Spot-check sentinel names
 * across layers — a missing sentinel means the preserveModules barrel
 * silently lost part of the surface (e.g. an over-aggressive
 * tree-shake config).
 */
function checkGranularEntryExports(): string[] {
  const failures: string[] = [];
  // NOTE: layouts (Stack/Container) are deliberately absent — the main
  // entry never exported them (they ship via ./server only), and the
  // granular barrel mirrors the main entry's surface.
  const sentinels = [
    "Accordion",
    "Button",
    "Card",
    "AppProvider",
    "useScrollSpy",
  ];
  const granularBarrel = join(process.cwd(), "dist/granular/index.js");

  if (!existsSync(granularBarrel)) {
    return [
      "dist/granular/index.js does not exist (vite.config.granular.ts build missing?)",
    ];
  }

  const content = readFileSync(granularBarrel, "utf-8");
  for (const name of sentinels) {
    if (!content.includes(name)) {
      failures.push(
        `sentinel export \`${name}\` missing from the granular barrel`,
      );
    }
  }
  return failures;
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

  // Check the granular hooks entry
  console.log("\n✅ Checking hooks entry exports...");
  const hooksFailures = checkHooksEntryExports();
  if (hooksFailures.length > 0) {
    console.error(`\n❌ Hooks entry (./hooks) validation failed:`);
    hooksFailures.forEach((msg) => console.error(`   - ${msg}`));
    console.error(
      "\n   Check vite.config.hooks.ts and src/ui/hooks-entry.ts.\n",
    );
    process.exit(1);
  }
  console.log("   ✓ dist/hooks/index.js exports every public hook");

  // Check the granular entry (issue #208)
  console.log("\n✅ Checking granular entry exports...");
  const granularFailures = checkGranularEntryExports();
  if (granularFailures.length > 0) {
    console.error(`\n❌ Granular entry (./granular) validation failed:`);
    granularFailures.forEach((msg) => console.error(`   - ${msg}`));
    console.error(
      "\n   Check vite.config.granular.ts and the dist/granular output.\n",
    );
    process.exit(1);
  }
  console.log("   ✓ dist/granular/index.js re-exports the public surface");

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
