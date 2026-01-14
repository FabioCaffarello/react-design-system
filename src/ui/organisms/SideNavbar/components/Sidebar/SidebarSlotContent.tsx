'use client';

import React, { type ReactNode } from 'react';
import { useSidebarSlotRequired } from '../../contexts/SidebarSlotContext';

export interface SidebarSlotContentProps {
  /** Fallback content when no slot is active */
  fallback?: ReactNode;
}

/**
 * SidebarSlotContent Component
 *
 * **Note: This component is exclusive to the Sidebar, not the Navbar.**
 *
 * Container that renders the currently active slot content within the Sidebar.
 * Displays fallback content if no slot is active.
 * Must be used inside a SidebarSlotProvider and within the Sidebar component.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar>
 *   <SideNavbar.Sidebar.Content>
 *     <SidebarSlotProvider defaultSlot="dashboard">
 *       <SidebarSlot id="dashboard">
 *         <DashboardContent />
 *       </SidebarSlot>
 *       <SidebarSlotContent fallback={<EmptyState />} />
 *     </SidebarSlotProvider>
 *   </SideNavbar.Sidebar.Content>
 * </SideNavbar.Sidebar>
 * ```
 */
export function SidebarSlotContent({ fallback = null }: SidebarSlotContentProps) {
  const { activeSlot, slots } = useSidebarSlotRequired();

  if (!activeSlot || !slots.has(activeSlot)) {
    return <>{fallback}</>;
  }

  return <>{slots.get(activeSlot)}</>;
}
