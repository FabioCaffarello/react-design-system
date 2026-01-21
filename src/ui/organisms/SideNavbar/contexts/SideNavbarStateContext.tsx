'use client';

import { createContext, useContext } from 'react';
import type { SideNavbarStateContextValue } from '../types';

/**
 * State context for SideNavbar runtime state.
 * Contains mutable state that changes during component lifecycle.
 */
export const SideNavbarStateContext = createContext<SideNavbarStateContextValue | null>(null);

/**
 * Hook to access SideNavbar state context.
 * Returns null if used outside of provider.
 */
export function useSideNavbarState(): SideNavbarStateContextValue | null {
  return useContext(SideNavbarStateContext);
}

/**
 * Hook to access SideNavbar state context with required check.
 * Throws error if used outside of provider.
 */
export function useSideNavbarStateRequired(): SideNavbarStateContextValue {
  const context = useContext(SideNavbarStateContext);
  if (!context) {
    throw new Error('useSideNavbarStateRequired must be used within SideNavbarStateProvider');
  }
  return context;
}

// Default values factory (needs ref)
export function createDefaultStateValues(): SideNavbarStateContextValue {
  return {
    collapsed: false,
    toggle: () => {},
    setCollapsed: () => {},
    currentWidth: 320,
    setWidth: () => {},
    isMobile: false,
    isResizing: false,
    startResize: () => {},
    groupStates: {},
    toggleGroup: () => {},
    setGroupCollapsed: () => {},
    sidebarRef: { current: null },
  };
}
