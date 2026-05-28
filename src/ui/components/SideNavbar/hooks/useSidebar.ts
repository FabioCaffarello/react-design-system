"use client";

/**
 * Hook to access Sidebar context
 *
 * Re-exports the hooks from SidebarContext for convenience.
 * Use this hook to access sidebar-specific state within Sidebar subcomponents.
 *
 * @example
 * ```tsx
 * function SidebarContent() {
 *   const { collapsed, scrollPosition, setScrollPosition } = useSidebar();
 *   // ...
 * }
 * ```
 */
export { useSidebar, useSidebarRequired } from "../contexts/SidebarContext";
