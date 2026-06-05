/**
 * server-safe — shared classification core for issue #150.
 *
 * Exported by:
 *   - scripts/analyze-server-safe.mjs (the report CLI; also writes
 *     server-safe-map.json for human review and for the validator below).
 *   - scripts/validate-server-entry.mjs (the gate that fails CI if
 *     src/ui/server.ts re-exports something this analyser classifies as
 *     client-only).
 *
 * Two callers, one classifier — no risk of the gate and the report
 * drifting apart on what "server-safe" means.
 *
 * Rule of classification: a module is **client-only** if it OR any of
 * its transitive *value* imports inside `src/ui/` calls one of these
 * React client APIs at module scope: useState, useEffect,
 * useLayoutEffect, useReducer, useContext, useRef, useImperativeHandle,
 * useCallback, useMemo, useId, useTransition, useDeferredValue,
 * useSyncExternalStore, useInsertionEffect, useOptimistic, createContext.
 *
 * Type-only imports (`import type { ... }` and `import { type X }`
 * inline specifiers) are erased by TypeScript before the bundler runs,
 * so they do NOT propagate client-ness. The analyser filters them.
 *
 * Bare specifiers (react, lucide-react, class-variance-authority,
 * clsx, tailwind-merge, react-hook-form, etc.) are NOT walked. The
 * server bundle externalises every third-party dependency — its
 * `vite.config.server.ts` lists them in `rollupOptions.external` — so
 * client APIs they declare at module top (e.g. lucide-react's
 * `LucideContext = createContext({})`) stay behind the consumer's own
 * boundaries, where lucide-react's per-file `"use client"` directives
 * apply. That's exactly the failure mode we hit during the first
 * server-build attempt: lucide-react's createContext was inlined into
 * the server bundle because it wasn't externalised, and the validator
 * would have missed it because the analyser only walks src/ui/.
 * The fix is on the build side (externalise the dep); the analyser's
 * scope stays narrow and correct.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";

export const ROOT = process.cwd();
export const UI = join(ROOT, "src/ui");

// Identifier-followed-by-paren or angle bracket — avoids false positives
// on Ref<T> vs useRef<T>(...), and on prose mentions of these names in
// comments after they've been stripped by `stripCommentsAndStrings`.
export const CLIENT_API_PATTERN =
  /\b(useState|useEffect|useLayoutEffect|useReducer|useContext|useRef|useImperativeHandle|useCallback|useMemo|useId|useTransition|useDeferredValue|useSyncExternalStore|useInsertionEffect|useOptimistic|createContext)\s*[(<]/;

// Strip comments and string literals so the API pattern never matches
// against doc prose or string contents. Approximate is fine: we only
// need the result to NOT contain hook names that originated outside
// real code positions.
function stripCommentsAndStrings(src) {
  let out = src;
  out = out.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/(^|[^:])\/\/.*$/gm, "$1");
  out = out.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  out = out.replace(/'(?:[^'\\]|\\.)*'/g, "''");
  out = out.replace(/`(?:[^`\\]|\\.)*`/g, "``");
  return out;
}

export function usesClientApi(src) {
  const stripped = stripCommentsAndStrings(src);
  const m = stripped.match(CLIENT_API_PATTERN);
  return m ? m[1] : null;
}

// Iterates over every ES import / re-export declaration in `src` and
// yields `{ spec, isTypeOnly }`. A declaration is type-only when either:
//   - the whole declaration begins with `import type` / `export type`,
//     OR
//   - every named binding inside the braces is prefixed with the inline
//     `type` keyword AND there is no default binding and no `* as N`
//     namespace binding.
// Mixed declarations (default + type bindings, namespace + type
// bindings) are runtime imports because at least one binding survives
// to JavaScript.
export function* iterImports(src) {
  const importRe =
    /(^|\n)(?<lead>\s*)(?<kind>import|export)(?<rest>(?:\s+type)?\s+[^;]*?from\s*["'](?<spec>[^"']+)["'])/g;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    const fullDecl = m[0];
    const spec = m.groups.spec;

    if (/\b(?:import|export)\s+type\b/.test(fullDecl)) {
      yield { spec, isTypeOnly: true };
      continue;
    }

    const braceMatch = fullDecl.match(/\{([^}]*)\}/);
    if (braceMatch) {
      const bindings = braceMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      // Strip the leading `\n` + indentation captured by `lead` so the
      // anchored `^` regex below sees the declaration cleanly.
      const trimmedDecl = fullDecl.replace(/^\s+/, "");
      const hasDefault =
        /^(?:import|export)\s+(?!\{|type\b)[A-Za-z_$][\w$]*\s*,?/.test(
          trimmedDecl,
        );
      const hasNamespace = /\*\s+as\s+[A-Za-z_$][\w$]*/.test(fullDecl);
      const allTypeBindings =
        bindings.length > 0 && bindings.every((b) => /^type\s+/.test(b));
      if (allTypeBindings && !hasDefault && !hasNamespace) {
        yield { spec, isTypeOnly: true };
        continue;
      }
    }

    yield { spec, isTypeOnly: false };
  }

  // Side-effect-only: `import "spec";` — always runtime.
  const sideRe = /(^|\n)\s*import\s+["']([^"']+)["']\s*;?/g;
  while ((m = sideRe.exec(src)) !== null) {
    yield { spec: m[2], isTypeOnly: false };
  }
}

// Resolves a relative import to a source file under src/ui/. Returns
// null for bare specifiers (they are not walked; see the file header)
// and for paths that resolve outside src/ui/.
export function resolveImport(spec, fromFile) {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return null;
  const base = spec.startsWith("/") ? spec : resolve(dirname(fromFile), spec);
  for (const ext of ["", ".tsx", ".ts", ".jsx", ".js"]) {
    if (existsSync(base + ext) && statSync(base + ext).isFile()) {
      return base + ext;
    }
  }
  for (const ext of [".tsx", ".ts", ".jsx", ".js"]) {
    const candidate = join(base, "index" + ext);
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

// classify(file, cache?) — depth-first walk that returns either
// `{ verdict: "server", chain: [file] }` or
// `{ verdict: "client", reason: "...", chain: [file, ..., offender] }`.
//
// The cache is created on first call if not passed in. Sharing a cache
// across multiple classify() calls makes the walk linear in the total
// number of files reached, rather than quadratic per starting point.
// The cache also breaks cycles: re-entering a file in progress returns
// the tentative "server" verdict, which is updated to "client" if a
// real client hit is found further down the walk.
//
// Limitation: re-entry on a file mid-classification returns the tentative
// `{ verdict: "server" }` cache entry, so an A→B→A cycle where A's
// clientness is learned through B can leave B's cache entry stale. Not
// triggered on the current server-safe set; a future contributor
// introducing such a cycle should revisit this.
export function classify(file, cache = new Map()) {
  if (cache.has(file)) return cache.get(file);
  cache.set(file, { verdict: "server", chain: [] });

  const src = readFileSync(file, "utf-8");
  const own = usesClientApi(src);
  if (own) {
    const v = {
      verdict: "client",
      reason: `uses ${own}() at module scope`,
      chain: [file],
    };
    cache.set(file, v);
    return v;
  }

  for (const { spec, isTypeOnly } of iterImports(src)) {
    if (isTypeOnly) continue;
    const target = resolveImport(spec, file);
    if (!target) continue;
    if (!target.startsWith(UI + "/") && target !== UI) continue;
    const sub = classify(target, cache);
    if (sub.verdict === "client") {
      const v = {
        verdict: "client",
        reason: sub.reason,
        chain: [file, ...sub.chain],
      };
      cache.set(file, v);
      return v;
    }
  }

  const v = { verdict: "server", chain: [file] };
  cache.set(file, v);
  return v;
}

// Enumerates every component source file (.tsx) under
// src/ui/{primitives,components,layouts}/ recursively, excluding test,
// stories, and a11y-test files. This is the analyser's report input;
// the validator uses `iterImports` directly on src/ui/server.ts to
// learn its re-export set.
export function listComponentFiles() {
  const roots = ["primitives", "components", "layouts"].map((r) => join(UI, r));
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      if (!/\.tsx$/.test(ent.name)) continue;
      if (/\.test\.tsx$/.test(ent.name)) continue;
      if (/\.stories\.tsx$/.test(ent.name)) continue;
      if (/\.accessibility\.test\.tsx$/.test(ent.name)) continue;
      out.push(full);
    }
  };
  for (const r of roots) walk(r);
  return out.sort();
}

export function rel(p) {
  return relative(ROOT, p);
}
