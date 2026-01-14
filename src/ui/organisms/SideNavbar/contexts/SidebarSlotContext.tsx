'use client';

import { createContext, useContext } from 'react';
import type { SidebarSlotContextValue } from '../types';

/**
 * Sidebar Slot Context
 *
 * Provides slot management for dynamic sidebar content.
 * Allows registering and switching between different content slots.
 */
export const SidebarSlotContext = createContext<SidebarSlotContextValue | null>(null);

/**
 * Hook to access sidebar slot context
 * Returns null if used outside provider
 */
export function useSidebarSlot(): SidebarSlotContextValue | null {
  return useContext(SidebarSlotContext);
}

/**
 * Hook to access sidebar slot context (required)
 * Throws error if used outside provider
 */
export function useSidebarSlotRequired(): SidebarSlotContextValue {
  const context = useContext(SidebarSlotContext);
  if (!context) {
    throw new Error('useSidebarSlotRequired must be used within SidebarSlotProvider');
  }
  return context;
}
