"use client";

import { createContext, useContext } from "react";
import type { SideNavbarThemeContextValue } from "../types";

/**
 * Theme context for SideNavbar styling configuration.
 * Contains visual customization options that typically don't change during runtime.
 */
export const SideNavbarThemeContext =
  createContext<SideNavbarThemeContextValue | null>(null);

/**
 * Hook to access SideNavbar theme context.
 * Returns null if used outside of provider.
 */
export function useSideNavbarTheme(): SideNavbarThemeContextValue | null {
  return useContext(SideNavbarThemeContext);
}

/**
 * Hook to access SideNavbar theme context with required check.
 * Throws error if used outside of provider.
 */
export function useSideNavbarThemeRequired(): SideNavbarThemeContextValue {
  const context = useContext(SideNavbarThemeContext);
  if (!context) {
    throw new Error(
      "useSideNavbarThemeRequired must be used within SideNavbarThemeProvider",
    );
  }
  return context;
}

// Default values
export const defaultThemeValues: SideNavbarThemeContextValue = {
  variant: "default",
  navigationWidth: "56px",
  contentWidth: "320px",
  animationDuration: 300,
  animationEasing: "ease-in-out",
};
