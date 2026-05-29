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
    // Build configuration for library mode.
    //
    // Single entry. Phase 13d collapsed the previous multi-entry layout
    // (index + providers + primitives + components + tokens) because cross-
    // chunk references (notably to cva from primitives) silently broke for
    // external consumers since v1.0.0 — never caught because no test
    // exercised the dist bundle from outside the repo. Single entry
    // dissolves the cross-chunk class of bug structurally and preserves the
    // original Next.js SSR / TDZ protection trivially: all providers and
    // their dependencies live in one linear module, so no downstream
    // bundler can split them apart in an order that breaks initialization.
    build: {
      lib: {
        entry: "src/ui/index.ts",
        name: "ReactDesignSystem",
        fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
        formats: ["es", "cjs"],
      },
      minify: "esbuild",
      target: "es2015",
      cssMinify: true,
      // CSS will be emitted as a single asset alongside the JS bundle when a
      // future entry imports the global stylesheet (Phase 13e). Keeping
      // cssCodeSplit: false + assetFileNames so the CSS asset lands at the
      // expected /styles export path the moment it has content.
      cssCodeSplit: false,
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          // Preserve named exports — required for library mode consumers.
          exports: "named",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          sourcemapExcludeSources: false,
          // Pin the emitted CSS asset name to the path "./styles" resolves
          // to in package.json exports.
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "react-design-system.css";
            }
            return assetInfo.name || "assets/[name]-[hash][extname]";
          },
        },
        // Keep provider modules side-effectful so tree-shaking cannot drop
        // their initialization. With single entry this is belt-and-braces
        // protection — initialization order is already enforced by module
        // order in the linear bundle — but matches the discipline that
        // resolved the original Next.js TDZ regression.
        treeshake: {
          moduleSideEffects: (id) =>
            id.includes("src/ui/") || id.includes("providers"),
          propertyReadSideEffects: true,
          tryCatchDeoptimization: false,
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
