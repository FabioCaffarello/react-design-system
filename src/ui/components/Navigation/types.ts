/**
 * Navigation Types
 *
 * Type definitions for the Navigation component.
 */

import type { ReactNode } from "react";

/**
 * Navigation Orientation
 */
export type NavigationOrientation = "horizontal" | "vertical";

/**
 * Navigation Variant
 */
export type NavigationVariant = "default" | "pills" | "tabs";

/**
 * Navigation Item
 *
 * Represents a single navigation item.
 */
export interface NavItem {
  /**
   * URL of the navigation item
   */
  href: string;

  /**
   * Label text
   */
  label: string;

  /**
   * Whether the item is active
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional icon (ReactNode)
   */
  icon?: ReactNode;

  /**
   * Optional badge or additional content
   */
  badge?: ReactNode;

  /**
   * Additional CSS classes for this item
   */
  className?: string;
}

/**
 * Navigation Props
 *
 * @see EPIC-003: Navigation Component (Molecule)
 * @see RFC-005: Navigation Composition Pattern (APPROVED)
 */
export interface NavigationProps {
  /**
   * Array of navigation items
   */
  items: NavItem[];

  /**
   * Orientation of the navigation
   * @default 'horizontal'
   */
  orientation?: NavigationOrientation;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: NavigationVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for the navigation
   * @default 'Main navigation'
   */
  "aria-label"?: string;

  /**
   * Bare mode: Don't create nav element wrapper.
   * Useful when Navigation is used inside Header.Navigation which already provides the nav wrapper.
   * @default false
   */
  bare?: boolean;

  /**
   * Current pathname for auto-detection of active state.
   * If not provided, Navigation will try to auto-detect using Next.js usePathname (if available).
   * Manual active prop on items has priority over auto-detection.
   */
  pathname?: string;
}
