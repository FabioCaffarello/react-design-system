'use client';

import { useState, useCallback, useEffect } from 'react';
import type { UseGroupStateOptions, UseGroupStateReturn } from '../types';

/**
 * Hook for managing collapsible group states
 *
 * Manages collapsed/expanded state for multiple groups with optional persistence.
 * Used internally by SideNavbarStateProvider, but can be used standalone.
 *
 * @example
 * ```tsx
 * const { groupStates, toggleGroup, setGroupCollapsed } = useGroupState({
 *   defaultStates: { filters: false, settings: true },
 *   persist: true,
 *   storageKey: 'my-sidebar-groups',
 * });
 *
 * // Check if group is collapsed
 * const isFiltersCollapsed = groupStates['filters'] ?? false;
 *
 * // Toggle a group
 * toggleGroup('filters');
 *
 * // Set specific state
 * setGroupCollapsed('settings', false);
 * ```
 */
export function useGroupState({
  defaultStates = {},
  persist = false,
  storageKey,
}: UseGroupStateOptions = {}): UseGroupStateReturn {
  // Initialize state from storage or defaults
  const getInitialStates = (): Record<string, boolean> => {
    if (persist && storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${storageKey}-groups`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultStates, ...parsed };
        } catch {
          // Invalid JSON, use defaults
        }
      }
    }
    return defaultStates;
  };

  const [groupStates, setGroupStates] = useState<Record<string, boolean>>(getInitialStates);

  // Persist state changes
  useEffect(() => {
    if (persist && storageKey && typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-groups`, JSON.stringify(groupStates));
    }
  }, [persist, storageKey, groupStates]);

  const toggleGroup = useCallback((groupId: string) => {
    setGroupStates((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const setGroupCollapsed = useCallback((groupId: string, collapsed: boolean) => {
    setGroupStates((prev) => ({
      ...prev,
      [groupId]: collapsed,
    }));
  }, []);

  const resetGroups = useCallback(() => {
    setGroupStates(defaultStates);
  }, [defaultStates]);

  return {
    groupStates,
    toggleGroup,
    setGroupCollapsed,
    resetGroups,
  };
}

export default useGroupState;
