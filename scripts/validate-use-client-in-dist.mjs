#!/usr/bin/env node
/**
 * validate-use-client-in-dist
 *
 * Verifies that dist/index.{js,cjs} begin with a `"use client";` directive.
 *
 * Why: when the React Server Components runtime (Next App Router, etc.)
 * evaluates an imported module on the server, it requires the file to
 * carry a `"use client"` directive *as its first statement* to know the
 * module should run on the client. RDS is a single-bundle UI library
 * that uses `React.createContext` and hooks at module-evaluation time —
 * without the directive, importing anything from RDS in a Server
 * Component crashes with `(0, j.createContext) is not a function`
 * (issue #148).
 *
 * The directive is injected by `rollupOptions.output.banner` in
 * vite.config.ts. This script is the gate that fails when the banner is
 * lost (config regression, Vite/Rollup version change, minifier
 * stripping leading directives, etc.). See `.claude/rules/ci-gates.md`.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIRECTIVE = '"use client"';
const TARGETS = ["dist/index.js", "dist/index.cjs"];
const PREFIX_BYTES = 64;

const failures = [];

for (const rel of TARGETS) {
  const abs = join(process.cwd(), rel);
  if (!existsSync(abs)) {
    failures.push(
      `${rel}: file does not exist (did you run \`npm run build\`?)`,
    );
    continue;
  }
  // Read the first chunk only — the directive must be at byte 0 (modulo
  // an optional BOM), so we never need to scan further.
  const head = readFileSync(abs, { encoding: "utf8" }).slice(0, PREFIX_BYTES);
  // Tolerate an optional UTF-8 BOM, then require the directive verbatim
  // as the first statement. `"use client"` and `'use client'` both
  // satisfy the React spec; the banner emits the double-quoted form.
  const stripped = head.replace(/^﻿/, "");
  if (!stripped.startsWith(`${DIRECTIVE};`)) {
    failures.push(
      `${rel}: missing leading \`${DIRECTIVE};\` directive — got: ${JSON.stringify(stripped.slice(0, 32))}…`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    '[validate-use-client-in-dist] FAIL — dist bundle(s) missing `"use client";` directive:',
  );
  for (const msg of failures) {
    console.error(`  - ${msg}`);
  }
  console.error("");
  console.error(
    "The directive is set via `rollupOptions.output.banner` in vite.config.ts.",
  );
  console.error(
    "Without it, RDS crashes when imported from a Next App Router Server",
  );
  console.error(
    "Component with `createContext is not a function` (issue #148).",
  );
  process.exit(1);
}

console.log(
  `[validate-use-client-in-dist] OK — \`${DIRECTIVE};\` present at the head of all ${TARGETS.length} dist entries.`,
);
