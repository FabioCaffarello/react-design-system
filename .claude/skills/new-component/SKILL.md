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

2. **Scaffold.** Run `npm run plop` if the template fits, otherwise create the four files manually:
   `Name.tsx`, `Name.test.tsx`, `Name.stories.tsx`, `index.ts`.

3. **Implement** following `.claude/rules/components.md`:
   - Exported `NameProps` interface, no `any`.
   - `variant` unions over boolean soup.
   - Tailwind + semantic tokens only.
   - `forwardRef` + `...rest` for interactive primitives.
   - ARIA + keyboard + focus ring.

4. **Test** following `.claude/rules/testing.md`: render, variants, interaction, states, a11y. Run `npm run test -- Name` and confirm green + coverage ≥ 80%.

5. **Story**: one `Default`, one per variant, one `Playground` with controls. Include a11y-relevant args.

6. **Verify**: `npm run lint` clean. Report what was created and any token additions.

## Guardrails

- Don't add dependencies. If you think one is needed, stop and ask.
- Don't touch other components. Stay in scope.
- If a needed token doesn't exist, add it to the scale and the Tokens story first.
