"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavbarRequired } from "../../contexts/NavbarContext";
import Tooltip from "../../../../primitives/Tooltip/Tooltip";
import type { NavbarToggleProps } from "../../types";

/**
 * Toggle button for the Navbar subcomponent
 *
 * Uses the NavbarContext to control the sidebar collapse state.
 * Can be customized with different icons, sizes, and variants.
 *
 * @example
 * ```tsx
 * <SideNavbar.Navbar.Toggle
 *   variant="ghost"
 *   icon={(collapsed) => collapsed ? <ChevronRight /> : <ChevronLeft />}
 * />
 * ```
 */
export default function NavbarToggle({
  icon,
  size = "sm",
  variant = "ghost",
  className = "",
  ...props
}: NavbarToggleProps) {
  const { collapsed, toggle } = useNavbarRequired();

  // Render the icon
  const renderIcon = () => {
    if (icon) {
      return typeof icon === "function" ? icon(collapsed) : icon;
    }
    const Icon = collapsed ? ChevronRight : ChevronLeft;
    return (
      <Icon
        className={iconSizeClasses[size]}
        style={{
          transition: "none",
          transform: "none",
          willChange: "auto",
        }}
      />
    );
  };

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
  };

  const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  const variantClasses = {
    default:
      "bg-surface-base border border-line-default shadow-sm hover:bg-surface-hover",
    ghost: "hover:bg-surface-active",
    outline: "border border-line-emphasis hover:bg-surface-hover",
  };

  return (
    <Tooltip
      content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      position="right"
    >
      <button
        type="button"
        onClick={toggle}
        className={`
          flex
          items-center
          justify-center
          rounded-md
          text-fg-secondary
          hover:text-fg-primary
          focus:outline-none
          focus:ring-2
          focus:ring-line-focus
          focus:ring-offset-1
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          [&:hover]:!transform-none
          ${className}
        `}
        style={{
          // Remover transições que possam causar movimento
          willChange: "auto",
          transform: "none",
          transition: "none",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        {...props}
      >
        {renderIcon()}
      </button>
    </Tooltip>
  );
}
