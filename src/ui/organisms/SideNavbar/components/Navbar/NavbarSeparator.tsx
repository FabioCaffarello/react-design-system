'use client';

import React from 'react';
import { cn } from '../../../../utils';
import type { NavbarSeparatorProps } from '../../types';

/**
 * Separator for the Navbar subcomponent
 *
 * Creates visual separation between groups of navigation items.
 *
 * @example
 * ```tsx
 * <SideNavbar.Navbar>
 *   <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *   <SideNavbar.Navbar.Separator />
 *   <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
 * </SideNavbar.Navbar>
 * ```
 */
export default function NavbarSeparator({
  orientation = 'horizontal',
  className = '',
  ...props
}: NavbarSeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px',
          'h-6',
          'bg-[var(--color-border)]',
          'mx-auto',
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        'w-full',
        'h-px',
        'bg-[var(--color-border)]',
        'my-2', // my-2 (8px) para consistência com gap-2 usado em outros lugares
        'flex-shrink-0', // Prevenir que separator encolha
        className
      )}
      role="separator"
      aria-orientation="horizontal"
      style={{
        // Garantir que separator não seja afetado por transformações
        willChange: 'auto',
        transform: 'none',
      }}
      {...props}
    />
  );
}
