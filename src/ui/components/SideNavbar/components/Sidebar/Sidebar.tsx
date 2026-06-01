"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { useSideNavbarStateRequired } from "../../contexts/SideNavbarStateContext";
import { useSideNavbarThemeRequired } from "../../contexts/SideNavbarThemeContext";
import { parseWidthToPixels } from "../../utils";
import type { SidebarProps, SidebarContextValue } from "../../types";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarFooter from "./SidebarFooter";
import SidebarGroup from "./SidebarGroup";
import { SidebarSlot } from "./SidebarSlot";
import { SidebarSlotContent } from "./SidebarSlotContent";
import { cn } from "../../../../utils";

/**
 * Sidebar subcomponent for SideNavbar
 *
 * Provides its own context that inherits from the root SideNavbar context.
 * Contains the expandable content area with header, content, and footer.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar>
 *   <SideNavbar.Sidebar.Header title="Dashboard" />
 *   <SideNavbar.Sidebar.Content>
 *     <SideNavbar.Sidebar.Group id="filters" title="Filters">
 *       <FilterList />
 *     </SideNavbar.Sidebar.Group>
 *   </SideNavbar.Sidebar.Content>
 *   <SideNavbar.Sidebar.Footer>
 *     <Button>Apply</Button>
 *   </SideNavbar.Sidebar.Footer>
 * </SideNavbar.Sidebar>
 * ```
 */
function Sidebar({ children, className = "", style, ...props }: SidebarProps) {
  const rootState = useSideNavbarStateRequired();
  const rootTheme = useSideNavbarThemeRequired();
  const sidebarRef = useRef<HTMLElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasHeader, setHasHeader] = useState(false);
  const [hasFooter, setHasFooter] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const registerHeader = useCallback(() => setHasHeader(true), []);
  const unregisterHeader = useCallback(() => setHasHeader(false), []);
  const registerFooter = useCallback(() => setHasFooter(true), []);
  const unregisterFooter = useCallback(() => setHasFooter(false), []);

  const contextValue: SidebarContextValue = useMemo(
    () => ({
      // Inherited from root
      collapsed: rootState.collapsed,
      currentWidth: rootState.currentWidth,
      isMobile: rootState.isMobile,
      // Sidebar-specific
      sidebarRef,
      scrollPosition,
      setScrollPosition,
      hasHeader,
      hasFooter,
      registerHeader,
      unregisterHeader,
      registerFooter,
      unregisterFooter,
      activeGroup,
      setActiveGroup,
    }),
    [
      rootState.collapsed,
      rootState.currentWidth,
      rootState.isMobile,
      scrollPosition,
      hasHeader,
      hasFooter,
      registerHeader,
      unregisterHeader,
      registerFooter,
      unregisterFooter,
      activeGroup,
    ],
  );

  // Calculate sidebar width (total width minus navigation width)
  const totalWidth = parseWidthToPixels(rootTheme.contentWidth);
  const navWidth = parseWidthToPixels(rootTheme.navigationWidth);
  const sidebarWidth = totalWidth - navWidth;

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* This inner container was previously an `<aside>` — a second
       * landmark nested inside SideNavbarRoot's outer `<aside
       * role="complementary" aria-label="Sidebar navigation">`. axe
       * `landmark-complementary-is-top-level` flagged it across all 20+
       * SideNavbar stories. The outer aside already provides the
       * landmark; this inner div is purely a layout container for the
       * collapsible content area. */}
      <div
        ref={sidebarRef}
        className={cn(
          "flex",
          "flex-col",
          "h-full",
          "bg-surface-subtle",
          "border-r",
          "border-line-default",
          "overflow-hidden",
          className,
        )}
        style={{
          width: rootState.collapsed ? 0 : sidebarWidth,
          opacity: rootState.collapsed ? 0 : 1,
          visibility: rootState.collapsed ? "hidden" : "visible",
          transitionProperty: "width, opacity, visibility",
          transitionDuration: `${rootTheme.animationDuration}ms`,
          transitionTimingFunction: rootTheme.animationEasing,
          ...style,
        }}
        aria-hidden={rootState.collapsed}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// Attach compound components
Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Group = SidebarGroup;
// Slot components (exclusive to Sidebar, not Navbar)
Sidebar.Slot = SidebarSlot;
Sidebar.SlotContent = SidebarSlotContent;

export default Sidebar;
