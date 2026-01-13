'use client';

import React, { type ReactNode, type HTMLAttributes } from 'react';
import { getColorClass } from '../../tokens';
import { SIDEBAR_TOKENS } from '../../tokens/sidebar';

export interface SidebarNavigationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the navigation column
   * @default '56px'
   */
  width?: number | string;
  
  /**
   * Variant of the navigation
   * - 'fixed': Always visible, cannot be collapsed
   * - 'collapsible': Can be collapsed/expanded
   * @default 'fixed'
   */
  variant?: 'fixed' | 'collapsible';
  
  /**
   * Whether the navigation is collapsed (only applies when variant is 'collapsible')
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Callback when collapse state changes (only applies when variant is 'collapsible')
   */
  onCollapseChange?: (collapsed: boolean) => void;
  
  /**
   * Orientation of navigation items
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Content to render (typically Tabs or navigation items)
   */
  children: ReactNode;
}

/**
 * SidebarNavigation Component
 * 
 * A reusable component for the narrow navigation column (typically 56px) with icons.
 * Supports fixed and collapsible variants with smooth transitions.
 * 
 * @example
 * ```tsx
 * <SidebarNavigation width="56px" variant="fixed">
 *   <Tabs>
 *     <Tabs.List orientation="vertical">
 *       <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     </Tabs.List>
 *   </Tabs>
 * </SidebarNavigation>
 * ```
 */
export default function SidebarNavigation({
  width = SIDEBAR_TOKENS.navigation.width.default,
  variant = 'fixed',
  collapsed = false,
  onCollapseChange,
  orientation = 'vertical',
  children,
  className = '',
  style,
  ...props
}: SidebarNavigationProps) {
  const isCollapsible = variant === 'collapsible';
  const isCollapsed = isCollapsible && collapsed;
  
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const finalWidth = isCollapsed ? '0px' : widthValue;
  
  const baseClasses = `
    shrink-0
    border-r
    ${getColorClass('neutral', 'DEFAULT', 'border')}
    ${SIDEBAR_TOKENS.split.transition}
    overflow-hidden
  `;

  const backgroundStyle = {
    backgroundColor: SIDEBAR_TOKENS.navigation.background.default,
    width: finalWidth,
    ...style,
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={backgroundStyle}
      aria-hidden={isCollapsed}
      {...props}
    >
      {!isCollapsed && (
        <div className="h-full w-full">
          {children}
        </div>
      )}
    </div>
  );
}
