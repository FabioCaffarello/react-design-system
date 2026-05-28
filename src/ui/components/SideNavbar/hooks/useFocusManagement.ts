"use client";

import { useEffect, useRef, useCallback } from "react";

export interface UseFocusManagementOptions {
  /**
   * Whether focus trap is active
   */
  isActive: boolean;

  /**
   * Container element to trap focus within
   */
  containerRef: React.RefObject<HTMLElement | null>;

  /**
   * Whether to restore focus to previous element when deactivated
   * @default true
   */
  restoreFocus?: boolean;

  /**
   * Initial element to focus when activated
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Hook for managing focus within a container (focus trap)
 *
 * Traps focus within a container element, useful for modals and overlays.
 * Supports restoring focus when deactivated.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useFocusManagement({
 *   isActive: isOpen,
 *   containerRef,
 *   restoreFocus: true
 * });
 * ```
 */
export function useFocusManagement({
  isActive,
  containerRef,
  restoreFocus = true,
  initialFocusRef,
}: UseFocusManagementOptions) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Save previous focus when activating
  useEffect(() => {
    if (isActive) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Focus initial element if provided
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        // Otherwise focus first focusable element in container
        const firstFocusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        firstFocusable?.focus();
      }
    } else if (restoreFocus && previousActiveElementRef.current) {
      // Restore focus when deactivating
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, [isActive, containerRef, initialFocusRef, restoreFocus]);

  // Trap focus within container
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      // Handle Tab key
      if (event.key === "Tab") {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    },
    [isActive, containerRef],
  );

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyDown]);
}
