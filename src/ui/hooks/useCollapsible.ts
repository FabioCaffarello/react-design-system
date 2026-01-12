'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseCollapsibleOptions {
  defaultOpen?: boolean;
  open?: boolean; // Controlled mode
  onOpenChange?: (open: boolean) => void;
  storageKey?: string; // For localStorage persistence
}

export interface UseCollapsibleReturn {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * useCollapsible Hook
 * 
 * Reusable hook for collapsible component logic.
 * Supports both controlled and uncontrolled modes.
 * Optional localStorage persistence.
 * 
 * @example
 * ```tsx
 * const { isOpen, toggle } = useCollapsible({
 *   defaultOpen: true,
 *   storageKey: 'my-collapsible-state'
 * });
 * ```
 */
export function useCollapsible({
  defaultOpen = true,
  open,
  onOpenChange,
  storageKey,
}: UseCollapsibleOptions): UseCollapsibleReturn {
  // Load initial state from localStorage if storageKey is provided
  const getInitialState = useCallback((): boolean => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return defaultOpen;
  }, [defaultOpen, storageKey]);

  const [internalOpen, setInternalOpen] = useState<boolean>(getInitialState);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;

  // Persist to localStorage when state changes
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined' && open === undefined) {
      localStorage.setItem(storageKey, String(internalOpen));
    }
  }, [internalOpen, storageKey, open]);

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        // Uncontrolled mode
        setInternalOpen(newOpen);
      }
      // In controlled mode, parent handles state
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange]
  );

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  return {
    isOpen,
    toggle,
    setOpen,
  };
}
