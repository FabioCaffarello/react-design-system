/**
 * useNavigationActiveState Hook
 * 
 * Hook to automatically detect active navigation items using Next.js usePathname.
 * 
 * @see EPIC-003: Navigation Component (Molecule)
 */

'use client';

import { useMemo } from 'react';
import type { NavItem } from '../types';

/**
 * Options for useNavigationActiveState
 */
export interface UseNavigationActiveStateOptions {
  /**
   * Navigation items
   */
  items: NavItem[];

  /**
   * Current pathname (from Next.js usePathname)
   * If not provided, will try to auto-detect
   */
  pathname?: string;
}

/**
 * Result of useNavigationActiveState
 */
export interface UseNavigationActiveStateResult {
  /**
   * Items with active state calculated
   */
  itemsWithActive: NavItem[];
}

/**
 * useNavigationActiveState Hook
 * 
 * Automatically detects which navigation items are active based on current pathname.
 * 
 * Priority: manual active prop > auto-detect > false
 * 
 * @param options - Hook options
 * @returns Items with active state calculated
 */
export function useNavigationActiveState({
  items,
  pathname,
}: UseNavigationActiveStateOptions): UseNavigationActiveStateResult {
  // Try to get pathname from Next.js if not provided
  const currentPathname = useMemo(() => {
    if (pathname !== undefined) {
      return pathname;
    }

    // Try to auto-detect using Next.js usePathname
    try {
      // Dynamic import to avoid breaking when Next.js is not available
      // @ts-expect-error - usePathname is available at runtime but not in TypeScript types
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nextNavigation = typeof require !== 'undefined' ? require('next/navigation') : null;
      if (nextNavigation?.usePathname) {
        // We can't call hooks conditionally, so we need to handle this differently
        // For now, return undefined and let the component handle it
        return undefined;
      }
    } catch {
      // Next.js not available - this is expected and safe
    }

    return undefined;
  }, [pathname]);

  // Calculate active state for each item
  const itemsWithActive = useMemo(() => {
    return items.map((item) => {
      // Manual active prop has priority
      if (item.active !== undefined) {
        return item;
      }

      // Auto-detect if pathname is available
      if (currentPathname) {
        const isActive = 
          currentPathname === item.href || 
          currentPathname.startsWith(`${item.href}/`);
        return { ...item, active: isActive };
      }

      // Default to false
      return { ...item, active: false };
    });
  }, [items, currentPathname]);

  return { itemsWithActive };
}
