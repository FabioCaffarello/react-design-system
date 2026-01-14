'use client';

import { createContext, useContext } from 'react';
import type { SideNavbarTogglePosition } from '../types';

export interface SideNavbarToggleContextValue {
  showMainToggle: boolean;
  mainTogglePosition: SideNavbarTogglePosition;
}

export const SideNavbarToggleContext = createContext<SideNavbarToggleContextValue | null>(null);

export function useSideNavbarToggleContext(): SideNavbarToggleContextValue | null {
  return useContext(SideNavbarToggleContext);
}

export function useSideNavbarToggleContextRequired(): SideNavbarToggleContextValue {
  const context = useContext(SideNavbarToggleContext);
  if (!context) {
    // Return defaults if context is not available (for backward compatibility)
    return {
      showMainToggle: true,
      mainTogglePosition: 'floating',
    };
  }
  return context;
}
