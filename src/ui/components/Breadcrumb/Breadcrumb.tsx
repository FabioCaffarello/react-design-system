"use client";

import type { HTMLAttributes } from "react";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getTypographySize,
  getTypographyWeight,
} from "../../tokens";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: string;
}

/**
 * Breadcrumb Component
 *
 * A breadcrumb navigation component for hierarchical navigation.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Epics", href: "/epics" },
 *     { label: "Epic Details" }
 *   ]}
 * />
 * ```
 */
export default function Breadcrumb({
  items,
  separator = "/",
  className = "",
  ...props
}: Props) {
  const baseClasses = [
    "flex",
    "items-center",
    getSpacingClass("sm", "space-x"),
    getTypographySize("bodySmall"),
  ];

  const classes = cn(...baseClasses, className);

  return (
    <nav aria-label="Breadcrumb" className={classes} {...props}>
      <ol
        className={cn("flex", "items-center", getSpacingClass("sm", "space-x"))}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span
                  className={cn(
                    getSpacingClass("sm", "mx"),
                    "text-fg-tertiary",
                  )}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              {isLast ? (
                <span
                  className={cn(
                    "text-fg-primary",
                    getTypographyWeight("label"),
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    "inline-flex",
                    "items-center",
                    getSpacingClass("xs", "px"),
                    getSpacingClass("xs", "pt"),
                    "border-b-2",
                    "border-transparent",
                    getTypographySize("bodySmall"),
                    getTypographyWeight("label"),
                    "transition-colors",
                    "text-fg-secondary",
                    "hover:border-line-emphasis",
                    "hover:text-fg-primary",
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-fg-secondary">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
