"use client";

import React from "react";
import { useSidebarRequired } from "../../contexts/SidebarContext";
import { getSpacingClass } from "../../../../tokens";
import { SIDEBAR_TOKENS } from "../../../../tokens/sidebar";
import type { SidebarContentProps } from "../../types";

/**
 * Content component for the Sidebar subcomponent
 *
 * The main scrollable area of the sidebar.
 * Supports configurable padding and scroll tracking.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Content padding="md" scrollable>
 *   <SideNavbar.Sidebar.Group id="filters" title="Filters">
 *     <FilterList />
 *   </SideNavbar.Sidebar.Group>
 * </SideNavbar.Sidebar.Content>
 * ```
 */
export default function SidebarContent({
  scrollable = true,
  padding = "md",
  children,
  className = "",
  style,
  ...props
}: SidebarContentProps) {
  const { collapsed, setScrollPosition } = useSidebarRequired();

  if (collapsed) {
    return null;
  }

  const paddingClass = padding !== "none" ? getSpacingClass(padding, "p") : "";

  const scrollClasses = scrollable
    ? "overflow-y-auto overflow-x-hidden"
    : "overflow-hidden";

  const scrollbarStyles = scrollable
    ? {
        scrollbarWidth: SIDEBAR_TOKENS.content.scrollbar.width as "thin",
        scrollbarColor: `${SIDEBAR_TOKENS.content.scrollbar.color.thumb} ${SIDEBAR_TOKENS.content.scrollbar.color.track}`,
      }
    : {};

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollable) {
      setScrollPosition(e.currentTarget.scrollTop);
    }
  };

  return (
    <div
      className={`
        flex-1
        min-h-0
        ${scrollClasses}
        ${paddingClass}
        ${className}
      `}
      style={{
        ...scrollbarStyles,
        ...style,
      }}
      onScroll={handleScroll}
      // Defensive `tabIndex={0}` on the scrollable container so keyboard
      // users can enter the region and scroll with arrow keys. Required
      // by axe `scrollable-region-focusable` (serious) whenever the
      // content inside doesn't include focusable elements (the
      // LongContent story rendered plain text with no actionable items;
      // a keyboard user had no way to reach the scrollbar). When the
      // content DOES include focusable elements axe is also satisfied,
      // so the attribute is harmless then. Only set when scrollable
      // (a non-scrollable container has no region to enter).
      tabIndex={scrollable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
