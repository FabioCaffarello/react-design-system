"use client";

import React, { useEffect } from "react";
import { useSidebarRequired } from "../../contexts/SidebarContext";
import { getSpacingClass, getTypographyClasses } from "../../../../tokens";
import type { SidebarHeaderProps } from "../../types";

/**
 * Header component for the Sidebar subcomponent
 *
 * Displays a title and optional subtitle at the top of the sidebar content.
 * Automatically registers its presence with the Sidebar context.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Header title="Dashboard" subtitle="Overview" />
 * ```
 */
export default function SidebarHeader({
  title,
  subtitle,
  showBorder = true,
  children,
  className = "",
  style,
  ...props
}: SidebarHeaderProps) {
  const { collapsed, registerHeader, unregisterHeader } = useSidebarRequired();

  // Register header presence with Sidebar context
  useEffect(() => {
    registerHeader();
    return () => unregisterHeader();
  }, [registerHeader, unregisterHeader]);

  if (collapsed) {
    return null;
  }

  return (
    <div
      className={`
        flex-shrink-0
        ${getSpacingClass("md", "px")}
        ${getSpacingClass("sm", "py")}
        ${showBorder ? "border-b border-line-default" : ""}
        bg-surface-subtle
        ${className}
      `}
      style={style}
      {...props}
    >
      {children || (
        <>
          {title && (
            <h2
              className={`
                ${getTypographyClasses("h4")}
                text-fg-primary
                ${getSpacingClass("none", "m")}
                font-semibold
              `}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`
                ${getTypographyClasses("bodySmall")}
                text-fg-secondary
                ${getSpacingClass("none", "m")}
                ${getSpacingClass("xs", "mt")}
              `}
            >
              {subtitle}
            </p>
          )}
        </>
      )}
    </div>
  );
}
