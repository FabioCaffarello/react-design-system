"use client";

import { useState, type ReactNode } from "react";
import { MenuProvider } from "./MenuContext";
import MenuTrigger from "./MenuTrigger";
import MenuContent from "./MenuContent";
import MenuItem from "./MenuItem";
import MenuSeparator from "./MenuSeparator";

export type MenuPlacement = "top" | "bottom" | "left" | "right";

export interface MenuProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: MenuPlacement;
}

/**
 * Menu Component
 *
 * A dropdown menu component with keyboard navigation and portal rendering.
 * Uses Compound Component pattern.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuTrigger>
 *     <Button>Open Menu</Button>
 *   </MenuTrigger>
 *   <MenuContent>
 *     <MenuItem onClick={handleClick}>Item 1</MenuItem>
 *     <MenuItem onClick={handleClick}>Item 2</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem onClick={handleClick}>Item 3</MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export default function Menu({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
}: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <MenuProvider
      value={{
        isOpen,
        setIsOpen,
        closeMenu,
        placement,
      }}
    >
      {children}
    </MenuProvider>
  );
}

// Export sub-components for compound pattern
Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;

// Also export as named exports for easier imports
export { MenuTrigger, MenuContent, MenuItem, MenuSeparator };
