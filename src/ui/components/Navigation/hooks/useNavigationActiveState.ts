/**
 * useNavigationActiveState Hook
 *
 * Hook to automatically detect active navigation items using Next.js usePathname.
 *
 * @see EPIC-003: Navigation Component (Molecule)
 */

"use client";

import { useMemo } from "react";
import type { NavItem } from "../types";

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
  // `pathname` is the single explicit channel. The earlier
  // `require("next/navigation")` probe always returned undefined (it
  // couldn't call `usePathname` conditionally) so it was a no-op in
  // disguise — removed.
  const currentPathname = pathname;

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
