/**
 * HeaderActions Component
 *
 * Actions slot component for Header (typically buttons, user menu, etc.).
 *
 * @see EPIC-002: Header Component (Molecule)
 * @see RFC-003: Header Composition Pattern (APPROVED)
 */

"use client";

import { type ReactNode } from "react";
import { cn } from "../../../utils";
import { getSpacingClass } from "../../../tokens/spacing";

export interface HeaderActionsProps {
  /**
   * Actions content (typically Button components)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeaderActions Component
 *
 * Actions slot for Header. Typically contains Button components or user menu.
 *
 * @example
 * ```tsx
 * <Header.Actions>
 *   <Button variant="outline">Sign In</Button>
 *   <Button variant="primary">Sign Up</Button>
 * </Header.Actions>
 * ```
 */
export function HeaderActions({ children, className }: HeaderActionsProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 flex items-center",
        getSpacingClass("sm", "gap"),
        className,
      )}
    >
      {children}
    </div>
  );
}
