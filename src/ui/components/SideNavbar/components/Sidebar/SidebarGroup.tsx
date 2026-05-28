"use client";

import React, { useEffect, useRef } from "react";
import { useSidebarRequired } from "../../contexts/SidebarContext";
import { useSideNavbarStateRequired } from "../../contexts/SideNavbarStateContext";
import { useSideNavbarThemeRequired } from "../../contexts/SideNavbarThemeContext";
import Collapsible from "../../../../primitives/Collapsible/Collapsible";
import { getSpacingClass } from "../../../../tokens/spacing";
import type { SidebarGroupProps } from "../../types";

/**
 * Group component for the Sidebar subcomponent
 *
 * Creates a collapsible section within the sidebar content.
 * State is managed by the root SideNavbar context.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Group
 *   id="filters"
 *   title="Filters"
 *   icon={<Filter />}
 *   collapsible
 * >
 *   <FilterList />
 * </SideNavbar.Sidebar.Group>
 * ```
 */
export default function SidebarGroup({
  id,
  title,
  icon,
  actions,
  collapsible = true,
  defaultCollapsed = false,
  children,
  className = "",
  ...props
}: SidebarGroupProps) {
  const {
    collapsed: sidebarCollapsed,
    activeGroup,
    setActiveGroup,
  } = useSidebarRequired();
  const { groupStates, toggleGroup, setGroupCollapsed } =
    useSideNavbarStateRequired();
  const { animationDuration } = useSideNavbarThemeRequired();
  const hasInitialized = useRef(false);

  // Initialize group state on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current && groupStates[id] === undefined) {
      hasInitialized.current = true;
      setGroupCollapsed(id, defaultCollapsed);
    }
  }, [id, defaultCollapsed, groupStates, setGroupCollapsed]);

  // Don't render if sidebar is collapsed
  if (sidebarCollapsed) {
    return null;
  }

  const isCollapsed = groupStates[id] ?? defaultCollapsed;
  const isActive = activeGroup === id;

  const _handleToggle = () => {
    if (collapsible) {
      toggleGroup(id);
    }
    setActiveGroup(id);
  };

  const handleHeaderClick = () => {
    setActiveGroup(id);
    if (collapsible) {
      toggleGroup(id);
    }
  };

  return (
    <div
      className={`
        border-b
        border-gray-200
        last:border-b-0
        ${className}
      `}
      {...props}
    >
      {title && (
        <button
          type="button"
          onClick={handleHeaderClick}
          className={`
            flex
            items-center
            justify-between
            w-full
            ${getSpacingClass("md", "px")}
            ${getSpacingClass("2.5", "py")}
            text-left
            transition-colors
            duration-150
            ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}
            ${!collapsible ? "cursor-default" : "cursor-pointer"}
          `}
          aria-expanded={collapsible ? !isCollapsed : undefined}
          aria-controls={collapsible ? `sidebar-group-${id}` : undefined}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="w-4 h-4 text-gray-500">{icon}</span>}
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {collapsible && (
              <ChevronDown
                className={`
                  w-4
                  h-4
                  text-gray-400
                  transition-transform
                  ${isCollapsed ? "-rotate-90" : "rotate-0"}
                `}
                style={{ transitionDuration: `${animationDuration}ms` }}
                aria-hidden="true"
              />
            )}
          </div>
        </button>
      )}

      {collapsible ? (
        <Collapsible open={!isCollapsed} duration={animationDuration}>
          <div id={`sidebar-group-${id}`} className="px-3 py-2">
            {children}
          </div>
        </Collapsible>
      ) : (
        <div className="px-3 py-2">{children}</div>
      )}
    </div>
  );
}
