'use client';

import React, { type ReactNode, type HTMLAttributes } from 'react';
import { useSideNavbarStateRequired } from '../contexts/SideNavbarStateContext';
import { useSideNavbarThemeRequired } from '../contexts/SideNavbarThemeContext';
import { useSideNavbarConfigRequired } from '../contexts/SideNavbarConfigContext';
import { getColorClass } from '../../../tokens';
import SideNavbarResizeHandle from './SideNavbarResizeHandle';
import SideNavbarBackdrop from './SideNavbarBackdrop';
import type { SideNavbarRootProps } from '../types';

const variantClasses = {
  default: '',
  compact: 'text-sm',
  elevated: 'shadow-lg',
  minimal: 'border-0',
  bordered: 'border-2',
};

/**
 * SideNavbar Root Component
 *
 * The inner container component that renders the sidebar structure.
 * Uses all three contexts (Theme, Config, State) for rendering.
 *
 * This component is typically used internally by SideNavbar,
 * but can be used directly with individual providers for advanced customization.
 *
 * @example
 * ```tsx
 * // Usually wrapped by SideNavbar
 * <SideNavbar>
 *   <SideNavbar.Navbar>...</SideNavbar.Navbar>
 *   <SideNavbar.Sidebar>
 *     <SideNavbar.Sidebar.Content>...</SideNavbar.Sidebar.Content>
 *   </SideNavbar.Sidebar>
 * </SideNavbar>
 *
 * // Or with individual providers
 * <SideNavbar.ThemeProvider variant="elevated">
 *   <SideNavbar.ConfigProvider mode="full" resizable>
 *     <SideNavbar.StateProvider>
 *       <SideNavbarRoot>...</SideNavbarRoot>
 *     </SideNavbar.StateProvider>
 *   </SideNavbar.ConfigProvider>
 * </SideNavbar.ThemeProvider>
 * ```
 */
export default function SideNavbarRoot({
  children,
  className = '',
  style,
  'aria-label': ariaLabel,
  ...props
}: SideNavbarRootProps) {
  // Get context values
  const state = useSideNavbarStateRequired();
  const theme = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();

  const {
    collapsed,
    setCollapsed,
    currentWidth,
    isResizing,
    sidebarRef,
    isMobile,
  } = state;

  const {
    variant,
    navigationWidth,
    contentWidth,
    animationDuration,
    animationEasing,
  } = theme;

  const {
    mode,
    resizable,
    mobileVariant,
    overlayBackdrop,
  } = config;

  // Parse widths
  const navWidthValue = typeof navigationWidth === 'number'
    ? `${navigationWidth}px`
    : navigationWidth;

  const contentWidthValue = typeof contentWidth === 'number'
    ? `${contentWidth}px`
    : contentWidth;

  // Calculate displayed width based on mode
  const calculateWidth = () => {
    if (mode === 'navigation') {
      // Navigation-only mode: always show just navigation
      return navWidthValue;
    }

    if (collapsed) {
      return navWidthValue;
    }

    // Use resize width if resizable, otherwise configured width
    return resizable ? `${currentWidth}px` : contentWidthValue;
  };

  const displayedWidth = calculateWidth();

  // Mobile overlay mode
  const isMobileOverlay = isMobile && mobileVariant === 'overlay';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOverlay && overlayBackdrop && !collapsed && (
        <SideNavbarBackdrop />
      )}

      <aside
        ref={sidebarRef as React.RefObject<HTMLElement>}
        className={`
          relative
          flex
          h-full
          overflow-visible
          ${getColorClass('neutral', 'light', 'bg')}
          border-r
          ${getColorClass('neutral', 'DEFAULT', 'border')}
          ${variantClasses[variant]}
          ${isMobileOverlay ? 'fixed left-0 top-0 z-50' : ''}
          ${isMobileOverlay && collapsed ? '-translate-x-full' : 'translate-x-0'}
          ${className}
        `}
        style={{
          width: displayedWidth,
          minWidth: displayedWidth,
          transitionProperty: isResizing ? 'none' : 'width, min-width, transform',
          transitionDuration: `${animationDuration}ms`,
          transitionTimingFunction: animationEasing,
          ...style,
        } as React.CSSProperties}
        role="complementary"
        aria-label={ariaLabel || 'Sidebar navigation'}
        aria-expanded={mode !== 'navigation' ? !collapsed : undefined}
        data-mode={mode}
        data-collapsed={collapsed}
        {...props}
      >
        {/* Resize handle */}
        {resizable && mode !== 'navigation' && !collapsed && (
          <SideNavbarResizeHandle />
        )}

        {/* Content wrapper */}
        <div className="flex h-full w-full overflow-visible">
          {children}
        </div>
      </aside>
    </>
  );
}
