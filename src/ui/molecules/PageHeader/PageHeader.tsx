/**
 * PageHeader Component
 *
 * Page header component with title, description, breadcrumb, and actions.
 *
 * @see EPIC-004: PageHeader Component (Molecule)
 */

"use client";

import React from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { Text } from "../../primitives";
import type { PageHeaderProps } from "./types";
import { cn, cva } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

/**
 * PageHeader Variants using CVA
 * Type-safe variant system for PageHeader component
 */
const pageHeaderVariants = cva(
  // Base classes
  cn("w-full", "flex", "flex-col", "gap-2"),
  {
    variants: {
      variant: {
        default: cn(getSpacingClass("base", "mb")),
        compact: cn(getSpacingClass("sm", "mb")),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * PageHeader Component
 *
 * Page header with title, description, breadcrumb, and actions.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Page Title"
 *   description="Page description"
 *   breadcrumb={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Page', href: '/page' },
 *   ]}
 *   actions={<Button>Action</Button>}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  variant = "default",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderVariants({ variant }), className)} {...props}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}

      {/* Title and Actions Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <Text variant="heading" as="h1" className="mb-2 text-2xl font-bold">
            {title}
          </Text>
          {description && (
            <Text variant="body" className="text-gray-600">
              {description}
            </Text>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
