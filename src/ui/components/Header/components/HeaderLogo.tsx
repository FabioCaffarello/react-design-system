/**
 * HeaderLogo Component
 *
 * Logo slot component for Header.
 *
 * @see EPIC-002: Header Component (Molecule)
 * @see RFC-003: Header Composition Pattern (APPROVED)
 */

"use client";

import React, { type ReactNode } from "react";
import { cn } from "../../../utils";
import type { NavLinkProps } from "../../../primitives/NavLink";
import { NavLink } from "../../../primitives/NavLink";

export interface HeaderLogoProps extends Omit<NavLinkProps, "children"> {
  /**
   * Logo content (text, image, or component)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeaderLogo Component
 *
 * Logo slot for Header. Renders as a NavLink by default.
 *
 * @example
 * ```tsx
 * <Header.Logo href="/">MyApp</Header.Logo>
 * <Header.Logo href="/">
 *   <img src="/logo.png" alt="Logo" />
 * </Header.Logo>
 * ```
 */
export function HeaderLogo({ children, className, ...props }: HeaderLogoProps) {
  return (
    <div className="flex-shrink-0">
      <NavLink
        href={props.href || "/"}
        variant="default"
        className={cn("flex items-center font-semibold text-lg", className)}
        {...props}
      >
        {children}
      </NavLink>
    </div>
  );
}
