"use client";

import type { HTMLAttributes } from "react";
import type { TableColumn } from "./TableTypes";

export interface TableCellProps<T = unknown>
  extends HTMLAttributes<HTMLTableCellElement> {
  column: TableColumn<T>;
  row: T;
}

/**
 * TableCell Component
 *
 * Renders a table cell (td) for a column.
 * Uses column.render if available, otherwise renders the raw value.
 * Must be used within a Table component.
 */
export default function TableCell<
  T extends Record<string, unknown> = Record<string, unknown>,
>({ column, row, className = "", ...props }: TableCellProps<T>) {
  const value = column.key in row ? row[column.key as keyof T] : undefined;

  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
        column.hiddenOnMobile ? "hidden md:table-cell" : ""
      } ${className}`}
      {...props}
    >
      {column.render ? column.render(value, row) : String(value ?? "")}
    </td>
  );
}
