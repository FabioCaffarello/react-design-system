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
        'lucide-react',
        'react-hook-form',
        '@testing-library/dom',
        '@testing-library/react',
        '@xyflow/react',
      ],
    },
    resolve: {
      // Ensure barrel exports are resolved correctly
      mainFields: ['module', 'main'],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    // Build configuration for library mode
    build: {
        lib: {
          entry: {
            index: "src/ui/index.ts",
            atoms: "src/ui/atoms/index.ts",
            molecules: "src/ui/molecules/index.ts",
            organisms: "src/ui/organisms/index.ts",
            tokens: "src/ui/tokens/index.ts",
          },
          name: "ReactDesignSystem",
          fileName: (format, entryName) => {
            if (format === 'es') {
              return entryName === 'index' ? 'index.js' : `${entryName}/index.js`;
            }
            if (format === 'cjs') {
              return entryName === 'index' ? 'index.cjs' : `${entryName}/index.cjs`;
            }
            return entryName === 'index' ? 'index.cjs' : `${entryName}/index.cjs`;
          },
          formats: ["es", "cjs"],
        },
        // Minification configuration (using esbuild - faster and already included)
        minify: 'esbuild',
        // esbuild minification options
        target: 'es2015',
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
            // Note: We don't use manualChunks for the main index entry to ensure all exports are preserved
            manualChunks: (id) => {
              // Only split sub-entry points, not the main index
              if (id.includes('/atoms/') && !id.includes('src/ui/index')) {
                return 'atoms';
              }
              if (id.includes('/molecules/') && !id.includes('src/ui/index')) {
                return 'molecules';
              }
              if (id.includes('/organisms/') && !id.includes('src/ui/index')) {
                return 'organisms';
              }
              if (id.includes('/tokens/') && !id.includes('src/ui/index')) {
                return 'tokens';
              }
              // Keep providers and all other exports in main bundle
              return null;
            },
            // Source maps for production
            sourcemapExcludeSources: false,
            // CSS file naming
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'react-design-system.css';
              }
              return assetInfo.name || 'assets/[name]-[hash][extname]';
            },
          },
          // Prevent aggressive tree-shaking of exports
          // This is critical to ensure all exports from index.ts are preserved
          treeshake: {
            moduleSideEffects: (id) => {
              // Preserve all side effects from our source files
              if (id.includes('src/ui/')) {
                return true;
              }
              return false;
            },
            propertyReadSideEffects: true,
            tryCatchDeoptimization: false,
          },
        },
        emptyOutDir: false,
      },
    test: {
      projects: [
        {
          extends: true,
          test: {
            include: ["src/**/*.test.{ts,tsx}"],
            environment: "jsdom",
            setupFiles: ["src/setupTests.ts"],
            globals: true,
            coverage: {
              provider: 'v8',
              reporter: ['text', 'json', 'html', 'lcov'],
              exclude: [
                'node_modules/',
                'dist/',
                '**/*.stories.{ts,tsx}',
                '**/*.test.{ts,tsx}',
                '**/index.ts',
                '.storybook/',
                'storybook-static/',
                'src/setupTests.ts',
                'src/vitest.shims.d.ts',
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
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ],
                },
              }),
              instances: [
                {
                  browser: "chromium",
                },
              ],
              ui: false,
            },
            setupFiles: [".storybook/vitest.setup.ts"],
            testTimeout: 60000,
            hookTimeout: 60000,
            teardownTimeout: 30000,
            isolate: false,
            retry: 0,
            bail: 0,
            onConsoleLog: () => false,
          },
        },
      ],
    },
  };
});
