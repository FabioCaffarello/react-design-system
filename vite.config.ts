/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(() => {
  return {
    plugins: [tsConfigPaths(), react(), tailwindcss()],
    optimizeDeps: {
      include: [
        "lucide-react",
        "react-hook-form",
        "@testing-library/dom",
        "@testing-library/react",
      ],
    },
    resolve: {
      // Ensure barrel exports are resolved correctly
      mainFields: ["module", "main"],
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
    },
    // Build configuration for library mode
    build: {
      lib: {
        entry: {
          index: "src/ui/index.ts",
          providers: "src/ui/providers/index.ts", // Separate entry point for providers
          primitives: "src/ui/primitives/index.ts",
          components: "src/ui/components/index.ts",
          tokens: "src/ui/tokens/index.ts",
        },
        name: "ReactDesignSystem",
        fileName: (format, entryName) => {
          if (format === "es") {
            return entryName === "index" ? "index.js" : `${entryName}/index.js`;
          }
          if (format === "cjs") {
            return entryName === "index"
              ? "index.cjs"
              : `${entryName}/index.cjs`;
          }
          return entryName === "index" ? "index.cjs" : `${entryName}/index.cjs`;
        },
        formats: ["es", "cjs"],
      },
      // Minification configuration (using esbuild - faster and already included)
      minify: "esbuild",
      // esbuild minification options
      target: "es2015",
      // Additional optimization
      cssMinify: true,
      // CSS code splitting - false to generate single CSS bundle
      cssCodeSplit: false,
      // Source maps configuration
      sourcemap: true,
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          // Preserve all named exports - critical for library mode
          exports: "named",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          // Code splitting configuration
          // CRITICAL: All providers MUST be in the same chunk to preserve initialization order
          // This is essential for Next.js SSR/prerendering compatibility
          manualChunks: (id) => {
            // CRITICAL: Force all providers into the same chunk (main bundle)
            // This prevents Next.js from code-splitting providers, which breaks initialization order
            // Include all provider-related files to ensure they're in the same module boundary
            if (
              id.includes("/providers/") ||
              id.includes("ThemeProvider") ||
              id.includes("ConfigProvider") ||
              id.includes("AppProvider") ||
              id.includes("ToastProvider") ||
              id.includes("DialogProvider") ||
              id.includes("ToastContext") ||
              id.includes("DialogContext")
            ) {
              return null; // Keep in main bundle - CRITICAL for initialization order
            }
            // Only split sub-entry points, not the main index
            if (id.includes("/primitives/") && !id.includes("src/ui/index")) {
              return "primitives";
            }
            // Split components, but keep provider-adjacent ones in main bundle
            if (
              id.includes("/components/") &&
              !id.includes("src/ui/index") &&
              !id.includes("/Toast/ToastProvider") &&
              !id.includes("/Dialog/DialogProvider") &&
              !id.includes("/Toast/ToastContext") &&
              !id.includes("/Dialog/DialogContext")
            ) {
              return "components";
            }
            if (id.includes("/tokens/") && !id.includes("src/ui/index")) {
              return "tokens";
            }
            // Keep all other exports in main bundle
            return null;
          },
          // Source maps for production
          sourcemapExcludeSources: false,
          // CSS file naming
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "react-design-system.css";
            }
            return assetInfo.name || "assets/[name]-[hash][extname]";
          },
        },
        // Prevent aggressive tree-shaking of exports
        // CRITICAL: Preserve all side effects for providers to maintain initialization order
        treeshake: {
          moduleSideEffects: (id) => {
            // Preserve all side effects from our source files
            if (id.includes("src/ui/")) {
              return true;
            }
            // CRITICAL: Preserve side effects for ALL provider-related files
            // This prevents tree-shaking from breaking the initialization chain
            if (
              id.includes("providers") ||
              id.includes("ThemeProvider") ||
              id.includes("ConfigProvider") ||
              id.includes("AppProvider") ||
              id.includes("ToastProvider") ||
              id.includes("DialogProvider") ||
              id.includes("ToastContext") ||
              id.includes("DialogContext")
            ) {
              return true;
            }
            return false;
          },
          // CRITICAL: Preserve property reads to ensure provider references are not removed
          propertyReadSideEffects: true,
          // CRITICAL: Disable try-catch deoptimization to preserve initialization order
          tryCatchDeoptimization: false,
          // CRITICAL: Preserve all exports from provider modules
          preserveEntrySignatures: "strict",
        },
      },
      emptyOutDir: false,
    },
    test: {
      include: ["src/**/*.test.{ts,tsx}", "eslint-rules/**/*.test.js"],
      environment: "jsdom",
      setupFiles: ["src/setupTests.ts"],
      globals: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        exclude: [
          "node_modules/",
          "dist/",
          "**/*.stories.{ts,tsx}",
          "**/*.test.{ts,tsx}",
          "**/index.ts",
          ".storybook/",
          "storybook-static/",
          "src/setupTests.ts",
          "src/vitest.shims.d.ts",
          "eslint-rules/",
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  };
});
