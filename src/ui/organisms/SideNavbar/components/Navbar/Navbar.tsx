'use client';

import React, { useState, useRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { NavbarContext } from '../../contexts/NavbarContext';
import { useSideNavbarStateRequired } from '../../contexts/SideNavbarStateContext';
import { useSideNavbarThemeRequired } from '../../contexts/SideNavbarThemeContext';
import { useSideNavbarConfigRequired } from '../../contexts/SideNavbarConfigContext';
import { useSideNavbarToggleContextRequired } from '../../contexts/SideNavbarToggleContext';
import { cn } from '../../../../utils';
import type { NavbarProps, NavbarContextValue, NavbarTogglePosition } from '../../types';
import NavbarToggle from './NavbarToggle';
import NavbarItem from './NavbarItem';
import NavbarSeparator from './NavbarSeparator';
import { NavbarGroup } from './NavbarGroup';
import SideNavbarToggle from '../SideNavbarToggle';

/**
 * Navbar subcomponent for SideNavbar
 *
 * Provides its own context that inherits from the root SideNavbar context.
 * Contains the icon navigation column with optional internal toggle.
 *
 * @example
 * ```tsx
 * <SideNavbar.Navbar showToggle togglePosition="bottom">
 *   <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *   <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
 * </SideNavbar.Navbar>
 * ```
 */
function Navbar({
  children,
  showMainToggle: showMainToggleProp,
  mainTogglePosition: mainTogglePositionProp,
  showToggle = false,
  togglePosition = 'bottom',
  labelMode = 'tooltip',
  expandedWidth = 200,
  className = '',
  style,
  ...props
}: NavbarProps) {
  const rootState = useSideNavbarStateRequired();
  const rootTheme = useSideNavbarThemeRequired();
  const rootConfig = useSideNavbarConfigRequired();
  const toggleContext = useSideNavbarToggleContextRequired();
  const navbarRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use props if provided, otherwise use context values
  const showMainToggle = showMainToggleProp ?? toggleContext.showMainToggle;
  const mainTogglePosition = mainTogglePositionProp ?? toggleContext.mainTogglePosition;

  // When labelMode is 'inline', navbar should expand
  const shouldExpand = labelMode === 'inline' && !rootState.collapsed;
  const navbarWidth = shouldExpand 
    ? (typeof expandedWidth === 'number' ? `${expandedWidth}px` : expandedWidth)
    : rootTheme.navigationWidth;

  const contextValue: NavbarContextValue = useMemo(
    () => ({
      // Inherited from root
      collapsed: rootState.collapsed,
      toggle: rootState.toggle,
      // Navbar-specific
      navbarRef,
      activeItem,
      setActiveItem,
      isHovered,
      showInternalToggle: showToggle,
      togglePosition,
      labelMode,
    }),
    [
      rootState.collapsed,
      rootState.toggle,
      activeItem,
      isHovered,
      showToggle,
      togglePosition,
      labelMode,
    ]
  );

  // Determine if main toggle should be shown
  const shouldShowMainToggle = showMainToggle && rootConfig.mode !== 'navigation';

  return (
    <NavbarContext.Provider value={contextValue}>
      <nav
        ref={navbarRef}
        className={cn(
          'relative',
          'flex-shrink-0',
          'flex',
          'flex-col',
          'h-full',
          'bg-white',
          'border-r',
          'border-gray-200',
          shouldExpand ? 'items-stretch' : 'items-center',
          className
        )}
        style={{
          width: navbarWidth,
          transitionProperty: 'width',
          transitionDuration: `${rootTheme.animationDuration}ms`,
          transitionTimingFunction: rootTheme.animationEasing,
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Side navigation"
        {...props}
      >
        {/* Main toggle button at right edge of navbar - rendered first for proper z-index */}
        {shouldShowMainToggle && (
          <SideNavbarToggle position={mainTogglePosition} />
        )}

        {/* Top toggle position (internal) */}
        {showToggle && togglePosition === 'top' && (
          <div className="flex-shrink-0 p-2 border-b border-gray-200">
            <NavbarToggle />
          </div>
        )}

        {/* Navigation items - vertical layout */}
        <div className={cn(
          'flex-1',
          'flex',
          'flex-col',
          'overflow-y-auto',
          'overflow-x-hidden',
          'p-2',
          'gap-2',
          'w-full',
          'min-w-0', // Prevent flex items from overflowing
          shouldExpand ? 'items-stretch' : 'items-center',
          'justify-start'
        )}>
          {children}
        </div>

        {/* Bottom toggle position (internal) */}
        {showToggle && togglePosition === 'bottom' && (
          <div className="flex-shrink-0 p-2 border-t border-gray-200">
            <NavbarToggle />
          </div>
        )}
      </nav>
    </NavbarContext.Provider>
  );
}

// Attach compound components
Navbar.Toggle = NavbarToggle;
Navbar.Item = NavbarItem;
Navbar.Separator = NavbarSeparator;
Navbar.Group = NavbarGroup;

// Add displayName for easier identification in cloneElement
Navbar.displayName = 'Navbar';

export default Navbar;
