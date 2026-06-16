---
description: Color vocabulary and the 9 semantic precedents from Phase 7
globs: src/**/*.tsx, src/**/*.ts, src/**/*.{mdx,css}
---

# Color rules

This project consumes color via native Tailwind v4 classes generated from
`@theme` (`text-fg-*`, `bg-surface-*`, `border-line-*`, `bg-status-*`,
`bg-success/warning/error/info`, etc.), not via JS getters. Tokens describe
**role**, not tone. Use this file before applying any color in a component;
historical context lives in `PHASE_7_SEMANTIC_COLORS.md`.

The source of truth for all class names is `src/styles/semantic/colors.css`.
Dark-mode overrides live in `src/styles/themes/dark.css`. Adding a new color
means editing those files, not inlining values.

**Dark mode has two activation paths and BOTH must be maintained.**
`themes/dark.css` declares the dark token set twice:

1. `[data-theme="dark"], .dark { … }` — explicit consumer opt-in.
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]):not(.light) { … } }` — auto-apply when the OS prefers dark and no explicit opt-out is set.

CSS does **not** inherit custom-property declarations between selectors,
so the two blocks must declare the same set of tokens verbatim (modulo
selector header and `::selection` pseudo). A prior version of the file
listed only 5 of ~117 vars in the `@media` block with a comment claiming
"other variables would inherit from .dark" — that comment was wrong,
and the result was Modal/Dialog/CommandPalette rendering with white
backgrounds for every user on OS-dark without an explicit
`data-theme="dark"`. The bug was invisible to the light a11y baseline
and surfaced only when the dark baseline plumbing landed.

`scripts/validate-dark-coverage.mjs` runs in `pre-push` and CI; it
parses both blocks and fails on any divergence — duplication that
cannot drift. Theme-agnostic tokens (`--color-scrim`, `--color-tint-hover`,
per Principle 5 below) are allowlisted in the validator and stay out of
the dark blocks by design.

If you add a token to `semantic/colors.css`, add it to **both** dark
blocks. If it is intentionally theme-agnostic, add it to the validator's
allowlist with a Principle-5 rationale. There is no path where a
semantic color token has only one of the two declarations.

## Canonical vocabulary

The lists below are the public surface. If you need something not on the
list, read "Principle 9 — Incomplete semantic family" before inventing.

### Foreground (text & icons)

| Family                                                          | Purpose                                                      | Common uses                             |
| --------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| `text-fg-primary`                                               | Highest-emphasis text                                        | Headings, body copy                     |
| `text-fg-secondary`                                             | Secondary text                                               | Subheads, captions                      |
| `text-fg-tertiary`                                              | Tertiary text                                                | Metadata, help text                     |
| `text-fg-quaternary`                                            | Lowest-emphasis text in the ordered hierarchy                | Inactive labels                         |
| `text-fg-placeholder`                                           | Placeholder text                                             | Inputs, search fields                   |
| `text-fg-disabled`                                              | Binary off-state OR disabled interactivity (see Principle 6) | Off-star Rating, disabled Input         |
| `text-fg-inverse`                                               | Foreground on dark surface                                   | Tooltip body, inverse Toast             |
| `text-fg-inverse-secondary`                                     | Secondary text on inverse surface                            | Subtle inverse labels                   |
| `text-fg-link` / `-hover` / `-active` / `-visited`              | Links — the full state ladder                                | Anchor tags                             |
| `text-fg-brand`                                                 | Default brand foreground                                     | Brand-colored body link, logotype       |
| `text-fg-brand-emphasis`                                        | Emphasis brand foreground                                    | Active navbar item icon/label           |
| `text-fg-brand-secondary` / `-emphasis`                         | Secondary brand pair                                         | Secondary-branded UI                    |
| `text-fg-success` / `-warning` / `-error` / `-info`             | Feedback text                                                | Inline form errors, status text         |
| `text-fg-on-success` / `-on-warning` / `-on-error` / `-on-info` | On-color text — sits ON a solid status fill (`bg-*-solid`)   | Solid status badge/pill ("Virou norma") |

### Surface (backgrounds)

| Family                                                   | Purpose                                       | Notes                                                                                             |
| -------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `bg-surface-canvas`                                      | Page background                               | The lowest tier (Principle 4)                                                                     |
| `bg-surface-subtle` / `-muted` / `-emphasis` / `-strong` | Neutral scale (subtle→strong)                 | Hierarchy within page                                                                             |
| `bg-surface-inverse` / `-inverse-subtle`                 | Dark surfaces in light mode (flip with theme) | Tooltip background                                                                                |
| `bg-surface-base` / `-raised` / `-overlay`               | Elevation ladder (Principle 4)                | Card on canvas / Modal above page                                                                 |
| `bg-surface-sunken`                                      | Inset region                                  | Code blocks, inputs                                                                               |
| `bg-surface-disabled` / `-disabled-subtle`               | Disabled component surface                    | Disabled button background                                                                        |
| `bg-surface-hover` / `-hover-subtle`                     | Hover state on neutral surface                | Row hover, ghost button hover                                                                     |
| `bg-surface-active`                                      | Active (pressed)                              | Pressed button                                                                                    |
| `bg-surface-selected` / `-selected-subtle`               | Selected in collection (Principle 8)          | Selected row, selected tab                                                                        |
| `bg-surface-focus`                                       | Focus background tint                         | Focused input wrapper                                                                             |
| `bg-surface-brand`                                       | Decorative brand surface (no foreground text) | Progress bar fill, Slider thumb/track, Switch checked bg                                          |
| `bg-surface-brand-strong`                                | Brand surface that carries foreground text    | Primary Button, filled Chip, active Tabs, selected DatePicker day, active Stepper/Timeline bubble |
| `bg-surface-brand-emphasis`                              | Stronger brand surface for "pressed" states   | SideNavbarResizeHandle `active:` / `isResizing` (currently only consumer)                         |
| `bg-surface-brand-subtle` / `-brand-muted`               | Soft brand washes                             | Brand-tinted callout; **brand-muted = active singular** (Principle 8)                             |
| `bg-surface-secondary` / `-secondary-subtle`             | Secondary brand pair                          | Secondary-themed surface                                                                          |
| `bg-surface-accent` / `-accent-subtle`                   | Accent (cyan) pair                            | Accent callout                                                                                    |

### Lines (borders, dividers, separators)

| Family                                         | Purpose                   | Notes                      |
| ---------------------------------------------- | ------------------------- | -------------------------- |
| `border-line-default`                          | Default border            | Card outline, input border |
| `border-line-muted` / `-subtle`                | Subtler borders           | Inner dividers             |
| `border-line-emphasis` / `-strong`             | Stronger borders          | Active/focused outline alt |
| `border-line-inverse`                          | Border on inverse surface | Tooltip outline (rare)     |
| `border-line-focus` / `-focus-ring`            | Focus indicators          | Keyboard focus ring        |
| `border-line-brand` / `-secondary` / `-accent` | Brand-colored borders     | Branded outline button     |

Use the **`line-*` family for any visual line role** (separator, divider,
connector), even when CSS-rendered via `bg-*` or `height: 1px` — see
Principle 7.

### Status family (success / warning / error / info / neutral)

Each role exposes a five-class set: solid (`bg-success`), surface
(`bg-success-bg`, `bg-success-bg-emphasis`), border (`border-success`,
`border-success-emphasis`), foreground (`text-fg-success`), and icon
(`text-icon-success`). The neutral member is `bg-status-neutral` — it
completes the family for Dot/status Badge/online-presence indicators
where "no specific status" is a legitimate fifth state (Principle 9).

Do not use `text-fg-error` for general red text. Do not use `bg-error`
for a Dialog accent unless the dialog is semantically an error state.

#### Solid status fill + on-color text (the filled badge/pill)

There are **two** saturated solids per status, and they are not
interchangeable:

- `bg-success` (`--color-success`, emerald-500) is the **decorative**
  solid — Dot, Progress fill, Stepper/Timeline bubble. No text sits on
  it; white over it is only ~2.5:1.
- `bg-success-solid` (`--color-success-solid`, emerald-700) is the
  **text-carrying** solid — the filled status badge/pill. It pairs with
  `text-fg-on-success` (white) at AA for normal text (emerald-700 5.48:1,
  amber-700 5.02:1, rose-700 6.29:1, sky-700 5.93:1).

This split mirrors `surface-brand` (decorative) vs `surface-brand-strong`
(carries text). Always pair `bg-{status}-solid` with `text-fg-on-{status}`
— never `text-fg-inverse` (slate-900 in dark mode, a worse and
semantically wrong pair over a saturated fill) and never `text-fg-success`
(the colored text, invisible over its own fill). The solids stay saturated
with white text in **both** themes by design (a status chip behaves like a
colored button, not a neutral surface), so `dark.css` declares identical
values.

```tsx
// Solid "became law" achievement badge, AA in light and dark:
<span className="bg-success-solid text-fg-on-success">Virou norma</span>
```

### Theme-agnostic translucent layers

`bg-scrim` (50% black) and `bg-tint-hover` (10% black) **do not flip**
between light and dark — see Principle 5.

- `bg-scrim` — backdrop veil under modals/drawers/command palettes.
- `bg-tint-hover` — hover state layer for buttons embedded in elements
  whose background color is variable (chip remove buttons, etc.).

Distinct from `bg-surface-overlay` (the overlay's container) and
`bg-surface-hover` (solid neutral hover on flat backgrounds).

### Icons

`text-icon-default/muted/subtle/emphasis/inverse/brand/success/warning/error/info`.
Mirror the surrounding text role unless the icon carries its own status
meaning.

### Skeleton, divider, overlay (specific use)

- `bg-skeleton-base` / `bg-skeleton-shine` — loading placeholders.
- `border-divider` / `-subtle` / `-emphasis` — alt API to `line-*` for
  prose dividers (legacy; prefer `line-*` for new code).
- `bg-overlay-light` / `-dark` / `-darker` / `-backdrop` — translucent
  page tints (different mechanism from `bg-scrim`; rarely the right pick).

## Principles (9, from Phase 7)

These are the rules that govern role choice when the system has more
than one plausible token. Each was earned by a concrete migration —
referenced in `PHASE_7_SEMANTIC_COLORS.md`. The original Portuguese
heading is preserved in quotes for historical continuity.

### 1. Role beats shade ("Papel vence shade")

When two tokens have the same visual tone but different intent, pick the
one whose **role** matches the intent — not the one whose shade matches
the design comp.

**Example:** A disabled checkbox and a quaternary label can land on the
same slate-300 visually. Use `text-fg-disabled` for the checkbox (state)
and `text-fg-quaternary` for the label (hierarchy). Visually identical
in light mode, semantically distinct — and `fg-disabled` may flip
differently in a future theme.

### 2. Hover magnitude proportional to prominence ("Magnitude de hover proporcional à proeminência")

Hover transitions should jump farther for high-prominence interactive
elements than for low-prominence ones. A ghost button hover usually
moves one tier (`transparent` → `bg-surface-hover`). The primary Button
currently uses `hover:opacity-90` instead of a tier shift — a stylistic
choice that achieves the affordance via opacity rather than crossing
the brand-tier ladder. The principle below (NavbarItem) carries the
concrete illustration.

**Example:** `NavbarItem` has tiered hovers. The secondary-level item
hovers to `bg-surface-active` and bumps text to `text-fg-primary` (a
two-step bg jump from transparent through hover, plus a text step). The
tertiary-level item hovers to `bg-surface-hover` with the same text bump
(a one-step bg jump). Same affordance pattern, scaled by tier — the
more prominent row gets the louder feedback. Active state for either
tier uses `bg-surface-brand-muted` + `text-fg-brand-emphasis` (Principle
8).

### 3. Documented literal exception > forced token ("Exceção literal documentada > token forçado")

If the design calls for a shade shift ≥ 2 from any existing role AND
no plausible new role explains it, use the **primitive** color class
(e.g. `bg-pink-300`) with an inline comment naming the exception. Don't
force-fit a token; don't create a single-use semantic token.

**Example:** the Badge `bg-pink-300` literal — pink-300 is two steps
lighter than `bg-surface-secondary` (pink-500) with no role describing
"two-shades-lighter secondary." Comment marks it as exception, future
readers understand the deviation is intentional.

### 4. Three-tier elevation hierarchy: canvas → base → overlay ("Hierarquia de elevação de três tiers")

Surface elevation is decided by **where the component floats in the
visual stack**, not by its prominence.

- `bg-surface-canvas` — page background.
- `bg-surface-base` — `Card` sits flat on the canvas.
- `bg-surface-overlay` — `Modal` (and drawers/popovers) float above the
  page.

A button on a card uses surface roles relative to that card (`hover` /
`active` / `selected`), not relative to the canvas.

### 5. Scrim and tint-hover are theme-agnostic by design ("Scrim e tint-hover são theme-agnostic by design")

These tokens are dark in both themes deliberately. A "lightening" backdrop
in dark mode loses its function — it stops focusing attention. The
translucency works over any underlying surface in any theme. If a future
state needs a similar translucent layer (`tint-pressed`, `tint-focus`),
follow the same family name and keep theme-agnostic.

**Sanity check:** never wrap a `bg-scrim` or `bg-tint-*` in a
`dark:bg-*` override. If you find one, it's a bug.

### 6. Hierarchy vs binary state vs interactivity state ("Hierarquia vs estado binário vs estado de interatividade")

Three orthogonal axes — pick the right one even when two land on
`text-fg-disabled` or `text-fg-quaternary`:

- **Ordered hierarchy** (primary/secondary/tertiary/quaternary) — use
  `text-fg-N`. Decreasing emphasis along a ladder.
- **Independent binary state** (Rating off-star, Checkbox unmarked,
  Switch off) — use `text-fg-disabled`. Not "disabled" but "the off
  state of a two-state control."
- **Real interactivity state** (input with `disabled` prop) — use
  `text-fg-disabled`. Actually disabled.

The last two share the token; that's intentional (same visual treatment
for similar perceptual function), even though the semantic reason
differs. Don't introduce `text-fg-off` to "fix" the overload —
the token correctly captures both.

### 7. Semantic token reflects visual role, not CSS mechanism ("Token semântico reflete papel visual, não mecanismo CSS")

A visual line role (`line-*`) is correct regardless of HOW the line is
implemented. CSS `border-*`, `bg-*` on a 1-px-tall div, `height: 1px`
with `bg-*` — same role, same token.

**Example:** `Stepper` carries two line mechanisms side by side. The
connector between steps is a `<div>` with `bg-line-emphasis` (and
`bg-success` when the step is completed — semantic recoloring).
Surrounding section borders use `border-line-default` on `border-t`.
Same `line-*` family, different CSS rendering — driven by which
construct fits geometrically, not by which token to pick.

### 8. State cardinality dictates intensity ("Cardinalidade do estado dita intensidade")

When the design has both "active" and "selected" states, the visual
intensity should reflect cardinality:

- **Active singular** (one element at a time) →
  `bg-surface-brand-muted` (stronger brand tint). `NavbarItem` active
  state uses this — there's exactly one current item.
- **Selected in collection** (multiple can coexist) →
  `bg-surface-selected` (softer, neutral-tinted). `TableRow` toggles
  to this when `isSelected` — many rows can be selected at once.

If a feature uses one role for both, it's likely conflating modes.

### 9. Incomplete semantic family justifies token creation ("Família semântica incompleta justifica criação de token")

When a component's variant union covers N semantic states but the system
only has N-1 tokens, **create the missing one to close the symmetry**.

**Example:** the Dot/status Badge family covered success/warning/error/info
but had no `neutral` for the "no specific status" variant. Components
were reaching for `text-fg-quaternary` (wrong semantic — that's
hierarchy, not feedback). Adding `--color-status-neutral` closed the
family. The token is justified by the family's existence, not by
"a designer asked for it."

**Anti-pattern:** creating `--color-button-special-hover` because one
button has an idiosyncratic hover. That's not closing a family, it's
opening a new degenerate family of one. Use Principle 3 (literal
exception) instead.

## Special cases and pitfalls

### Micro-z (z-index inline + className)

Phase 8 promoted z-index to semantic tokens (`z-modal`, `z-tooltip`,
etc.). Single-purpose exceptions where a numeric `z-N` survives carry a
`// micro-z: <reason>` comment naming why the semantic token doesn't
fit (stacking-within-component, sibling ordering, etc.). Pitfall: if
you set z-index in **both** `className` (e.g. `"relative z-10"`) AND
inline `style={{ zIndex: 10 }}` on the same element, inline wins CSS
specificity and the className is a silent no-op — pick one. The same
applies to a parent that already provides the semantic z-index: a
child redeclaring the same `z-modal` is inert (parent stacking context
already covers it) and should be removed.

### Stale CSS var references (e.g. references to non-existent primitives)

Tailwind v4's slate scale is `50…900/950` — there is no `slate-850`,
`slate-150`, etc. Referencing `var(--color-slate-850)` resolves as
`unset` with a silent fallback, invisible to the dark-coverage
validator (it checks token parity, not primitive resolution). If you
add a new token that depends on a primitive shade, **grep for the
primitive var first** to confirm it exists in the scale.

### Status-neutral vs `text-fg-*` vs `bg-line-*`

Three families that get confused:

- `text-fg-*` — text/icon foreground.
- `bg-line-*` — visual lines (dividers, separators, connectors).
- `bg-status-neutral` (and the rest of the status family) — filled
  state indicators (dots, status badges).

Don't reach for `text-fg-quaternary` to render a "no status" dot — use
`bg-status-neutral`. Don't render a divider as `bg-fg-*` — use
`bg-line-*`.

### Brand foreground emphasis pair

`text-fg-brand` and `text-fg-brand-emphasis` form a pair where emphasis
is **darker** in light mode (`brand-primary-600` vs the base
`brand-primary`) and **lighter** in dark mode (`brand-primary-300` vs
`brand-primary-400`). The "emphasis is more contrasted against the
surface" relationship is preserved across themes. Same pattern for
`text-fg-brand-secondary` / `-secondary-emphasis` over the
`brand-secondary-*` scale. Don't flatten the pair to a single token
"to simplify."

### Brand primitive scales (ADR-024)

The brand primitives `--color-brand-primary-*` and
`--color-brand-secondary-*` live in `src/styles/primitives/brand.css` —
semantic tokens reference them, components never do. The secondary
scale is OKLCH-derived (hue locked at 295) from the ADR-024
"brasil-a-vera" anchors, smoothed across the 11 stops.
`node scripts/derive-brand-secondary.mjs` regenerates the HEX stops for
manual comparison against `brand.css`; run it when retuning the
secondary scale. It is a report, not a gate.

### `fg-quaternary`: AA-by-construction exception

**Invariant.** `text-fg-quaternary` is the 4th tier of the ordered
foreground hierarchy and, by construction, cannot pass WCAG 2.1 AA over
a light background without ceasing to be the 4th tier (derivation in
Histórico). This is a structural property, not a token bug; the token
stays, under the conditions below.

**Scope.** The exception covers exactly the **pending-sequence-marker**
role: `Stepper`'s pending bubble and `Timeline`'s pending dot (each in
horizontal and vertical layout). Every carrying site sets
`data-marker="pending"` — that attribute is the canonical anchor; grep
for it to find the live list, do not rely on line numbers. Uses of
`fg-quaternary` whose actual rendering context passes AA (e.g. the
SideNavbar collapsible-group chevron token in `src/ui/tokens/sidebar.ts`,
over a tinted surface) need neither the exception nor the scaffolding —
check the real context before adopting.

**Boundary condition — when the exception does NOT apply.** This
exception covers the marker as a **decorative-hierarchical hint**
redundant with title + position + state-color. A consumer that makes
the marker the **only** anchor of identity falls outside:

- Timelines with identical titles, no timestamps, no custom `item.icon`,
  where the user must rely on the bubble number to tell items apart.
- Steppers with empty `step.title` and `showStepNumbers={true}` where
  the number is the only label.

These uses have genuine insufficient contrast — fix by supplying
`item.icon` (Timeline) or non-empty `step.title` (Stepper). **The
architectural exception covers redundant use; it does not legitimize
critical use.**

**Enforcement.** `data-marker="pending"` anchors the directed
`parameters.a11y` suppression in the affected stories to the role, not
to the bubble's style classes:

```ts
{ id: "color-contrast", selector: ":not([data-marker='pending'])" }
```

The attribute is conditional on the component's own pending enum value —
Stepper: `status === "pending"` (`StepperStatus`); Timeline:
`status === "default"` (its `status` union has no `"pending"` member) —
verify by reading the source enum, not by visual analogy. The anchor
survives restyles and expires automatically when the marker stops
meaning "pending" (rationale in Histórico). A new consumer in the same
role only needs the status-conditional `data-marker="pending"` plus a
reference to this section, and only **if** its context actually fails AA.

## When NOT to create a new token

- The component has a single color that doesn't repeat anywhere else in
  the system. → Use Principle 3 (primitive + inline comment).
- The color differs from an existing token by 1 shade and the intent is
  the same. → Use the existing token; the system is deliberately uniform.
- The color is proposed to "avoid a visual conflict with X." → Re-evaluate
  X first. The conflict is usually a symptom of another problem.
- The color exactly covers the case of another token (same family, same
  intent, same shade). → Search error; reopen the vocabulary.

The hard rule: **adding a token must close a family, create a role, or
fill a vocabulary gap** — not accommodate an isolated request.

## Quick validation before commit

Before closing a new or refactored component:

```sh
# 1. Zero hardcoded color tailwind classes
grep -rIn --include='*.tsx' \
  -E '\b(text|bg|border|fill|stroke)-(gray|slate|zinc|red|green|blue|yellow|orange|pink|indigo|violet|cyan|emerald|amber|rose|sky|fuchsia|purple|teal|lime)-[0-9]+\b' \
  <new files>

# 2. Zero arbitrary syntax bg-[var(--color-...)] (should be a native class)
grep -rIn --include='*.tsx' \
  -E 'bg-\[var\(--color-' \
  <new files>
```

Both greps should return zero hits. If they don't, refactor before commit
or document as a literal exception (Principle 3) with an inline comment.

**Enforcement.** The regex above is implemented as a custom ESLint rule
(`ds/no-raw-color-classes`, source under `eslint-rules/`) that runs in
pre-commit (via lint-staged), pre-push (full `npm run lint`), and CI
(the `lint` job in `.github/workflows/ci.yml`). Raw color classes in
`src/ui/**/*.tsx` excluding stories, tests, and the meta-context file
`src/ui/tokens/TokenVisualizations.tsx` trigger an error and block the
commit/PR. The rule recognises three exception comment shapes (within
~15 lines above the offending literal):

- `// exception: <reason>` — generic Principle 3 marker.
- `// micro-z: <reason>` — z-index inline/className pitfall (Phase 8).
- `// <the-exact-class>: <reason>` — names the class being excused, the
  canonical pattern used in `Badge.tsx` for `bg-pink-300`.

Stories (`*.stories.tsx`) are intentionally out of the rule's scope
pending a triage phase. The rule scans by AST, not by grep, so it does
not share the BSD-vs-GNU `--include` brace-expansion pitfall that hid
`src/ui/tokens/sidebar.ts` from the original Phase 7 sweep.

## Histórico

Extended argumentation behind the operative sections above. Nothing here
is normative on its own — if a statement matters for a decision, it has
a counterpart in the sections above.

### `fg-quaternary` AA derivation and design evidence

- **The mathematical constraint.** The light-mode hierarchy maps to
  `fg-primary` slate-900 → `fg-secondary` slate-600 → `fg-tertiary`
  slate-500 → `fg-quaternary` slate-400, each tier deliberately more
  muted than the one above. `fg-tertiary` over `surface-base` (white)
  measures 4.76:1 — only +0.26 above the AA threshold. Any neutral
  lighter than slate-500 fails AA over white, so a 4th tier that passes
  AA over a light background cannot exist in the scale; that is why the
  exception is "AA-by-construction" rather than a fixable bug.
- **Design evidence — consumers treat the marker as decorative.** The
  glyph inside the bubble is never the only carrier of identity:
  Stepper renders the step number only when `showStepNumbers` is true
  (`showStepNumbers ? index + 1 : null` — opt-out by prop); Timeline
  renders the index only as the third fallback in
  `item.icon || (status === "completed" ? <CheckCircle2 /> : index + 1)`,
  so a consumer may supply `item.icon` at any time and the number never
  renders for completed items. Identity is carried by the always-rendered
  required adjacent title (Stepper `step.title`, Timeline `item.title` —
  `fg-primary`/`fg-secondary`, well above AA), reinforced by position in
  the sequence and by state color (completed = green-filled bubble,
  pending = white-with-light-border, active = brand-filled bubble).
- **Why the anchor is `data-marker` and not class compounds.** A restyle
  changes the bubble's classes freely while the role attribute persists.
  The live list of carrying sites is whatever
  `grep -rn 'data-marker="pending"' src/ui/` returns — that grep
  replacing a hardcoded file:line list is the point of anchoring by
  attribute.
