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
    // Two entries:
    //   - index: the linear JS bundle (Phase 13d collapsed the previous
    //     multi-entry layout — providers + primitives + components + tokens
    //     — because cross-chunk references to cva silently broke external
    //     distribution since v1.0.0). All component code, providers, hooks,
    //     and tokens live in this single bundle. No cross-chunk references
    //     possible. SSR / TDZ initialization order preserved trivially.
    //   - styles: a build-time scaffolding entry whose only job is to
    //     side-effect import src/style.css so Vite extracts the token
    //     cascade to dist/react-design-system.css. Consumers reach the CSS
    //     via the package.json "./styles" export, not this JS shell.
    //     The shell itself is ~30 bytes of dead code in dist/styles/ —
    //     trivial overhead for the architectural clarity it provides.
    build: {
      lib: {
        entry: {
          index: "src/ui/index.ts",
          styles: "src/ui/styles-entry.ts",
        },
        name: "ReactDesignSystem",
        fileName: (format, entryName) => {
          const ext = format === "es" ? "js" : "cjs";
          return entryName === "index"
            ? `index.${ext}`
            : `${entryName}/index.${ext}`;
        },
        formats: ["es", "cjs"],
      },
      minify: "esbuild",
      target: "es2015",
      cssMinify: true,
      // Single CSS bundle pinned to dist/react-design-system.css via
      // assetFileNames below — matches the path the package.json "./styles"
      // export resolves to.
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
