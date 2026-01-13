'use client';

import { type HTMLAttributes } from 'react';
import { getSpacingClass } from '../../tokens/spacing';

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * MenuSeparator Component
 * 
 * A visual separator for menu items.
 * 
 * @example
 * ```tsx
 * <MenuSeparator />
 * ```
 */
export default function MenuSeparator({
  className = '',
  ...props
}: MenuSeparatorProps) {
  return (
    <div
      role="separator"
      className={`
        h-px
        bg-gray-200
        ${getSpacingClass('sm', 'my')}
        ${className}
      `}
      {...props}
    />
  );
}
