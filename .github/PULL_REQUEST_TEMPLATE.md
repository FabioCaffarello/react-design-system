<!--
Title must follow Conventional Commits, e.g.:
  feat(button): add loading state
  fix(modal): trap focus on open
  ci: split CI into parallel jobs
Allowed types: feat, fix, perf, revert, refactor, docs, style, chore, test, build, ci
Breaking changes: append "!" to the type or include "BREAKING CHANGE:" in the body.
-->

## Summary

<!-- What does this PR change and why? Keep it to a few bullets. -->

-
-

## Type of change

<!-- Check all that apply. -->

- [ ] feat — new user-facing capability
- [ ] fix — bug fix
- [ ] refactor — internal change, no behavior delta
- [ ] perf — performance improvement
- [ ] docs — docs / Storybook only
- [ ] test — tests only
- [ ] build / ci — build, release, or CI plumbing
- [ ] chore — tooling, deps, housekeeping
- [ ] BREAKING CHANGE

## Scope

<!-- Which layer(s) does this touch? -->

- [ ] primitives
- [ ] components
- [ ] layouts
- [ ] tokens
- [ ] hooks / providers
- [ ] tooling / CI

## Checklist

- [ ] Title follows Conventional Commits.
- [ ] Component file set (`.tsx`, `.test.tsx`, `.stories.tsx`, `index.ts`) is intact for any touched component.
- [ ] Styling uses tokens / Tailwind utilities — no hardcoded hex/px.
- [ ] Accessibility verified (keyboard nav, ARIA, focus ring) where relevant.
- [ ] Tests added or updated; coverage stays ≥ 80% for touched components.
- [ ] `npm run lint`, `npm run test`, and `npm run build` all pass locally.
- [ ] Storybook still builds (`npm run build-storybook`) if stories or styles changed.

## Screenshots / Storybook

<!-- Drop screenshots, gifs, or Storybook links for visual changes. -->

## Related issues

<!-- Closes #..., Refs #... -->
