"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import { getZIndexClass } from "../../tokens/z-index";
import TableHeaderRow from "./TableHeaderRow";

export interface TableHeaderProps extends Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  "children"
> {
  className?: string;
}

/**
 * TableHeader Component
 *
 * Renders the table header (thead) with columns.
 * Must be used within a Table component.
 */
export default function TableHeader({
  className = "",
  ...props
}: TableHeaderProps) {
  useTableContext(); // Ensure we're within Table context
  // columns is accessed via TableHeaderRow which uses useTableContext

  return (
    <thead
      className={`bg-surface-subtle sticky top-0 ${getZIndexClass("sticky")} ${className}`}
      {...props}
    >
      <TableHeaderRow />
    </thead>
  );
}
