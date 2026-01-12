'use client';

import type { HTMLAttributes } from "react";
import NavLink from "../../atoms/NavLink/NavLink";

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
 * Follows Atomic Design principles as a Molecule component.
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
    "space-x-2",
    "text-sm",
  ];

  const classes = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <nav aria-label="Breadcrumb" className={classes} {...props}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <NavLink href={item.href} variant="default">
                  {item.label}
                </NavLink>
              ) : (
                <span className="text-gray-500">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
