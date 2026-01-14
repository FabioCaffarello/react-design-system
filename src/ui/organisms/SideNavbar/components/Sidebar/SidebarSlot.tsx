'use client';

import React, { useEffect, type ReactNode } from 'react';
import { useSidebarSlotRequired } from '../../contexts/SidebarSlotContext';

export interface SidebarSlotProps {
  /** Unique slot identifier */
  id: string;
  /** Slot content */
  children: ReactNode;
}

/**
 * SidebarSlot Component
 *
 * **Note: Slots are exclusive to the Sidebar component, not the Navbar.**
 *
 * Registers a content slot that can be displayed dynamically within the Sidebar.
 * The slot content is only rendered when it's the active slot.
 * Use this to switch between different content views in the Sidebar based on navigation.
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
export function SidebarSlot({ id, children }: SidebarSlotProps) {
  const { activeSlot, registerSlot, unregisterSlot } = useSidebarSlotRequired();

  useEffect(() => {
    registerSlot(id, children);
    return () => unregisterSlot(id);
  }, [id, children, registerSlot, unregisterSlot]);

  // Only render if this is the active slot
  if (activeSlot !== id) {
    return null;
  }

  return <>{children}</>;
}
