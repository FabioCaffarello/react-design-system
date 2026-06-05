import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

// =========================================================================
// Server entry build — issue #150
// =========================================================================
//
// This config produces a SECOND, fully independent Vite build of the
// library: dist/server/index.{js,cjs} starting from `src/ui/server.ts`,
// which re-exports only the components verified server-safe by
// `scripts/analyze-server-safe.mjs` (see also
// `scripts/validate-server-entry.mjs` for the enforcement gate).
//
// Why a separate config (and a separate `vite build` invocation) rather
// than a second entry in the existing config:
//
//   The vite.config.ts header documents the pre-v1.0.0 regression:
//   "external distribution broke since v1.0.0" when the library was
//   shipped as a multi-entry bundle, because cross-chunk references to
//   class-variance-authority (`cva`) silently broke at the consumer.
//   That bug fires when a single Rollup build has multiple entries that
//   both import a shared module — Rollup extracts the shared module to
//   its own chunk and both entries import it via relative path, which
//   breaks once the package is unpacked at the consumer.
//
//   Two independent Vite builds dodge that family of bug entirely:
//   each build is its own Rollup graph, with its own copy of `cva`, its
//   own copy of `cn`, its own copy of token getters. ~1.5KB gz of
//   duplication is a price we pay gladly to keep the architectural
//   guarantee that the main entry remains a single self-contained
//   bundle and the server entry is another single self-contained
//   bundle. Neither bundle references anything in the other.
//
// What is intentionally different from the main config:
//
//   - **No `banner: '"use client";'`.** This is the whole point of the
//     server entry: the emitted module is plain ESM/CJS that React
//     Server Components can evaluate in the server runtime without
//     crashing on `createContext`/hook calls. The
//     `validate-use-client-in-dist.mjs` gate asserts the negative —
//     server dist must NOT start with the directive.
//
//   - **No `@tailwindcss/vite` plugin, and `.css` imports are stripped
//     by `stripCssImports` below.** The single canonical stylesheet
//     `dist/react-design-system.css` is emitted by the main build (it
//     already includes Progress.css's keyframes because Progress lives
//     in both bundles). Consumers reach it via the unchanged
//     `./styles` package export. Emitting a second copy from the
//     server build would either fight for the same path or pollute
//     the dist with a redundant file — neither is right.
//
//   - **No `styles-entry.ts` scaffolding entry.** The main build owns
//     CSS emission end-to-end.
//
//   - **`emptyOutDir: false`** — the main build runs first (per the
//     `build` script in package.json) and populates dist/. This build
//     adds dist/server/ on top of it. Emptying would wipe the main
//     bundle.
//
// What is the SAME as the main config and not by accident:
//
//   - `external: ["react", "react-dom"]` — same peer-dep contract.
//   - `output.exports: "named"` — library-mode discipline.
//   - `treeshake.moduleSideEffects` keyed to `src/ui/` — same
//     conservative tree-shake the main build uses; here it has less
//     practical effect (no providers in the graph) but the discipline
//     is identical, which keeps the build behaviour predictable across
//     both entries.
//
//   - `sourcemap: true` — server entry ships sourcemaps too. They're
//     small (no providers) and help downstream debuggers.
// =========================================================================

// Strip CSS imports for the server build. The server entry transitively
// pulls in `src/ui/primitives/Progress/Progress.css` (Progress.tsx side-
// effect imports it for keyframes). The MAIN build already extracts
// that CSS into the canonical `dist/react-design-system.css`. We don't
// want the server build to emit a competing CSS asset, and we don't
// want the JS bundle to retain a runtime `require("…css")` that
// resolves to nothing on the server.
//
// The plugin runs `enforce: "pre"` so it claims the .css ids before any
// Vite default CSS handling. Returning an empty module body for them
// converts the side-effect import into a no-op without disturbing the
// rest of the graph.
const stripCssImports = {
  name: "rds-server-strip-css-imports",
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
    lib: {
      entry: { index: "src/ui/server.ts" },
      name: "ReactDesignSystemServer",
      fileName: (format, entryName) => {
        const ext = format === "es" ? "js" : "cjs";
        return entryName === "index"
          ? `server/index.${ext}`
          : `server/${entryName}/index.${ext}`;
      },
      formats: ["es", "cjs"],
    },
    minify: "esbuild",
    target: "es2015",
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // The main build owns CSS extraction. This build has no CSS pipeline
    // (no Tailwind plugin) and strips every .css import to empty, so
    // setting this here is belt-and-braces — there should be no CSS
    // asset in this build's output graph at all.
    cssCodeSplit: false,
    rollupOptions: {
      // Externalise every third-party dependency. Two reasons:
      //
      //   1. **`lucide-react` `createContext` leak.** lucide-react ships
      //      a `LucideContext` declared at module top in its `context`
      //      submodule, with a per-file `"use client"` directive that
      //      makes the consumer's bundler (Next, etc.) put it behind a
      //      client boundary. If we bundle lucide-react INTO the server
      //      bundle, the directive is dropped by Rollup, the module
      //      becomes part of our server bundle's evaluation graph, and
      //      RSC crashes on `createContext` in the server runtime — the
      //      exact failure mode issue #148 fixed for the main entry,
      //      reintroduced via a transitive dep. Externalising
      //      lucide-react preserves the per-file directives at the
      //      consumer's boundary.
      //
      //   2. **Server-bundle should be lean.** Treating every dep as
      //      external keeps `dist/server/index.js` to just the RDS
      //      source we audit ourselves. The consumer's bundler dedupes
      //      `react`, `lucide-react`, `clsx`, `tailwind-merge`, and
      //      `class-variance-authority` against whatever it already has
      //      in the client bundle. We do not pay the v1.0.0 cva
      //      duplication cost we accepted on the main bundle, because
      //      this build has zero cva-internal cross-chunk references
      //      to break (it's a single entry with everything external).
      //
      // The MAIN build's `external: ["react", "react-dom"]` stays
      // narrow on purpose — the historical decision is to ship cva and
      // friends bundled to avoid the cross-chunk failure mode. The two
      // builds make opposite tradeoffs by design.
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
      // Top-level Rollup option — preserves the entry's exported
      // surface verbatim (no hoisting that could rename or drop named
      // exports). Same intent as the main config's setting, here in
      // the canonical location.
      preserveEntrySignatures: "strict",
      output: {
        exports: "named",
        // NO `banner: '"use client";'`. See the file header for why.
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
