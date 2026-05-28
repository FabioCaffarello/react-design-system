/**
 * Header Types
 *
 * Type definitions for the Header component.
 */

import type { ReactNode, HTMLAttributes } from "react";

/**
 * Header Variants
 */
export type HeaderVariant = "default" | "elevated" | "bordered";

/**
 * Header Max Width
 */
export type HeaderMaxWidth = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Header Props
 *
 * @see EPIC-002: Header Component (Molecule)
 * @see RFC-003: Header Composition Pattern (APPROVED)
 * @see ADR-002: Header + SideNavbar Compatibility (ACCEPTED)
 */
export interface HeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Header content (uses compound components pattern)
   *
   * @example
   * ```tsx
   * <Header>
   *   <Header.Logo>Logo</Header.Logo>
   *   <Header.Navigation>...</Header.Navigation>
   *   <Header.Actions>...</Header.Actions>
   * </Header>
   * ```
   */
  children?: ReactNode;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: HeaderVariant;

  /**
   * Whether the header is sticky
   * @default false
   */
  sticky?: boolean;

  /**
   * Max width of the header container
   * @default 'full'
   */
  maxWidth?: HeaderMaxWidth;

  /**
   * Bare mode: Don't create header element and Container wrapper.
   * Useful when Header is used inside DashboardLayout which already provides the wrapper.
   * @default false
   */
  bare?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
