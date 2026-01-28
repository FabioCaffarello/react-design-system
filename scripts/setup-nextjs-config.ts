#!/usr/bin/env tsx
/**
 * Setup Next.js Configuration
 *
 * This script helps consumers set up the Next.js configuration
 * to work correctly with the design system.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";

const NEXT_CONFIG_PATH = "next.config.js";
const NEXT_CONFIG_MJS_PATH = "next.config.mjs";
const NEXT_CONFIG_TS_PATH = "next.config.ts";

function log(message: string) {
  console.log(`[setup-nextjs-config] ${message}`);
}

function findNextConfig(): string | null {
  if (existsSync(NEXT_CONFIG_TS_PATH)) return NEXT_CONFIG_TS_PATH;
  if (existsSync(NEXT_CONFIG_MJS_PATH)) return NEXT_CONFIG_MJS_PATH;
  if (existsSync(NEXT_CONFIG_PATH)) return NEXT_CONFIG_PATH;
  return null;
}

function generateWebpackConfig(): string {
  return `
  webpack: (config, { isServer }) => {
    // Force design system providers into a single chunk
    // This prevents code splitting that breaks initialization order
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          designSystemProviders: {
            test: /[\\\\/]node_modules[\\\\/]@fabio\\.caffarello[\\\\/]react-design-system[\\\\/].*providers/,
            name: 'design-system-providers',
            chunks: 'all',
            enforce: true,
            priority: 20, // High priority to ensure it's created
          },
        },
      },
    };
    
    // Use deterministic module IDs to ensure consistent builds
    config.optimization.moduleIds = 'deterministic';
    
    return config;
  },`;
}

function main() {
  log("Setting up Next.js configuration for design system...");

  const configPath = findNextConfig();

  if (!configPath) {
    log("❌ Next.js config file not found.");
    log("   Please create next.config.js, next.config.mjs, or next.config.ts");
    log("   Then run this script again.");
    process.exit(1);
  }

  log(`Found config file: ${configPath}`);

  try {
    const content = readFileSync(configPath, "utf-8");

    // Check if webpack config already exists
    if (content.includes("designSystemProviders")) {
      log("✅ Design system webpack configuration already exists.");
      log("   No changes needed.");
      process.exit(0);
    }

    // Check if webpack function exists
    if (content.includes("webpack:")) {
      log("⚠️  Webpack configuration already exists.");
      log("   Please add the design system configuration manually.");
      log("   See docs/NEXTJS_SETUP.md for details.");
      process.exit(0);
    }

    // Add webpack configuration
    const webpackConfig = generateWebpackConfig();

    // Try to add to nextConfig object
    let newContent = content;

    if (content.includes("const nextConfig = {")) {
      // JavaScript/TypeScript format
      newContent = content.replace(
        /const nextConfig = \{([^}]*)\};/s,
        `const nextConfig = {$1${webpackConfig}\n};`,
      );
    } else if (content.includes("module.exports = {")) {
      // CommonJS format
      newContent = content.replace(
        /module\.exports = \{([^}]*)\};/s,
        `module.exports = {$1${webpackConfig}\n};`,
      );
    } else {
      log("⚠️  Could not automatically add configuration.");
      log("   Please add manually. See docs/NEXTJS_SETUP.md");
      process.exit(1);
    }

    // Backup original
    const backupPath = `${configPath}.backup`;
    writeFileSync(backupPath, content);
    log(`✅ Backup created: ${backupPath}`);

    // Write new content
    writeFileSync(configPath, newContent);
    log(`✅ Configuration added to ${configPath}`);
    log("");
    log("Next steps:");
    log("1. Review the changes in your next.config file");
    log("2. Run: npm run build");
    log("3. If issues persist, see docs/NEXTJS_SETUP.md");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`❌ Error: ${errorMessage}`);
    process.exit(1);
  }
}

main();
