'use client';

import { forwardRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { getColorClass } from '../../tokens/colors';
import { getRadiusClass } from '../../tokens/radius';
import { getSpacingClass } from '../../tokens/spacing';

export type ChipVariant = 'default' | 'outlined' | 'filled';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Chip Component
 * 
 * A chip/tag component for displaying labels, filters, or selected items.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Chip>Tag</Chip>
 * <Chip onRemove={() => console.log('removed')}>Removable</Chip>
 * ```
 */
const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    children,
    variant = 'default',
    size = 'md',
    onRemove,
    selected = false,
    disabled = false,
    className = '',
  },
  ref
) {
  const sizeClasses: Record<ChipSize, string> = {
    sm: `${getSpacingClass('xs', 'px')} ${getSpacingClass('xs', 'py')} text-xs`,
    md: `${getSpacingClass('sm', 'px')} ${getSpacingClass('xs', 'py')} text-sm`,
    lg: `${getSpacingClass('md', 'px')} ${getSpacingClass('sm', 'py')} text-base`,
  };

  const variantClasses: Record<ChipVariant, string> = {
    default: `
      ${getColorClass('neutral', 'light', 'bg')}
      ${getColorClass('neutral', 'dark', 'text')}
      border
      border-gray-300
    `,
    outlined: `
      bg-transparent
      ${getColorClass('neutral', 'dark', 'text')}
      border
      border-gray-300
    `,
    filled: `
      ${getColorClass('primary', 'DEFAULT', 'bg')}
      text-white
      border
      border-transparent
    `,
  };

  const selectedClasses = selected
    ? `
      ${getColorClass('primary', 'DEFAULT', 'bg')}
      text-white
      border
      ${getColorClass('primary', 'DEFAULT', 'border')}
    `
    : '';

  return (
    <div
      ref={ref}
      className={`
        inline-flex
        items-center
        gap-1
        ${getRadiusClass('full')}
        font-medium
        ${sizeClasses[size]}
        ${selectedClasses || variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onRemove ? 'pr-1' : ''}
        ${className}
      `}
      role={selected ? 'option' : 'button'}
      aria-selected={selected}
      aria-disabled={disabled}
    >
      <span>{children}</span>
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});

Chip.displayName = 'Chip';

export default Chip;
