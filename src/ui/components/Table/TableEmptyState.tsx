"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import { EmptyState } from "../../components";

export type TableEmptyStateProps = HTMLAttributes<HTMLDivElement>;

/**
 * TableEmptyState Component
 *
 * Renders empty state when table has no data.
 * Uses empty state configuration from Table context.
 * Must be used within a Table component.
 */
export default function TableEmptyState({
  className = "",
  ...props
}: TableEmptyStateProps) {
  const {
    emptyMessage,
    emptyStateTitle,
    emptyStateMessage,
    emptyStateIllustration,
    emptyStateAction,
  } = useTableContext();

  if (emptyStateTitle || emptyStateMessage || emptyStateIllustration) {
    return (
      <div className={className} {...props}>
        <EmptyState
          title={emptyStateTitle || "No data available"}
          message={emptyStateMessage || emptyMessage || "No data available"}
          variant={emptyStateIllustration ? "withIllustration" : "default"}
          illustration={emptyStateIllustration}
        />
        {emptyStateAction && (
          <div className="mt-4 flex justify-center">{emptyStateAction}</div>
        )}
      </div>
    );
  }

  return (
    <div className={`text-center text-fg-secondary ${className}`} {...props}>
      {emptyMessage || "No data available"}
    </div>
  );
}
