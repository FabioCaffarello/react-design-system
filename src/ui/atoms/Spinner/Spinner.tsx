'use client';

import { memo, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { getColorClass } from '../../tokens/colors';

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
const Spinner = memo(function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  className = '',
  ...props
}: SpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  const variantColorClass = useMemo(() => 
    variant === 'neutral' 
      ? 'text-gray-500' 
      : variant === 'secondary'
      ? getColorClass('secondary', 'DEFAULT', 'text')
      : getColorClass('primary', 'DEFAULT', 'text'),
    [variant]
  );

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="status"
      aria-label={label || 'Loading'}
      aria-live="polite"
      {...props}
    >
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${variantColorClass}`}
        aria-hidden="true"
      />
      {label && (
        <span className="ml-2 text-sm text-gray-600 sr-only">{label}</span>
      )}
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
