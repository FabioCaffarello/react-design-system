#!/usr/bin/env node
/**
 * a11y baseline gate validator.
 *
 * Reads `a11y-baseline.json` (produced by
 * `scripts/a11y-serial-baseline.mjs`) and fails (exit code 1) if the
 * critical+serious floor is breached on EITHER theme, or if the runner
 * reported any errored stories.
 *
 * Why both themes checked SEPARATELY (not aggregated)
 *
 *   An aggregate over light+dark hides single-theme regressions. A
 *   token redesign could flip dark from 0 to 5 critical color-contrast
 *   without touching light; the sum (0+5=5) would fail, but a sum-only
 *   gate would also fail the same way for a 5-light/0-dark regression
 *   — the report wouldn't tell you which theme regressed. Worse, a
 *   contract that says "sum < N" leaves ambiguity if one theme worsens
 *   while the other improves. Per-theme assertion is unambiguous: each
 *   theme has its own floor, both must hold.
 *
 * Why this script, not the addon-a11y vitest gate
 *
 *   `parameters.a11y.test: "error"` in `.storybook/preview.tsx` is
 *   cosmetic without a Storybook-stories-as-vitest-tests wiring (which
 *   this project does not have). The vitest `npm run test` step
 *   explicitly excludes `*.stories.tsx` and the `@storybook/addon-vitest`
 *   plugin is not wired into `vite.config.ts` / a vitest workspace. So
 *   the addon's `afterEach` handler never fires in CI. The serial
 *   baseline runner is the actual enforcement mechanism this project
 *   has — same axe-core@4.11.4 as the addon (verified via npm dedup
 *   in PR #69), same rule config (`.storybook/a11y-config.mjs`), same
 *   per-story `parameters.a11y.options.rules` honoring. The
 *   committable a11y-baseline.json doubles as a reproducibility record
 *   AND as the artifact the CI gate reads.
 *
 * Usage
 *
 *   node scripts/validate-a11y-baseline.mjs            # reads ./a11y-baseline.json
 *   node scripts/validate-a11y-baseline.mjs <path>     # custom path
 *
 * Themes checked
 *
 *   Derived from `report.themes` (the array the runner records when it
 *   was invoked). The single-theme files produced by the parallel CI
 *   jobs (`--theme light` or `--theme dark`) only carry their own
 *   theme's data; the validator then only checks that one. The
 *   committable local `a11y-baseline.json` (built by
 *   `npm run test:a11y:baseline` with no flag) carries both, and the
 *   validator checks both. Falling back to `["light", "dark"]` keeps
 *   pre-existing baseline files (from before this change) validating
 *   the same way.
 *
 * Exit codes
 *
 *   0 — every measured theme has critical+serious = 0 AND no errored stories
 *   1 — gate breached. Detailed failure message lists which theme,
 *       which rules, and how many nodes for each.
 *   2 — input error (file missing, malformed JSON, missing theme data).
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const DEFAULT_PATH = "a11y-baseline.json";
const FLOOR_IMPACTS = ["critical", "serious"];

const argPath = process.argv[2] || DEFAULT_PATH;
const absPath = resolve(process.cwd(), argPath);

let report;
try {
  const raw = await readFile(absPath, "utf8");
  report = JSON.parse(raw);
} catch (err) {
  console.error(`[a11y-gate] cannot read ${absPath}: ${err.message}`);
  process.exit(2);
}

// Derive the themes to check from the report itself — the runner
// records which themes it measured in `report.themes`. Pre-existing
// files without that field default to both themes (backward compat).
const themesToCheck =
  Array.isArray(report.themes) && report.themes.length > 0
    ? report.themes
    : ["light", "dark"];

for (const theme of themesToCheck) {
  if (!report[theme]) {
    console.error(
      `[a11y-gate] ${absPath} is missing data for theme "${theme}" (declared in report.themes). Re-run the baseline runner to regenerate.`,
    );
    process.exit(2);
  }
}

const failures = [];

for (const theme of themesToCheck) {
  const r = report[theme];

  // (1) Errored stories — the runner couldn't render or measure them.
  //     This is NOT a violation of WCAG, but it IS a measurement gap:
  //     the gate cannot certify zero on a story it didn't actually see.
  //     Treat it as a gate breach to force investigation.
  if (r.storiesWithErrors && r.storiesWithErrors.length > 0) {
    failures.push({
      theme,
      kind: "errored-stories",
      count: r.storiesWithErrors.length,
      details: r.storiesWithErrors.slice(0, 5).map((s) => s.storyId),
    });
  }

  // (2) Critical + serious node count over the floor (0).
  const cs = (r.byImpact?.critical ?? 0) + (r.byImpact?.serious ?? 0);
  if (cs > 0) {
    // Identify which rules contributed, in descending node count.
    const offending = Object.entries(r.rules ?? {})
      .filter(([, info]) => FLOOR_IMPACTS.includes(info.impact))
      .sort(([, a], [, b]) => b.nodes - a.nodes)
      .map(([id, info]) => ({
        id,
        impact: info.impact,
        nodes: info.nodes,
        stories: info.stories.length,
      }));
    failures.push({
      theme,
      kind: "floor-breach",
      critical: r.byImpact.critical,
      serious: r.byImpact.serious,
      offending,
    });
  }
}

if (failures.length === 0) {
  const summary = themesToCheck
    .map(
      (t) =>
        `${t}: ${report[t].totalStories} stories, ${report[t].byImpact.moderate} moderate`,
    )
    .join(" / ");
  const themePhrase =
    themesToCheck.length === 1
      ? `theme "${themesToCheck[0]}"`
      : `${themesToCheck.length} themes`;
  console.log(
    `[a11y-gate] PASS — critical+serious = 0 on ${themePhrase}. (${summary})`,
  );
  process.exit(0);
}

console.error(
  `[a11y-gate] FAIL — ${failures.length} breach${failures.length === 1 ? "" : "es"}:`,
);
for (const f of failures) {
  if (f.kind === "errored-stories") {
    console.error(
      `  [${f.theme}] ${f.count} story/stories errored during measurement (sample: ${f.details.join(", ")}). ` +
        `The gate cannot certify zero on a story it didn't measure.`,
    );
  } else if (f.kind === "floor-breach") {
    console.error(
      `  [${f.theme}] critical=${f.critical} serious=${f.serious} (floor is 0):`,
    );
    for (const rule of f.offending) {
      console.error(
        `    ${rule.id} [${rule.impact}] — ${rule.nodes} nodes across ${rule.stories} stories`,
      );
    }
  }
}
console.error(
  `\nFix the violations, re-run \`npm run test:a11y:baseline\`, ` +
    `and confirm a clean exit before merging.`,
);
process.exit(1);
