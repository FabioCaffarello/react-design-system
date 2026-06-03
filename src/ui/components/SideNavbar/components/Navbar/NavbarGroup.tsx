"use client";

import React, { useState } from "react";
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

  return (
    <div id={id} className={cn("flex flex-col", className)} {...props}>
      {label && (
        <div
          className={cn(
            getSpacingClass("sm", "px"),
            getSpacingClass("1.5", "py"),
            "text-xs text-fg-tertiary uppercase tracking-wider",
            collapsible && "cursor-pointer hover:text-fg-secondary",
          )}
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          <div
            className={cn("flex items-center", getSpacingClass("1.5", "gap"))}
          >
            {" "}
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
          </div>
        </div>
      )}
      {!isCollapsed && (
        <div className={`flex flex-col ${getSpacingClass("sm", "gap")}`}>
          {children}
        </div>
      )}
    </div>
  );
}
