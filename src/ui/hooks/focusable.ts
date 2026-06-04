"use client";

/**
 * Shared focusable-element helpers consumed by the focus-management
 * hooks (`useFocusTrap`, `useAutoFocus`). Centralised so the selector
 * and visibility filter have one definition — if the rules change
 * (a new tabbable role lands, jsdom's offsetParent quirk needs a
 * different handling pivot, etc.), there's exactly one site to edit.
 *
 * Originally lived inline in `DialogContent`'s focus trap; the trap
 * hook took ownership in Phase 3 PR 1, and PR 2 split it out again
 * once `useAutoFocus` became the second consumer.
 */

/**
 * Selector covering tabbable elements per WAI-ARIA Authoring Practices.
 * Mirrors the selector DialogContent has shipped with since the dialog
 * pattern landed.
 */
export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Return the focusable descendants of `container` that are eligible to
 * receive Tab focus.
 *
 * Filters out:
 *  - `disabled` form controls (button/input/select/textarea expose the
 *    DOM property; the cast is safe at the call site because every
 *    selector match either has the property or returns `undefined`,
 *    which short-circuits to falsy).
 *  - hidden elements (`offsetParent === null` — covers `display: none`,
 *    `visibility: hidden`, detached subtrees). In jsdom this filter
 *    rejects every connected element because jsdom doesn't compute
 *    layout; tests work around this by stubbing `offsetParent` on the
 *    nodes they care about. Production stays correct.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      !(el as HTMLButtonElement | HTMLInputElement).disabled &&
      el.offsetParent !== null,
  );
}
