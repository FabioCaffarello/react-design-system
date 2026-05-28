---
description: Standards for any component under src/ui/
globs: src/ui/**/*.tsx
---

# Component rules

When creating or editing a component:

1. **File set is mandatory.** A component folder MUST contain:
   - `ComponentName.tsx` — implementation
   - `ComponentName.test.tsx` — Vitest + Testing Library
   - `ComponentName.stories.tsx` — Storybook
   - `index.ts` — single explicit export

2. **Props.** Define and export a `ComponentNameProps` interface. No inline prop types. No `any`. Prefer composition over boolean prop explosion (avoid >4 boolean props — use a `variant` union instead).

3. **Styling.** Tailwind utility classes only, driven by tokens. No hardcoded colors, spacing, or radii. If a value isn't in the token scale, add it to the scale first — don't inline it.

4. **forwardRef.** Interactive primitives forward refs and spread `...rest` onto the root element.

5. **Accessibility.** Keyboard operable, correct ARIA role/state, visible focus ring. Interactive elements have accessible names.

6. **No cross-layer upward imports.** primitives never import from components or layouts. components may import primitives. layouts import primitives only.
