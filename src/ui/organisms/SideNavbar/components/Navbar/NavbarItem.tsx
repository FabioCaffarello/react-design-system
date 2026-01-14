'use client';

import React from 'react';
import { useNavbarRequired } from '../../contexts/NavbarContext';
import { cn } from '../../../../utils';
import Tooltip from '../../../../atoms/Tooltip/Tooltip';
import type { NavbarItemProps, NavbarLabelMode } from '../../types';

/**
 * Size configuration for navbar items
 */
const SIZE_CLASSES = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    badge: 'min-w-[14px] h-[14px] text-[10px]',
  },
  md: {
    container: 'w-10 h-10',
    icon: 'w-5 h-5',
    badge: 'min-w-[18px] h-[18px] text-xs',
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    badge: 'min-w-[20px] h-[20px] text-xs',
  },
} as const;

/**
 * Badge variant colors
 */
const BADGE_VARIANTS = {
  default: 'bg-red-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-600',
} as const;

/**
 * Navigation item for the Navbar subcomponent
 *
 * Displays an icon button with optional tooltip, badge, and active state.
 * Supports multiple sizes, variants, and can render as a link when href is provided.
 *
 * @example
 * ```tsx
 * // Basic button
 * <SideNavbar.Navbar.Item
 *   icon={<Home />}
 *   label="Home"
 *   onClick={() => navigate('/')}
 * />
 *
 * // As a link
 * <SideNavbar.Navbar.Item
 *   icon={<Docs />}
 *   label="Documentation"
 *   href="/docs"
 * />
 *
 * // With badge
 * <SideNavbar.Navbar.Item
 *   icon={<Bell />}
 *   label="Notifications"
 *   badge={5}
 *   badgeVariant="danger"
 * />
 * ```
 */
const LABEL_STYLES: Record<NavbarLabelMode, string> = {
  tooltip: '', // Uses existing tooltip behavior
  inline: 'flex-row gap-2 w-full px-3',
  below: 'flex-col gap-1',
};

export default function NavbarItem({
  id,
  icon,
  label,
  labelMode,
  showLabel = true,
  active = false,
  showTooltip = true,
  badge,
  badgeVariant = 'default',
  variant = 'default',
  size = 'md',
  href,
  target,
  onClick,
  disabled = false,
  className = '',
  ...props
}: NavbarItemProps) {
  const { activeItem, setActiveItem, labelMode: contextLabelMode } = useNavbarRequired();
  
  // Use prop labelMode or fallback to context labelMode or 'tooltip'
  const effectiveLabelMode = labelMode ?? contextLabelMode ?? 'tooltip';

  const isActive = active || (id && activeItem === id);
  const sizeConfig = SIZE_CLASSES[size];

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (id) {
      setActiveItem(id);
    }
    onClick?.();
  };

  // Label element (for inline and below modes)
  const labelElement = effectiveLabelMode !== 'tooltip' && showLabel && label && (
    <span className={cn(
      'text-xs',
      effectiveLabelMode === 'below' && 'text-center',
      effectiveLabelMode === 'inline' && 'truncate'
    )}>
      {label}
    </span>
  );

  // Base classes for the item
  const baseClasses = cn(
    'relative',
    'flex',
    'items-center',
    effectiveLabelMode === 'inline' ? 'justify-start' : 'justify-center',
    effectiveLabelMode === 'below' && 'flex-col',
    'rounded-lg',
    'transition-colors',
    'duration-150',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-indigo-500',
    'focus:ring-offset-1',
    'w-full', // Ensure full width for vertical layout
    'flex-shrink-0', // Prevent items from shrinking
    'min-w-0', // Prevent flex items from overflowing
    effectiveLabelMode === 'tooltip' ? sizeConfig.container : 'px-2 py-1.5',
    effectiveLabelMode !== 'tooltip' && LABEL_STYLES[effectiveLabelMode],
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  );

  // Variant-specific classes
  const variantClasses = {
    default: isActive
      ? 'bg-indigo-100 text-indigo-600'
      : disabled
        ? 'text-gray-400'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    ghost: isActive
      ? 'text-indigo-600'
      : disabled
        ? 'text-gray-400'
        : 'text-gray-600 hover:text-gray-900',
    subtle: isActive
      ? 'bg-gray-100 text-gray-900'
      : disabled
        ? 'text-gray-400'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
  };

  const content = (
    <>
      <span className={cn('flex-shrink-0', sizeConfig.icon)}>{icon}</span>
      
      {/* Label (for inline and below modes) */}
      {labelElement}

      {/* Badge */}
      {badge !== undefined && badge !== null && (
        <span
          className={cn(
            'absolute',
            '-top-1',
            '-right-1',
            'flex',
            'items-center',
            'justify-center',
            'px-1',
            'font-medium',
            'text-white',
            'rounded-full',
            sizeConfig.badge,
            BADGE_VARIANTS[badgeVariant]
          )}
        >
          {badge}
        </span>
      )}
    </>
  );

  // Render as link if href is provided
  const element = href ? (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={cn(baseClasses, variantClasses[variant])}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant])}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {content}
    </button>
  );

  // Wrap with tooltip only if mode is 'tooltip'
  if (effectiveLabelMode === 'tooltip' && showTooltip && label && !disabled) {
    return (
      <Tooltip content={label} position="right">
        {element}
      </Tooltip>
    );
  }

  return element;
}
