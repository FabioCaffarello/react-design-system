/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(() => {
  return {
    plugins: [tsConfigPaths(), react()],
    optimizeDeps: {
      include: [
        "lucide-react",
        "react-hook-form",
        "@testing-library/dom",
        "@testing-library/react",
        "@xyflow/react",
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
          atoms: "src/ui/atoms/index.ts",
          molecules: "src/ui/molecules/index.ts",
          organisms: "src/ui/organisms/index.ts",
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
            if (id.includes("/providers/") || 
                id.includes("ThemeProvider") ||
                id.includes("ConfigProvider") ||
                id.includes("AppProvider") ||
                id.includes("ToastProvider") ||
                id.includes("DialogProvider") ||
                id.includes("ToastContext") ||
                id.includes("DialogContext")) {
              return null; // Keep in main bundle - CRITICAL for initialization order
            }
            // Only split sub-entry points, not the main index
            if (id.includes("/atoms/") && !id.includes("src/ui/index")) {
              return "atoms";
            }
            if (id.includes("/molecules/") && !id.includes("src/ui/index")) {
              return "molecules";
            }
            // Split other organisms, but not providers
            if (id.includes("/organisms/") && 
                !id.includes("src/ui/index") &&
                !id.includes("/Toast/ToastProvider") &&
                !id.includes("/Dialog/DialogProvider") &&
                !id.includes("/Toast/ToastContext") &&
                !id.includes("/Dialog/DialogContext")) {
              return "organisms";
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
            if (id.includes("providers") ||
                id.includes("ThemeProvider") ||
                id.includes("ConfigProvider") ||
                id.includes("AppProvider") ||
                id.includes("ToastProvider") ||
                id.includes("DialogProvider") ||
                id.includes("ToastContext") ||
                id.includes("DialogContext")) {
              return true;
            }
            return false;
          },
          // CRITICAL: Preserve property reads to ensure provider references are not removed
          propertyReadSideEffects: true,
          // CRITICAL: Disable try-catch deoptimization to preserve initialization order
          tryCatchDeoptimization: false,
          // CRITICAL: Preserve all exports from provider modules
          preserveEntrySignatures: 'strict',
        },
      },
      emptyOutDir: false,
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/*.test.{ts,tsx}"],
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
              ],
              thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
              },
            },
          },
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, ".storybook"),
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({
                launch: {
                  args: [
                    "--disable-web-security",
                    "--disable-features=IsolateOrigins,site-per-process",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                  ],
                },
              }),
              instances: process.env.CI
                ? 1
                : [
                    {
                      browser: "chromium",
                    },
                  ],
              ui: false,
            },
            setupFiles: [".storybook/vitest.setup.ts"],
            testTimeout: process.env.CI ? 120000 : 60000,
            hookTimeout: process.env.CI ? 120000 : 60000,
            teardownTimeout: process.env.CI ? 120000 : 60000,
            isolate: !process.env.CI,
            retry: process.env.CI ? 2 : 0,
            bail: 0,
            onConsoleLog: () => false,
            // Browser mode doesn't work well with forks pool in CI
            // Use default pool for browser mode
            maxConcurrency: process.env.CI ? 1 : undefined,
          },
        },
      ],
    },
  };
});
