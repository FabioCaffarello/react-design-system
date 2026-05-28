"use client";

import { useMemo } from "react";
import {
  SideNavbarConfigContext,
  defaultConfigValues,
} from "../contexts/SideNavbarConfigContext";
import type { SideNavbarConfigProviderProps } from "../types";

/**
 * Config Provider for SideNavbar
 *
 * Provides behavioral configuration context for the sidebar.
 * Config values are typically set once and don't change during runtime.
 *
 * @example
 * ```tsx
 * <SideNavbarConfigProvider mode="full" resizable responsive>
 *   <SideNavbarStateProvider>
 *     <SideNavbarRoot>...</SideNavbarRoot>
 *   </SideNavbarStateProvider>
 * </SideNavbarConfigProvider>
 * ```
 */
export function SideNavbarConfigProvider({
  children,
  mode = defaultConfigValues.mode,
  resizable = defaultConfigValues.resizable,
  minWidth = defaultConfigValues.minWidth,
  maxWidth = defaultConfigValues.maxWidth,
  snapPoints = defaultConfigValues.snapPoints,
  responsive = defaultConfigValues.responsive,
  mobileBreakpoint = defaultConfigValues.mobileBreakpoint,
  mobileVariant = defaultConfigValues.mobileVariant,
  overlayBackdrop = defaultConfigValues.overlayBackdrop,
  persistState = defaultConfigValues.persistState,
  persistWidth = defaultConfigValues.persistWidth,
  storageKey = defaultConfigValues.storageKey,
  keyboardShortcut = defaultConfigValues.keyboardShortcut,
  enableKeyboardShortcut = defaultConfigValues.enableKeyboardShortcut,
}: SideNavbarConfigProviderProps) {
  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return (
    <SideNavbarConfigContext.Provider value={value}>
      {children}
    </SideNavbarConfigContext.Provider>
  );
}

export default SideNavbarConfigProvider;
