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

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current =
        (document.activeElement as HTMLElement | null) ?? null;
    } else {
      const previous = previousActiveElement.current;
      // setTimeout(0) defers the restore until after React has committed
      // the close transition and removed the overlay's DOM (so the
      // restore target isn't a now-disposed element inside the overlay
      // — it's whatever had focus *before* the overlay opened).
      const timer = setTimeout(() => {
        previous?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
}
