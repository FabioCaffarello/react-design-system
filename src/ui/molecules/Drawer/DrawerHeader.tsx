'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { getSpacingClass } from '../../tokens/spacing';
import { getColorClass } from '../../tokens/colors';

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * DrawerHeader Component
 * 
 * Header section for drawer content.
 * 
 * @example
 * ```tsx
 * <DrawerHeader>
 *   <h2>Drawer Title</h2>
 * </DrawerHeader>
 * ```
 */
export default function DrawerHeader({
  children,
  className = '',
  ...props
}: DrawerHeaderProps) {
  return (
    <div
      className={`
        ${getSpacingClass('lg', 'p')}
        border-b
        ${getColorClass('neutral', 'DEFAULT', 'border')}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
