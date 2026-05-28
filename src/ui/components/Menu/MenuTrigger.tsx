"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { useMenuContext } from "./MenuContext";

export interface MenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  asChild?: boolean;
}

/**
 * MenuTrigger Component
 *
 * The trigger element that opens/closes the menu.
 * Must be used within a Menu component.
 */
const MenuTrigger = forwardRef<HTMLDivElement, MenuTriggerProps>(
  function MenuTrigger({ children, asChild = false, onClick, ...props }, ref) {
    const { isOpen, setIsOpen } = useMenuContext();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!asChild) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div
        ref={ref}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MenuTrigger.displayName = "MenuTrigger";

export default MenuTrigger;
