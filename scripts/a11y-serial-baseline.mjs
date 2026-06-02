#!/usr/bin/env node
/**
 * a11y serial baseline runner — the committable record-of-virada.
 *
 * Renders every Storybook story headlessly, workers=1 by default, fresh
 * BrowserContext per story, injects the addon-a11y's bundled axe-core
 * directly via `addScriptTag`, replicates the addon's call sequence
 * (`axe.reset() → axe.configure({rules}) → axe.run(context, options)`),
 * and aggregates violations by impact and rule.
 *
 * Two passes by default (light + dark):
 *   - light: no media emulation. Playwright headless default.
 *   - dark: `browser.newContext({ colorScheme: 'dark' })`. Exercises
 *     the `@media (prefers-color-scheme: dark)` path established in
 *     Phase 13e (the same path Phase C PR55 instrumented for the
 *     parallel dual-theme sweep). `emulateMedia` exists on Page but
 *     not BrowserContext in this Playwright version; setting it at
 *     context creation is the equivalent and applies to all pages.
 *
 * Why serial + fresh context per story:
 *   Phase C PR2 measured a workers=6 shared-context paralelo against a
 *   workers=1 fresh-context serial. The paralelo had axe-race on 2
 *   interactive stories (Form/with-events, Toast/clear-all). The serial
 *   closed that variance. Observed wall clock ~5.5min per theme on 852
 *   stories with a local storybook-static (BACKLOG predicted ~48min
 *   under slower I/O; record the actual run duration in the output).
 *   See BACKLOG "Phase C PR2 — calibragem metodológica".
 *
 * Why same axe-core as the gate:
 *   `@storybook/addon-a11y@10.0.3` depends on `axe-core@^4.2.0` and
 *   resolves (in this lockfile) to `axe-core@4.11.4`. This script
 *   reads `node_modules/axe-core/axe.min.js` directly — the SAME
 *   bundle the addon ships. Both gate and baseline run the same axe.
 *   (An earlier draft used `@axe-core/playwright` AxeBuilder; we moved
 *   to direct script injection because the addon's call shape needs
 *   `axe.configure({rules})` then `axe.run(context, options)`, and
 *   AxeBuilder routes rules through axe.run's strict path. Direct
 *   injection lets us replicate the addon's exact sequence.)
 *
 * Output:
 *   `a11y-baseline.json` at repo root (committable). Schema:
 *     { generatedAt, axeCoreVersion, light: { ...summary }, dark: { ... } }
 *
 * Usage:
 *   npm run test:a11y:baseline               # both themes, full set
 *   npm run test:a11y:baseline -- --theme light
 *   npm run test:a11y:baseline -- --filter "components/menu"
 *   npm run test:a11y:baseline -- --workers 4   # paralelo (variance possible)
 *
 * Pre-requisites:
 *   - `storybook-static/` build (run `npm run build-storybook` first).
 *   - Playwright browser binaries installed (Vitest infra already
 *     installs them).
 *
 * Per-story overrides:
 *   The script reads `parameters.a11y.options.rules` from each story
 *   at render time (via `window.__STORYBOOK_PREVIEW__.currentRender.
 *   story.parameters`) and shallow-merges it into the global disable
 *   map before calling axe.run. Story-level wins per key — the same
 *   semantics Storybook's parameter deepmerge would apply at the gate.
 *   This honors:
 *     - DashboardLayout re-enabling region/landmark-one-main/
 *       page-has-heading-one (full-page composition).
 *     - Timeline/ManyItems bucket-F suppression (data-marker selector).
 *     - Any future per-story rule override following the same shape.
 *   `parameters.a11y.config.rules` is NOT honored (configure-time
 *   enable is broken under tag-runOnly — see a11y-config.mjs).
 *
 * What this script does NOT do:
 *   - Flip the gate. The serial reports a number. Flipping
 *     `a11y.test: "todo" → "error"` is a separate, human-driven step.
 */

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  a11yRules,
  a11yOptions,
  a11yChecks,
  a11yDisabledRules,
} from "../.storybook/a11y-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STATIC_DIR = join(ROOT, "storybook-static");

const DEFAULTS = {
  workers: 1,
  output: "a11y-baseline.json",
  filter: null,
  themes: ["light", "dark"],
  settleMs: 200,
  storyTimeout: 15000,
};

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) {
        console.error(`missing value for ${a}`);
        process.exit(2);
      }
      return v;
    };
    if (a === "--output") args.output = next();
    else if (a === "--filter") args.filter = new RegExp(next());
    else if (a === "--workers") args.workers = parseInt(next(), 10);
    else if (a === "--theme") args.themes = [next()];
    else if (a === "--settle") args.settleMs = parseInt(next(), 10);
    else if (a === "--story-timeout") args.storyTimeout = parseInt(next(), 10);
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: node scripts/a11y-serial-baseline.mjs [--theme light|dark] [--filter <regex>] [--workers N] [--output path]",
      );
      process.exit(0);
    } else {
      console.error(`unknown arg: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
};

async function startStaticServer() {
  if (!existsSync(STATIC_DIR)) {
    throw new Error(
      `${STATIC_DIR} not found. Run \`npm run build-storybook\` first.`,
    );
  }
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://x");
      let path = decodeURIComponent(url.pathname);
      if (path === "/") path = "/index.html";
      const file = join(STATIC_DIR, path);
      if (!file.startsWith(STATIC_DIR)) {
        res.statusCode = 403;
        res.end("forbidden");
        return;
      }
      const data = await readFile(file);
      res.setHeader(
        "content-type",
        MIME[extname(file)] || "application/octet-stream",
      );
      res.end(data);
    } catch (e) {
      res.statusCode = 404;
      res.end(`not found: ${req.url}`);
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const addr = server.address();
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  return { server, baseUrl };
}

async function loadStoryIds(filter) {
  const indexPath = join(STATIC_DIR, "index.json");
  const raw = JSON.parse(await readFile(indexPath, "utf8"));
  const entries = Object.values(raw.entries || {});
  const stories = entries.filter((e) => e.type === "story");
  return filter ? stories.filter((s) => filter.test(s.id)) : stories;
}

/**
 * Wait for render-terminal: Storybook 10 sets `sb-show-main` BEFORE
 * #storybook-root has rendered children. Polling on the class alone
 * gives ~67% false-positive empty-render. Require BOTH the class AND
 * a non-empty root, then a small settle window.
 */
async function waitForRender(page, settleMs, storyTimeout) {
  await page.waitForFunction(
    () => {
      const main = document.body.classList.contains("sb-show-main");
      const root = document.getElementById("storybook-root");
      return main && root && root.children.length > 0;
    },
    null,
    { timeout: storyTimeout },
  );
  await page.waitForTimeout(settleMs);
}

async function runStory({
  browser,
  baseUrl,
  axeSource,
  theme,
  storyId,
  settleMs,
  storyTimeout,
}) {
  // colorScheme is set at context creation. `emulateMedia` exists on
  // Page (not BrowserContext) in this Playwright version; setting it
  // via context options is the equivalent and applies to all pages in
  // the context.
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ...(theme === "dark" ? { colorScheme: "dark" } : {}),
  });
  const page = await context.newPage();
  try {
    // `globals=a11y.manual:!true` (Storybook 10 URL-globals syntax:
    // `!true` = boolean true) flips `globals.a11y.manual = true`,
    // which short-circuits the addon-a11y `afterEach` handler (see
    // chunk-W2OC36OK.js:154 — `shouldRunEnvironmentIndependent` is
    // false when `a11yGlobals?.manual === true`). Without this, the
    // addon kicks off its OWN axe.run after each story render. When
    // this script's `page.evaluate(axe.run)` collides with the
    // addon's still-in-flight run (CI is slower than local; the
    // race window widens), axe throws "Axe is already running. Use
    // `await axe.run()` to wait for the previous run to finish". The
    // CI failure on PR #82 surfaced this — locally the 200ms settle
    // was enough for the addon to finish before this script's run
    // started, so it worked by accident. The URL globals fix is the
    // deterministic version: the addon does not run here, only this
    // script does.
    const url =
      `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}` +
      `&viewMode=story&globals=a11y.manual:!true`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await waitForRender(page, settleMs, storyTimeout);

    // Inject the SAME axe-core bundle the addon ships with, then
    // replicate the addon's exact sequence, including per-story
    // parameters.a11y overrides:
    //   1. axe.reset()
    //   2. axe.configure({ rules: [...] })
    //   3. axe.run(context, options) — with options.rules merged from
    //      global preview.tsx disable + per-story story params
    //      (story-level wins per Storybook's deepmerge contract).
    // Source: node_modules/@storybook/addon-a11y/dist/_browser-chunks/
    //   chunk-W2OC36OK.js (the `axe-runner` module).
    //
    // Why this exact sequence:
    //   - `axe.configure({ rules })` is LENIENT — silently ignores
    //     unknown rule IDs. The first version of this script used the
    //     run-options `rules` field, which is STRICT and threw on
    //     `video-description` (a rule in our preview.tsx that isn't
    //     registered in axe-core 4.11). The gate (addon) tolerates the
    //     unknown rule; the baseline now does too. If the two had
    //     different tolerance, the baseline would not be a faithful
    //     record of the gate.
    //   - The addon hard-codes `{ id: "region", enabled: false }` as
    //     DISABLED_RULES even before user config. Our preview.tsx
    //     already disables `region` explicitly, so the duplicate is
    //     harmless — axe.configure tolerates duplicate IDs (last wins).
    //   - `context` mirrors the addon's body-minus-sb-internals:
    //       include: document.body
    //       exclude: .sb-wrapper, #storybook-docs,
    //                #storybook-highlights-root
    //     Without this, axe would scan Storybook chrome that the gate
    //     deliberately excludes.
    //   - `options` carries `runOnly`, `restoreScroll`, and per-check
    //     options (color-contrast.contrastRatio). axe-core 4.11
    //     accepts `checks` at axe.run-options level.
    // Read per-story a11y params (if declared). Storybook exposes the
    // resolved story.parameters at runtime; we read .a11y.options.rules
    // to merge with the global disable map. This is the same shape the
    // addon would receive after Storybook's parameter deepmerge.
    const perStoryA11y = await page.evaluate(() => {
      const sb = window.__STORYBOOK_PREVIEW__;
      const params = sb?.currentRender?.story?.parameters?.a11y;
      return {
        optionsRules: params?.options?.rules || null,
        configRules: params?.config?.rules || null,
      };
    });

    await page.addScriptTag({ content: axeSource });

    // Merge global disabled-rules with per-story options.rules
    // (per-story wins per key — the merge semantics Storybook applies).
    const mergedRules = {
      ...a11yDisabledRules,
      ...(perStoryA11y.optionsRules || {}),
    };

    const violations = await page.evaluate(
      async ({ rules, runOnly, restoreScroll, checks, finalRules }) => {
        const axe = window.axe;
        axe.reset();
        // configure-time rule list is kept for parity with addon-a11y's
        // call shape (it spreads `config.rules` into axe.configure), even
        // though enabled:false there is ineffective under tag-runOnly.
        // The actual enable/disable flows through `options.rules` below.
        axe.configure({
          rules: [{ id: "region", enabled: false }, ...rules],
        });
        const context = {
          include: document.body,
          exclude: [
            ".sb-wrapper",
            "#storybook-docs",
            "#storybook-highlights-root",
          ],
        };
        const results = await axe.run(context, {
          runOnly,
          restoreScroll,
          checks,
          rules: finalRules,
        });
        return results.violations;
      },
      {
        rules: a11yRules,
        runOnly: a11yOptions.runOnly,
        restoreScroll: a11yOptions.restoreScroll,
        checks: a11yChecks,
        finalRules: mergedRules,
      },
    );

    return {
      storyId,
      status: "ok",
      violations,
    };
  } catch (err) {
    return {
      storyId,
      status: "error",
      error: String(err && err.message ? err.message : err),
    };
  } finally {
    await context.close();
  }
}

function summarize(perStory) {
  const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const byRule = {};
  const storiesWithErrors = [];
  let totalNodes = 0;
  let totalStories = 0;
  let storiesWithViolations = 0;
  for (const r of perStory) {
    totalStories++;
    if (r.status === "error") {
      storiesWithErrors.push({ storyId: r.storyId, error: r.error });
      continue;
    }
    if (r.violations.length > 0) storiesWithViolations++;
    for (const v of r.violations) {
      const nodes = v.nodes.length;
      totalNodes += nodes;
      byImpact[v.impact || "minor"] =
        (byImpact[v.impact || "minor"] || 0) + nodes;
      if (!byRule[v.id])
        byRule[v.id] = { impact: v.impact, nodes: 0, stories: new Set() };
      byRule[v.id].nodes += nodes;
      byRule[v.id].stories.add(r.storyId);
    }
  }
  // Serialize rule -> { impact, nodes, stories: [...] }
  const rules = {};
  for (const [id, v] of Object.entries(byRule)) {
    rules[id] = {
      impact: v.impact,
      nodes: v.nodes,
      stories: Array.from(v.stories).sort(),
    };
  }
  // Per-story (only stories with violations)
  const perStoryReport = perStory
    .filter((r) => r.status === "ok" && r.violations.length > 0)
    .map((r) => ({
      storyId: r.storyId,
      nodes: r.violations.reduce((acc, v) => acc + v.nodes.length, 0),
      violations: r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
      })),
    }));
  return {
    totalStories,
    storiesWithViolations,
    totalNodes,
    byImpact,
    storiesWithErrors,
    rules,
    stories: perStoryReport,
  };
}

async function runTheme({
  baseUrl,
  browser,
  axeSource,
  stories,
  theme,
  workers,
  settleMs,
  storyTimeout,
}) {
  const total = stories.length;
  let done = 0;
  const results = new Array(total);
  console.log(`\n[${theme}] running ${total} stories (workers=${workers}) …`);
  const startedAt = Date.now();

  if (workers === 1) {
    for (let i = 0; i < stories.length; i++) {
      results[i] = await runStory({
        browser,
        axeSource,
        baseUrl,
        theme,
        storyId: stories[i].id,
        settleMs,
        storyTimeout,
      });
      done++;
      if (done % 25 === 0 || done === total) {
        process.stdout.write(`  [${done}/${total}] …\n`);
      }
    }
  } else {
    let cursor = 0;
    const next = async () => {
      while (true) {
        const myIdx = cursor++;
        if (myIdx >= stories.length) return;
        results[myIdx] = await runStory({
          browser,
          baseUrl,
          axeSource,
          theme,
          storyId: stories[myIdx].id,
          settleMs,
          storyTimeout,
        });
        done++;
        if (done % 25 === 0 || done === total) {
          process.stdout.write(`  [${done}/${total}] …\n`);
        }
      }
    };
    await Promise.all(Array.from({ length: workers }, () => next()));
  }

  const durationMs = Date.now() - startedAt;
  console.log(`[${theme}] done in ${(durationMs / 1000).toFixed(1)}s`);
  return { results, durationMs };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Get the actual axe-core version that will be used (via dedup).
  let axeCoreVersion = "unknown";
  try {
    const pkg = JSON.parse(
      await readFile(join(ROOT, "node_modules/axe-core/package.json"), "utf8"),
    );
    axeCoreVersion = pkg.version;
  } catch {}

  console.log(`axe-core version: ${axeCoreVersion}`);
  console.log(`themes: ${args.themes.join(", ")}`);

  // Read the EXACT same axe-core bundle the addon loads, to inject
  // into each story page. This pins the serial to the same axe-core
  // installation that the gate uses.
  const axeSource = await readFile(
    join(ROOT, "node_modules/axe-core/axe.min.js"),
    "utf8",
  );

  const { server, baseUrl } = await startStaticServer();
  console.log(`static server: ${baseUrl}`);

  const stories = await loadStoryIds(args.filter);
  console.log(`stories: ${stories.length}${args.filter ? ` (filtered)` : ""}`);

  const browser = await chromium.launch({ headless: true });
  const themeReports = {};

  try {
    for (const theme of args.themes) {
      const { results, durationMs } = await runTheme({
        baseUrl,
        browser,
        axeSource,
        stories,
        theme,
        workers: args.workers,
        settleMs: args.settleMs,
        storyTimeout: args.storyTimeout,
      });
      themeReports[theme] = {
        durationMs,
        ...summarize(results),
      };
    }
  } finally {
    await browser.close();
    server.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    axeCoreVersion,
    workers: args.workers,
    settleMs: args.settleMs,
    storyTimeout: args.storyTimeout,
    filter: args.filter ? args.filter.source : null,
    themes: args.themes,
    ...themeReports,
  };

  const outPath = resolve(ROOT, args.output);
  await writeFile(outPath, JSON.stringify(report, null, 2));
  console.log(`\nreport: ${outPath}`);

  // Print a tiny summary to stdout so CI logs show the number.
  for (const theme of args.themes) {
    const r = themeReports[theme];
    const cs = r.byImpact.critical + r.byImpact.serious;
    console.log(
      `[${theme}] critical=${r.byImpact.critical} serious=${r.byImpact.serious} moderate=${r.byImpact.moderate} minor=${r.byImpact.minor} (critical+serious=${cs})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
