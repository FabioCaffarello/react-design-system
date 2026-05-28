"use client";

// Layered context hooks
export {
  useSideNavbarTheme,
  useSideNavbarThemeRequired,
} from "../contexts/SideNavbarThemeContext";

export {
  useSideNavbarConfig,
  useSideNavbarConfigRequired,
} from "../contexts/SideNavbarConfigContext";

export {
  useSideNavbarState,
  useSideNavbarStateRequired,
} from "../contexts/SideNavbarStateContext";

// Subcomponent hooks
export { useNavbar, useNavbarRequired } from "./useNavbar";
export { useSidebar, useSidebarRequired } from "./useSidebar";

// Utility hooks
export { useResize } from "./useResize";
export type { UseResizeOptions, UseResizeReturn } from "./useResize";

export { useResponsiveSidebar } from "./useResponsiveSidebar";
export type {
  UseResponsiveSidebarOptions,
  UseResponsiveSidebarReturn,
} from "./useResponsiveSidebar";

export { useKeyboardShortcut } from "./useKeyboardShortcut";
export type { UseKeyboardShortcutOptions } from "./useKeyboardShortcut";

export { useFocusManagement } from "./useFocusManagement";
export type { UseFocusManagementOptions } from "./useFocusManagement";

export { useGroupState } from "./useGroupState";
export type { UseGroupStateOptions, UseGroupStateReturn } from "../types";

// Navigation and content hooks
export { useSideNavbarNavigation } from "./useSideNavbarNavigation";
export { useSideNavbarContent } from "./useSideNavbarContent";

/**
 * Combined hook to access all root contexts
 *
 * Returns an object with theme, config, and state contexts.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, config, state } = useSideNavbarCombined();
 *   // Access theme.variant, config.mode, state.collapsed, etc.
 * }
 * ```
 */
export function useSideNavbarCombined() {
  // Import here to avoid circular dependencies
  const theme = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();
  const state = useSideNavbarStateRequired();

  return { theme, config, state };
}
