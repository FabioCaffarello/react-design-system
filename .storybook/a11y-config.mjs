/**
 * Shared a11y axe configuration.
 *
 * Consumed by:
 *   - `.storybook/preview.tsx` — addon-a11y / vitest-storybook gate config
 *     (parameters.a11y).
 *   - `scripts/a11y-serial-baseline.mjs` — the committable serial baseline
 *     runner that records the number on which the gate is flipped.
 *
 * Why a single source: the serial baseline is the record-of-virada for
 * flipping `a11y.test: "todo" → "error"`. The two MUST measure with the
 * same rule set, the same disabled rules, the same axe options. If they
 * diverge, the baseline stops being a faithful record of what the gate
 * would block on, and a future "is the gate still honest?" check becomes
 * unanswerable.
 *
 * This is `.mjs` (plain JS with ESM) so both the TypeScript preview.tsx
 * (via Vite's loader) and the Node `.mjs` baseline runner can import it
 * without a transpiler step.
 *
 * To add or remove a rule: edit it here. Both the gate and the baseline
 * pick it up on next run. Do NOT shadow rules inline in preview.tsx or
 * the script.
 */

/**
 * Rule enable/disable list, in the array shape that
 * `@storybook/addon-a11y` expects (parameters.a11y.config.rules).
 *
 * Three rules are disabled globally as Storybook-iframe context
 * exceptions (region / landmark-one-main / page-has-heading-one) and
 * MAY be re-enabled per-story when the story renders a full page
 * (currently only DashboardLayout). See `docs/ACCESSIBILITY.md`
 * "Story-iframe exceptions" for the rationale.
 */
export const a11yRules = [
  // Perceivable - Text Alternatives
  { id: "image-alt", enabled: true },
  { id: "object-alt", enabled: true },
  { id: "role-img-alt", enabled: true },
  { id: "video-caption", enabled: true },
  { id: "audio-caption", enabled: true },

  // Perceivable - Time-based Media
  { id: "video-description", enabled: true },

  // Perceivable - Adaptable
  { id: "html-has-lang", enabled: true },
  { id: "html-lang-valid", enabled: true },
  { id: "valid-lang", enabled: true },

  // Perceivable - Distinguishable
  { id: "color-contrast", enabled: true },
  { id: "color-contrast-enhanced", enabled: false }, // AAA level, optional
  { id: "avoid-inline-spacing", enabled: true },

  // Operable - Keyboard Accessible
  { id: "keyboard", enabled: true },
  { id: "keyboard-navigation", enabled: true },
  { id: "no-keyboard-trap", enabled: true },
  { id: "focus-order-semantics", enabled: true },

  // Operable - Enough Time
  { id: "meta-refresh", enabled: true },
  { id: "timed-media", enabled: true },

  // Operable - Seizures and Physical Reactions
  { id: "blink", enabled: true },

  // Operable - Navigable
  { id: "bypass", enabled: true },
  { id: "document-title", enabled: true },
  { id: "link-purpose", enabled: true },
  { id: "scrollable-region-focusable", enabled: true },

  // Understandable - Input Assistance
  { id: "label", enabled: true },
  { id: "label-title-only", enabled: true },
  { id: "form-field-multiple-labels", enabled: true },
  { id: "error-message", enabled: true },

  // Robust - Parsing
  { id: "duplicate-id", enabled: true },
  { id: "duplicate-id-active", enabled: true },
  { id: "duplicate-id-aria", enabled: true },

  // Robust - Name, Role, Value
  { id: "aria-allowed-attr", enabled: true },
  { id: "aria-required-attr", enabled: true },
  { id: "aria-required-children", enabled: true },
  { id: "aria-required-parent", enabled: true },
  { id: "aria-roles", enabled: true },
  { id: "aria-valid-attr", enabled: true },
  { id: "aria-valid-attr-value", enabled: true },
  { id: "button-name", enabled: true },
  { id: "input-button-name", enabled: true },
  { id: "link-name", enabled: true },
  { id: "list", enabled: true },
  { id: "listitem", enabled: true },
  { id: "select-name", enabled: true },
  { id: "table-fake-caption", enabled: true },
  { id: "td-headers-attr", enabled: true },
  { id: "th-has-data-cells", enabled: true },
  { id: "aria-hidden-focus", enabled: true },
  { id: "aria-hidden-body", enabled: true },
  { id: "aria-input-field-name", enabled: true },
  { id: "aria-meter-name", enabled: true },
  { id: "aria-progressbar-name", enabled: true },
  { id: "aria-slider-name", enabled: true },
  { id: "aria-tooltip-name", enabled: true },
  { id: "aria-treeitem-name", enabled: true },
  { id: "heading-order", enabled: true },

  // Storybook-iframe context exceptions — disabled globally; re-enabled
  // per-story on full-page compositions (DashboardLayout).
  { id: "region", enabled: false },
  { id: "landmark-one-main", enabled: false },
  { id: "page-has-heading-one", enabled: false },
];

/**
 * axe run options — restricts the active tags to WCAG 2 A / AA / 2.1 AA
 * plus axe best-practice. `restoreScroll: true` is an addon-specific
 * flag (not consumed by axe.run); `noScroll` on `color-contrast` is the
 * one consequential check option (already the addon's default but pinned
 * here for documentation).
 */
export const a11yOptions = {
  restoreScroll: true,
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
  },
};

/**
 * Per-check option overrides. Currently only color-contrast pins the
 * WCAG 2.1 AA threshold (4.5:1) explicitly and disables axe's scroll
 * behavior (which interferes with element measurement in headless
 * Chromium).
 */
export const a11yChecks = {
  "color-contrast": {
    options: {
      noScroll: true,
      contrastRatio: 4.5,
    },
  },
};

/**
 * Disabled-rule overrides in the `axe.run(context, options).rules`
 * shape. Used for BOTH the addon-a11y gate (via `parameters.a11y.options
 * .rules` in preview.tsx) and the serial baseline runner.
 *
 * Why this lives at run-options level (not configure-time):
 *
 *   `axe.configure({ rules: [{ id, enabled: false }] })` sets the
 *   internal `enabled` flag on the rule spec, but when `axe.run` is
 *   called with `runOnly: { type: "tag", values: [...] }`, axe-core
 *   4.11.4 selects rules by tag match and IGNORES the configure-time
 *   `enabled` flag. The earlier inline rule list in preview.tsx was
 *   declaring `{ id: "region", enabled: false }` (and friends) via
 *   `config.rules` — that path no-ops in this axe-core version.
 *
 *   The addon-a11y source confirms it does
 *     `axe.configure({ rules: [...] }); axe.run(context, options)`
 *   verbatim — so the broken configure-disable behavior IS what the
 *   gate would have enforced. The disable was a declared promise the
 *   tool didn't keep. The serial baseline runner discovered this by
 *   reporting `region` violations on 5 of 24 button stories (10 nodes,
 *   moderate) — exactly the rule preview.tsx claimed to disable.
 *
 *   The fix is to move enable/disable INTO axe.run's `rules` option
 *   instead: `axe.run(context, { ..., rules: { region: { enabled:
 *   false } } })` IS honored. The trade-off is strictness on unknown
 *   rule IDs — but the four IDs below are all canonical axe-core 4.11
 *   rules (verified in `axe.getRules()`), so they pass.
 *
 *   Per-story re-enable (DashboardLayout: full-page composition where
 *   landmark/heading rules are legitimate) must mirror this — also
 *   use `parameters.a11y.options.rules` with `{ enabled: true }`. The
 *   legacy `config.rules` re-enable would have been a no-op under
 *   tag-runOnly anyway (same root cause).
 */
export const a11yDisabledRules = Object.fromEntries(
  a11yRules
    .filter((r) => r.enabled === false)
    .map((r) => [r.id, { enabled: false }]),
);
