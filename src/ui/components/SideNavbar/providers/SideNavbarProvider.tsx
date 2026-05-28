"use client";

import { SideNavbarThemeProvider } from "./SideNavbarThemeProvider";
import { SideNavbarConfigProvider } from "./SideNavbarConfigProvider";
import { SideNavbarStateProvider } from "./SideNavbarStateProvider";
import type { SideNavbarProviderProps } from "../types";

/**
 * Combined Provider for SideNavbar
 *
 * Convenience component that wraps all three context providers
 * (Theme, Config, State) with a single component.
 *
 * For most use cases, use this combined provider.
 * For advanced customization, use individual providers.
 *
 * @example
 * ```tsx
 * <SideNavbarProvider
 *   variant="elevated"
 *   mode="full"
 *   resizable
 *   responsive
 *   defaultCollapsed
 *   onCollapseChange={handleChange}
 * >
 *   <SideNavbarRoot>...</SideNavbarRoot>
 * </SideNavbarProvider>
 * ```
 */
export function SideNavbarProvider({
  children,
  // Theme props
  variant,
  navigationWidth,
  contentWidth,
  animationDuration,
  animationEasing,
  // Config props
  mode,
  resizable,
  minWidth,
  maxWidth,
  snapPoints,
  responsive,
  mobileBreakpoint,
  mobileVariant,
  overlayBackdrop,
  persistState,
  persistWidth,
  storageKey,
  keyboardShortcut,
  enableKeyboardShortcut,
  // State props
  defaultCollapsed,
  collapsed,
  onCollapseChange,
  onWidthChange,
  onMobileChange,
  exclusiveGroups,
}: SideNavbarProviderProps) {
  return (
    <SideNavbarThemeProvider
      variant={variant}
      navigationWidth={navigationWidth}
      contentWidth={contentWidth}
      animationDuration={animationDuration}
      animationEasing={animationEasing}
    >
      <SideNavbarConfigProvider
        mode={mode}
        resizable={resizable}
        minWidth={minWidth}
        maxWidth={maxWidth}
        snapPoints={snapPoints}
        responsive={responsive}
        mobileBreakpoint={mobileBreakpoint}
        mobileVariant={mobileVariant}
        overlayBackdrop={overlayBackdrop}
        persistState={persistState}
        persistWidth={persistWidth}
        storageKey={storageKey}
        keyboardShortcut={keyboardShortcut}
        enableKeyboardShortcut={enableKeyboardShortcut}
      >
        <SideNavbarStateProvider
          defaultCollapsed={defaultCollapsed}
          collapsed={collapsed}
          onCollapseChange={onCollapseChange}
          onWidthChange={onWidthChange}
          onMobileChange={onMobileChange}
          exclusiveGroups={exclusiveGroups}
        >
          {children}
        </SideNavbarStateProvider>
      </SideNavbarConfigProvider>
    </SideNavbarThemeProvider>
  );
}

export default SideNavbarProvider;
