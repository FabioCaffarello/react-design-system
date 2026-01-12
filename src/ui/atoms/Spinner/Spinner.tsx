'use client';

import { memo, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
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
      <svg
        className={`animate-spin ${sizeClasses[size]} ${variantColorClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="ml-2 text-sm text-gray-600 sr-only">{label}</span>
      )}
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
