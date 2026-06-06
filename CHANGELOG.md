## [3.3.1](https://github.com/FabioCaffarello/react-design-system/compare/v3.3.0...v3.3.1) (2026-06-06)


### 🐛 Bug Fixes

* **card+server-entry:** RSC-safe Card guard + full smoke surface coverage ([#160](https://github.com/FabioCaffarello/react-design-system/issues/160)) ([#161](https://github.com/FabioCaffarello/react-design-system/issues/161)) ([56323fb](https://github.com/FabioCaffarello/react-design-system/commit/56323fbcf61fb3089e50d53b1af008cfea9a83f3)), closes [#155](https://github.com/FabioCaffarello/react-design-system/issues/155)

## [3.3.0](https://github.com/FabioCaffarello/react-design-system/compare/v3.2.0...v3.3.0) (2026-06-05)


### ✨ Features

* **primitives:** add Button variant `link` — text-fg-brand, underline on hover, no chrome ([#156](https://github.com/FabioCaffarello/react-design-system/issues/156)) ([#159](https://github.com/FabioCaffarello/react-design-system/issues/159)) ([d7c6e43](https://github.com/FabioCaffarello/react-design-system/commit/d7c6e4396798e192f1e763c37dc1104651632f9e)), closes [#157](https://github.com/FabioCaffarello/react-design-system/issues/157) [#486581](https://github.com/FabioCaffarello/react-design-system/issues/486581) [#7390](https://github.com/FabioCaffarello/react-design-system/issues/7390) [#157](https://github.com/FabioCaffarello/react-design-system/issues/157) [#155](https://github.com/FabioCaffarello/react-design-system/issues/155) [#158](https://github.com/FabioCaffarello/react-design-system/issues/158)

## [3.2.0](https://github.com/FabioCaffarello/react-design-system/compare/v3.1.0...v3.2.0) (2026-06-05)


### ✨ Features

* **server-entry:** promote Badge, Card, Label, Separator to ./server ([#155](https://github.com/FabioCaffarello/react-design-system/issues/155)) ([#158](https://github.com/FabioCaffarello/react-design-system/issues/158)) ([79cfe1b](https://github.com/FabioCaffarello/react-design-system/commit/79cfe1b0132aa0dd03e5c1d7b76ea555a9009c97)), closes [#157](https://github.com/FabioCaffarello/react-design-system/issues/157) [#157](https://github.com/FabioCaffarello/react-design-system/issues/157) [#157](https://github.com/FabioCaffarello/react-design-system/issues/157)

## [3.1.0](https://github.com/FabioCaffarello/react-design-system/compare/v3.0.0...v3.1.0) (2026-06-05)


### ✨ Features

* **primitives:** add asChild to Button and Chip (Radix Slot) — [#154](https://github.com/FabioCaffarello/react-design-system/issues/154) ([#157](https://github.com/FabioCaffarello/react-design-system/issues/157)) ([e02b11c](https://github.com/FabioCaffarello/react-design-system/commit/e02b11ced06891e83cc6a68d8aad241e13d024fe))

## [3.0.0](https://github.com/FabioCaffarello/react-design-system/compare/v2.1.0...v3.0.0) (2026-06-05)


### ⚠ BREAKING CHANGES

* **tokens:** introduce brand primitive layer — Caminho C (#152)

### ✨ Features

* **tokens:** introduce brand primitive layer — Caminho C ([#152](https://github.com/FabioCaffarello/react-design-system/issues/152)) ([3b63b72](https://github.com/FabioCaffarello/react-design-system/commit/3b63b721caf525a08b8e8cc56d8a200af2929417))

## [2.1.0](https://github.com/FabioCaffarello/react-design-system/compare/v2.0.1...v2.1.0) (2026-06-05)


### ✨ Features

* **server-entry:** add ./server export for RSC-safe components ([#150](https://github.com/FabioCaffarello/react-design-system/issues/150)) ([#151](https://github.com/FabioCaffarello/react-design-system/issues/151)) ([24a43f5](https://github.com/FabioCaffarello/react-design-system/commit/24a43f5749d2fad3818c52b2c128852c42cf9a27)), closes [#148](https://github.com/FabioCaffarello/react-design-system/issues/148) [#148](https://github.com/FabioCaffarello/react-design-system/issues/148) [#148](https://github.com/FabioCaffarello/react-design-system/issues/148)

## [2.0.1](https://github.com/FabioCaffarello/react-design-system/compare/v2.0.0...v2.0.1) (2026-06-05)


### 🐛 Bug Fixes

* **build:** emit "use client" banner so RDS works in Next 16 RSC ([#148](https://github.com/FabioCaffarello/react-design-system/issues/148)) ([#149](https://github.com/FabioCaffarello/react-design-system/issues/149)) ([d04b42d](https://github.com/FabioCaffarello/react-design-system/commit/d04b42d3f0a9e348c17ee441ffccd326e7ebf904)), closes [#2](https://github.com/FabioCaffarello/react-design-system/issues/2)

## [2.0.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.24.0...v2.0.0) (2026-06-05)


### ⚠ BREAKING CHANGES

* consumers importing `type { AutocompleteOption }` must
switch to `type { AutocompleteOptionType }`. The component export
`AutocompleteOption` is unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): replace NodeJS.Timeout with ReturnType<typeof setTimeout>

TS2503: NodeJS is not in scope for browser code (the app tsconfig
intentionally excludes the node type ambient). `ReturnType<typeof
setTimeout>` is the standard browser-safe shape — it resolves to
`number` in the DOM lib and `Timeout` under @types/node, so the same
expression works in both runtimes without leaking node globals.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(navigation,navlink)!: drop Next.js require() auto-detection probes

TS2591 + TS2578: three sites used `typeof require !== "undefined" &&
require("next/...")` to optionally pick up Next.js APIs. `require` is
not a global in modern ESM browser bundles — TS rightly refuses to
type it, the @ts-expect-error directives masked the gap, and the
probes were brittle in practice (bundlers vary, the
useNavigationActiveState probe always returned undefined per its own
"For now" comment, and Navigation.tsx's branch violated rules-of-hooks
to call usePathname() conditionally).

Replacements per site:

- useNavLink: drop the NextLink probe. Consumers wanting Next routing
  pass `as={NextLink}` on NavLink — `as` already takes priority over
  the auto-detect path per the existing code.
- useNavigationActiveState: `pathname` prop is the single explicit
  channel. The probe was a no-op in disguise.
- Navigation: explicit `pathname` prop wins, else fall back to
  `window.location.pathname` (SSR-safe). Next.js consumers should
  continue passing `pathname={usePathname()}` for reactive updates;
  this preserves the active-state highlight for non-Next apps without
  the require() dance.
* `useNavLink` no longer auto-supplies a NextLink
component. Apps that relied on `NextLink` from this hook must pass
`as={NextLink}` to NavLink explicitly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): replace process.env.NODE_ENV with import.meta.env.DEV

TS2591: process is not a global in browser code (and we don't pull in
@types/node ambient). Vite injects `import.meta.env.DEV` at build time
as a real boolean — the same role process.env.NODE_ENV was playing in
these dev-only a11y warning guards, with the right typing and no leaked
node globals.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): widen RefObject<T> prop types to match React 19 useRef shape

TS2322: React 19's `useRef<T>(null)` returns `RefObject<T | null>`,
not `RefObject<T>`. Components that received a ref via prop still
declared `RefObject<HTMLDivElement>`, which the caller couldn't
satisfy. Widened to `RefObject<HTMLDivElement | null>` in
AutocompleteList, DatePickerPopup, and SidebarContextValue.

Also retyped Sidebar's local ref from `HTMLElement` to `HTMLDivElement`
to match the `<div>` it attaches to; SidebarContextValue.sidebarRef
follows.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): type cloneElement child props in Dialog Trigger/Close

TS2769 + TS18046: under React 19, `ReactElement<unknown>` exposes
children.props as `unknown`, so the previous `children.props.onClick`
read failed typecheck and the `cloneElement(child, … as unknown)`
escape hatch papered over the gap.

Make the prop shape explicit: `ReactElement<{ onClick?: ... }>`. The
cloneElement call is now valid without a cast, and the optional
forwarding uses `?.` instead of an if/then.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): pointwise narrows and coercions

Several unrelated single-call-site fixes flushed in one commit:

- DialogContent: cast focus-trap element to HTMLButtonElement|HTMLInputElement
  before reading .disabled (HTMLElement has no .disabled).
- Table: `pagination.onPageChange` is required by the type, so the
  truthiness check (TS2774) is dead. Drop it.
- TableHeaderCell: addEventListener overload (TS2769) — cast handler
  via EventListener.
- TableFilters: FilterValue is `string|number|boolean|null|undefined` but
  Input/Select expect `string|number|readonly string[]|undefined`. Coerce
  via `String(value ?? "")` at the boundary.
- DataGrid: keyof T index against `Record<string, number>` (TS2536) —
  cast to string.
- FileUpload: validateFile returns `string|null` but the field type is
  `string|undefined`. Coerce via `?? undefined`.
- SearchInput: SearchInputProps Omits `onChange` and then destructures
  it as a prop. Stop omitting it.
- DatePickerProvider: getInitialRange returned `null` in controlled
  mode but useState's slot is `{start, end}`. Always return the empty
  range shape; controlled mode reads controlledValue elsewhere.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* feat(tokens): extend getSpacingClass to accept space-x direction

Closes the asymmetry with `space-y` (Principle 9 — incomplete family).
Breadcrumb was the lone in-tree consumer of `space-x` and could not
satisfy the type union; the system response is to extend the getter,
not to add a literal-exception. The ESLint rule now flags raw
`space-x-N` alongside `space-y-N`, restoring symmetric enforcement.

.claude/rules/tokens.md is updated in the same commit (docs-sync
rule): the "NOT in scope" carve-out for `space-x-N` is replaced by
inclusion in the supported direction list.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): map Header/LoginBox variants to real ButtonVariant values

TS2322 across three sites — all symptoms of consumers naming variants
that don't exist on the canonical `ButtonVariant` union (primary,
secondary, error, outline, ghost, iconOnly):

- HeaderHamburger: drop the phantom "default" from its local variant
  union; "ghost" is the default and "outline" remains.
- LoginBox Sign-in: variant="regular" had no destination — submit
  action is the primary CTA, so map to "primary".
- LoginBox form className: `props.className` was read after `className`
  had already been destructured out of props, so the consumer's
  className silently dropped on the `<form>`. The outer `<div>` already
  receives it; remove the dead reference.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): make Collapsible.trigger optional + small narrows

- Collapsible: SidebarGroup/SideNavbarGroup use Collapsible purely as
  the animated content container — they own the trigger button outside
  the Collapsible. The `trigger` prop was required (TS2741 at both
  callers), but the component is fully usable without one. Make trigger
  optional; render the toggle button only when supplied.
- SideNavbarToggle: TS2339 + TS6133 — the destructure of `minWidth`
  from SideNavbarThemeContextValue referenced a property that the
  type does not declare, and the other two destructured fields
  (navigationWidth, contentWidth) were _underscored and unread.
  Removed for now; phase-2 audit will decide whether the theme context
  should grow these fields.
- DatePickerCalendar: handleKeyDown was typed for HTMLDivElement but
  attached to a button (TS2345). Widened to the union.
- DataGrid: filters prop was typed with `unknown[]` and
  `Record<string, unknown>`, but Table consumes
  `FilterConfig[]` / `Record<string, FilterValue>`. Pull the canonical
  types from Table's TableFilters and use them.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(table): tighten Table generic to satisfy TableProps constraint

TS2344/TS2322/TS2345/TS7053/TS2571/TS2339 — the Table function generic
was unconstrained `<T = unknown>` while TableProps<T> requires
`T extends Record<string, unknown>`. Tightening the function generic
fixes the constraint mismatch without changing the exported
`TableProps<T>` shape (consumers already supply
`T extends Record<string, unknown>` via TableColumn<T>'s constraint).

Companion changes to close the gate at zero:

- Table.tsx: extract className/aria-label/aria-labelledby from props via
  destructure cast — TableProps is a discriminated union and indexed
  access (`props["aria-label"]`) cannot narrow per-branch (TS7053).
- TableProvider.tsx: row-indexing casts (`row as Record<string, unknown>`)
  for sort/filter loops; safer `id?: { toString(): string }` shape for
  getRowId's structural read.
- TableContext.tsx + TableProvider.tsx: add
  `virtualScrollingOptions` to TableContextValue (additive, completes the
  family — TableBody already reads the field).
- TableProvider value cast: `contextValue as unknown as
  TableContextValue<Record<string, unknown>>` is the single bridge
  between the per-call T and the singular global context.

Marked TODO(phase2) at TableContext creation + TableProvider's useMemo:
createContext doesn't carry generics, which forces the cast. Migration
to a context-factory pattern fixes both at the same time. See the
symmetric TODO landed in FormProvider in the same series.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(form): narrow union, fix RHF generics, ArrayPath constraint

Three independent typecheck fixes in the Form area:

- Form.tsx: in the simple branch (no `form` prop), onSubmit is the
  SimpleFormProps variant of the union. TS sees the union's intersected
  parameter type and rejects the FormEvent call. Cast the local
  onSubmitSimple to SimpleFormProps["onSubmit"] at the call site.
- FormProvider.tsx: FormContext is typed `FormContextValue<FieldValues>`
  (createContext doesn't carry the generic). Cast the per-call
  `FormContextValue<TFieldValues>` to the default at the Provider value
  boundary. TODO(phase2) lined up to migrate to a generic context
  factory in parallel with the matching TableContext/TableProvider TODO.
- useFormFieldArray.ts: the second generic parameter must extend
  ArrayPath<TFieldValues>, not Path<TFieldValues>. RHF's useFieldArray
  enforces this at runtime; the type was lying.

FormField's onBlur typing is deliberately not in this commit — the
honest fix is a breaking change to a public callback shape and follows
in a separate commit after the consumer-grep is reported.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(types): mark 6 underscored vars as audited Phase-2 work + filter typing

Six _underscored locals were flagged TS6133 by tsc --build:
- DataGrid `_handleGroupToggle` — column-grouping handler ready,
  header-click UI never wired.
- SideNavbar Navbar `_mainTogglePosition`, `_shouldShowMainToggle` —
  toggle position/visibility computed but the rendered nav ignores
  them.
- SideNavbar SidebarGroup `_handleToggle` — duplicate of
  handleHeaderClick; consolidation pending.
- SideNavbar SideNavbarToggle `_isInlinePosition` — inline-branch
  computed, style ignores it.
- Table TableProvider `_controlledColumnWidths` — orphan alias whose
  comment promised an injection point that never materialised.

These are fios soltos from in-progress features, not stale debt. Per
Phase 0 charter: don't delete in-progress work to silence the gate.
Each site gets:
  // TODO(phase2): <diagnóstico do que falta wirear>
  const _foo = …;
  void _foo;
The `void _foo` makes the binding observably read for tsc6133 without
faking a runtime use. Phase 2's underscored-vars sweep will pick up
each TODO marker.

Also: TableProvider's internalFilterValues was useState<Record<string,
unknown>>, but the prop and TableContextValue.filterState declare
Record<string, FilterValue>. Align the state typing so the contextValue
narrows correctly — the cast at the provider boundary stops absorbing
the mismatch.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(form)!: align FormField onBlur/onChange with react-hook-form types

TS2322: FormField's children render-prop declared
  onChange?: (e: React.ChangeEvent<...>) => void;
  onBlur?: () => void;
but the implementation forwards `fieldRegister.onBlur`, which is RHF's
ChangeHandler — the prior typing was lying about the shape.

The honest fix is to expose the same handler types RHF emits from
register(). Forwarding `fieldRegister.onBlur` is required for RHF's
validation modes (mode: "onBlur") to fire and for `touched` state to
track correctly — fabricating an event-less handler (the option floated
in the diff review) would silently break those.

In-repo grep: zero FormField call-sites destructure onBlur from the
children callback. External consumers passing `onBlur={() => something()}`
(0-arg arrow ignoring the event) continue to compile because a no-arg
function is assignable to RHF's ChangeHandler. Only consumers who
declared `const cb: () => void = …` and passed it as onBlur will hit a
type error.
* FormField's children render-prop now exposes onBlur
and onChange as ReturnType<UseFormReturn<TFieldValues>["register"]>'s
matching fields (RHF's ChangeHandler), instead of the previous custom
() => void / React.ChangeEvent shapes. Migration: drop the explicit
() => void annotation if you had one; pass the handler through to your
input (typical pattern: `<Input {...register("foo")} />` does not
destructure onBlur and is unaffected).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* refactor(utils): add mergeRefs helper for composed ref forwarding

mergeRefs composes any number of refs (callback or object) into a
single RefCallback. Designed for the cloneElement pattern where a
parent owns an internal ref to a trigger AND the consumer may have
supplied their own ref on that trigger — both need to land on the same
node. Under React 19, a consumer's `<Child ref={r}/>` flows through
`child.props.ref` after cloneElement; that's the second argument
mergeRefs is meant to receive.

Five unit tests cover: callback ref, object ref, mixed, undefined/null
no-op, and null-node propagation on unmount.

Dropdown will adopt it in a follow-up commit. Tooltip, DialogTrigger,
DialogClose, Popover are open candidates for Phase 2 (the inline
merge-ref pattern they ship today is the same fragility this helper
exists to remove).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(dropdown): forward consumer ref via mergeRefs (React 19)

TS2769/TS18046/TS2339/TS2345/TS2322 — Dropdown.tsx read child.ref to
forward a consumer-supplied ref alongside its own internal triggerRef.
React 19 moved consumer refs out of the element itself and into
child.props.ref; the old read path returns undefined under React 19 AND
fails to typecheck.

Replacements:
- Adopt mergeRefs(triggerRef, trigger.props.ref) — composed ref
  forwarding via the new src/ui/utils helper, replacing the inline
  callback that hand-rolled the same logic with the wrong React-19
  property.
- Widen triggerRef to HTMLElement | null (Button → button, plain →
  div role="button"); HTMLDivElement was a lie that worked only
  because of the wrapper div in the else branch.
- Type TriggerChildProps explicitly with the props cloneElement
  overrides, so children.props.onClick / onKeyDown / aria-label etc.
  stop being `unknown`.
- onKeyDown handler typed as React.KeyboardEvent (default Element);
  HTMLElement narrowing fought the React.cloneElement overload.
- Else-branch (non-element trigger): wrap the div ref in a callback so
  RefObject<HTMLElement> can land on a HTMLDivElement slot (refs are
  invariant on the inner type — comment in the code names this).

DropdownProps.trigger remains `ReactNode` exported — no public API
change. Under peerDependency `react: ">=19"`, consumer refs that
previously broke silently now thread through correctly.

Test coverage in the companion commit: ref forwarding to the
underlying element, plus consumer onClick/onKeyDown preservation
(merged-not-replaced).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* test(dropdown): cover trigger ref forwarding and handler preservation

Three new tests under "Trigger Ref Forwarding":

1. createRef passed to <Button ref={…}/> as trigger lands on the DOM
   button after render (proves the React 19 props.ref → mergeRefs path
   works end-to-end).
2. Consumer-supplied onClick on the trigger fires on user click
   (Dropdown's handler composes with, not replaces, the original).
3. Consumer-supplied onKeyDown on the trigger fires on keyDown
   (same composition guarantee for the keyboard path).

These guard against the silent regression a future cloneElement
refactor would otherwise introduce: deduction-only verification was
how the React 19 typing broke unnoticed for the original 119-error
build. Behaviour test forces the next refactor to keep working.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* build: remove error-masking || true from build script

The trailing `|| true` after the `.d.ts` emit step swallowed every type
error during build — combined with Vite/esbuild's type-erasure, this
hid the same 119 errors the CI typecheck gate also missed via `-p` vs
`--build`. With the typecheck pipeline at zero errors and the gate
correctly wired, the masking is both unnecessary and dangerous: future
type regressions would silently emit a partial .d.ts and ship.

Removed. `npm run build` now fails on any TS error, matching what
`npm run typecheck` reports.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* fix(dialog): migrate DialogFooter sm:space-x-2 to getSpacingClass

The extended ds/no-raw-spacing-classes rule (now covering space-x-N)
caught this pre-existing raw class. Migrate to
getSpacingClass("sm", "space-x"); preserves the same 8px gap (sm = 2)
under the responsive sm: prefix.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* docs: add ci-gates rule and surface typecheck script in CLAUDE.md

New .claude/rules/ci-gates.md: states the rule that every CI/CT gate
must be verified by inducing the failure it is supposed to catch — not
only by observing it pass. Catalogues the Phase-0 traps so they cannot
silently return:
- `tsc -p` against a solution-style tsconfig typechecks zero files and
  exits 0 (use `tsc --build`).
- `|| true` chained after a typecheck step turns every TS error into a
  silent partial .d.ts emit.
- tsconfig `exclude` does not skip transitive imports.
- pre-commit/pre-push hooks ARE local gates; --no-verify is bypassing
  verification you were asked to perform.

CLAUDE.md updates per docs-sync:
- Commands section now lists `npm run typecheck` (tsc --build --force).
- New Hard-rules item points to ci-gates.md and restates the
  test-the-gate principle in one line.

.claude/rules/docs-sync.md gets a new derivation entry: the new
hard-rule in CLAUDE.md is derived from ci-gates.md (authoritative
file). Touching ci-gates.md is the trigger to revisit the gist in
CLAUDE.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* test(eslint): update no-raw-spacing-classes tests for space-x in scope

The earlier feat(tokens) extended getSpacingClass with `space-x` AND
the ESLint rule that enforces it, but the rule's own test file kept
asserting `space-x-N` was a valid (out-of-scope) pattern. Move
`space-x-2` from `valid` to `invalid`; collapse the `space-y-reverse`
test to cover both reverse variants. 25/25 passing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

* Phase 0: unmask the typecheck gate and zero out the backlog (119 → 0) (#127) ([50e1bed](https://github.com/FabioCaffarello/react-design-system/commit/50e1bedc9d98e4d5aea89971c83dcabaa41d636e)), closes [#127](https://github.com/FabioCaffarello/react-design-system/issues/127)


### ✨ Features

* **form-primitives:** add success state to Checkbox / Radio / Switch / Textarea ([5b5f896](https://github.com/FabioCaffarello/react-design-system/commit/5b5f89670126009c9c57cd3f1287924204c6e25e))
* **lint:** add ds/no-raw-spacing-classes rule (warn level, Phase A) ([#110](https://github.com/FabioCaffarello/react-design-system/issues/110)) ([b3a55b5](https://github.com/FabioCaffarello/react-design-system/commit/b3a55b50d4860a408be5424964370886815cad1e))
* **sidenavbar:** wire Navbar showMainToggle/mainTogglePosition overrides (render-driven) ([#135](https://github.com/FabioCaffarello/react-design-system/issues/135)) ([1f820fb](https://github.com/FabioCaffarello/react-design-system/commit/1f820fb0485993acb5f1cb672d1a41510ca2d2fb)), closes [#130](https://github.com/FabioCaffarello/react-design-system/issues/130)
* **tabs:** expose orientation as typed prop on TabsList ([5030314](https://github.com/FabioCaffarello/react-design-system/commit/5030314c9a0dd05d0d0426e05c89b469806532ae))


### 🐛 Bug Fixes

* **deps:** unbundle unused peers, widen lucide-react to ^0.552 || ^1 ([#145](https://github.com/FabioCaffarello/react-design-system/issues/145)) ([#146](https://github.com/FabioCaffarello/react-design-system/issues/146)) ([1b9adc3](https://github.com/FabioCaffarello/react-design-system/commit/1b9adc33b6396571a5c934a34cd46a31716c5099))
* **drawer:** implement modal focus contract (trap, auto-focus, restore) ([#138](https://github.com/FabioCaffarello/react-design-system/issues/138)) ([6b2bdef](https://github.com/FabioCaffarello/react-design-system/commit/6b2bdef9d64cbb35342fa3de724ce74dfbfb512e))
* **file-upload:** replace deprecated substr in file id generation ([#131](https://github.com/FabioCaffarello/react-design-system/issues/131)) ([99e4193](https://github.com/FabioCaffarello/react-design-system/commit/99e41937401e605b5a69215c9060f35914d96487)), closes [#130](https://github.com/FabioCaffarello/react-design-system/issues/130) [#130](https://github.com/FabioCaffarello/react-design-system/issues/130) [#130](https://github.com/FabioCaffarello/react-design-system/issues/130)
* **modal:** query portal content via screen, drop fragile react-dom mock ([#143](https://github.com/FabioCaffarello/react-design-system/issues/143)) ([b97fd6b](https://github.com/FabioCaffarello/react-design-system/commit/b97fd6b52bf8da582aa909dc036cf70996a07705)), closes [post-#142](https://github.com/FabioCaffarello/post-/issues/142) [#142](https://github.com/FabioCaffarello/react-design-system/issues/142)
* **popover:** restore focus to opening element on close ([#139](https://github.com/FabioCaffarello/react-design-system/issues/139)) ([5a6dedf](https://github.com/FabioCaffarello/react-design-system/commit/5a6dedf27c6446219af810c892fb22ae7ffed8ef))
* replace deprecated Math.random().substr() ids with React.useId across 9 sites ([#130](https://github.com/FabioCaffarello/react-design-system/issues/130)) ([58f4e57](https://github.com/FabioCaffarello/react-design-system/commit/58f4e579b29f6d8783bc1ef3c9b04d7a1b9f316b))


### 📝 Documentation

* **claude-md:** sync Commands section with package.json reality ([95d1543](https://github.com/FabioCaffarello/react-design-system/commit/95d1543bcde886cb1a13c9a84ae804ef88ea46cc))
* drop 5 historical phase/bootstrap markdowns ([#126](https://github.com/FabioCaffarello/react-design-system/issues/126)) ([9257ef7](https://github.com/FabioCaffarello/react-design-system/commit/9257ef7e5f951f6ddf113c81e483c712f2b17711))


### ♻️ Code Refactoring

* **datagrid:** freeze grouping as [@experimental](https://github.com/experimental), remove dead Group button ([#134](https://github.com/FabioCaffarello/react-design-system/issues/134)) ([ebea840](https://github.com/FabioCaffarello/react-design-system/commit/ebea8408ffddd24cbe83d734813118a389d8f0d7))
* **dialog:** consume shared focus hooks (trap, auto-focus, restore) ([#140](https://github.com/FabioCaffarello/react-design-system/issues/140)) ([d746929](https://github.com/FabioCaffarello/react-design-system/commit/d7469292a5c60efcf3629f0518552a1bf5d69b03))
* **form-primitives:** standardize helperText across Switch / Textarea ([45cd627](https://github.com/FabioCaffarello/react-design-system/commit/45cd627ff88381cbde40c98346338ade7d94f308))
* **primitives:** forwardRef on Collapsible / NavLink / Tooltip ([aee8bfa](https://github.com/FabioCaffarello/react-design-system/commit/aee8bfaf4a96b22b5c7b4963d527ca7fbbf9b01c))
* **sidenavbar,table:** remove dead derived values (_isInlinePosition, _controlledColumnWidths) ([#133](https://github.com/FabioCaffarello/react-design-system/issues/133)) ([3f43f76](https://github.com/FabioCaffarello/react-design-system/commit/3f43f76712499c9d8f437548770adedf50e837b1))
* **spacing:** drain long tail to 0 — 28 files (W5.1.5 Phase D) ([#113](https://github.com/FabioCaffarello/react-design-system/issues/113)) ([2cd1ec7](https://github.com/FabioCaffarello/react-design-system/commit/2cd1ec7ecdac23c3a1a72f1313908cb54c61366a)), closes [#112](https://github.com/FabioCaffarello/react-design-system/issues/112) [#112](https://github.com/FabioCaffarello/react-design-system/issues/112) [#110](https://github.com/FabioCaffarello/react-design-system/issues/110) [#111](https://github.com/FabioCaffarello/react-design-system/issues/111) [#112](https://github.com/FabioCaffarello/react-design-system/issues/112) [#112](https://github.com/FabioCaffarello/react-design-system/issues/112)
* **spacing:** migrate next 15 files to getSpacingClass (W5.1.4 Phase C) ([#112](https://github.com/FabioCaffarello/react-design-system/issues/112)) ([97f5f8b](https://github.com/FabioCaffarello/react-design-system/commit/97f5f8b96df281a1c46e817bf4e19ec7c42f1b3a)), closes [#111](https://github.com/FabioCaffarello/react-design-system/issues/111) [#110](https://github.com/FabioCaffarello/react-design-system/issues/110) [#111](https://github.com/FabioCaffarello/react-design-system/issues/111)
* **spacing:** migrate top-5 violation files to getSpacingClass (W5.1.3 Phase B) ([#111](https://github.com/FabioCaffarello/react-design-system/issues/111)) ([f76e7dc](https://github.com/FabioCaffarello/react-design-system/commit/f76e7dc998c7ffd98c2fa538bc83d9be44ec6ab5)), closes [#110](https://github.com/FabioCaffarello/react-design-system/issues/110)
* **text:** remove stale color prop with no visual effect ([59318f5](https://github.com/FabioCaffarello/react-design-system/commit/59318f591a7238a466dcb17c9a34e653a9670288))

## [1.24.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.17...v1.24.0) (2026-06-02)


### ✨ Features

* **a11y:** wire real CI gate — validator + workflow job + line flip ([3a69498](https://github.com/FabioCaffarello/react-design-system/commit/3a694988a6abb645c8643f8ba54f0ffbcc655a9e)), closes [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#81](https://github.com/FabioCaffarello/react-design-system/issues/81) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#80](https://github.com/FabioCaffarello/react-design-system/issues/80) [#70-80](https://github.com/FabioCaffarello/react-design-system/issues/70-80) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#81](https://github.com/FabioCaffarello/react-design-system/issues/81)


### 🐛 Bug Fixes

* **a11y:** serial bypasses addon-a11y auto-run via &globals=a11y.manual ([308ea9e](https://github.com/FabioCaffarello/react-design-system/commit/308ea9e988918a6b2c1e623af32188c8bcc090bb)), closes [PR-#82](https://github.com/FabioCaffarello/PR-/issues/82) [#82](https://github.com/FabioCaffarello/react-design-system/issues/82)

## [1.23.17](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.16...v1.23.17) (2026-06-02)


### 🐛 Bug Fixes

* **a11y:** tabs/dynamictabs moves close buttons OUT of tablist ([251894e](https://github.com/FabioCaffarello/react-design-system/commit/251894e733e92f62610d1d125ae4a7b4dc2a7b34)), closes [#76-78](https://github.com/FabioCaffarello/react-design-system/issues/76-78)
* **a11y:** trivial story labels/wrappers bundle — final 5 nodes drained ([cba4432](https://github.com/FabioCaffarello/react-design-system/commit/cba4432a86d72538e18f0192b3b3cffc14cd6230)), closes [#67](https://github.com/FabioCaffarello/react-design-system/issues/67) [#52](https://github.com/FabioCaffarello/react-design-system/issues/52) [#66](https://github.com/FabioCaffarello/react-design-system/issues/66) [#66](https://github.com/FabioCaffarello/react-design-system/issues/66) [#73](https://github.com/FabioCaffarello/react-design-system/issues/73) [#76-79](https://github.com/FabioCaffarello/react-design-system/issues/76-79) [#70-79](https://github.com/FabioCaffarello/react-design-system/issues/70-79) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#74](https://github.com/FabioCaffarello/react-design-system/issues/74) [#76](https://github.com/FabioCaffarello/react-design-system/issues/76)

## [1.23.16](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.15...v1.23.16) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** decouple card ARIA interactivity from variant=hover ([714ec61](https://github.com/FabioCaffarello/react-design-system/commit/714ec616da9afdb1daa2af1b2caaa0c630a95471)), closes [#70-75](https://github.com/FabioCaffarello/react-design-system/issues/70-75)
* **a11y:** sidebar.content tabIndex=0 on scrollable container ([38013df](https://github.com/FabioCaffarello/react-design-system/commit/38013df185173980b95cacef7d37081b53394a4b)), closes [#77](https://github.com/FabioCaffarello/react-design-system/issues/77)
* **a11y:** switch implements controlled/uncontrolled (aria-checked always set) ([8a46b93](https://github.com/FabioCaffarello/react-design-system/commit/8a46b93bcf225d85d2ee0248135deb7f6dbd2936)), closes [#67](https://github.com/FabioCaffarello/react-design-system/issues/67) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69) [#76](https://github.com/FabioCaffarello/react-design-system/issues/76)

## [1.23.15](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.14...v1.23.15) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** popover wires title via aria-labelledby on role=dialog ([ae6efee](https://github.com/FabioCaffarello/react-design-system/commit/ae6efee6158717c652f2e47740a1c03f2cf33529)), closes [#72](https://github.com/FabioCaffarello/react-design-system/issues/72)
* **a11y:** sidenavbar/withfooter migrates raw <input> to Input primitive ([aec3622](https://github.com/FabioCaffarello/react-design-system/commit/aec3622583665e97c0521a1a1995cef11e88193c)), closes [#70-74](https://github.com/FabioCaffarello/react-design-system/issues/70-74)

## [1.23.14](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.13...v1.23.14) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** autocomplete + multiselect listbox cascade + label dev warning ([066af3b](https://github.com/FabioCaffarello/react-design-system/commit/066af3bccc0546189d4a6230eac6502b06ba318e)), closes [#6](https://github.com/FabioCaffarello/react-design-system/issues/6) [#65](https://github.com/FabioCaffarello/react-design-system/issues/65) [#69](https://github.com/FabioCaffarello/react-design-system/issues/69)
* **a11y:** drawer accessible name via title + aria-* + dev warning guard ([c1926c5](https://github.com/FabioCaffarello/react-design-system/commit/c1926c5649ef6814f7098ff4d5112ed01162ab3b)), closes [#70](https://github.com/FabioCaffarello/react-design-system/issues/70) [#71](https://github.com/FabioCaffarello/react-design-system/issues/71)

## [1.23.13](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.12...v1.23.13) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** chip role=option drained — unified label-button architecture ([423999e](https://github.com/FabioCaffarello/react-design-system/commit/423999ee7fe8205629115fc553f2439c6367f284))
* **a11y:** searchandfilter raw select gets aria-label={filter.label} ([3f78e51](https://github.com/FabioCaffarello/react-design-system/commit/3f78e512045bb8d9af09d2b0f0421203d93551a3)), closes [#5](https://github.com/FabioCaffarello/react-design-system/issues/5) [#70](https://github.com/FabioCaffarello/react-design-system/issues/70) [#5](https://github.com/FabioCaffarello/react-design-system/issues/5)
* **a11y:** serial baseline of record + honest disable + sidebar id anchor ([b5cd12b](https://github.com/FabioCaffarello/react-design-system/commit/b5cd12b61cd717db13a0ff44123b7a5648ceca73)), closes [#1](https://github.com/FabioCaffarello/react-design-system/issues/1) [#2](https://github.com/FabioCaffarello/react-design-system/issues/2) [#3](https://github.com/FabioCaffarello/react-design-system/issues/3)

## [1.23.12](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.11...v1.23.12) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** chip click+remove desaninhado lado-a-lado ([4265b79](https://github.com/FabioCaffarello/react-design-system/commit/4265b79b67c80e3bc43d3a2559f5e2f11a17201e))

## [1.23.11](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.10...v1.23.11) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** menutrigger asChild implemented + stale gate removed ([7a8e733](https://github.com/FabioCaffarello/react-design-system/commit/7a8e733fd45524b34fbb4322f25e365219270962))

## [1.23.10](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.9...v1.23.10) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** textarea label opcional + dev warning guard ([3570aab](https://github.com/FabioCaffarello/react-design-system/commit/3570aab50b42ac2b2ec5ce007bd11818b877312f))

## [1.23.9](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.8...v1.23.9) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** multiselect label prop (required, htmlFor association) ([d5f7243](https://github.com/FabioCaffarello/react-design-system/commit/d5f724300ece727310f6b6e3056ddf512a82b937))
* **a11y:** timepicker stories — add label to default/format24h/format12h ([16fafb5](https://github.com/FabioCaffarello/react-design-system/commit/16fafb536db0af76953863df4e4d15dddf5be2c8))

## [1.23.8](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.7...v1.23.8) (2026-06-01)


### 🐛 Bug Fixes

* **a11y:** slider label required + range handles named via aria-labelledby ([a644b7d](https://github.com/FabioCaffarello/react-design-system/commit/a644b7dc6167a6dddfecba8aab0d21dc3ac3d75e)), closes [#6](https://github.com/FabioCaffarello/react-design-system/issues/6)

## [1.23.7](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.6...v1.23.7) (2026-05-31)


### 🐛 Bug Fixes

* **a11y:** triviais 2/3/5 — FormWizard h2, landmark-unique, select-name ([7912ebf](https://github.com/FabioCaffarello/react-design-system/commit/7912ebfa538d6a3ca058316a493d15dc2be4802b)), closes [#2](https://github.com/FabioCaffarello/react-design-system/issues/2) [#3](https://github.com/FabioCaffarello/react-design-system/issues/3) [#5](https://github.com/FabioCaffarello/react-design-system/issues/5)

## [1.23.6](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.5...v1.23.6) (2026-05-31)


### 🐛 Bug Fixes

* **a11y:** sidenavbar inner-aside removed + navigationtabs role corrected ([692e437](https://github.com/FabioCaffarello/react-design-system/commit/692e4374bf03c597ec5cce96bb9d35dacabc0c57))

## [1.23.5](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.4...v1.23.5) (2026-05-31)


### 🐛 Bug Fixes

* **a11y:** re-triagem semântica + cadeado ds/no-raw-color-classes nas stories ([dc6792f](https://github.com/FabioCaffarello/react-design-system/commit/dc6792fda949e71ea2a630936ebefa55309b291a)), closes [#59](https://github.com/FabioCaffarello/react-design-system/issues/59) [#57](https://github.com/FabioCaffarello/react-design-system/issues/57)

## [1.23.4](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.3...v1.23.4) (2026-05-31)


### 🐛 Bug Fixes

* **a11y:** faxina semântica raw-color em 56 story files (Phase 7 triagem) ([49bf249](https://github.com/FabioCaffarello/react-design-system/commit/49bf2496acf8f64b057bf1b7ed0843174a7f6ea7))

## [1.23.3](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.2...v1.23.3) (2026-05-31)


### 🐛 Bug Fixes

* **theme:** consume --color-surface-canvas on body (axe canvas-token fix) ([4d6e5b4](https://github.com/FabioCaffarello/react-design-system/commit/4d6e5b44106d97aa9df83564b3ebd1ce31959361)), closes [#020617](https://github.com/FabioCaffarello/react-design-system/issues/020617)

## [1.23.2](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.1...v1.23.2) (2026-05-30)


### 🐛 Bug Fixes

* **a11y:** Timeline + Stepper stories raw-color → semantic tokens (Phase 7 hygiene) ([94a8518](https://github.com/FabioCaffarello/react-design-system/commit/94a85184a19b250e2a7be33bfa144a77dcbc6e01))


### 📝 Documentation

* **backlog:** re-sweep post-PR55 + component-vs-story classification ([41966ae](https://github.com/FabioCaffarello/react-design-system/commit/41966aecf7b3501a1b6e198cffb20af2717cac9a))

## [1.23.1](https://github.com/FabioCaffarello/react-design-system/compare/v1.23.0...v1.23.1) (2026-05-30)


### 🐛 Bug Fixes

* **theme:** complete dark [@media](https://github.com/media) block + 5 missing dark overrides ([6e05ad9](https://github.com/FabioCaffarello/react-design-system/commit/6e05ad92376a65c10905a48b70f520d4bddb8e55)), closes [#55](https://github.com/FabioCaffarello/react-design-system/issues/55)

## [1.23.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.22.0...v1.23.0) (2026-05-30)


### ✨ Features

* **a11y:** Stepper button-name 13n — aria-label on bubble buttons ([c15789b](https://github.com/FabioCaffarello/react-design-system/commit/c15789b565b9114c4a564d06f71fd9ddd701e3e6)), closes [#52](https://github.com/FabioCaffarello/react-design-system/issues/52)

## [1.22.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.21.0...v1.22.0) (2026-05-30)


### ✨ Features

* **a11y:** fix SideNavbar button-name 38n (story defect) + Family A sweep ([8885ea2](https://github.com/FabioCaffarello/react-design-system/commit/8885ea21e66e83c2b1774dccbd6fc09e6257de25)), closes [#51](https://github.com/FabioCaffarello/react-design-system/issues/51)


### 🐛 Bug Fixes

* **a11y:** Switch tabIndex + Rating aria-label gate (Family C bucket B partial) ([bfbaf86](https://github.com/FabioCaffarello/react-design-system/commit/bfbaf86157a3ac2a2aef79457527ba8ddd8dd69f))


### 📝 Documentation

* **backlog:** mark DatePicker bucket resolved alongside PR49 fix ([8a682b4](https://github.com/FabioCaffarello/react-design-system/commit/8a682b4b17f1df931c4b47dfe1d3762348cc1ef8)), closes [#49](https://github.com/FabioCaffarello/react-design-system/issues/49)
* **backlog:** retroactive sync Family B — mark Switch + Rating resolved (PR [#48](https://github.com/FabioCaffarello/react-design-system/issues/48)) ([5242fa5](https://github.com/FabioCaffarello/react-design-system/commit/5242fa50a389bb89167e137e80fe8b55ff933d72)), closes [#49](https://github.com/FabioCaffarello/react-design-system/issues/49) [#49](https://github.com/FabioCaffarello/react-design-system/issues/49) [#50](https://github.com/FabioCaffarello/react-design-system/issues/50) [#49](https://github.com/FabioCaffarello/react-design-system/issues/49)

## [1.21.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.20.0...v1.21.0) (2026-05-30)


### ✨ Features

* **a11y:** DatePicker WAI-ARIA grid + roving tabindex (Family B anchor) ([a77388a](https://github.com/FabioCaffarello/react-design-system/commit/a77388adb961b35137d4e82a12de4a8554f3ba72)), closes [#48](https://github.com/FabioCaffarello/react-design-system/issues/48)

## [1.20.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.19.0...v1.20.0) (2026-05-30)


### ✨ Features

* **tokens:** add surface-brand-strong; remap 9 with-text sites (Family C bucket A) ([b589fc0](https://github.com/FabioCaffarello/react-design-system/commit/b589fc0136823cdceb78c2335d869a1a4d89b0d0)), closes [#6366f1](https://github.com/FabioCaffarello/react-design-system/issues/6366f1) [#4f46e5](https://github.com/FabioCaffarello/react-design-system/issues/4f46e5)


### 📝 Documentation

* **rules:** colors.md fg-quaternary exception — scope precision ([fb163fa](https://github.com/FabioCaffarello/react-design-system/commit/fb163faee811449859c91318a037b52b68fe014a))

## [1.19.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.18.0...v1.19.0) (2026-05-30)


### ✨ Features

* **a11y:** remap tertiary→secondary on tinted-bg contexts (Family C bucket E) ([df42f39](https://github.com/FabioCaffarello/react-design-system/commit/df42f3928cd73804c8f0e8866abc9016b16ae034)), closes [#64748](https://github.com/FabioCaffarello/react-design-system/issues/64748) [#f1f5f9](https://github.com/FabioCaffarello/react-design-system/issues/f1f5f9) [#64748](https://github.com/FabioCaffarello/react-design-system/issues/64748) [#e0e7](https://github.com/FabioCaffarello/react-design-system/issues/e0e7) [#64748](https://github.com/FabioCaffarello/react-design-system/issues/64748) [#475569](https://github.com/FabioCaffarello/react-design-system/issues/475569) [#e0e7](https://github.com/FabioCaffarello/react-design-system/issues/e0e7)

## [1.18.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.17.0...v1.18.0) (2026-05-30)


### ✨ Features

* **tokens:** darken surface-secondary + error to cross AA (Family C B+D) ([d06b9c9](https://github.com/FabioCaffarello/react-design-system/commit/d06b9c98e43abf5691dbce45684b2501575c1edb)), closes [#0f172](https://github.com/FabioCaffarello/react-design-system/issues/0f172) [#ec4899](https://github.com/FabioCaffarello/react-design-system/issues/ec4899) [#f43f5](https://github.com/FabioCaffarello/react-design-system/issues/f43f5) [#be185](https://github.com/FabioCaffarello/react-design-system/issues/be185) [#be123](https://github.com/FabioCaffarello/react-design-system/issues/be123) [#6366f1](https://github.com/FabioCaffarello/react-design-system/issues/6366f1)

## [1.17.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.16.0...v1.17.0) (2026-05-30)


### ✨ Features

* **badge:** use brand-subtle for primary solid (Family C bucket G) ([bdc0546](https://github.com/FabioCaffarello/react-design-system/commit/bdc0546db70b2aa5ce7b10a15c9af01eea63a96d)), closes [#eef2](https://github.com/FabioCaffarello/react-design-system/issues/eef2) [#4f46e5](https://github.com/FabioCaffarello/react-design-system/issues/4f46e5) [#1e1b4](https://github.com/FabioCaffarello/react-design-system/issues/1e1b4) [#a5b4](https://github.com/FabioCaffarello/react-design-system/issues/a5b4) [#4f46e5](https://github.com/FabioCaffarello/react-design-system/issues/4f46e5) [#6366f1](https://github.com/FabioCaffarello/react-design-system/issues/6366f1) [#eef2](https://github.com/FabioCaffarello/react-design-system/issues/eef2)

## [1.16.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.15.1...v1.16.0) (2026-05-30)


### ✨ Features

* **tokens:** darken status -dark tokens to cross WCAG AA 4.5:1 ([602e0e9](https://github.com/FabioCaffarello/react-design-system/commit/602e0e9b6fdc9e6ef87800451d5ea6d17d59e92c))


### 📝 Documentation

* **backlog:** close a11y baseline with full serial + equivalence note ([24eee0c](https://github.com/FabioCaffarello/react-design-system/commit/24eee0c8a9a67334e4d635df2dd36ac918346ed1))

## [1.15.1](https://github.com/FabioCaffarello/react-design-system/compare/v1.15.0...v1.15.1) (2026-05-29)


### 🐛 Bug Fixes

* **storybook:** file Providers/AppProvider under Design System ([37bb3a9](https://github.com/FabioCaffarello/react-design-system/commit/37bb3a97f674fc4945c2c9f69d51eb0bcaa44834))
* **storybook:** move Providers between Tokens and Component Status ([ef42927](https://github.com/FabioCaffarello/react-design-system/commit/ef429277ae2ad82fd6f82b70a17244f8848b3330))


### 📝 Documentation

* **rules:** add docs-sync rule; realign STORYBOOK_GUIDE ([9b01b41](https://github.com/FabioCaffarello/react-design-system/commit/9b01b418f60220c0a90aed93eca41ea1f2ba8771))

## [1.15.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.14.3...v1.15.0) (2026-05-29)


### ✨ Features

* **build:** emit bundled CSS via styles-entry library mode ([911d1d9](https://github.com/FabioCaffarello/react-design-system/commit/911d1d99b9e06bab2ad8dfd7e813c556b68c5461))


### 📝 Documentation

* **backlog:** close Phase 13e, register theme decision, 3rd FINAL occurrence ([cdcd3cd](https://github.com/FabioCaffarello/react-design-system/commit/cdcd3cd098735e18f2f4a41f97a54f4125fd659b))
* **readme:** add Installation, Usage, and Theming sections ([e01d479](https://github.com/FabioCaffarello/react-design-system/commit/e01d479b937d2bdc3db76f1dbe066989c3ae5153)), closes [#36](https://github.com/FabioCaffarello/react-design-system/issues/36)
* **testing:** document theme-aware test page pattern ([a6101fb](https://github.com/FabioCaffarello/react-design-system/commit/a6101fb4e82c2120630c0f6907e15715d4833b68))

## [1.14.3](https://github.com/FabioCaffarello/react-design-system/compare/v1.14.2...v1.14.3) (2026-05-29)


### 🐛 Bug Fixes

* **build:** simplify library to single entry ([c62b4e3](https://github.com/FabioCaffarello/react-design-system/commit/c62b4e394f406b56dd6ec5728baf62fbfe12d36b))
* **package:** remove broken sub-entries from exports ([f10a1b5](https://github.com/FabioCaffarello/react-design-system/commit/f10a1b544254747c16c57de7d42fb294363ab1cd))


### 📝 Documentation

* **testing:** document external consumer validation procedure ([72a450a](https://github.com/FabioCaffarello/react-design-system/commit/72a450a15a847a6ef22680f9f6e513611c31235e))

## [1.14.2](https://github.com/FabioCaffarello/react-design-system/compare/v1.14.1...v1.14.2) (2026-05-29)


### 🐛 Bug Fixes

* **css:** replace PostCSS Tailwind pipeline with @tailwindcss/vite ([ac4bbbf](https://github.com/FabioCaffarello/react-design-system/commit/ac4bbbf00c59fce75e0abcdd9a37dd780612fdb4)), closes [#0f172](https://github.com/FabioCaffarello/react-design-system/issues/0f172) [#6366f1](https://github.com/FabioCaffarello/react-design-system/issues/6366f1) [#6366f1](https://github.com/FabioCaffarello/react-design-system/issues/6366f1) [#e2e8f0](https://github.com/FabioCaffarello/react-design-system/issues/e2e8f0)

## [1.14.1](https://github.com/FabioCaffarello/react-design-system/compare/v1.14.0...v1.14.1) (2026-05-29)


### 🐛 Bug Fixes

* **build:** pin tsconfig rootDir to ./src for stable d.ts emission ([4c2bfa7](https://github.com/FabioCaffarello/react-design-system/commit/4c2bfa79d91204d69925796301fccb2c24e2844d))
* **storybook:** enable GFM in MDX pipeline (install remark-gfm) ([bd6aeaa](https://github.com/FabioCaffarello/react-design-system/commit/bd6aeaab9efe69353d8dd2f9835530b56364f4ee))


### 📝 Documentation

* **legacy:** delete EventCatalog ([476115e](https://github.com/FabioCaffarello/react-design-system/commit/476115e5e7a83e736fd0f5fb616d6362385948af))
* **legacy:** delete Performance guide, preserve actionable surface ([a7f9d12](https://github.com/FabioCaffarello/react-design-system/commit/a7f9d12520db5b503abf2110992c778c79113ed9))
* **legacy:** delete StateCatalog ([3d32d47](https://github.com/FabioCaffarello/react-design-system/commit/3d32d476ac53f11d1d6a5f79f141fe6d66ea3f4b))
* **legacy:** rewrite Component Composition guide ([4e87328](https://github.com/FabioCaffarello/react-design-system/commit/4e87328477472376c1ce9bda1a16a8b73ccc8c7b))
* **legacy:** rewrite Component Status and drop custom React table ([bdd1e01](https://github.com/FabioCaffarello/react-design-system/commit/bdd1e01b250e444b6b101f48e9396b728f2bbb85))

## [1.14.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.13.1...v1.14.0) (2026-05-29)


### ✨ Features

* **storybook:** add Design System Introduction landing page ([5cfb265](https://github.com/FabioCaffarello/react-design-system/commit/5cfb2652b80a116bc907468db8fa8964a0b41109))
* **storybook:** add manager theming with RDS wordmark ([ebc2558](https://github.com/FabioCaffarello/react-design-system/commit/ebc2558314d05c26b2152cff20a780a5734613f8))
* **storybook:** opinionated sidebar order via storySort ([7402c6e](https://github.com/FabioCaffarello/react-design-system/commit/7402c6e2e2e1f42d26556ddddee86e6cd08197c2))


### 📝 Documentation

* **claude:** add trailing-section exception rule for SKILL.md ([63d72ff](https://github.com/FabioCaffarello/react-design-system/commit/63d72ff8554e366a6e5ee6ff1db56ac4b84ed95a))
* **claude:** calibrate component-doc skill for Phase 13b3 — anatomy scaling + cross-reference rule ([68b00df](https://github.com/FabioCaffarello/react-design-system/commit/68b00df819f3e1550db8daa26f394845263a9dcb))
* **components:** document Card, Pagination, Breadcrumb (3 components) ([dec28d3](https://github.com/FabioCaffarello/react-design-system/commit/dec28d3dac7bffcee4e04af17f3d27b37064bd49))
* **components:** document DashboardLayout, LoginBox, Autocomplete (3 components) + BACKLOG finding ([6b65dda](https://github.com/FabioCaffarello/react-design-system/commit/6b65dda027e150b5e3a4d9c77a4a13621fb9ffee)), closes [#20](https://github.com/FabioCaffarello/react-design-system/issues/20) [checkpoint-#10](https://github.com/FabioCaffarello/checkpoint-/issues/10) [#20](https://github.com/FabioCaffarello/react-design-system/issues/20)
* **components:** document DataTablePattern, Timeline, Rating, SearchAndFilterPattern (4 components) ([778ef3f](https://github.com/FabioCaffarello/react-design-system/commit/778ef3f686f8376f108460d0ede56b6b2ed02810)), closes [#30](https://github.com/FabioCaffarello/react-design-system/issues/30) [checkpoint-#10](https://github.com/FabioCaffarello/checkpoint-/issues/10) [#30](https://github.com/FabioCaffarello/react-design-system/issues/30)
* **components:** document Drawer, Popover, Accordion (3 components) ([7761f6b](https://github.com/FabioCaffarello/react-design-system/commit/7761f6ba7afd1d324dfe8f8a0d467f8860cb6ead)), closes [checkpoint-#10](https://github.com/FabioCaffarello/checkpoint-/issues/10)
* **components:** document Dropdown, Menu, EmptyState (3 components) ([f058924](https://github.com/FabioCaffarello/react-design-system/commit/f0589246b2817f35861ae1142c9a7cb22143a137)), closes [#10](https://github.com/FabioCaffarello/react-design-system/issues/10) [#10](https://github.com/FabioCaffarello/react-design-system/issues/10)
* **components:** document FileUpload, DataGrid, TimePicker (3 components) ([067311f](https://github.com/FabioCaffarello/react-design-system/commit/067311fff41045532f9a735c560475ebc56b1714))
* **components:** document FormWizardPattern, SideNavbar (2 components — checkpoint [#32](https://github.com/FabioCaffarello/react-design-system/issues/32)) ([ffdd0e6](https://github.com/FabioCaffarello/react-design-system/commit/ffdd0e6a38768e1adacebef2e9771efe4cf972a1))
* **components:** document MultiSelect, ColorPicker, CommandPalette (3 components) ([43e6ab7](https://github.com/FabioCaffarello/react-design-system/commit/43e6ab798ff69fabe0605bf488071fc76e335616))
* **components:** document SearchInput, Header, Toast, Tabs (4 components) ([f107ed4](https://github.com/FabioCaffarello/react-design-system/commit/f107ed400d62598cc5984128eb12bb1e89616fb1))
* **components:** document Stepper, PageHeader, Navigation, ButtonGroup (4 components) ([a331b78](https://github.com/FabioCaffarello/react-design-system/commit/a331b78ca8a241d22e43664f3e6e59eb19a7b503)), closes [checkpoint-#10](https://github.com/FabioCaffarello/checkpoint-/issues/10) [checkpoint-#20](https://github.com/FabioCaffarello/checkpoint-/issues/20)
* **layouts:** document Container, Stack (2 layouts) ([909721a](https://github.com/FabioCaffarello/react-design-system/commit/909721a8fc6d444fd3ffa3c8e1b309e19f33a15a))
* **legacy:** remove TableProvider.mdx (folded into Table > Architecture) ([ecb3ed2](https://github.com/FabioCaffarello/react-design-system/commit/ecb3ed2c3220a207fc4ef7200477734c6591eb9c)), closes [#5](https://github.com/FabioCaffarello/react-design-system/issues/5)
* **legacy:** rewrite DatePicker.mdx to attached MDX standard ([4f1ae87](https://github.com/FabioCaffarello/react-design-system/commit/4f1ae870ddc1b8047733377cbeb3a2cb9dad9183)), closes [#2](https://github.com/FabioCaffarello/react-design-system/issues/2)
* **legacy:** rewrite Dialog.mdx to attached MDX standard ([c9e5ba2](https://github.com/FabioCaffarello/react-design-system/commit/c9e5ba206041164f141d73d368543706867a47d5)), closes [#3](https://github.com/FabioCaffarello/react-design-system/issues/3)
* **legacy:** rewrite Form.mdx to attached MDX standard ([56dbbe2](https://github.com/FabioCaffarello/react-design-system/commit/56dbbe241bab5eabbce4bff4869249454c9d8468)), closes [#1](https://github.com/FabioCaffarello/react-design-system/issues/1)
* **legacy:** rewrite Table.mdx + fold TableProvider architecture as trailing section ([7d7dd04](https://github.com/FabioCaffarello/react-design-system/commit/7d7dd04e075c0f41dc36bb698c9f7670aea41d47)), closes [#4](https://github.com/FabioCaffarello/react-design-system/issues/4)
* **primitives:** document Badge, Avatar, Dot (3 components) ([4384807](https://github.com/FabioCaffarello/react-design-system/commit/43848070350886e2ce906855755d7e007d1db83d))
* **primitives:** document Info, NavLink (2 components) + BACKLOG finding ([f91123a](https://github.com/FabioCaffarello/react-design-system/commit/f91123a13551fa97d0a79075e659324efc9d7b79))
* **primitives:** document Input, Checkbox, Radio (3 components) ([907a693](https://github.com/FabioCaffarello/react-design-system/commit/907a6930b2dd5715c002d68dd50c88a215941dbf))
* **primitives:** document Select, Textarea (2 components) ([61533bc](https://github.com/FabioCaffarello/react-design-system/commit/61533bca4cc840de9d1ba1048318a1e234cff277))
* **primitives:** document Slider, Collapsible (2 components) ([73c1519](https://github.com/FabioCaffarello/react-design-system/commit/73c15195871f9712e527985385b16373c8e8b99f))
* **primitives:** document Spinner, Progress, Skeleton, Separator (4 components) ([9ba955f](https://github.com/FabioCaffarello/react-design-system/commit/9ba955f708ebabb697405ceb32c9a8871b5aee3d))
* **primitives:** document Switch, Tooltip, Chip (3 components) ([7a84a36](https://github.com/FabioCaffarello/react-design-system/commit/7a84a361bb0c69820cce67ea943170049866cc45))
* **primitives:** document Text, Label, ErrorMessage (3 components) ([5af2433](https://github.com/FabioCaffarello/react-design-system/commit/5af2433b9e000649501743c24ffa3c09b22d5232))

## [1.13.1](https://github.com/FabioCaffarello/react-design-system/compare/v1.13.0...v1.13.1) (2026-05-29)


### 🐛 Bug Fixes

* **storybook:** remove autodocs tags from all stories — MDX attached is canonical ([004990e](https://github.com/FabioCaffarello/react-design-system/commit/004990ec652ba2ad9fac91ebee2a370e1158c582))


### 📝 Documentation

* **backlog:** register Phase 13b1 follow-ups ([ea7f3e9](https://github.com/FabioCaffarello/react-design-system/commit/ea7f3e995d28bfe649fc068c50ce697ad4f45c65))
* **button:** document Button as gold standard ([02effc3](https://github.com/FabioCaffarello/react-design-system/commit/02effc3a98c9f8f15f2358018e8543d864e2fe05))
* **claude:** add component-doc skill with corrected template ([8923fd9](https://github.com/FabioCaffarello/react-design-system/commit/8923fd9d6cf41193ceabc4c8f948b1c363ea88bc))
* **modal:** document Modal as gold standard ([62efecd](https://github.com/FabioCaffarello/react-design-system/commit/62efecd20ea9a19f434bc78fe074a98b5c8ad5fc))


### ♻️ Code Refactoring

* **claude:** calibrate component-doc skill based on gold standards ([7c91dd5](https://github.com/FabioCaffarello/react-design-system/commit/7c91dd51ae93b42dfd1a5a06019605f701bb10b2))

## [1.13.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.12.0...v1.13.0) (2026-05-29)


### ✨ Features

* **avatar:** document expected console error in ImageError story ([0bee31d](https://github.com/FabioCaffarello/react-design-system/commit/0bee31da2c308f77d1b25bc8a54b341f712e4ecc))
* **npm:** add storybook:smoke script ([d03a333](https://github.com/FabioCaffarello/react-design-system/commit/d03a33326867c60b9268f9cc123a33bcb4e7292d))
* **scripts:** add storybook smoke test script ([dea0ea9](https://github.com/FabioCaffarello/react-design-system/commit/dea0ea9a64859af961bc8e48c0bd38e3e481d54d))
* **scripts:** per-story allowlist via runtime story parameters ([15e3c87](https://github.com/FabioCaffarello/react-design-system/commit/15e3c8759b09b4732f67eb7f5e0f26abe4b3ee55))


### 🐛 Bug Fixes

* **scripts:** require [#storybook](https://github.com/FabioCaffarello/react-design-system/issues/storybook)-root children before declaring pass ([c44a129](https://github.com/FabioCaffarello/react-design-system/commit/c44a1296fa72cd69f84d44cc93c3b04fa46fca17))


### 📝 Documentation

* **backlog:** register Phase 13a follow-ups ([74a2d01](https://github.com/FabioCaffarello/react-design-system/commit/74a2d01cc80d4bdf4bbc4fbbfdc00fa828f17a2a))
* **claude:** document smoke script and methodology ([1b6262a](https://github.com/FabioCaffarello/react-design-system/commit/1b6262ab898f1a7696c26b97578c0cf32deb8c0e))

## [1.12.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.11.1...v1.12.0) (2026-05-29)


### ✨ Features

* **lint:** implement no-raw-color-classes rule ([86cca43](https://github.com/FabioCaffarello/react-design-system/commit/86cca4331963ad4937b3d788b575b684f2eb9f67))
* **lint:** scaffold local eslint plugin for color discipline ([d50dd76](https://github.com/FabioCaffarello/react-design-system/commit/d50dd76adc02d62e121f4a76304af5882f54a1dc))
* **lint:** wire ds/no-raw-color-classes into eslint.config.js ([83041f3](https://github.com/FabioCaffarello/react-design-system/commit/83041f30f1006fd1d8b7fa9d3b4248313adc7c5d))


### 🐛 Bug Fixes

* **text:** mark Text.tsx variant colors as documented literal exceptions ([b66ef34](https://github.com/FabioCaffarello/react-design-system/commit/b66ef34c8e42fcd5ef868df3498894680555273e))
* **tokens:** migrate SIDEBAR_TOKENS raw color classes to semantic tokens ([0692365](https://github.com/FabioCaffarello/react-design-system/commit/06923659903591244b0fe87bb4f293f313993f56))


### 📝 Documentation

* **backlog:** register Phase 12 follow-ups ([a313ae3](https://github.com/FabioCaffarello/react-design-system/commit/a313ae340f50b5f65e54daaa92b73893d22d0de8))
* **claude/rules:** add colors.md with 9 semantic principles from Phase 7 ([bbab76e](https://github.com/FabioCaffarello/react-design-system/commit/bbab76edb672047240fcb7b9a06e9a72be5f9161))
* **claude:** reference the enforcement layer in colors.md and CLAUDE.md ([95e3274](https://github.com/FabioCaffarello/react-design-system/commit/95e327491f8e89271d545f83236047e82d84cfd7)), closes [#3](https://github.com/FabioCaffarello/react-design-system/issues/3)
* **claude:** update environment for post-Phase 7 vocabulary ([20b8a22](https://github.com/FabioCaffarello/react-design-system/commit/20b8a22503157270516bbefac1966a2467e5141d))

## [1.11.1](https://github.com/FabioCaffarello/react-design-system/compare/v1.11.0...v1.11.1) (2026-05-29)


### 📝 Documentation

* **phase-10:** mark Phase 10 as complete ([833d888](https://github.com/FabioCaffarello/react-design-system/commit/833d888cf5123058fa857944015c7fc9f9e21286))


### ♻️ Code Refactoring

* **tokens:** migrate TokenVisualizations to new color system (8 roles) ([f4df9e8](https://github.com/FabioCaffarello/react-design-system/commit/f4df9e810f8575eb4be07f6ff6f34c9ec832d6f5))

## [1.11.0](https://github.com/FabioCaffarello/react-design-system/compare/v1.10.5...v1.11.0) (2026-05-29)


### ✨ Features

* **colors:** migrate Accordion to semantic tokens ([4140ebd](https://github.com/FabioCaffarello/react-design-system/commit/4140ebdb4efa4a2eb690352dfc741ae019f1bf90))
* **colors:** migrate AutocompleteList to semantic tokens ([fa8aff8](https://github.com/FabioCaffarello/react-design-system/commit/fa8aff8b5a419c137de3c352648adffd6bb4fdbc))
* **colors:** migrate AutocompleteOption to semantic tokens ([e43f836](https://github.com/FabioCaffarello/react-design-system/commit/e43f83625c0ba71cec6daf731b28a0c272c5690b))
* **colors:** migrate Avatar to semantic tokens ([e70b883](https://github.com/FabioCaffarello/react-design-system/commit/e70b88359f32c4015133b6e7e1dc0e10922b91e1))
* **colors:** migrate AvatarGroup to semantic tokens ([9cb4e6d](https://github.com/FabioCaffarello/react-design-system/commit/9cb4e6d5e698bf94ceb9af89fb510f47300d11f0))
* **colors:** migrate Badge to semantic tokens ([b6839f1](https://github.com/FabioCaffarello/react-design-system/commit/b6839f1ee71ae00c428fc3b0398c19f9d3614698))
* **colors:** migrate Breadcrumb to semantic tokens ([22f7d4b](https://github.com/FabioCaffarello/react-design-system/commit/22f7d4bbcdd9a960e59e95d609e60d2ee79f8cfb))
* **colors:** migrate Button to semantic tokens ([0ce6d49](https://github.com/FabioCaffarello/react-design-system/commit/0ce6d4980df422e077435083f39f670426a297ad))
* **colors:** migrate Card to semantic tokens ([e36d371](https://github.com/FabioCaffarello/react-design-system/commit/e36d3716e9d78aaf28d8937ffbad6be43ff86302))
* **colors:** migrate Checkbox to semantic tokens ([73a3743](https://github.com/FabioCaffarello/react-design-system/commit/73a37432091260be87ef0b05a8417e0e0181cc8c))
* **colors:** migrate Chip to semantic tokens ([d192100](https://github.com/FabioCaffarello/react-design-system/commit/d1921005f004ce92ce699f04552589a59c7d4940))
* **colors:** migrate ColorPicker to semantic tokens ([03f9722](https://github.com/FabioCaffarello/react-design-system/commit/03f97221e3dc4bbe6f99cc18713b6e285e96ab47))
* **colors:** migrate CommandPalette to semantic tokens ([f509eec](https://github.com/FabioCaffarello/react-design-system/commit/f509eec9fbeb7866de86c76f7ddd51fd3ff89ef0))
* **colors:** migrate DashboardLayout to semantic tokens ([44e295d](https://github.com/FabioCaffarello/react-design-system/commit/44e295d17a54aa4db163a41bf30078d02a6b0ea0))
* **colors:** migrate DataGrid to semantic tokens ([6e48a11](https://github.com/FabioCaffarello/react-design-system/commit/6e48a11629c0e5499824cf61b73735d44f589c9c))
* **colors:** migrate DataTablePattern (final residual site) ([f5711cc](https://github.com/FabioCaffarello/react-design-system/commit/f5711ccc6fa710c78a953738fd89ab4304e08f99))
* **colors:** migrate DatePicker to semantic tokens ([8451494](https://github.com/FabioCaffarello/react-design-system/commit/8451494b28deedb77ae14a9331a0be1a966fea60))
* **colors:** migrate DatePickerCalendar to semantic tokens ([68a488d](https://github.com/FabioCaffarello/react-design-system/commit/68a488df7f6dcbc15e14b665394ac8e3ccb8ff11))
* **colors:** migrate DialogContent to semantic tokens ([29ede3f](https://github.com/FabioCaffarello/react-design-system/commit/29ede3fa06afe3e295ddd34cc406dcd9dcdd3df8))
* **colors:** migrate Dot to semantic tokens ([a0a2f85](https://github.com/FabioCaffarello/react-design-system/commit/a0a2f8595473731d0099e68b1dba462c98095306))
* **colors:** migrate DrawerContent to semantic tokens ([6733e90](https://github.com/FabioCaffarello/react-design-system/commit/6733e90bfff4e4afa750dceda9a6e3813b0284ab))
* **colors:** migrate DrawerFooter to semantic tokens ([1ae2c28](https://github.com/FabioCaffarello/react-design-system/commit/1ae2c283d9974d4b9b4033ad46c5ba3ce62ebcb7))
* **colors:** migrate DrawerHeader to semantic tokens ([14c0f43](https://github.com/FabioCaffarello/react-design-system/commit/14c0f4343e7bf5cb24ec8bc114343722d617d607))
* **colors:** migrate Dropdown to semantic tokens ([9ffbebb](https://github.com/FabioCaffarello/react-design-system/commit/9ffbebb9931e671d344d160586062db91619ca1d))
* **colors:** migrate FileUpload to semantic tokens ([27bea1f](https://github.com/FabioCaffarello/react-design-system/commit/27bea1f28517b785a147615e960ecdda2ae37237))
* **colors:** migrate FormField to semantic tokens ([503528a](https://github.com/FabioCaffarello/react-design-system/commit/503528a6f5aac6832a0b5fb5b64cebccc3e44c31))
* **colors:** migrate FormWizardPattern to semantic tokens ([888be79](https://github.com/FabioCaffarello/react-design-system/commit/888be7905679a842d556463ce47c7f556a13edb3))
* **colors:** migrate Header to semantic tokens ([a88c9e6](https://github.com/FabioCaffarello/react-design-system/commit/a88c9e6f5d0da7293cf4ea9a0969a73616b5611d))
* **colors:** migrate Input to semantic tokens ([5c57a50](https://github.com/FabioCaffarello/react-design-system/commit/5c57a50179bd95c81b947e094905a85d74ab6bec))
* **colors:** migrate Label to semantic tokens ([7bcd957](https://github.com/FabioCaffarello/react-design-system/commit/7bcd95774dcfa001101f9e950b83b1baae3c1b37))
* **colors:** migrate LoginBox to semantic tokens ([9b48fdd](https://github.com/FabioCaffarello/react-design-system/commit/9b48fdd59088b3605bee1fb72c230a28417a9af9))
* **colors:** migrate MenuContent to semantic tokens ([d2ae29e](https://github.com/FabioCaffarello/react-design-system/commit/d2ae29e38692f98820900618bdca6da9b0445a9d))
* **colors:** migrate MenuItem to semantic tokens ([5c49aa1](https://github.com/FabioCaffarello/react-design-system/commit/5c49aa184d289c1a87fdb0fb29a9b1d56c447b00))
* **colors:** migrate MenuSeparator to semantic tokens ([4a44b74](https://github.com/FabioCaffarello/react-design-system/commit/4a44b74f552a81a12373f95cf28b4bee53e62d21))
* **colors:** migrate Modal to semantic tokens ([92d6c2d](https://github.com/FabioCaffarello/react-design-system/commit/92d6c2da2690765d34218bb622a8e945f6440189))
* **colors:** migrate MultiSelect to semantic tokens ([122a263](https://github.com/FabioCaffarello/react-design-system/commit/122a26313a9f747d8c46a10d9cec90890a3f2a0d))
* **colors:** migrate Navbar to semantic tokens ([b6ea1fa](https://github.com/FabioCaffarello/react-design-system/commit/b6ea1fae8bab8429cef449534a4ea10bc5747030))
* **colors:** migrate NavbarGroup to semantic tokens ([51fac38](https://github.com/FabioCaffarello/react-design-system/commit/51fac380a15896fea1f6b3766c48ac4b5563cfea))
* **colors:** migrate NavbarItem to semantic tokens ([db35305](https://github.com/FabioCaffarello/react-design-system/commit/db35305c49a30fdadbf732e6d5c625dfc2e07474))
* **colors:** migrate NavbarToggle to semantic tokens ([5446b6b](https://github.com/FabioCaffarello/react-design-system/commit/5446b6b27e72b429abcab3c2c3576a0a626c2c2a))
* **colors:** migrate NavLink to semantic tokens ([50c0387](https://github.com/FabioCaffarello/react-design-system/commit/50c038729d4f143169bf8663683aab791462038f))
* **colors:** migrate PageHeader to semantic tokens ([42813c4](https://github.com/FabioCaffarello/react-design-system/commit/42813c431de1691db1ea5668773db4d8c5005a7e))
* **colors:** migrate Pagination to semantic tokens ([81e1abc](https://github.com/FabioCaffarello/react-design-system/commit/81e1abc9c757157d6858593552dc88af9b3b42f6))
* **colors:** migrate Popover to semantic tokens ([0ab70fd](https://github.com/FabioCaffarello/react-design-system/commit/0ab70fda62f468ee7203c5b30638925f1e4793d1))
* **colors:** migrate Progress to semantic tokens ([5764029](https://github.com/FabioCaffarello/react-design-system/commit/5764029ecb0d67ac5994d15f51e138844129e9a0))
* **colors:** migrate Radio to semantic tokens ([3b27b58](https://github.com/FabioCaffarello/react-design-system/commit/3b27b58e251cf2b4ec7b489fbba01cbc4549b534))
* **colors:** migrate Rating to semantic tokens ([a46304e](https://github.com/FabioCaffarello/react-design-system/commit/a46304e3b4722854af72126198ac78af49fb38c3))
* **colors:** migrate scrim and tint-hover consumers to semantic tokens ([539d43a](https://github.com/FabioCaffarello/react-design-system/commit/539d43a53fed06612a5127ceab370479dee091e5))
* **colors:** migrate SearchAndFilterPattern to semantic tokens ([b193bc3](https://github.com/FabioCaffarello/react-design-system/commit/b193bc32f7797651e50f47ad9cfed76b1a17f32a))
* **colors:** migrate Select to semantic tokens ([d883067](https://github.com/FabioCaffarello/react-design-system/commit/d88306789f5d5db30793508ab4702f73efde4e16))
* **colors:** migrate Separator to semantic tokens ([9213cc6](https://github.com/FabioCaffarello/react-design-system/commit/9213cc63357706348274e7beea41897c26741666))
* **colors:** migrate Sidebar to semantic tokens ([3e95ef9](https://github.com/FabioCaffarello/react-design-system/commit/3e95ef9650df98efbac96cee84bf0beb4b295947))
* **colors:** migrate SidebarFooter to semantic tokens ([f8ce0eb](https://github.com/FabioCaffarello/react-design-system/commit/f8ce0eb787e9b1fc5866887bf0efa74f1ab22b50))
* **colors:** migrate SidebarGroup to semantic tokens ([2729685](https://github.com/FabioCaffarello/react-design-system/commit/2729685f80e6ce2a3d4d47bdac1f17e15616ce40))
* **colors:** migrate SidebarHeader to semantic tokens ([a228461](https://github.com/FabioCaffarello/react-design-system/commit/a228461ffad5932e0d569c79883f49f22077660f))
* **colors:** migrate SideNavbarGroup to semantic tokens ([b9fdd19](https://github.com/FabioCaffarello/react-design-system/commit/b9fdd19684d6ca4fb707c183f53158e47eecc6a0))
* **colors:** migrate SideNavbarResizeHandle to semantic tokens ([caa0584](https://github.com/FabioCaffarello/react-design-system/commit/caa0584cdd4f51f4bca9888fd7a669b51ce44044))
* **colors:** migrate SideNavbarRoot to semantic tokens ([14af19b](https://github.com/FabioCaffarello/react-design-system/commit/14af19b4321e3db395a4cfab405dab6befa2e27a))
* **colors:** migrate SideNavbarToggle to semantic tokens ([16bf925](https://github.com/FabioCaffarello/react-design-system/commit/16bf92555b8927458dd34c6af14819c7aece7f4b))
* **colors:** migrate Skeleton to semantic tokens ([b595124](https://github.com/FabioCaffarello/react-design-system/commit/b595124edd55a1cba68e8a92fb3b598ef3304884))
* **colors:** migrate Slider to semantic tokens ([c72209a](https://github.com/FabioCaffarello/react-design-system/commit/c72209a9cb907fd2d89523a3f2528ab28728fd3f))
* **colors:** migrate Spinner to semantic tokens ([159ba48](https://github.com/FabioCaffarello/react-design-system/commit/159ba48f1a5f3d5d1acd594ba8f403ca8c820479))
* **colors:** migrate Stepper to semantic tokens ([a05fa01](https://github.com/FabioCaffarello/react-design-system/commit/a05fa0156060a6e7b78ee366f72e40b4c26d249b))
* **colors:** migrate Switch to semantic tokens ([d2d24e8](https://github.com/FabioCaffarello/react-design-system/commit/d2d24e8c18a7e54ec8e042d15ff7353dd6046995))
* **colors:** migrate Table to semantic tokens ([d890132](https://github.com/FabioCaffarello/react-design-system/commit/d890132a814cfba6470098074dee478eb9b0ae34))
* **colors:** migrate TableBody to semantic tokens ([c8d4795](https://github.com/FabioCaffarello/react-design-system/commit/c8d479558c594c20008656abe71a411b32db930a))
* **colors:** migrate TableCell to semantic tokens ([c6930bc](https://github.com/FabioCaffarello/react-design-system/commit/c6930bcfd5e71b01df4e6ed477b70b37fd441cdd))
* **colors:** migrate TableEmptyState to semantic tokens ([c062bf9](https://github.com/FabioCaffarello/react-design-system/commit/c062bf9d1c12e35271376f4394bcf388b159578a))
* **colors:** migrate TableFilters to semantic tokens ([ad5f737](https://github.com/FabioCaffarello/react-design-system/commit/ad5f737b7c8d1e9eb142879b1957d4e51a2267f8))
* **colors:** migrate TableHeader to semantic tokens ([858d36e](https://github.com/FabioCaffarello/react-design-system/commit/858d36eeb15ad590a11580fdf191cd8bcb6854d2))
* **colors:** migrate TableHeaderCell to semantic tokens ([db50ed4](https://github.com/FabioCaffarello/react-design-system/commit/db50ed4c769ac0c91d834d89de6d543095056658))
* **colors:** migrate TableHeaderRow to semantic tokens ([1b4cace](https://github.com/FabioCaffarello/react-design-system/commit/1b4cace86bc363ff439e0f4e0fa1975476a1ff01))
* **colors:** migrate TablePagination to semantic tokens ([102ac3b](https://github.com/FabioCaffarello/react-design-system/commit/102ac3bd07bde3e9dec49d74e50950b4e913e651))
* **colors:** migrate TableRow to semantic tokens ([8e5125d](https://github.com/FabioCaffarello/react-design-system/commit/8e5125d94fced2cf69f2f35bfa962d509bbe5562))
* **colors:** migrate TabsList to semantic tokens ([3a69acf](https://github.com/FabioCaffarello/react-design-system/commit/3a69acf63674e5fbad6db575c15a832a9a6baa62))
* **colors:** migrate TabsTrigger to semantic tokens ([d58b311](https://github.com/FabioCaffarello/react-design-system/commit/d58b3115b3bb24b06b324ecf0b4104f95693b7bc))
* **colors:** migrate Textarea to semantic tokens ([ba0945c](https://github.com/FabioCaffarello/react-design-system/commit/ba0945c51f425992f7dddff0fc08b0d275d5d55d))
* **colors:** migrate Timeline to semantic tokens ([462c204](https://github.com/FabioCaffarello/react-design-system/commit/462c204f994f734ef1dc8f20d4653ec0c9ad794a))
* **colors:** migrate Toast to semantic tokens ([19a0661](https://github.com/FabioCaffarello/react-design-system/commit/19a06611bcc511da926798894794b1d312b19d61))
* **colors:** migrate Tooltip to semantic tokens ([f44e29c](https://github.com/FabioCaffarello/react-design-system/commit/f44e29cc15ea933e1d53a19e94e7977ffb103f3d))
* **colors:** pilot batch A — migrate Dialog, EmptyState, NavbarSeparator to semantic tokens ([9ae035a](https://github.com/FabioCaffarello/react-design-system/commit/9ae035a25e397e9478df188b0ef85803aa5fee70))
* **tokens:** add fg-brand-emphasis for active/selected brand foreground ([d3ac9f2](https://github.com/FabioCaffarello/react-design-system/commit/d3ac9f2638c0127ecd59811cd5e31cf9b27f8bff))
* **tokens:** add fg-brand-secondary-emphasis for active/selected secondary brand foreground ([139bb40](https://github.com/FabioCaffarello/react-design-system/commit/139bb407771d9d9528901118f4cab7e2af3ecab3))
* **tokens:** add scrim and tint-hover color tokens ([a2aea60](https://github.com/FabioCaffarello/react-design-system/commit/a2aea60710e760194f84ef0d46c82f78fc9408e0))
* **tokens:** add status-neutral color token ([3aac35d](https://github.com/FabioCaffarello/react-design-system/commit/3aac35d81279a2a4d8fadd29151d787d2288260d))


### 📝 Documentation

* **backlog:** expand scrim item with Chip and intensity variants ([727582a](https://github.com/FabioCaffarello/react-design-system/commit/727582a4fbe3cdfb2438b0909785daba9d97e4e6))
* **backlog:** mark scrim token gap as resolved ([2dd4913](https://github.com/FabioCaffarello/react-design-system/commit/2dd49138450e6f7ce5300405956cd6f18d3bff42))
* **backlog:** register notification color gap ([b9da782](https://github.com/FabioCaffarello/react-design-system/commit/b9da7827b4f0d38a22cb28417d3e1f8ff3172028))
* **backlog:** register Phase 10 — Tokens infrastructure cleanup ([c02265b](https://github.com/FabioCaffarello/react-design-system/commit/c02265b0ef18f2440c106ebd5539289563a2428b))
* **backlog:** register scrim token gap ([c4f1578](https://github.com/FabioCaffarello/react-design-system/commit/c4f15788a5bf09e8a598c90c6268ed5c7802eeb4))
* **phase-7:** mark Phase 7 as complete ([a4a43aa](https://github.com/FabioCaffarello/react-design-system/commit/a4a43aa66c451fc06587ef19b0d8ab783f18b3cc))
* **phase-7:** register cardinality-of-state precedent ([e283444](https://github.com/FabioCaffarello/react-design-system/commit/e28344494db92e4b898c59a033d55f94e4e17cde))
* **phase-7:** register family-completion precedent ([f044ec3](https://github.com/FabioCaffarello/react-design-system/commit/f044ec35f833cc3fdcba02f96f40c6c959904e5b))
* **phase-7:** register hierarchy-vs-binary-vs-interactivity refinement ([f40d149](https://github.com/FabioCaffarello/react-design-system/commit/f40d149c92361284db81a2ce98ee0beb9f056f41))
* **phase-7:** register hierarchy-vs-state and line-token-vs-mechanism precedents ([553e5c6](https://github.com/FabioCaffarello/react-design-system/commit/553e5c6c75d1d08e8a866fae10a307a8b2674895))
* **phase-7:** register new precedents from Feedback batch ([ab58b69](https://github.com/FabioCaffarello/react-design-system/commit/ab58b69fb2fdbc99e71b717dbb93dfec8e4442cc))
* **phase-7:** register new precedents from Form batch ([6983b1d](https://github.com/FabioCaffarello/react-design-system/commit/6983b1d7c76b31075b4bc4949d3302fb40718b3d))
* **phase-7:** register new precedents from Overlay batch ([b45d693](https://github.com/FabioCaffarello/react-design-system/commit/b45d69370c2da5f4cd4ddf91211f96cbb11c8a41))
* **phase-7:** register semantic translation heuristics from pilot ([b12c26d](https://github.com/FabioCaffarello/react-design-system/commit/b12c26d4cf7e4ac4fb48cdb573f0fc16db9fa2ea))
* **tokens:** refresh README with Phase 9 canonical API ([a0ad4c4](https://github.com/FabioCaffarello/react-design-system/commit/a0ad4c47a051e8e70e228f984616c7882bb9fb6c))


### ♻️ Code Refactoring

* **tokens:** remove LEGACY re-export block from tokens/index.ts ([91c34be](https://github.com/FabioCaffarello/react-design-system/commit/91c34bed9861073e68f3a0af89b46958a98024db))

## [1.10.5](https://github.com/FabioCaffarello/react-design-system/compare/v1.10.4...v1.10.5) (2026-05-28)


### 🐛 Bug Fixes

* **release:** rename release.config.js to .cjs ([929863a](https://github.com/FabioCaffarello/react-design-system/commit/929863a024ebaba3e24a1aaf24c2fbec51297094))

# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.10.4] - 2026-01-19 (Próxima Versão)

### ✅ Solução Turbopack: Compatibilidade com Next.js 15+

#### Problema Resolvido

- **Turbopack Compatibility:** Resolvido problema de inicialização com Turbopack (Next.js 15+)
  - Problema estava nas extensions (especialmente React Flow) sendo code-split incorretamente
  - Solução: Extensions removidas do export principal e disponibilizadas via entry point separado
  - Build do Next.js com Turbopack agora funciona corretamente

#### Mudanças

- **Extensions Separadas:** Extensions não são mais exportadas do index principal
  - Evita code splitting incorreto do Turbopack
  - Extensions disponíveis via `@fabio.caffarello/react-design-system/extensions`
  - Flow extension disponível via `@fabio.caffarello/react-design-system/extensions/flow`
- **Documentação Atualizada:** `NEXTJS_SETUP.md` atualizado com instruções para Turbopack

### 🏗️ Solução Estrutural: Inicialização de Providers

#### Mudanças Estruturais

- **Provider Initialization Guard:** Implementado sistema de guard que garante ordem de inicialização dos providers
  - Objeto que referencia todos os providers, criando boundary de módulo
  - Previne code splitting que quebra ordem de inicialização
  - Garante que todos os providers estejam no mesmo contexto
- **Configuração de Build Otimizada:** Ajustes no `vite.config.ts` para garantir ordem
  - `manualChunks`: Força todos os providers no mesmo chunk
  - `treeshake.moduleSideEffects`: Preserva side effects dos providers
  - `preserveEntrySignatures: 'strict'`: Preserva exports
- **Exports Explícitos:** Substituído barrel exports por exports nomeados explícitos
  - Elimina dependências implícitas de barrel exports
  - Garante ordem de exports explícita
- **Entry Point Separado:** Criado entry point `./providers` separado
  - Permite importar providers sem importar todo o design system
  - Facilita tree-shaking e code splitting controlado

#### Reestruturação de Providers

- **Providers Movidos:** `ToastProvider` e `DialogProvider` movidos de `organisms/` para `providers/`
  - Quebra dependências arquiteturais
  - Agrupa todos os providers logicamente
  - Re-exports mantidos para compatibilidade

#### Documentação e Ferramentas

- **Documentação Completa:** Criado `docs/NEXTJS_SETUP.md` com guia completo
  - Configuração do Next.js necessária
  - Script de setup automatizado
  - Workaround documentado
  - Troubleshooting
- **Script de Setup:** Criado `npm run setup:nextjs` para configurar Next.js automaticamente
- **Análise de Dependências:** Criado `npm run analyze:deps` para detectar dependências circulares

### ⚠️ Limitação Conhecida

O problema de inicialização pode persistir no Next.js mesmo com a solução estrutural porque:

- Next.js faz seu próprio bundling e pode reorganizar código
- Requer configuração adicional no `next.config.js` do consumidor
- Ver `docs/NEXTJS_SETUP.md` para configuração necessária

### 📝 Documentação

- Adicionado `docs/NEXTJS_SETUP.md` - Guia completo de setup do Next.js
- Adicionado `.context/docs/SOLUCAO_ESTRUTURAL_COMPLETA.md` - Documentação técnica completa
- Adicionado `.context/docs/PLANO_RESOLUCAO_INICIALIZACAO_CIRCULAR.md` - Plano detalhado
- Adicionado `.context/docs/ANALISE_INICIAL_COMPLETA.md` - Análise inicial

### 🔗 Impacto

**Antes:**

- ❌ Erro durante build do Next.js
- ❌ Problema de inicialização circular
- ❌ Requer workaround

**Depois:**

- ✅ Solução estrutural implementada
- ✅ Build do design system otimizado
- ✅ Documentação completa
- ⚠️ Requer configuração adicional no Next.js (documentada)

---

## [1.10.3] - 2026-01-19

### 🐛 Corrigido

#### Compatibilidade Next.js SSR

- **Correção crítica:** Resolvido erro `ReferenceError: Cannot access 'aT' before initialization` durante build do Next.js 15.5.9
- **Ordem de exports:** Reorganizada ordem de exports em `src/ui/index.ts` e `src/ui/providers/index.ts` para garantir inicialização correta
  - Tokens exportados primeiro (sem dependências)
  - Utils exportados em seguida (funções puras)
  - Providers exportados na ordem de dependência (Theme → Config → App)
  - Componentes exportados por último (dependem de providers)
- **Compatibilidade SSR:** Corrigidos `ThemeProvider` e `ConfigProvider` para verificar ambiente antes de usar APIs do browser
  - `ThemeProvider`: Adicionada verificação `typeof window === 'undefined'` no `useEffect`
  - `ConfigProvider`: Substituído `useMemo` por `useEffect` para manipulação do DOM (SSR-safe)
- **Configuração de build:** Ajustada configuração do Vite para preservar ordem de inicialização
  - Providers mantidos no bundle principal (não code-split)
  - Tree-shaking preserva side effects necessários dos providers

### ✨ Adicionado

#### Testes

- **Script de teste Next.js:** Adicionado `npm run test:nextjs` para validar compatibilidade com Next.js
  - Cria aplicação Next.js mínima automaticamente
  - Testa build com `AppProvider` em layout (SSR)
  - Testa build com `AppProvider` em client component
  - Valida que build passa sem erros

### 📝 Documentação

- Adicionado documento `.context/docs/completed-changes/nextjs-ssr-fixes.md` com detalhes das correções

### 🔗 Impacto

**Antes:**

- ❌ Erro durante build do Next.js
- ❌ Requer workaround com lazy loading
- ❌ Flash de conteúdo sem estilização

**Depois:**

- ✅ Build do Next.js passa sem erros
- ✅ `AppProvider` funciona nativamente em SSR/prerendering
- ✅ Sem necessidade de workarounds
- ✅ Melhor experiência de usuário

---

## [1.9.0] - 2024-01-XX

### ✨ Adicionado

#### Novos Tokens

- **Animações** (`tokens/animations.ts`)
  - Durações: fast (150ms), base (200ms), slow (300ms), slower (500ms)
  - Easing functions: ease-in, ease-out, ease-in-out, spring
  - Helpers: `getAnimationClass()`, `getTransitionClass()`

- **Z-Index** (`tokens/z-index.ts`)
  - Layers: base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip, toast
  - Helper: `getZIndexClass()`

- **Opacidade** (`tokens/opacity.ts`)
  - Valores: 0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100
  - Helper: `getOpacityClass()`

- **Gradientes** (`tokens/gradients.ts`)
  - Roles: primary, secondary, success, error, info, warning
  - Directions: to-r, to-l, to-t, to-b, to-tr, to-tl, to-br, to-bl
  - Helper: `getGradientClass()`

#### Novos Componentes Atoms

- **Switch** - Toggle on/off com estados, labels, descrições, acessibilidade completa
- **Separator** - Separador horizontal/vertical com variantes (solid, dashed, dotted)
- **Accordion** - Single e multiple selection, animações suaves, ícones customizáveis
- **Slider** - Range input com single e dual thumb, marks opcionais, tooltip de valor
- **Popover** - Posicionamento inteligente, trigger customizável, portal rendering

#### Novos Componentes Molecules

- **SearchInput** - Input com ícone de busca, clear button, loading state, debounce
- **Rating** - Sistema de avaliação com estrelas, half ratings, read-only, custom icons
- **FileUpload** - Drag and drop, preview de arquivos, validação de tipo/tamanho, progress indicator
- **TimePicker** - Seleção de hora com formato 12h/24h, keyboard navigation
- **ColorPicker** - Seletor de cores com RGB sliders, presets, formatos hex/rgb/hsl

#### Novos Componentes Organisms

- **Stepper** - Wizard multi-step com validação por step, navegação, progress indicator
- **Timeline** - Exibição de eventos em linha do tempo, horizontal/vertical, status, ícones
- **CommandPalette** - Busca rápida de comandos, keyboard navigation (Cmd/Ctrl+K), categorias
- **DataGrid** - Grid avançado com export, grouping, column management, toolbar actions

### 🔧 Melhorado

#### Performance

- **React.memo** implementado em: Card, Badge, Separator, Spinner
- **useMemo/useCallback** implementado em componentes otimizados
- **Code splitting** configurado com entry points separados (atoms, molecules, organisms, tokens)
- **Virtual scrolling** já existente no Table otimizado

#### Documentação

- Documentação completa de tokens no Storybook (`Tokens.mdx`)
- Componentes de visualização de tokens (`TokenVisualizations.tsx`)
- Guia de code splitting (`CODE_SPLITTING.md`)
- Guia de performance (`PERFORMANCE_GUIDE.md`)

#### Ferramentas

- Script de auditoria de tokens (`scripts/audit-tokens.js`)
- Comando npm: `npm run audit:tokens`

### 📦 Build

- Entry points separados configurados no `package.json`
- Vite config atualizado para múltiplos builds
- Tree shaking otimizado

### 🔄 Breaking Changes

Nenhuma breaking change nesta versão. Todas as mudanças são aditivas e backward compatible.

### 📝 Notas

- Todos os novos componentes incluem testes com cobertura >80%
- Todos os novos componentes incluem stories no Storybook
- Todos os novos componentes seguem padrões de acessibilidade WCAG 2.1 AA
- Todos os novos componentes usam design tokens consistentemente
