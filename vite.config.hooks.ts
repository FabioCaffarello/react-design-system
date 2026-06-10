import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

// =========================================================================
// Public hooks entry build — issue #203
// =========================================================================
//
// Third independent Vite build: dist/hooks/index.{js,cjs} from
// `src/ui/hooks-entry.ts`, which re-exports ONLY the public hooks
// (`.claude/rules/hooks.md` — today: useScrollSpy).
//
// Why: the main entry is a single pre-bundled `"use client"` file by
// design (see vite.config.ts header for the cva cross-chunk history).
// That bundle is opaque to the consumer bundler's tree-shaking, so
// importing just one hook from `.` pulled the entire barrel into the
// consumer's client JS (+277KB minified on a Next 16 route, measured
// in issue #203). This build gives hooks their own tiny bundle.
//
// Same independent-build discipline as vite.config.server.ts: each
// build is its own Rollup graph, no shared chunks, so the cva
// cross-chunk failure mode cannot fire across entries.
//
// What is intentionally DIFFERENT from the server config:
//
//   - **`banner: '"use client";'` IS present.** Hooks call React client
//     APIs by definition (`.claude/rules/hooks.md` — "Never in
//     ./server"). This bundle must carry the directive so importing it
//     from a Server Component file creates a client boundary instead of
//     crashing. `validate-use-client-in-dist.mjs` asserts the positive.
//
//   - No CSS scaffolding at all: hooks import no CSS, so there is no
//     strip plugin and no Tailwind pipeline.
//
// What is the SAME and not by accident:
//
//   - Wide `external` list: everything third-party stays external. The
//     hooks graph today only touches `react`, but keeping the full list
//     means a future public hook that imports e.g. `clsx` cannot
//     silently start bundling deps.
//   - `emptyOutDir: false` — this build runs third in the `build`
//     script and adds dist/hooks/ on top of the main + server output.
//   - `preserveEntrySignatures: "strict"`, `exports: "named"`,
//     `sourcemap: true` — library-mode discipline shared by all three
//     configs.
// =========================================================================

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  build: {
    lib: {
      entry: { index: "src/ui/hooks-entry.ts" },
      name: "ReactDesignSystemHooks",
      fileName: (format, entryName) => {
        const ext = format === "es" ? "js" : "cjs";
        return entryName === "index"
          ? `hooks/index.${ext}`
          : `hooks/${entryName}/index.${ext}`;
      },
      formats: ["es", "cjs"],
    },
    minify: "esbuild",
    target: "es2015",
    sourcemap: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "lucide-react",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "react-hook-form",
      ],
      preserveEntrySignatures: "strict",
      output: {
        exports: "named",
        // The directive that makes this bundle a client boundary for RSC
        // consumers — same mechanism as the main entry (issue #148).
        banner: '"use client";',
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        sourcemapExcludeSources: false,
      },
      treeshake: {
        moduleSideEffects: (id) => id.includes("src/ui/"),
        propertyReadSideEffects: true,
        tryCatchDeoptimization: false,
      },
    },
    emptyOutDir: false,
  },
});
