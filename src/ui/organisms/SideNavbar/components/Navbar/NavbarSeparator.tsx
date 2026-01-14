'use client';

import React from 'react';
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
        className={`
          w-px
          h-6
          bg-gray-200
          mx-auto
          ${className}
        `}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  return (
    <div
      className={`
        w-full
        h-px
        bg-gray-200
        my-2
        ${className}
      `}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  );
}
