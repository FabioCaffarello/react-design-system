/**
 * HeaderMobileMenu Component
 * 
 * Mobile menu drawer for Header navigation.
 * 
 * @see EPIC-002: Header Component (Molecule)
 * @see TASK-028: Mobile Menu (Drawer)
 */

'use client';

import React from 'react';
import { Drawer, DrawerContent } from '../../Drawer';
import { useHeaderContext } from '../contexts/HeaderContext';
import { cn } from '../../../utils';

export interface HeaderMobileMenuProps {
  /**
   * Menu content (typically navigation links)
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * HeaderMobileMenu Component
 * 
 * Mobile menu drawer that slides in from the side.
 * Uses Drawer component from design system.
 * 
 * @example
 * ```tsx
 * <Header>
 *   <Header.MobileMenu>
 *     <NavLink href="/home">Home</NavLink>
 *     <NavLink href="/about">About</NavLink>
 *   </Header.MobileMenu>
 * </Header>
 * ```
 */
export function HeaderMobileMenu({
  children,
  className,
}: HeaderMobileMenuProps) {
  const { isMobileMenuOpen, closeMobileMenu } = useHeaderContext();

  return (
    <Drawer
      open={isMobileMenuOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeMobileMenu();
        }
      }}
      position="left"
      size="sm"
      closeOnOverlayClick
      closeOnEscape
    >
      <DrawerContent className={cn('p-4', className)}>
        <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
          {children}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
