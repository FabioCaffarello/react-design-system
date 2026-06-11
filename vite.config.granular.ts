import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

// =========================================================================
// Granular client entry build — issue #208
// =========================================================================
//
// Fourth independent Vite build: the FULL public surface of
// `src/ui/index.ts`, emitted with `preserveModules: true` into
// dist/granular/. Exposed as the `./granular` package export.
//
// Why: the main entry (`.`) is a single pre-bundled `"use client"` file
// by design (see vite.config.ts header — the v1.0.0 cva cross-chunk
// regression). That single file is opaque to the consumer bundler's
// tree-shaking: importing ONE client component pulled the whole barrel
// (+264KB minified measured on a Next 16 route for `Accordion`, issue
// #208 — same class as the +277KB for `useScrollSpy`, issue #203).
// `./hooks` (#205) solved it for public hooks; this entry generalises
// the solution to every component: one module per source file, so the
// consumer's bundler includes only the import's actual module graph.
// The consumer-measured contrast that motivated this: `useScrollSpy`
// via `./hooks` cost +396 BYTES; `Accordion` via the barrel cost
// +264KB.
//
// Why this does NOT recreate the v1.0.0 cva cross-chunk bug:
//
//   That regression came from Rollup EXTRACTING shared modules into
//   anonymous chunks that multiple entries imported via fragile
//   relative paths. Here there is no chunk extraction at all —
//   `preserveModules` maps source modules 1:1 to output files (the
//   standard Radix/Mantine layout), and every third-party dep is
//   external (cva, clsx, tailwind-merge are runtime `dependencies`;
//   react/lucide-react/react-hook-form are peers — the consumer's
//   bundler resolves all of them from its own node_modules). Nothing
//   is shared between this build and the other three; nothing is
//   duplicated inside this build.
//
// Why the main entry stays the default instead of flipping the root
// build to preserveModules (the issue's alternative B):
//
//   - Zero regression risk for every existing consumer of `.` — the
//     single bundle keeps its battle-tested layout, TDZ-safe provider
//     initialization included.
//   - Provider/bundle initialization order: `providers-bundle.ts`
//     exists precisely because module-split providers once broke
//     under Turbopack (see src/ui/index.ts section 3). The granular
//     tree re-splits them by construction, so app-wide setup
//     (AppProvider/Theme/Toast/Dialog) should keep importing from `.`;
//     `./granular` is for leaf imports (components/primitives/layouts)
//     on size-critical routes. README documents this split.
//
// What is intentionally different from the other builds:
//
//   - `preserveModules: true` + `preserveModulesRoot: "src"` — emits
//     dist/granular/ui/** mirroring the source tree; the entry lands
//     at dist/granular/ui/index.js (what `./granular` resolves to).
//   - ES format only. The granular path exists FOR bundlers, and every
//     modern bundler consumes ESM; a CJS mirror would double the file
//     count for no consumer.
//   - `banner: '"use client";'` is applied PER EMITTED MODULE (Rollup
//     prepends banners to every chunk, and with preserveModules every
//     module is a chunk) — each file is independently a valid client
//     module for RSC, so a Server Component can import any granular
//     module directly and Next places exactly that module graph behind
//     the boundary. `validate-use-client-in-dist.mjs` walks the whole
//     tree and asserts the directive on every emitted .js file.
//   - CSS imports are stripped (same plugin as the server build): the
//     main build owns dist/react-design-system.css; consumers of
//     `./granular` keep importing `./styles` for it, unchanged.
//
// Tree-shaking contract: package.json carries
// `"sideEffects": ["**/*.css"]` so bundlers may prune re-exported but
// unimported modules from the dist/granular/ui/index.js barrel. The
// next-smoke fixture gates this end-to-end: a route importing ONLY
// `Accordion` from `./granular` must come out a fraction of the size
// of the identical route importing it from `.` (see
// scripts/next-smoke.mjs step 5).
// =========================================================================

// Same rationale as vite.config.server.ts: convert side-effect CSS
// imports (Progress.css keyframes) into no-ops; the canonical
// stylesheet is emitted once, by the main build.
const stripCssImports = {
  name: "rds-granular-strip-css-imports",
  enforce: "pre" as const,
  resolveId(source: string) {
    if (/\.css(\?.*)?$/.test(source)) {
      return { id: source, moduleSideEffects: false };
    }
    return null;
  },
  load(id: string) {
    if (/\.css(\?.*)?$/.test(id)) {
      return "";
    }
    return null;
  },
};

export default defineConfig({
  plugins: [tsConfigPaths(), react(), stripCssImports],
  build: {
    outDir: "dist/granular",
    lib: {
      entry: { index: "src/ui/index.ts" },
      formats: ["es"],
    },
    minify: "esbuild",
    target: "es2015",
    sourcemap: true,
    cssCodeSplit: false,
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
        "@radix-ui/react-slot",
      ],
      preserveEntrySignatures: "strict",
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        exports: "named",
        // Per-module client directive — see the header. Rollup applies
        // the banner to every emitted chunk, and with preserveModules
        // every module is its own chunk.
        banner: '"use client";',
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
