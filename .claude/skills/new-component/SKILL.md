---
name: new-component
description: Scaffold and implement a new design system component end to end. Use when the user asks to create a new Button, Card, Modal, or any UI component. Handles the full lifecycle — scaffold, implement, test, story.
---

# New component

Build a complete, production-grade component for this mono-brand design system.

## Steps

1. **Classify the layer.** Ask once if ambiguous, otherwise decide:
   - indivisible (no other UI inside) → `src/ui/primitives/`
   - composed of primitives → `src/ui/components/`
   - pure structure/spacing → `src/ui/layouts/`

2. **Scaffold.** Run `npm run plop` — it emits the complete five-file set (`Name.tsx`, `Name.test.tsx`, `Name.accessibility.test.tsx`, `Name.stories.tsx`, `index.ts`) plus the layer-barrel export, and the generated files pass lint, typecheck, and `scripts/validate-file-set.mjs` as-is. The generated tests are a passing scaffold for a generic div — replace them with the component's real contract during implementation. The `*.accessibility.test.tsx` mirrors `src/ui/components/Header/Header.accessibility.test.tsx` for the four-section scaffold (ARIA Labels and Roles / Keyboard Navigation / Focus Management / Screen Reader Support); fill each section with the component's real a11y contract. The file-set gate rejects any dir missing any of the five files.

3. **Implement** following `.claude/rules/components.md`:
   - Exported `NameProps` interface, no `any`.
   - `variant` unions over boolean soup.
   - Tailwind + semantic tokens only. **Read `.claude/rules/colors.md` before applying ANY color — choose role, not shade. Zero raw Tailwind color classes.**
   - `forwardRef` + `...rest` for interactive primitives.
   - ARIA + keyboard + focus ring.

4. **Test** following `.claude/rules/testing.md`: render, variants, interaction, states, a11y. Run `npm run test -- Name` and confirm green + coverage ≥ 80%.

5. **Story**: one `Default`, one per variant, one `Playground` with controls. Include a11y-relevant args.

6. **Verify**: `npm run lint` clean. Run the validation greps from `.claude/rules/colors.md` (Quick validation section) against the new files — both must return zero hits. Report what was created and any token additions.

7. **Refresh the a11y baseline.** A new component adds its stories (5+) to the Storybook set, which changes the count the CI a11y gate compares against. Run `npm run test:a11y:baseline` (build-storybook + serial axe, light + dark, ~11min local) and commit the regenerated `a11y-baseline.json` in the same PR. Confirm the run reports `critical=0 serious=0` (the floor) first — otherwise the `--compare` story-set parity check in the `A11y baseline (light/dark)` CI jobs fails (`totalStories: CI=N ref=M`) even when lint, typecheck, tests, and the Next smoke are all green. (Skipping this is the #1 way a fully-passing local build still goes red in CI.)

## Guardrails

- Don't add dependencies. If you think one is needed, stop and ask.
- Don't touch other components. Stay in scope.
- If a needed token doesn't exist, add it to the scale and the Tokens story first.
