'use client';

import type { HTMLAttributes, ReactNode } from "react";
import SidebarHeader from "./SidebarHeader/SidebarHeader";
import SidebarGroup from "./SidebarGroup/SidebarGroup";
import SidebarItem from "./SidebarItem/SidebarItem";
import SplitSidebar from "../SplitSidebar/SplitSidebar";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "collapsed" | "split";
  title?: string;
  showHeader?: boolean;
  onClose?: () => void;
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  role?: 'navigation' | 'complementary';
  // Split sidebar props
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  width?: number | string;
  navigationWidth?: number | string;
}

/**
 * Sidebar Component
 * 
 * A sidebar navigation component with header, groups, and items.
 * Enhanced with split variant and better collapse support.
 * Follows Atomic Design principles as an Organism component.
 * Uses Compound Components pattern.
 * 
 * @example
 * ```tsx
 * <Sidebar title="Navigation" variant="default">
 *   <Sidebar.Group title="Agile">
 *     <Sidebar.Item href="/epics" isActive>Epics</Sidebar.Item>
 *     <Sidebar.Item href="/stories">Stories</Sidebar.Item>
 *   </Sidebar.Group>
 * </Sidebar>
 * 
 * <Sidebar variant="split" width="320px">
 *   <Sidebar.Navigation>
 *     <Tabs>...</Tabs>
 *   </Sidebar.Navigation>
 *   <Sidebar.Content title="Settings">
 *     <div>Content</div>
 *   </Sidebar.Content>
 * </Sidebar>
 * ```
 */
function SidebarComponent({
  variant = "default",
  title,
  showHeader = true,
  onClose,
  children,
  className = "",
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  role = 'navigation',
  // Split sidebar props
  defaultCollapsed,
  collapsed,
  onCollapseChange,
  collapsible = true,
  width,
  navigationWidth,
  ...props
}: SidebarProps) {
  // If variant is split, use SplitSidebar
  if (variant === 'split') {
    return (
      <SplitSidebar
        defaultCollapsed={defaultCollapsed}
        collapsed={collapsed}
        onCollapseChange={onCollapseChange}
        collapsible={collapsible}
        width={width}
        navigationWidth={navigationWidth}
        className={className}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        {children}
      </SplitSidebar>
    );
  }

  // Default variant (original behavior)
  const baseClasses = [
    "flex",
    "flex-col",
    "bg-white",
    "h-full",
    "w-full",
  ];

  const variantClasses = {
    default: "",
    collapsed: "",
    split: "", // Handled above
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  // Generate ID for title if provided and no aria-labelledby
  const titleId = title && !ariaLabelledBy ? `sidebar-title-${Math.random().toString(36).substr(2, 9)}` : undefined;

  return (
    <nav
      className={classes}
      role={role}
      aria-label={ariaLabel || (title ? undefined : 'Sidebar navigation')}
      aria-labelledby={ariaLabelledBy || (titleId ? titleId : undefined)}
      {...props}
    >
      {showHeader && title && (
        <div className="flex-shrink-0" id={titleId}>
          <SidebarHeader
            title={title}
            onClose={onClose}
            showCloseButton={!!onClose}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        {children}
      </div>
    </nav>
  );
}

// Compound Components
SidebarComponent.Group = SidebarGroup;
SidebarComponent.Item = SidebarItem;
SidebarComponent.Header = SidebarHeader;
// Add SplitSidebar subcomponents for split variant
SidebarComponent.Navigation = SplitSidebar.Navigation;
SidebarComponent.Content = SplitSidebar.Content;

export default SidebarComponent;
