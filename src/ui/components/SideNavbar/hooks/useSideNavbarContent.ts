"use client";

import { useSidebarSlot } from "../contexts/SidebarSlotContext";
import { useSidebar } from "../contexts/SidebarContext";

/**
 * Hook for content/slot management
 *
 * Provides access to sidebar slot state and scroll position.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { activeSlot, setActiveSlot, scrollPosition } = useSideNavbarContent();
 *
 *   return (
 *     <div>
 *       <p>Active slot: {activeSlot}</p>
 *       <p>Scroll position: {scrollPosition}px</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSideNavbarContent() {
  const slotContext = useSidebarSlot();
  const sidebarContext = useSidebar();

  return {
    activeSlot: slotContext?.activeSlot ?? null,
    setActiveSlot: slotContext?.setActiveSlot ?? (() => {}),
    scrollPosition: sidebarContext?.scrollPosition ?? 0,
    setScrollPosition: sidebarContext?.setScrollPosition ?? (() => {}),
  };
}
