"use client";

import { createContext, useContext } from "react";
import type { SideNavbarConfigContextValue } from "../types";

/**
 * Config context for SideNavbar behavior configuration.
 * Contains behavioral settings that typically don't change during runtime.
 */
export const SideNavbarConfigContext =
  createContext<SideNavbarConfigContextValue | null>(null);

/**
 * Hook to access SideNavbar config context.
 * Returns null if used outside of provider.
 */
export function useSideNavbarConfig(): SideNavbarConfigContextValue | null {
  return useContext(SideNavbarConfigContext);
}

/**
 * Hook to access SideNavbar config context with required check.
 * Throws error if used outside of provider.
 */
export function useSideNavbarConfigRequired(): SideNavbarConfigContextValue {
  const context = useContext(SideNavbarConfigContext);
  if (!context) {
    throw new Error(
      "useSideNavbarConfigRequired must be used within SideNavbarConfigProvider",
    );
  }
  return context;
}

// Default values
export const defaultConfigValues: SideNavbarConfigContextValue = {
  mode: "full",
  resizable: false,
  minWidth: undefined,
  maxWidth: undefined,
  snapPoints: undefined,
  responsive: false,
  mobileBreakpoint: 768,
  mobileVariant: "collapse",
  overlayBackdrop: true,
  persistState: true,
  persistWidth: false,
  storageKey: undefined,
  keyboardShortcut: "Ctrl+B",
  enableKeyboardShortcut: true,
};
