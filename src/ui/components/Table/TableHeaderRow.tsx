"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import { Checkbox } from "../../primitives";
import { getSpacingClass } from "../../tokens/spacing";
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
          className={`${getSpacingClass("lg", "px")} ${getSpacingClass("md", "py")} w-12`}
          aria-label="Select all"
        >
          <Checkbox
            checked={selectionState.isAllSelected}
            onChange={toggleSelectAll}
            aria-label="Select all rows"
            className={getSpacingClass("none", "my")}
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
          className={`${getSpacingClass("lg", "px")} ${getSpacingClass("md", "py")} text-right text-xs font-medium text-fg-tertiary uppercase tracking-wider w-12`}
          aria-label="Actions"
        >
          <span className="sr-only">Actions</span>
        </th>
      )}
    </tr>
  );
}
