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
