'use client';

import { useContext } from 'react';
import { SplitSidebarContext } from '../SplitSidebar';

/**
 * Hook to access SplitSidebar context
 * 
 * Provides access to sidebar state and controls.
 * Must be used within a SplitSidebar component.
 * 
 * @example
 * ```tsx
 * const { collapsed, toggle, setCollapsed } = useSplitSidebar();
 * ```
 */
export function useSplitSidebar() {
  const context = useContext(SplitSidebarContext);
  if (!context) {
    throw new Error('useSplitSidebar must be used within a SplitSidebar component');
  }
  return context;
}
