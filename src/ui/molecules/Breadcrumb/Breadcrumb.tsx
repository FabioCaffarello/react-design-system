'use client';

import type { HTMLAttributes } from "react";
import { cn } from "../../utils";
import { 
  getColorClass, 
  getHoverColorClass,
  getSpacingClass,
  getTypographySize,
  getTypographyWeight
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
    getSpacingClass('sm', 'space-x'),
    getTypographySize('bodySmall'),
  ];

  const classes = cn(...baseClasses, className);

  return (
    <nav aria-label="Breadcrumb" className={classes} {...props}>
      <ol className={cn('flex', 'items-center', getSpacingClass('sm', 'space-x'))}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className={cn(getSpacingClass('sm', 'mx'), getColorClass('neutral', 'DEFAULT', 'text'))} aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className={cn(getColorClass('neutral', 'dark', 'text'), getTypographyWeight('label'))} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    "inline-flex",
                    "items-center",
                    getSpacingClass('xs', 'px'),
                    getSpacingClass('xs', 'pt'),
                    "border-b-2",
                    "border-transparent",
                    getTypographySize('bodySmall'),
                    getTypographyWeight('label'),
                    "transition-colors",
                    getColorClass('neutral', 'DEFAULT', 'text'),
                    getHoverColorClass('neutral', 'DEFAULT', 'border'),
                    getHoverColorClass('neutral', 'dark', 'text')
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span className={getColorClass('neutral', 'DEFAULT', 'text')}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
