'use client';

import type { HTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Text } from "../../../atoms";
import Collapsible from "../../../atoms/Collapsible/Collapsible";
import { SIDEBAR_TOKENS } from "../../../tokens/sidebar";

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleIcon?: ReactNode; // Optional icon for the title
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean; // Controlled mode
  onCollapseChange?: (collapsed: boolean) => void;
  storageKey?: string; // For localStorage persistence
  showChevron?: boolean; // Default: true when collapsible
}

/**
 * SidebarGroup Component
 * 
 * A group container for sidebar items with optional title.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <SidebarGroup title="Agile">
 *   <SidebarItem href="/epics">Epics</SidebarItem>
 *   <SidebarItem href="/stories">Stories</SidebarItem>
 * </SidebarGroup>
 * ```
 */
export default function SidebarGroup({
  title,
  titleIcon,
  children,
  collapsible = false,
  defaultCollapsed = false,
  collapsed,
  onCollapseChange,
  storageKey,
  showChevron = true,
  className = "",
  ...props
}: SidebarGroupProps) {
  const baseClasses = ["space-y-1"];
  const classes = [...baseClasses, className].filter(Boolean).join(" ");

  // Chevron icon component using lucide-react
  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <ChevronRight
      className={`${SIDEBAR_TOKENS.chevron.size} ${SIDEBAR_TOKENS.chevron.color} transition-transform duration-200 ${
        isOpen ? 'rotate-90' : ''
      }`}
    />
  );

  // If collapsible and has title, use Collapsible component
  if (collapsible && title) {
    return (
      <Collapsible
        defaultOpen={!defaultCollapsed}
        open={collapsed !== undefined ? !collapsed : undefined}
        onOpenChange={(open) => onCollapseChange?.(!open)}
        storageKey={storageKey}
        trigger={
          <div className={`${SIDEBAR_TOKENS.spacing.groupTitlePadding} flex items-center justify-between w-full hover:bg-gray-50 rounded-md transition-colors cursor-pointer`}>
            <div className="flex items-center gap-2">
              {titleIcon && (
                <span className={`${SIDEBAR_TOKENS.icon.md} ${SIDEBAR_TOKENS.colors.groupTitle}`}>
                  {titleIcon}
                </span>
              )}
              <Text
                as="h3"
                className={`${SIDEBAR_TOKENS.text.xs} font-semibold ${SIDEBAR_TOKENS.colors.groupTitle} uppercase tracking-wider`}
              >
                {title}
              </Text>
            </div>
            {showChevron && (
              <span className="ml-2">
                <ChevronIcon isOpen={collapsed !== undefined ? !collapsed : !defaultCollapsed} />
              </span>
            )}
          </div>
        }
        className={classes}
        {...props}
      >
        <div className="space-y-1" role="menu">{children}</div>
      </Collapsible>
    );
  }

  // Non-collapsible group (default behavior)
  return (
    <div className={classes} role="group" aria-label={title} {...props}>
      {title && (
        <div className={`${SIDEBAR_TOKENS.spacing.groupTitlePadding} flex items-center gap-2`}>
          {titleIcon && (
            <span className={`${SIDEBAR_TOKENS.icon.md} ${SIDEBAR_TOKENS.colors.groupTitle}`} aria-hidden="true">
              {titleIcon}
            </span>
          )}
          <Text
            as="h3"
            className={`${SIDEBAR_TOKENS.text.xs} font-semibold ${SIDEBAR_TOKENS.colors.groupTitle} uppercase tracking-wider`}
          >
            {title}
          </Text>
        </div>
      )}
      <div className="space-y-1" role="menu">{children}</div>
    </div>
  );
}
