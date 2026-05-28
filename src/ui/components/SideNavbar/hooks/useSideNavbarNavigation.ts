"use client";

import { useCallback } from "react";
import { useNavbarRequired } from "../contexts/NavbarContext";
import { useSidebarSlot } from "../contexts/SidebarSlotContext";

/**
 * Hook for navigation-related state and actions
 *
 * Provides convenience methods for navigating between navbar items
 * and managing associated sidebar slots.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { activeItem, navigate } = useSideNavbarNavigation();
 *
 *   return (
 *     <button onClick={() => navigate('dashboard', 'dashboard-content')}>
 *       Go to Dashboard
 *     </button>
 *   );
 * }
 * ```
 */
export function useSideNavbarNavigation() {
  const { activeItem, setActiveItem } = useNavbarRequired();
  const slotContext = useSidebarSlot();

  const navigate = useCallback(
    (itemId: string, slotId?: string) => {
      setActiveItem(itemId);
      if (slotId && slotContext?.setActiveSlot) {
        slotContext.setActiveSlot(slotId);
      }
    },
    [setActiveItem, slotContext],
  );

  return {
    activeItem,
    setActiveItem,
    navigate,
  };
}
