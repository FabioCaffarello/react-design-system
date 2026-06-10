---
description: Testing standards
globs: src/**/*.test.tsx, src/**/*.test.ts
---

# Testing rules

- Use Vitest + Testing Library. Query by role/label, not by test-id or class.
- Cover: default render, each variant, interaction (click/keyboard), disabled/loading states, and a11y (no violations).
- Aim ≥ 80% coverage per component. Coverage is a floor, not a goal — test behavior users rely on, not implementation detail.
- No snapshot tests as the primary assertion. Assert on visible/accessible output.
- Stories double as interaction tests via play functions where it adds value.

## Test-file split: behavior vs accessibility

A component dir ships **two** Vitest test files:

- `<Name>.test.tsx` — behavior: variants, interaction, controlled/uncontrolled, edge cases, callbacks.
- `<Name>.accessibility.test.tsx` — a11y contracts: ARIA roles & labels, keyboard navigation, focus management, screen-reader-facing surface.

The a11y file mirrors `src/ui/components/Header/Header.accessibility.test.tsx` as the canonical scaffold — its four `describe` blocks (ARIA Labels and Roles / Keyboard Navigation / Focus Management / Screen Reader Support) are the slots every component-level a11y suite fills. The split keeps a11y regressions self-evident at the file level (a failing `*.accessibility.test.tsx` is unambiguously an accessibility regression, not a behavior one) and gives reviewers a single place to verify the WCAG 2.1 AA contract per component.

Enforced by `scripts/validate-file-set.mjs` — a new component dir without `<Name>.accessibility.test.tsx` fails the gate in pre-push and CI.
