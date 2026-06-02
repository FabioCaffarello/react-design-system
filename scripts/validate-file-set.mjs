#!/usr/bin/env node
/**
 * validate-file-set.mjs
 *
 * Enforces the "every component ships with four files" hard rule from
 * CLAUDE.md and .claude/rules/components.md:
 *
 *   <Name>.tsx       — implementation
 *   <Name>.test.tsx  — Vitest + Testing Library
 *   <Name>.stories.tsx — Storybook
 *   index.ts         — single explicit export
 *
 * Scans one level deep under src/ui/{primitives,components,layouts}/.
 * A directory is considered a component dir iff <Name>.tsx exists at
 * its top level. Utility directories (e.g. __tests__/, types/) that
 * don't carry a name-matching .tsx are skipped automatically.
 *
 * Nested sub-components (e.g. SideNavbar/components/Navbar/) are
 * intentionally NOT scanned — those are internal helpers of their
 * parent component, not standalone DS exports.
 *
 * Allowlist: grandfathered exceptions for component dirs that pre-date
 * this gate and are scheduled to be filled in Wave 2 of the post-quick-
 * win sequence. Remove entries from the allowlist as each PR fills the
 * missing file — the gate keeps tightening automatically.
 */

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const LAYERS = ["primitives", "components", "layouts"];
const REQUIRED_EXTS = [".tsx", ".test.tsx", ".stories.tsx"];

// Grandfathered missing-file exceptions. Each entry is `<layer>/<name>:<file>`.
// Scheduled for cleanup in Wave 2 of the post-quick-win sequence (see the
// "categorias restantes" plan in the team conversation). When a PR adds the
// missing file, delete the corresponding entry from this set in the same
// commit — the gate then enforces the file's presence going forward.
const ALLOWLIST = new Set([
  "components/DashboardLayout:DashboardLayout.test.tsx",
  "components/DataTablePattern:DataTablePattern.test.tsx",
  "components/FormWizardPattern:FormWizardPattern.test.tsx",
  "components/LoginBox:LoginBox.test.tsx",
  "components/SearchAndFilterPattern:SearchAndFilterPattern.test.tsx",
]);

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

const violations = [];
const consumedAllowlist = new Set();

for (const layer of LAYERS) {
  const layerDir = join(ROOT, "src", "ui", layer);
  if (!isDir(layerDir)) continue;

  for (const entry of readdirSync(layerDir)) {
    const dir = join(layerDir, entry);
    if (!isDir(dir)) continue;

    // A component dir is identified by `<Name>.tsx` at the top level.
    // Anything else (utility dirs, shared tests, etc.) is skipped.
    const implPath = join(dir, `${entry}.tsx`);
    if (!fileExists(implPath)) continue;

    for (const ext of REQUIRED_EXTS) {
      const path = join(dir, `${entry}${ext}`);
      if (fileExists(path)) continue;
      const key = `${layer}/${entry}:${entry}${ext}`;
      if (ALLOWLIST.has(key)) {
        consumedAllowlist.add(key);
        continue;
      }
      violations.push(key);
    }

    const indexPath = join(dir, "index.ts");
    if (!fileExists(indexPath)) {
      const key = `${layer}/${entry}:index.ts`;
      if (ALLOWLIST.has(key)) {
        consumedAllowlist.add(key);
      } else {
        violations.push(key);
      }
    }
  }
}

const staleAllowlist = [...ALLOWLIST].filter(
  (key) => !consumedAllowlist.has(key),
);

if (violations.length === 0 && staleAllowlist.length === 0) {
  const total = ALLOWLIST.size;
  console.log(
    `[validate-file-set] OK — every component dir under src/ui/{primitives,components,layouts}/ ships the four required files (${total} grandfathered exceptions allowlisted).`,
  );
  process.exit(0);
}

if (violations.length > 0) {
  console.error(
    `[validate-file-set] FAIL — ${violations.length} component dir(s) missing required file(s):`,
  );
  for (const v of violations) {
    const [dir, file] = v.split(":");
    console.error(`  ${dir} is missing ${file}`);
  }
  console.error(
    "\nEvery component ships with .tsx, .test.tsx, .stories.tsx, index.ts — see CLAUDE.md and .claude/rules/components.md.",
  );
}

if (staleAllowlist.length > 0) {
  console.error(
    `\n[validate-file-set] STALE — ${staleAllowlist.length} allowlist entry/entries no longer match any missing file:`,
  );
  for (const s of staleAllowlist) {
    console.error(`  ${s}`);
  }
  console.error(
    "\nThe missing file was added — remove the allowlist entry in scripts/validate-file-set.mjs to tighten the gate.",
  );
}

process.exit(1);
