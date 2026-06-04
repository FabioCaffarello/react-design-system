/**
 * NavLink Types
 *
 * Type definitions for the NavLink component.
 */

import type { ReactNode, ElementType, AnchorHTMLAttributes } from "react";

/**
 * NavLink Variants
 */
export type NavLinkVariant = "default" | "underline" | "background";

/**
 * NavLink Sizes
 */
export type NavLinkSize = "sm" | "md" | "lg";

/**
 * NavLink Props
 *
 * @see ADR-001 for active state detection strategy
 * @see RFC-002 for Next.js integration strategy
 */
export interface NavLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "as" | "href"
> {
  /**
   * URL of the navigation link
   */
  href: string;

  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Manual active state (has priority over auto-detect)
   *
   * @see ADR-001: Active state detection strategy
   */
  active?: boolean;

  /**
   * Whether the link is disabled
   */
  disabled?: boolean;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: NavLinkVariant;

  /**
   * Size variant
   * @default 'md'
   */
  size?: NavLinkSize;

  /**
   * Custom element type (for Next.js Link integration)
   *
   * @see RFC-002: Next.js integration strategy
   */
  as?: ElementType;

  /**
   * Additional CSS classes
   */
  className?: string;
}
