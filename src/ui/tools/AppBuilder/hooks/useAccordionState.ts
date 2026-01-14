'use client';

import { useState, useCallback } from 'react';

export interface UseAccordionStateOptions {
  defaultOpen?: string | null;
  onAccordionChange?: (activeId: string | null) => void;
}

export interface UseAccordionStateReturn {
  activeAccordionId: string | null;
  setActiveAccordionId: (id: string | null) => void;
  handleAccordionChange: (id: string | null) => void;
}

/**
 * Hook for managing accordion state
 * 
 * Manages which accordion item is currently open.
 * Only one accordion can be open at a time (type="single").
 */
export function useAccordionState(
  options: UseAccordionStateOptions = {}
): UseAccordionStateReturn {
  const { defaultOpen = null, onAccordionChange } = options;
  const [activeAccordionId, setActiveAccordionIdState] = useState<string | null>(defaultOpen);

  const handleAccordionChange = useCallback(
    (id: string | null) => {
      setActiveAccordionIdState(id);
      onAccordionChange?.(id);
    },
    [onAccordionChange]
  );

  const setActiveAccordionId = useCallback(
    (id: string | null) => {
      handleAccordionChange(id);
    },
    [handleAccordionChange]
  );

  return {
    activeAccordionId,
    setActiveAccordionId,
    handleAccordionChange,
  };
}
