'use client';

import { memo, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { getColorClass } from '../../tokens/colors';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeStyle = 'solid' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: BadgeStyle;
  children: ReactNode;
}

/**
 * Badge Component
 * 
 * A versatile badge component for displaying status, priority, and other labels.
 * Follows Atomic Design principles as an Atom component.
 * Uses tokens for consistent theming.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="lg">Critical</Badge>
 * <Badge variant="info" style="outline">New</Badge>
 * ```
 */
const Badge = memo(function Badge({ 
  variant = 'neutral',
  size = 'md',
  style = 'solid',
  className = '',
  children,
  ...props 
}: BadgeProps) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'border',
  ];

  // Size classes
  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1.5 text-sm',
  };

  // Map variant to color role
  const variantToColorRole: Record<BadgeVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    neutral: 'neutral',
    primary: 'primary',
    secondary: 'secondary',
  };

  const colorRole = variantToColorRole[variant];

  // Style classes
  const styleClasses = style === 'outline'
    ? [
        'bg-transparent',
        getColorClass(colorRole, 'DEFAULT', 'border'),
        getColorClass(colorRole, 'DEFAULT', 'text'),
      ]
    : [
        getColorClass(colorRole, 'light', 'bg'),
        getColorClass(colorRole, 'dark', 'text'),
        getColorClass(colorRole, 'DEFAULT', 'border'),
      ];

  const classes = useMemo(() => [
    ...baseClasses,
    sizeClasses[size],
    ...styleClasses,
    className,
  ].filter(Boolean).join(' '), [size, style, colorRole, className]);

  return (
    <span
      role="status"
      aria-label={typeof children === 'string' ? children : undefined}
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
