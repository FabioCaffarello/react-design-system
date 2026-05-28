"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import { Checkbox } from "../../primitives";
import TableHeaderCell from "./TableHeaderCell";

export type TableHeaderRowProps = HTMLAttributes<HTMLTableRowElement>;

/**
 * TableHeaderRow Component
 *
 * Renders a header row (tr) with header cells.
 * Must be used within a Table component.
 */
export default function TableHeaderRow({
  className = "",
  ...props
}: TableHeaderRowProps) {
  const {
    columns,
    selectable,
    selectionState,
    toggleSelectAll,
    actions,
    resizable,
    columnWidths,
    setColumnWidth,
  } = useTableContext();

  return (
    <tr role="row" className={className} {...props}>
      {selectable && (
        <th
          scope="col"
          role="columnheader"
          className="px-6 py-3 w-12"
          aria-label="Select all"
        >
          <Checkbox
            checked={selectionState.isAllSelected}
            onChange={toggleSelectAll}
            aria-label="Select all rows"
            className="my-0"
            indeterminate={selectionState.isIndeterminate}
          />
        </th>
      )}

      {columns.map((column) => (
        <TableHeaderCell
          key={column.key}
          column={column}
          resizable={resizable}
          width={columnWidths?.[column.key]}
          onResize={setColumnWidth}
        />
      ))}

      {actions && (
        <th
          scope="col"
          role="columnheader"
          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
          aria-label="Actions"
        >
          <span className="sr-only">Actions</span>
        </th>
      )}
    </tr>
  );
}
