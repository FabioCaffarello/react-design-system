/**
 * HeaderNavigation Component
 * 
 * Navigation slot component for Header.
 * 
 * @see EPIC-002: Header Component (Molecule)
 * @see RFC-003: Header Composition Pattern (APPROVED)
 */

'use client';

import React, { type ReactNode } from 'react';
import { cn } from '../../../utils';

export interface HeaderNavigationProps {
  /**
   * Navigation content (typically NavLink components)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeaderNavigation Component
 * 
 * Navigation slot for Header. Typically contains NavLink components.
 * 
 * @example
 * ```tsx
 * <Header.Navigation>
 *   <NavLink href="/home">Home</NavLink>
 *   <NavLink href="/about">About</NavLink>
 * </Header.Navigation>
 * ```
 */
export function HeaderNavigation({
  children,
  className,
}: HeaderNavigationProps) {
  return (
    <nav
      className={cn(
        'flex-1 flex items-center justify-center gap-4',
        'hidden md:flex', // Hidden on mobile, visible on desktop
        className
      )}
      aria-label="Main navigation"
    >
      {children}
    </nav>
  );
}
