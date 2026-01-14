'use client';

import React, { useEffect } from 'react';
import { useSidebarRequired } from '../../contexts/SidebarContext';
import { getSpacingClass, getColorClass, getTypographyClasses } from '../../../../tokens';
import type { SidebarHeaderProps } from '../../types';

/**
 * Header component for the Sidebar subcomponent
 *
 * Displays a title and optional subtitle at the top of the sidebar content.
 * Automatically registers its presence with the Sidebar context.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Header title="Dashboard" subtitle="Overview" />
 * ```
 */
export default function SidebarHeader({
  title,
  subtitle,
  showBorder = true,
  children,
  className = '',
  style,
  ...props
}: SidebarHeaderProps) {
  const { collapsed, registerHeader, unregisterHeader } = useSidebarRequired();

  // Register header presence with Sidebar context
  useEffect(() => {
    registerHeader();
    return () => unregisterHeader();
  }, [registerHeader, unregisterHeader]);

  if (collapsed) {
    return null;
  }

  return (
    <div
      className={`
        flex-shrink-0
        ${getSpacingClass('md', 'px')}
        ${getSpacingClass('sm', 'py')}
        ${showBorder ? `border-b ${getColorClass('neutral', 'DEFAULT', 'border')}` : ''}
        bg-gray-50
        ${className}
      `}
      style={style}
      {...props}
    >
      {children || (
        <>
          {title && (
            <h2
              className={`
                ${getTypographyClasses('h4')}
                ${getColorClass('neutral', 'dark', 'text')}
                m-0
                font-semibold
              `}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`
                ${getTypographyClasses('bodySmall')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                m-0
                mt-1
              `}
            >
              {subtitle}
            </p>
          )}
        </>
      )}
    </div>
  );
}
