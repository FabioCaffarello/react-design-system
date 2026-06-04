"use client";

import { useState, useRef, useCallback, useMemo, type ReactNode } from "react";
import { SidebarSlotContext } from "../contexts/SidebarSlotContext";
import type {
  SidebarSlotContextValue,
  SidebarSlotProviderProps,
} from "../types";

/**
 * Sidebar Slot Provider
 *
 * **Important: Slots are exclusive to the Sidebar component, not the Navbar.**
 *
 * Manages slot registration and active slot state for dynamic content switching
 * within the Sidebar. This provider should wrap the Sidebar content where slots
 * will be used.
 *
 * @example
 * ```tsx
 * <SideNavbar>
 *   <SideNavbar.Navbar>
 *     <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *   </SideNavbar.Navbar>
 *
 *   <SidebarSlotProvider defaultSlot="dashboard">
 *     <SideNavbar.Sidebar>
 *       <SideNavbar.Sidebar.Content>
 *         <SidebarSlot id="dashboard">
 *           <DashboardContent />
 *         </SidebarSlot>
 *         <SidebarSlot id="settings">
 *           <SettingsContent />
 *         </SidebarSlot>
 *         <SidebarSlotContent />
 *       </SideNavbar.Sidebar.Content>
 *     </SideNavbar.Sidebar>
 *   </SidebarSlotProvider>
 * </SideNavbar>
 * ```
 */
export function SidebarSlotProvider({
  children,
  defaultSlot = null,
}: SidebarSlotProviderProps) {
  const [activeSlot, setActiveSlot] = useState<string | null>(defaultSlot);
  const slotsRef = useRef(new Map<string, ReactNode>());

  const registerSlot = useCallback((id: string, content: ReactNode) => {
    slotsRef.current.set(id, content);
  }, []);

  const unregisterSlot = useCallback((id: string) => {
    slotsRef.current.delete(id);
  }, []);

  const contextValue: SidebarSlotContextValue = useMemo(
    () => ({
      activeSlot,
      setActiveSlot,
      slots: slotsRef.current,
      registerSlot,
      unregisterSlot,
    }),
    [activeSlot, registerSlot, unregisterSlot],
  );

  return (
    <SidebarSlotContext.Provider value={contextValue}>
      {children}
    </SidebarSlotContext.Provider>
  );
}
