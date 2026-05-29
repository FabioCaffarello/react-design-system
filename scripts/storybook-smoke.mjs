#!/usr/bin/env node
// Phase 13a smoke runner: render every Storybook story headlessly and
// report which ones crash, time out, render empty, or log console errors.
// Detector only — does not fix anything.
//
// Render-detection rationale:
// Storybook 10's body classes (sb-show-main, sb-show-errordisplay,
// sb-show-nopreview) signal which DOCUMENT MODE was selected, NOT
// whether the story actually rendered. The pipeline is:
//   1. body gets sb-show-main
//   2. #storybook-root is cleared
//   3. React mounts children
// Polling between steps 1-2 and 3 gives ~67% false-positive
// 'fail-empty' rate. We require BOTH state === 'main' AND
// #storybook-root.children.length > 0 before declaring pass. If the
// poll ever needs to be simplified back to "just check body class",
// don't — this dual gate is what makes the verdict mean "rendered",
// not "Storybook picked story mode".
//
// Per-story allowlist:
// Stories that intentionally emit console errors (e.g. demonstrating
// fallback behavior with an invalid URL) declare parameters.smoke.
// allowConsoleErrors with an array of patterns. Patterns are matched
// against console.error text — strings via substring, "/regex/flags"
// literals via RegExp. Matched messages move to allowedWarnings and
// stop counting toward fail-error.
//
// Storybook 10 does NOT expose parameters via index.json (they can
// be computed/functions; deliberate Storybook design). We read them
// at runtime from window.__STORYBOOK_PREVIEW__.currentRender.story.
// parameters, after the render-terminal check, with a small settle
// window so late errors (e.g. <img onerror> after a network failure)
// are captured before we finalize the verdict.
//
// Four cases for parameters.smoke validation, surfaced in the report:
//   1. absent: normal story, nothing to do.
//   2. allowConsoleErrors + reason (non-placeholder): correct use.
//   3. allowConsoleErrors + reason missing/empty/placeholder
//      (TODO/FIXME/tbd/wip/n/a): allowlist still applied, but story
//      id is listed under undocumentedAllowlists — pressure without
//      punishment.
//   4. parameters.smoke declared but allowConsoleErrors empty/missing:
//      story id is listed under deadSmokeConfigs — probable typo or
//      stale config.

import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const DEFAULTS = {
  workers: 6,
  output: "smoke-report.json",
  filter: null,
  port: 0,
  timeout: 5000,
  settleMs: 150,
  baseUrl: null,
  screenshotDir: "smoke-failures",
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
    else if (a === "--port") args.port = parseInt(next(), 10);
    else if (a === "--timeout") args.timeout = parseInt(next(), 10);
    else if (a === "--settle-ms") args.settleMs = parseInt(next(), 10);
    else if (a === "--base-url") args.baseUrl = next();
    else if (a === "--screenshot-dir") args.screenshotDir = next();
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`unknown argument: ${a}`);
      printHelp();
      process.exit(2);
    }
  }
  return args;
}

function printHelp() {
  console.log(`storybook-smoke — render every story and report failures.

Usage:
  node scripts/storybook-smoke.mjs [options]

Options:
  --output <file>          JSON report path (default: smoke-report.json)
  --filter <regex>         Only run stories whose id matches the regex
  --workers <n>            Parallel pages (default: 6)
  --port <n>               HTTP port for static server (default: random)
  --timeout <ms>           Per-story render timeout (default: 5000)
  --settle-ms <ms>         Post-render settle window for late console
                           errors (default: 150)
  --base-url <url>         Skip static server, use external URL
  --screenshot-dir <dir>   Where to write failure screenshots
                           (default: smoke-failures)
  --help, -h               Show this help

Behavior:
  - Requires storybook-static/index.json. Run \`npm run build-storybook\`
    first if missing.
  - Starts an ephemeral HTTP server over storybook-static/ unless
    --base-url is given.
  - Each story is opened at /iframe.html?id=<id>&viewMode=story.
  - Pass criteria: body acquires class \`sb-show-main\`, \`#storybook-root\`
    has children, no \`pageerror\`, no console.error.
  - Fail categories: fail-error, fail-empty, fail-timeout.
  - Warnings are collected but never cause failure.
  - Failure screenshots are written under --screenshot-dir.
  - Exit code: 0 if zero failures, 1 if any, 2 on configuration error.`);
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
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".map": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

async function startStaticServer(rootDir, port) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === "/" || pathname === "") pathname = "/iframe.html";
      const filePath = resolve(rootDir, "." + pathname);
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        return res.end("forbidden");
      }
      const s = await stat(filePath).catch(() => null);
      if (!s || !s.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end(`not found: ${pathname}`);
      }
      const body = await readFile(filePath);
      const mime =
        MIME[extname(pathname).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": mime,
        "Cache-Control": "no-store",
        "Content-Length": body.length,
      });
      res.end(body);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(String(e));
    }
  });
  await new Promise((res, rej) => {
    server.once("error", rej);
    server.listen(port, "127.0.0.1", res);
  });
  return server;
}

async function loadStoryIndex(staticDir) {
  const idx = join(staticDir, "index.json");
  if (!existsSync(idx)) {
    throw new Error(
      `storybook-static/index.json not found at ${idx}. Run \`npm run build-storybook\` first.`,
    );
  }
  const data = JSON.parse(await readFile(idx, "utf8"));
  if (!data || typeof data !== "object" || !data.entries) {
    throw new Error(
      `unexpected index.json shape (expected { entries: {...} }). Storybook version mismatch?`,
    );
  }
  return Object.values(data.entries).filter((e) => e && e.type === "story");
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

const PLACEHOLDER_REASONS = new Set(["todo", "fixme", "tbd", "wip", "n/a"]);

function isPlaceholderReason(s) {
  if (typeof s !== "string") return true;
  const trimmed = s.trim().toLowerCase();
  if (trimmed === "") return true;
  return PLACEHOLDER_REASONS.has(trimmed);
}

function patternMatches(pattern, text) {
  if (typeof pattern !== "string") return false;
  const reMatch = pattern.match(/^\/(.+)\/([gimsuy]*)$/);
  if (reMatch) {
    try {
      return new RegExp(reMatch[1], reMatch[2]).test(text);
    } catch {
      // malformed regex literal — fall back to substring match
      return text.includes(pattern);
    }
  }
  return text.includes(pattern);
}

// Resolves the four-case state of parameters.smoke. Used both to
// apply the allowlist and to surface stories under
// undocumentedAllowlists / deadSmokeConfigs in the final report.
function evaluateSmokeConfig(smokeParam) {
  if (!smokeParam || typeof smokeParam !== "object") {
    return { declared: false, state: "absent", allow: [], reason: null };
  }
  const allow = Array.isArray(smokeParam.allowConsoleErrors)
    ? smokeParam.allowConsoleErrors.filter((p) => typeof p === "string")
    : [];
  const reason =
    typeof smokeParam.reason === "string" ? smokeParam.reason : null;
  if (allow.length === 0) {
    return { declared: true, state: "dead", allow: [], reason };
  }
  if (isPlaceholderReason(reason)) {
    return { declared: true, state: "undocumented", allow, reason };
  }
  return { declared: true, state: "ok", allow, reason };
}

// Polls the page for terminal render state.
// Terminal states that short-circuit the poll:
//   - errordisplay  → story threw; return immediately
//   - nopreview     → story not found; return immediately
//   - main + hasChildren → fully rendered; return immediately
// Non-terminal: main + !hasChildren (the race window described in the
// header). Keep polling until children appear OR deadline expires.
// On deadline we return the last seen result so the caller can
// distinguish "main but empty after timeout" (true fail-empty) from
// "never reached any terminal state" (fail-timeout, returns null).
async function waitForRenderState(page, deadline) {
  let lastSeen = null;
  while (Date.now() < deadline) {
    const result = await page
      .evaluate(() => {
        const body = document.body;
        if (!body) return null;
        const cls = body.className || "";
        let state = "unknown";
        if (cls.includes("sb-show-errordisplay")) state = "errordisplay";
        else if (cls.includes("sb-show-nopreview")) state = "nopreview";
        else if (cls.includes("sb-show-main")) state = "main";
        const root = document.querySelector("#storybook-root");
        const hasChildren = !!root && root.children.length > 0;
        const errMsg =
          document.querySelector("#error-message")?.textContent || null;
        const errStack =
          document.querySelector("#error-stack")?.textContent || null;
        return { state, hasChildren, errMsg, errStack };
      })
      .catch(() => null);
    if (result) lastSeen = result;
    if (
      result &&
      (result.state === "errordisplay" || result.state === "nopreview")
    ) {
      return result;
    }
    if (result && result.state === "main" && result.hasChildren) {
      return result;
    }
    await page.waitForTimeout(75);
  }
  return lastSeen;
}

async function smokeStory(context, baseUrl, story, opts) {
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const warnings = [];

  page.on("pageerror", (err) => {
    pageErrors.push({ message: err.message, stack: err.stack });
  });
  page.on("console", (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === "error") consoleErrors.push(text);
    else if (t === "warning" || t === "warn") warnings.push(text);
  });

  const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
  const t0 = Date.now();
  let status = "pass";
  let detail = null;
  let renderState = null;

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: opts.timeout,
    });
    renderState = await waitForRenderState(page, t0 + opts.timeout);

    if (!renderState || renderState.state === "unknown") {
      status = "fail-timeout";
      detail = "no terminal sb-show-* class within timeout";
    } else if (renderState.state === "errordisplay") {
      status = "fail-error";
      detail = renderState.errMsg || "storybook error overlay";
      pageErrors.push({
        message: renderState.errMsg || "storybook error overlay",
        stack: renderState.errStack || null,
        source: "storybook-overlay",
      });
    } else if (renderState.state === "nopreview") {
      status = "fail-empty";
      detail = "storybook reports no preview for this id";
    } else if (renderState.state === "main" && !renderState.hasChildren) {
      // Reached only when the deadline expired while body was main but
      // #storybook-root never got children — a genuinely empty story.
      status = "fail-empty";
      detail = "sb-show-main but #storybook-root remained empty until timeout";
    }
  } catch (e) {
    if (/Timeout|timeout/i.test(String(e))) {
      status = "fail-timeout";
      detail = String(e.message || e);
    } else {
      status = "fail-error";
      detail = String(e.message || e);
      pageErrors.push({
        message: detail,
        stack: e.stack,
        source: "navigation",
      });
    }
  }

  // Settle window — captures late console.errors (typically <img>
  // network failures whose onerror fires shortly after React mounts)
  // so they are visible when we read parameters.smoke and partition.
  // Skipped when render failed; the verdict is already terminal.
  if (status === "pass") {
    await page.waitForTimeout(opts.settleMs);
  }

  // Read parameters.smoke from the running preview. See header.
  let smokeParam = null;
  if (status === "pass") {
    smokeParam = await page
      .evaluate(() => {
        try {
          return (
            window.__STORYBOOK_PREVIEW__?.currentRender?.story?.parameters
              ?.smoke ?? null
          );
        } catch {
          return null;
        }
      })
      .catch(() => null);
  }
  const smokeConfig = evaluateSmokeConfig(smokeParam);

  // Partition console errors against the allowlist (only if state === ok
  // or undocumented — both apply patterns; dead has no patterns).
  const allowedWarnings = [];
  const remainingConsoleErrors = [];
  for (const msg of consoleErrors) {
    let matched = null;
    if (
      smokeConfig.declared &&
      (smokeConfig.state === "ok" || smokeConfig.state === "undocumented") &&
      smokeConfig.allow.length > 0
    ) {
      for (const p of smokeConfig.allow) {
        if (patternMatches(p, msg)) {
          matched = p;
          break;
        }
      }
    }
    if (matched) {
      allowedWarnings.push({ message: msg, matchedPattern: matched });
    } else {
      remainingConsoleErrors.push(msg);
    }
  }

  // Promote remaining console errors / pageerrors to failure. Errors
  // that matched the allowlist do not count.
  if (
    status === "pass" &&
    (pageErrors.length > 0 || remainingConsoleErrors.length > 0)
  ) {
    status = "fail-error";
    detail = "console.error or pageerror after render";
  }

  const durationMs = Date.now() - t0;

  let screenshot = null;
  if (status !== "pass" && opts.screenshotDir) {
    try {
      await mkdir(opts.screenshotDir, { recursive: true });
      const file = join(opts.screenshotDir, `${sanitizeId(story.id)}.png`);
      await page.screenshot({ path: file, fullPage: false, timeout: 3000 });
      screenshot = file;
    } catch {
      // best-effort; never fail the report writer over a screenshot
    }
  }

  await page.close().catch(() => {});

  return {
    id: story.id,
    title: story.title,
    name: story.name,
    importPath: story.importPath,
    status,
    detail,
    renderState: renderState ? renderState.state : null,
    errors: pageErrors.concat(
      remainingConsoleErrors.map((m) => ({
        message: m,
        source: "console.error",
      })),
    ),
    warnings,
    allowedWarnings,
    smokeConfig,
    screenshot,
    durationMs,
  };
}

async function workerPool(items, n, worker) {
  const results = new Array(items.length);
  let i = 0;
  const lanes = [];
  for (let w = 0; w < Math.min(n, items.length); w++) {
    lanes.push(
      (async () => {
        while (true) {
          const idx = i++;
          if (idx >= items.length) return;
          results[idx] = await worker(items[idx], idx);
        }
      })(),
    );
  }
  await Promise.all(lanes);
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const staticDir = join(ROOT, "storybook-static");
  if (!existsSync(staticDir)) {
    console.error(
      `storybook-static/ not found at ${staticDir}. Run \`npm run build-storybook\` first.`,
    );
    process.exit(2);
  }

  console.error("[smoke] loading story index…");
  const allStories = await loadStoryIndex(staticDir);
  const stories = args.filter
    ? allStories.filter((s) => args.filter.test(s.id))
    : allStories;
  console.error(
    `[smoke] ${stories.length} stories selected (of ${allStories.length} total)`,
  );
  if (stories.length === 0) {
    console.error("[smoke] nothing to do");
    process.exit(0);
  }

  let server = null;
  let baseUrl = args.baseUrl;
  if (!baseUrl) {
    server = await startStaticServer(staticDir, args.port);
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
    console.error(`[smoke] serving ${staticDir} on ${baseUrl}`);
  } else {
    console.error(`[smoke] using external base url ${baseUrl}`);
  }

  // Clean previous screenshots so leftovers from a prior run don't lie.
  const screenshotAbs = resolve(ROOT, args.screenshotDir);
  await rm(screenshotAbs, { recursive: true, force: true }).catch(() => {});

  console.error("[smoke] launching chromium…");
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch (e) {
    console.error(
      "[smoke] @playwright/test is not installed. Run `npm i -D @playwright/test` first.",
    );
    console.error("[smoke] underlying error:", e.message);
    process.exit(2);
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

  const t0 = Date.now();
  let done = 0;
  const results = await workerPool(stories, args.workers, async (story) => {
    const r = await smokeStory(context, baseUrl, story, {
      timeout: args.timeout,
      settleMs: args.settleMs,
      screenshotDir: screenshotAbs,
    });
    done++;
    if (r.status !== "pass") {
      process.stderr.write(
        `  [${done}/${stories.length}] FAIL ${r.status} ${r.id} — ${r.detail}\n`,
      );
    } else if (done % 25 === 0) {
      process.stderr.write(`  [${done}/${stories.length}] …\n`);
    }
    return r;
  });
  const elapsed = Date.now() - t0;

  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  if (server) await new Promise((r) => server.close(r));

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.length - passed;
  const byStatus = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const totalWarnings = results.reduce((acc, r) => acc + r.warnings.length, 0);
  const totalAllowedWarnings = results.reduce(
    (acc, r) => acc + r.allowedWarnings.length,
    0,
  );
  const storiesWithAllowlist = results
    .filter((r) => r.smokeConfig.state === "ok")
    .map((r) => r.id);
  const undocumentedAllowlists = results
    .filter((r) => r.smokeConfig.state === "undocumented")
    .map((r) => r.id);
  const deadSmokeConfigs = results
    .filter((r) => r.smokeConfig.state === "dead")
    .map((r) => r.id);

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    workers: args.workers,
    timeoutMs: args.timeout,
    settleMs: args.settleMs,
    durationMs: elapsed,
    total: results.length,
    passed,
    failed,
    byStatus,
    totalWarnings,
    totalAllowedWarnings,
    storiesWithAllowlist,
    undocumentedAllowlists,
    deadSmokeConfigs,
    stories: results,
  };

  const outAbs = resolve(ROOT, args.output);
  await writeFile(outAbs, JSON.stringify(report, null, 2));
  console.error(
    `[smoke] done in ${(elapsed / 1000).toFixed(1)}s — passed=${passed} failed=${failed} warnings=${totalWarnings} allowed=${totalAllowedWarnings} (${storiesWithAllowlist.length} stories)`,
  );
  if (undocumentedAllowlists.length > 0) {
    console.error(
      `[smoke] ${undocumentedAllowlists.length} story/ies use smoke.allowConsoleErrors but smoke.reason is missing/placeholder:`,
    );
    for (const id of undocumentedAllowlists) console.error(`  - ${id}`);
  }
  if (deadSmokeConfigs.length > 0) {
    console.error(
      `[smoke] ${deadSmokeConfigs.length} story/ies declare parameters.smoke with no actionable content:`,
    );
    for (const id of deadSmokeConfigs) console.error(`  - ${id}`);
  }
  console.error(`[smoke] report: ${outAbs}`);

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("[smoke] fatal:", e);
  process.exit(2);
});
