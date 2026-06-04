"use client";

import { useEffect, type RefObject } from "react";
import { getFocusableElements } from "./focusable";

/**
 * On `isActive` rising edge, move keyboard focus to the first focusable
 * element inside `containerRef`. Falls back to focusing the container
 * itself (after temporarily setting `tabindex="-1"` if needed) when the
 * container has no focusable children — so the modal still owns focus
 * and Escape/Tab handlers attached to it remain reachable.
 *
 * Deferred via `setTimeout(0)`, matching the timing the existing Dialog
 * implementation proved out. Two reasons that timing matters:
 *
 *   1. The overlay's content (button, input, link) is committed to the
 *      DOM in the same render that flips `isActive` true. Synchronous
 *      focus from inside the effect can land on the *previous* DOM
 *      snapshot in React 19's concurrent paths; the timer guarantees
 *      we run after commit.
 *   2. Composes with `useFocusRestore`. Restore snapshots
 *      `document.activeElement` on open *before* this hook moves focus
 *      inside the overlay — order guaranteed by the snapshot running in
 *      its own effect at the rising edge while auto-focus is deferred.
 *
 * Idempotent on `isActive=false`: the hook does nothing on the falling
 * edge (focus restoration is `useFocusRestore`'s concern; this hook
 * only handles the rising-edge auto-focus).
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen }: { isOpen: boolean }) {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   useFocusRestore(isOpen);
 *   useFocusTrap(contentRef, isOpen);
 *   useAutoFocus(contentRef, isOpen);
 *   // ...
 * }
 * ```
 */
export function useAutoFocus(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
): void {
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const focusables = getFocusableElements(container);
      if (focusables.length > 0) {
        focusables[0].focus();
        return;
      }

      // Container has no focusable child (e.g., a confirmation modal
      // rendered with body text only). Make the container itself
      // focusable so the trap has something to anchor to and the
      // surface receives keyboard events. We don't restore the original
      // tabindex on cleanup — the container is about to unmount with
      // the closing overlay; persisting tabindex="-1" through the
      // closing frame is harmless.
      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }
      container.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isActive, containerRef]);
}
