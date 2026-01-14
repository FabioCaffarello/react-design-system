'use client';

import { memo, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { getColorClass } from '../../tokens/colors';
import { getSpacingClass } from '../../tokens/spacing';
import { getTypographySize } from '../../tokens/typography';
import { cn, cva } from '../../utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'neutral';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

/**
 * Spinner Component
 * 
 * A loading spinner component for indicating loading states.
 * Follows Atomic Design principles as an Atom component.
 * Uses Strategy Pattern for different size/variant combinations.
 * 
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" label="Loading..." />
 * ```
 */
// Spinner variants using CVA
const spinnerVariants = cva(
  'motion-safe:animate-spin',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-8 w-8',
      },
      variant: {
        primary: getColorClass('primary', 'DEFAULT', 'text'),
        secondary: getColorClass('secondary', 'DEFAULT', 'text'),
        neutral: getColorClass('neutral', 'DEFAULT', 'text'),
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

const Spinner = memo(function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn('inline-flex', 'items-center', className)}
      role="status"
      aria-label={label || 'Loading'}
      aria-live="polite"
      {...props}
    >
      <Loader2
        className={cn(spinnerVariants({ size, variant }))}
        aria-hidden="true"
      />
      {label && (
        <span className={cn(
          getSpacingClass('sm', 'ml'),
          getTypographySize('bodySmall'),
          getColorClass('neutral', 'DEFAULT', 'text'),
          'sr-only'
        )}>{label}</span>
      )}
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
