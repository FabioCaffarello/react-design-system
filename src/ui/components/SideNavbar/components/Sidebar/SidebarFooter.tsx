"use client";

import React, { useEffect } from "react";
import { useSidebarRequired } from "../../contexts/SidebarContext";
import { getSpacingClass } from "../../../../tokens";
import type { SidebarFooterProps } from "../../types";

/**
 * Footer component for the Sidebar subcomponent
 *
 * Displays content at the bottom of the sidebar.
 * Automatically registers its presence with the Sidebar context.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Footer>
 *   <Button variant="primary">Apply Changes</Button>
 * </SideNavbar.Sidebar.Footer>
 * ```
 */
export default function SidebarFooter({
  padding = "md",
  showBorder = true,
  children,
  className = "",
  style,
  ...props
}: SidebarFooterProps) {
  const { collapsed, registerFooter, unregisterFooter } = useSidebarRequired();

  // Register footer presence with Sidebar context
  useEffect(() => {
    registerFooter();
    return () => unregisterFooter();
  }, [registerFooter, unregisterFooter]);

  if (collapsed) {
    return null;
  }

  const paddingClass = padding !== "none" ? getSpacingClass(padding, "p") : "";

  return (
    <div
      className={`
        flex-shrink-0
        ${paddingClass}
        ${showBorder ? "border-t border-line-default" : ""}
        bg-surface-subtle
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
