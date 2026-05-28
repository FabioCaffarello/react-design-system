"use client";

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type { SidebarContextValue } from "../types";

/**
 * Context for the Sidebar subcomponent
 *
 * Provides sidebar-specific state that inherits from the root SideNavbar context.
 * Must be used within a Sidebar component.
 */
export const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Hook to access Sidebar context (returns null if outside Sidebar)
 */
export function useSidebar(): SidebarContextValue | null {
  return useContext(SidebarContext);
}

/**
 * Hook to access Sidebar context (throws if outside Sidebar)
 * @throws Error if used outside of Sidebar component
 */
export function useSidebarRequired(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarRequired must be used within a SideNavbar.Sidebar component",
    );
  }
  return context;
}

export default SidebarContext;
