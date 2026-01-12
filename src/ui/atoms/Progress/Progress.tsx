'use client';

import type { HTMLAttributes } from 'react';
import { getColorClass, getRadiusClass } from '../../tokens';
import './Progress.css';

export type ProgressVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100, undefined for indeterminate
  max?: number; // Default 100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  'aria-label'?: string;
}

/**
 * Progress Component
 * 
 * A progress bar component for displaying progress or loading states.
 * Supports both determinate (with value) and indeterminate (without value) modes.
 * Fully accessible with ARIA attributes.
 * 
 * @example
 * ```tsx
 * // Determinate progress
 * <Progress value={75} variant="primary" />
 * 
 * // Indeterminate progress
 * <Progress variant="primary" />
 * 
 * // With label
 * <Progress value={50} showLabel label="Uploading..." />
 * ```
 */
export default function Progress({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  'aria-label': ariaLabel,
  className = '',
  ...props
}: ProgressProps) {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate ? undefined : Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses: Record<ProgressSize, string> = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantColorClasses: Record<ProgressVariant, string> = {
    primary: getColorClass('primary', 'DEFAULT', 'bg'),
    secondary: getColorClass('secondary', 'DEFAULT', 'bg'),
    success: getColorClass('success', 'DEFAULT', 'bg'),
    error: getColorClass('error', 'DEFAULT', 'bg'),
    warning: getColorClass('warning', 'DEFAULT', 'bg'),
    info: getColorClass('info', 'DEFAULT', 'bg'),
  };

  const trackColorClass = variant === 'primary' || variant === 'secondary'
    ? 'bg-gray-200'
    : `${getColorClass(variant, 'light', 'bg')}`;

  const defaultAriaLabel = ariaLabel || (isIndeterminate 
    ? 'Loading in progress' 
    : `Progress: ${percentage?.toFixed(0)}%`);

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (label || !isIndeterminate) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {!isIndeterminate && percentage !== undefined && (
            <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : max}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-label={defaultAriaLabel}
        aria-busy={isIndeterminate}
        className={`
          relative
          w-full
          overflow-hidden
          ${sizeClasses[size]}
          ${trackColorClass}
          ${getRadiusClass('full')}
        `}
      >
        {isIndeterminate ? (
          <div
            className={`
              absolute
              top-0
              left-0
              bottom-0
              ${variantColorClasses[variant]}
              ${getRadiusClass('full')}
            `}
            style={{
              width: '30%',
              animation: 'progress-indeterminate 1.5s ease-in-out infinite',
            }}
          />
        ) : (
          <div
            className={`
              h-full
              ${variantColorClasses[variant]}
              ${getRadiusClass('full')}
              transition-all
              duration-300
              ease-out
            `}
            style={{
              width: `${percentage}%`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
