"use client";

import { useEffect, type RefObject } from "react";

/**
 * Selector covering tabbable elements per WAI-ARIA Authoring Practices.
 * Mirrors the selector DialogContent has shipped with since the dialog
 * pattern landed; centralising it here closes the duplication door.
 */
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      !(el as HTMLButtonElement | HTMLInputElement).disabled &&
      el.offsetParent !== null,
  );
}

/**
 * Trap Tab / Shift+Tab cycling within `containerRef` while `isActive`.
 *
 * Boundary-only intervention: the handler intercepts Tab on the LAST
 * focusable element (cycles back to first) and Shift+Tab on the FIRST
 * focusable element (cycles back to last). Tab/Shift+Tab on any
 * intermediate element falls through to the browser's default
 * sequential focus navigation. This is the exact shape the existing
 * `DialogContent` proved out — extracting it here means there's only
 * one place to fix when the subtle parts (disabled filtering,
 * `offsetParent !== null`, zero-focusable edge case) need to evolve.
 *
 * Zero-focusable edge case: if the container has no tabbable elements,
 * Tab and Shift+Tab are both preventDefault'd, so focus can't escape
 * the trap onto the underlying page. The container can still be closed
 * via Escape (a concern of the consumer, not this hook).
 *
 * Trap is restore-only on the focus side: it does NOT auto-focus the
 * first element when activated (the consumer typically handles that
 * separately) and it does NOT snapshot/restore focus on toggle (that's
 * `useFocusRestore`'s job — the two hooks compose).
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, ... }) {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(contentRef, isOpen);
 *   // ...
 * }
 * ```
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
): void {
  useEffect(() => {
    if (!isActive) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusables = getFocusableElements(container);

      if (focusables.length === 0) {
        // No tabbable target inside the trap — block both directions so
        // focus can't escape onto the underlying page.
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
    };
  }, [isActive, containerRef]);
}
