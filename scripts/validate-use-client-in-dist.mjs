#!/usr/bin/env node
/**
 * validate-use-client-in-dist
 *
 * Asserts the **dual** invariant on the published bundles:
 *
 *   - `dist/index.{js,cjs}` MUST start with `"use client";` — RDS's
 *     main entry is a single-bundle UI library that touches
 *     `React.createContext` and hooks at module-evaluation time, so the
 *     React Server Components runtime requires the directive to mark
 *     the whole module as client. Without it, importing anything from
 *     `@fabio.caffarello/react-design-system` from a Next App Router
 *     Server Component crashes with
 *     `(0, j.createContext) is not a function` (issue #148).
 *
 *   - `dist/server/index.{js,cjs}` MUST NOT start with `"use client"`
 *     (any quote style) — the whole point of the server entry
 *     (`./server`) is to be importable from a Server Component without
 *     introducing a client boundary. If a regression accidentally
 *     stamps the directive on this bundle, the consumer's bundler
 *     would treat every server-safe primitive as a Client Component
 *     and the opt-in path would be silently inert. Issue #150.
 *
 * The directives are controlled by `rollupOptions.output.banner` in
 * `vite.config.ts` (main entry, emits the directive) and the absence
 * of any banner in `vite.config.server.ts` (server entry). This script
 * is the gate that catches the moment those configurations drift.
 * See `.claude/rules/ci-gates.md`.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PREFIX_BYTES = 96;
const failures = [];

// Each target carries an explicit verdict on whether the directive
// must be PRESENT or ABSENT. The single shared scanner avoids
// asymmetric logic per target.
const TARGETS = [
  { path: "dist/index.js", directive: "required" },
  { path: "dist/index.cjs", directive: "required" },
  { path: "dist/server/index.js", directive: "forbidden" },
  { path: "dist/server/index.cjs", directive: "forbidden" },
];

// React's `"use client"` directive matches both quote styles per
// the spec; the main bundle emits double-quoted via vite banner but
// the forbidden-side check has to catch BOTH so a future minifier
// switch can't slip through. The trailing semicolon is optional —
// directives are valid without one per the JS spec, and the
// asymmetric risk matters: requiring `;` makes the *required* check
// falsely fail (annoying) but makes the *forbidden* check falsely
// pass (silent hole — a future minifier ASI-stripping the semicolon
// would let "use client" slip into dist/server/index.* past the gate).
const DIRECTIVE_REGEX = /^﻿?(?:"use client"|'use client');?/;
const REQUIRED_LITERAL = '"use client";';

for (const { path: rel, directive } of TARGETS) {
  const abs = join(process.cwd(), rel);
  if (!existsSync(abs)) {
    failures.push(
      `${rel}: file does not exist (did you run \`npm run build\`?)`,
    );
    continue;
  }
  const head = readFileSync(abs, { encoding: "utf8" }).slice(0, PREFIX_BYTES);
  const stripped = head.replace(/^﻿/, "");
  const present = DIRECTIVE_REGEX.test(stripped);

  if (directive === "required" && !present) {
    failures.push(
      `${rel}: MUST start with \`${REQUIRED_LITERAL}\` but does not — got: ${JSON.stringify(stripped.slice(0, 40))}…`,
    );
  } else if (directive === "forbidden" && present) {
    failures.push(
      `${rel}: MUST NOT start with \`"use client"\` (this is the server entry) — got: ${JSON.stringify(stripped.slice(0, 40))}…`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    "[validate-use-client-in-dist] FAIL — dual directive invariant violated:",
  );
  for (const msg of failures) {
    console.error(`  - ${msg}`);
  }
  console.error("");
  console.error(
    "Main entry: `banner: '\"use client\";'` set in vite.config.ts → dist/index.{js,cjs}.",
  );
  console.error(
    "Server entry: NO banner in vite.config.server.ts → dist/server/index.{js,cjs}.",
  );
  console.error(
    "If the main entry is missing the directive, importing RDS from a Server",
  );
  console.error(
    "Component crashes with `createContext is not a function` (issue #148).",
  );
  console.error(
    "If the server entry HAS the directive, the opt-in server boundary is",
  );
  console.error("silently broken (issue #150).");
  process.exit(1);
}

console.log(
  `[validate-use-client-in-dist] OK — main dist carries \`"use client";\`, server dist does not.`,
);
