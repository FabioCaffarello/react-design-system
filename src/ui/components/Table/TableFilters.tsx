"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import TableFiltersComponent from "./TableFilters/TableFilters";

export interface TableFiltersProps extends HTMLAttributes<HTMLDivElement> {
  showClearAll?: boolean;
}

/**
 * TableFilters Component
 *
 * Renders filter controls for the table.
 * Uses filter configuration from Table context.
 * Must be used within a Table component.
 */
export default function TableFilters({
  showClearAll = true,
  className = "",
  ...props
}: TableFiltersProps) {
  const { filterState, setFilters } = useTableContext();

  if (filterState.config.length === 0) {
    return null;
  }

  return (
    <TableFiltersComponent
      filters={filterState.config}
      onFilter={setFilters}
      initialValues={filterState.values}
      showClearAll={showClearAll}
      className={className}
      {...props}
    />
  );
}
