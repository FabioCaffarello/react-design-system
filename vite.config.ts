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
export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  optimizeDeps: {
    include: [
      'lucide-react',
      'react-hook-form',
      '@testing-library/dom',
      '@testing-library/react',
    ],
  },
  resolve: {
    // Ensure barrel exports are resolved correctly
    mainFields: ['module', 'main'],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
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
        if (format === 'umd') {
          return entryName === 'index' ? 'index.umd.js' : `${entryName}/index.umd.js`;
        }
        return entryName === 'index' ? 'index.cjs' : `${entryName}/index.cjs`;
      },
      formats: ["es", "cjs", "umd"],
    },
    // Minification configuration (using esbuild - faster and already included)
    minify: 'esbuild',
    // esbuild minification options
    target: 'es2015',
    // Additional optimization
    cssMinify: true,
    // Source maps configuration
    sourcemap: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Code splitting configuration
        manualChunks: (id) => {
          // Split by category
          if (id.includes('/atoms/')) {
            return 'atoms';
          }
          if (id.includes('/molecules/')) {
            return 'molecules';
          }
          if (id.includes('/organisms/')) {
            return 'organisms';
          }
          if (id.includes('/tokens/')) {
            return 'tokens';
          }
        },
        // Source maps for production
        sourcemapExcludeSources: false,
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
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
