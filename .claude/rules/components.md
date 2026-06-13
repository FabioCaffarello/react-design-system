---
description: Standards for any component under src/ui/
globs: src/ui/**/*.tsx
---

# Component rules

When creating or editing a component:

1. **File set is mandatory.** A component folder MUST contain:
   - `ComponentName.tsx` — implementation
   - `ComponentName.test.tsx` — Vitest + Testing Library (behavior coverage)
   - `ComponentName.accessibility.test.tsx` — Vitest + Testing Library (dedicated a11y suite; mirror `Header.accessibility.test.tsx` for the four-section scaffold: ARIA Labels and Roles / Keyboard Navigation / Focus Management / Screen Reader Support)
   - `ComponentName.stories.tsx` — Storybook
   - `index.ts` — single explicit export

   Enforced by `scripts/validate-file-set.mjs` in pre-push and CI. New dirs cannot land without all five files.

2. **Props.** Define and export a `ComponentNameProps` interface. No inline prop types. No `any`. Prefer composition over boolean prop explosion (avoid >4 boolean props — use a `variant` union instead).

3. **Styling.** Tailwind utility classes only. For color, read `.claude/rules/colors.md` before applying any color — use the semantic role-based vocabulary (`text-fg-*`, `bg-surface-*`, `border-line-*`, etc.). Never use raw Tailwind color classes (`text-gray-*`, `bg-white`, etc.). For spacing, radius, shadow, z-index: use the token scale; don't inline values. See `.claude/rules/tokens.md` for the full discipline.

4. **forwardRef.** Interactive primitives forward refs and spread `...rest` onto the root element.

5. **Accessibility.** Keyboard operable, correct ARIA role/state, visible focus ring. Interactive elements have accessible names.

6. **No cross-layer upward imports.** primitives never import from components or layouts. components may import primitives. layouts import primitives only.

7. **Stories change the a11y baseline.** A new component ships 5+ stories, which join the Storybook story set the CI a11y gate counts. Regenerate the committed reference with `npm run test:a11y:baseline` and commit `a11y-baseline.json` in the same PR — the `A11y baseline (light/dark)` jobs fail at the `--compare` story-set parity check (`totalStories: CI=N ref=M`) otherwise, even when lint/typecheck/tests/smoke are all green. Confirm `critical=0 serious=0` (the floor) before committing. This is the last step of landing a component and the easiest to forget; the `test:a11y:baseline` command and the two-parallel-jobs CI gate are documented in `CLAUDE.md`'s Commands section and its a11y note.
