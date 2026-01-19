'use client';

import { type HTMLAttributes } from 'react';
import { getSpacingClass } from '../../tokens/spacing';
import { getColorClass } from '../../tokens/colors';

export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

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
        ${getColorClass('neutral', 'light', 'bg')}
        ${getSpacingClass('sm', 'my')}
        ${className}
      `}
      {...props}
    />
  );
}
