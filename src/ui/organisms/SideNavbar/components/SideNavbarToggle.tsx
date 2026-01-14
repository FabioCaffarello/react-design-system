'use client';

import React, { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSideNavbarStateRequired } from '../contexts/SideNavbarStateContext';
import { useSideNavbarThemeRequired } from '../contexts/SideNavbarThemeContext';
import { useSideNavbarConfigRequired } from '../contexts/SideNavbarConfigContext';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import Button from '../../../atoms/Button/Button';
import type { SideNavbarToggleProps, SideNavbarTogglePosition, SideNavbarToggleVariant } from '../types';

const sizeClasses = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const positionClasses: Record<SideNavbarTogglePosition, string> = {
  floating: 'absolute z-[100]', // Right edge of navbar, vertically centered - position set via style
  top: 'absolute top-2 right-2 z-10',
  bottom: 'absolute bottom-2 right-2 z-10',
  inside: 'relative z-10',
  'navigation-top': 'relative mt-2 mx-auto z-10',
  'navigation-bottom': 'relative mt-auto mb-2 mx-auto z-10',
};

const variantClasses: Record<SideNavbarToggleVariant, string> = {
  default: 'bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow',
  ghost: 'bg-transparent hover:bg-gray-100 border-0',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-50',
};

const tooltipPositionMap: Record<SideNavbarTogglePosition, 'top' | 'right' | 'bottom' | 'left'> = {
  floating: 'right',
  top: 'bottom',
  bottom: 'top',
  inside: 'right',
  'navigation-top': 'right',
  'navigation-bottom': 'right',
};

/**
 * SideNavbarToggle Component
 *
 * A flexible toggle button for collapsing/expanding the SideNavbar.
 * Supports custom icons, multiple positions, and variants.
 *
 * @example
 * ```tsx
 * // Default usage (with PanelLeft icons)
 * <SideNavbar.Toggle />
 *
 * // Custom icons
 * <SideNavbar.Toggle
 *   icon={(collapsed) => collapsed ? <ChevronRight /> : <ChevronLeft />}
 * />
 *
 * // Or separate icons
 * <SideNavbar.Toggle
 *   expandIcon={<ChevronRight />}
 *   collapseIcon={<ChevronLeft />}
 * />
 *
 * // Inside navigation
 * <SideNavbar.Navbar>
 *   <NavItems />
 *   <SideNavbar.Toggle position="navigation-bottom" variant="ghost" />
 * </SideNavbar.Navbar>
 * ```
 */
export default function SideNavbarToggle({
  position = 'floating',
  offset,
  icon,
  expandIcon,
  collapseIcon,
  size = 'sm',
  variant = 'default',
  showTooltip = true,
  tooltipPosition: tooltipPositionOverride,
  keyboardShortcut: keyboardShortcutOverride,
  enableKeyboardShortcut: enableKeyboardShortcutOverride,
  className = '',
  style,
  'aria-label': ariaLabel,
  ...props
}: SideNavbarToggleProps) {
  const { collapsed, toggle } = useSideNavbarStateRequired();
  const { animationDuration, animationEasing } = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();

  // Use config values as defaults, allow prop overrides
  const keyboardShortcut = keyboardShortcutOverride ?? config.keyboardShortcut;
  const enableKeyboardShortcut = enableKeyboardShortcutOverride ?? config.enableKeyboardShortcut;

  // Render icon logic
  const renderIcon = () => {
    // Custom render function
    if (typeof icon === 'function') {
      return icon(collapsed);
    }

    // Static custom icon
    if (icon) {
      return icon;
    }

    // Separate expand/collapse icons
    if (collapsed && expandIcon) {
      return expandIcon;
    }
    if (!collapsed && collapseIcon) {
      return collapseIcon;
    }

    // Default Lucide icons
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
    return <Icon className={`${iconSizeClasses[size]} transition-transform duration-200`} />;
  };

  const defaultAriaLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  const tooltipPosition = tooltipPositionOverride ?? tooltipPositionMap[position];

  const tooltipContent = showTooltip
    ? `${collapsed ? 'Expand' : 'Collapse'} sidebar${enableKeyboardShortcut ? ` (${keyboardShortcut})` : ''}`
    : undefined;

  // Calculate offset styles
  const offsetStyle = offset
    ? {
        transform: `translate(${offset.x ?? 0}px, ${offset.y ?? 0}px)`,
      }
    : {};

  // Determine if this is an inline position (inside navigation)
  const isInlinePosition = position === 'inside' || position === 'navigation-top' || position === 'navigation-bottom';

  // Edge-following toggle positioning (right edge of navbar, between navbar and sidebar)
  // The toggle should be positioned at the right edge of the navbar, vertically centered
  // It moves smoothly with the navbar width transition
  // Position: right edge, vertically centered, half outside the navbar edge (between navbar and sidebar)
  const edgeFollowingStyle = position === 'floating' ? {
    right: '0px',
    top: '50%',
    transform: 'translateX(50%) translateY(-50%)',
    transition: `transform ${animationDuration}ms ${animationEasing}`,
    ...offsetStyle,
  } : offsetStyle;

  const button = (
    <button
      type="button"
      onClick={toggle}
      className={`
        ${positionClasses[position]}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        text-gray-600 hover:text-gray-800
        transition-all
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
        ${className}
      `}
      style={{
        transitionDuration: `${animationDuration}ms`,
        transitionTimingFunction: 'ease-in-out',
        ...edgeFollowingStyle,
        ...style,
      }}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-expanded={!collapsed}
      aria-controls="side-navbar-sidebar"
      data-position={position}
      {...props}
    >
      {renderIcon()}
    </button>
  );

  if (showTooltip && tooltipContent) {
    return (
      <Tooltip content={tooltipContent} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
