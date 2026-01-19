'use client';

import { useMemo } from 'react';
import { SideNavbarThemeContext, defaultThemeValues } from '../contexts/SideNavbarThemeContext';
import type { SideNavbarThemeProviderProps } from '../types';

/**
 * Theme Provider for SideNavbar
 *
 * Provides visual customization context for the sidebar.
 * Theme values are typically set once and don't change during runtime.
 *
 * @example
 * ```tsx
 * <SideNavbarThemeProvider variant="elevated" animationDuration={200}>
 *   <SideNavbarConfigProvider>
 *     <SideNavbarStateProvider>
 *       <SideNavbarRoot>...</SideNavbarRoot>
 *     </SideNavbarStateProvider>
 *   </SideNavbarConfigProvider>
 * </SideNavbarThemeProvider>
 * ```
 */
export function SideNavbarThemeProvider({
  children,
  variant = defaultThemeValues.variant,
  navigationWidth = defaultThemeValues.navigationWidth,
  contentWidth = defaultThemeValues.contentWidth,
  animationDuration = defaultThemeValues.animationDuration,
  animationEasing = defaultThemeValues.animationEasing,
}: SideNavbarThemeProviderProps) {
  const value = useMemo(
    () => ({
      variant,
      navigationWidth,
      contentWidth,
      animationDuration,
      animationEasing,
    }),
    [variant, navigationWidth, contentWidth, animationDuration, animationEasing]
  );

  return (
    <SideNavbarThemeContext.Provider value={value}>
      {children}
    </SideNavbarThemeContext.Provider>
  );
}

export default SideNavbarThemeProvider;
