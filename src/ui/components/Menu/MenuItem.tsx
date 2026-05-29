"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { ChevronRight } from "lucide-react";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { useMenuContext } from "./MenuContext";

export interface MenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  children: ReactNode;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSelect?: (e: React.MouseEvent<HTMLDivElement>) => void;
  hasSubmenu?: boolean;
}

/**
 * MenuItem Component
 *
 * A single menu item. Supports icons, disabled state, and submenu indicator.
 *
 * @example
 * ```tsx
 * <MenuItem onClick={handleClick} icon={<Icon />}>
 *   Menu Item
 * </MenuItem>
 * ```
 */
const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  {
    children,
    icon,
    rightIcon,
    disabled = false,
    onClick,
    onSelect,
    hasSubmenu = false,
    className = "",
    ...props
  },
  ref,
) {
  const { closeMenu } = useMenuContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    onClick?.(e);
    onSelect?.(e);

    // Close menu unless it has a submenu
    if (!hasSubmenu && !e.defaultPrevented) {
      closeMenu();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
          flex
          items-center
          gap-2
          ${getSpacingClass("sm", "px")}
          ${getSpacingClass("sm", "py")}
          ${getTypographySize("bodySmall")}
          text-fg-primary
          cursor-pointer
          transition-colors
          hover:bg-surface-hover
          focus:bg-surface-hover
          focus:outline-none
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {hasSubmenu && (
        <ChevronRight className="h-4 w-4 text-fg-secondary shrink-0" />
      )}
      {rightIcon && !hasSubmenu && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </div>
  );
});

MenuItem.displayName = "MenuItem";

export default MenuItem;
