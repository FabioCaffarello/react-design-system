"use client";

import { useState, useId } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../../../../utils";
import { getSpacingClass } from "../../../../tokens/spacing";
import type { NavbarGroupProps } from "../../types";

/**
 * NavbarGroup Component
 *
 * Groups navbar items with optional label and collapsible behavior.
 *
 * @example
 * ```tsx
 * <SideNavbar.Navbar>
 *   <SideNavbar.Navbar.Group label="Main" collapsible>
 *     <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *     <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
 *   </SideNavbar.Navbar.Group>
 * </SideNavbar.Navbar>
 * ```
 */
export function NavbarGroup({
  id,
  label,
  collapsible = false,
  defaultCollapsed = false,
  children,
  className,
  ...props
}: NavbarGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const panelId = `navbar-group-${useId()}`;

  // Shared label content (chevron + text) for both the static and the
  // collapsible-button renderings.
  const labelContent = (
    <span className={cn("flex items-center", getSpacingClass("1.5", "gap"))}>
      {collapsible && (
        <span className="shrink-0">
          {isCollapsed ? (
            <ChevronRight
              className="w-3 h-3"
              style={{ transition: "none", transform: "none" }}
            />
          ) : (
            <ChevronDown
              className="w-3 h-3"
              style={{ transition: "none", transform: "none" }}
            />
          )}
        </span>
      )}
      <span>{label}</span>
    </span>
  );

  return (
    <div id={id} className={cn("flex flex-col", className)} {...props}>
      {label &&
        (collapsible ? (
          // Collapsible header is a real button: keyboard operable
          // (Enter/Space activate it natively) with disclosure ARIA. The
          // old <div onClick> was unreachable by keyboard / unlabeled to AT.
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-controls={isCollapsed ? undefined : panelId}
            className={cn(
              getSpacingClass("sm", "px"),
              getSpacingClass("1.5", "py"),
              "text-xs text-fg-tertiary uppercase tracking-wider",
              "w-full text-left cursor-pointer hover:text-fg-secondary",
            )}
          >
            {labelContent}
          </button>
        ) : (
          <div
            className={cn(
              getSpacingClass("sm", "px"),
              getSpacingClass("1.5", "py"),
              "text-xs text-fg-tertiary uppercase tracking-wider",
            )}
          >
            {labelContent}
          </div>
        ))}
      {!isCollapsed && (
        <div
          id={panelId}
          className={`flex flex-col ${getSpacingClass("sm", "gap")}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
