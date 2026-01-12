'use client';

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { SIDEBAR_TOKENS, getNestedIndentClass } from "../../../tokens/sidebar";

export interface SidebarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  isActive?: boolean;
  icon?: ReactNode;
  nested?: boolean | number; // true = level 1, number = specific level
  iconSize?: 'sm' | 'md' | 'lg'; // Default: 'md'
  children: ReactNode;
}

/**
 * SidebarItem Component
 * 
 * An individual navigation item within a sidebar.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <SidebarItem href="/epics" isActive={true} icon={<EpicIcon />}>
 *   Epics
 * </SidebarItem>
 * ```
 */
export default function SidebarItem({
  href,
  isActive = false,
  icon,
  nested = false,
  iconSize = 'md',
  children,
  className = "",
  ...props
}: SidebarItemProps) {
  // Calculate nested level
  const nestedLevel = typeof nested === 'number' ? nested : (nested ? 1 : 0);
  
  // Get indent class based on nested level
  const indentClass = getNestedIndentClass(nestedLevel);

  // Base classes using tokens
  const baseClasses = [
    "flex",
    "items-center",
    indentClass,
    SIDEBAR_TOKENS.spacing.itemPaddingY,
    SIDEBAR_TOKENS.text.sm,
    "font-medium",
    "rounded-md",
    "transition-colors",
    "hover:bg-gray-100",
  ];

  // Active classes using tokens
  const activeClasses = isActive
    ? `${SIDEBAR_TOKENS.colors.active.bg} ${SIDEBAR_TOKENS.colors.active.text} border-r-2 ${SIDEBAR_TOKENS.colors.active.border}`
    : `${SIDEBAR_TOKENS.colors.inactive.text} ${SIDEBAR_TOKENS.colors.inactive.hover}`;

  // Icon size class from tokens
  const iconSizeClass = SIDEBAR_TOKENS.icon[iconSize];

  const classes = [
    ...baseClasses,
    activeClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <a
      href={href}
      className={classes}
      aria-current={isActive ? 'page' : undefined}
      role="menuitem"
      {...props}
    >
      {icon && (
        <span className={`${iconSizeClass} ${SIDEBAR_TOKENS.spacing.iconMargin} shrink-0`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </a>
  );
}
