"use client";

import { useEffect, useRef } from "react";

/**
 * Snapshot focus when an overlay opens; restore on close.
 *
 * When `isOpen` flips from false to true, snapshots
 * `document.activeElement` at that moment. When `isOpen` flips back to
 * false, restores focus to the snapshotted element in a `setTimeout(0)`
 * — matching the timing the existing DialogProvider proved out
 * (Dialog.test.tsx:221 depends on this exact shape).
 *
 * Trigger-ref-free by design: the snapshot mechanism captures whatever
 * had focus at open time, so overlays can be opened by any composition
 * (button click, programmatic call from a notification, etc.) without
 * carrying a ref to a single triggering element.
 *
 * Scope is restore only. Focus trapping (Tab cycling within an open
 * modal container) is the separate concern of `useFocusTrap`. The two
 * hooks compose: modal surfaces (Dialog, Drawer) use both; non-modal
 * surfaces (Popover) use only restore.
 *
 * @example
 * ```tsx
 * function MyOverlay({ isOpen }: { isOpen: boolean }) {
 *   useFocusRestore(isOpen);
 *   // ...
 * }
 * ```
 */
export function useFocusRestore(isOpen: boolean): void {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Rising edge: cancel any pending restore (rapid close→open) and
    // snapshot whatever had focus before the overlay opened. The snapshot
    // is taken before useAutoFocus (called after this hook) moves focus
    // inside the overlay.
    if (restoreTimer.current !== null) {
      clearTimeout(restoreTimer.current);
      restoreTimer.current = null;
    }
    previousActiveElement.current =
      (document.activeElement as HTMLElement | null) ?? null;

    // Restore from the effect CLEANUP — not from an `isOpen === false`
    // branch. The cleanup fires on BOTH the falling edge (isOpen → false
    // while mounted) AND on unmount-while-open. The latter is the common
    // `{isOpen && <Overlay />}` pattern: closing unmounts the subtree, so
    // an isOpen=false render never happens and a falling-edge-only restore
    // would leave focus stranded on <body> (WCAG 2.4.3).
    return () => {
      const previous = previousActiveElement.current;
      // setTimeout(0) defers the restore until after React has committed
      // the close and removed the overlay's DOM, so focus lands on the
      // pre-open element rather than a now-disposed node inside the overlay.
      restoreTimer.current = setTimeout(() => {
        previous?.focus();
        restoreTimer.current = null;
      }, 0);
    };
  }, [isOpen]);
}
