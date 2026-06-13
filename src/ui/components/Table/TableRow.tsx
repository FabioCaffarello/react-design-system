"use client";

import type { HTMLAttributes } from "react";
import { useTableContext } from "./TableContext";
import { Checkbox } from "../../primitives";
import { getSpacingClass } from "../../tokens/spacing";
import TableCell from "./TableCell";
import TableActions from "./TableActions";

export interface TableRowProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<HTMLAttributes<HTMLTableRowElement>, "style"> {
  row: T;
  rowIndex: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * TableRow Component
 *
 * Renders a table row (tr) with cells.
 * Supports selection and row click.
 * Must be used within a Table component.
 */
export default function TableRow<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  row,
  rowIndex,
  className = "",
  onClick,
  style,
  ...props
}: TableRowProps<T>) {
  const {
    columns,
    selectable,
    selectionState,
    toggleRowSelection,
    getRowId,
    actions,
    onRowClick,
  } = useTableContext<T>();

  const id = getRowId(row, rowIndex);
  const isSelected = selectionState.selectedRows.includes(id);
  const isRowInteractive = !!onRowClick;

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Keyboard operability for onRowClick (WCAG 2.1.1). role stays "row" —
  // promoting the <tr> to role="button" would strip it from the table's
  // grid/row structure for assistive tech, which is worse than the gap
  // being fixed. A focusable row with Enter/Space activation keeps the
  // table semantics intact while making the action reachable.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return;
    if (e.key === "Enter" || e.key === " ") {
      if (e.key === " ") e.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <tr
      role="row"
      aria-selected={selectable ? isSelected : undefined}
      aria-rowindex={rowIndex + 1}
      tabIndex={isRowInteractive ? 0 : undefined}
      onKeyDown={isRowInteractive ? handleKeyDown : undefined}
      className={`hover:bg-surface-hover ${isRowInteractive ? "cursor-pointer" : ""} ${isSelected ? "bg-surface-selected" : ""} ${className}`}
      onClick={handleClick}
      style={style}
      {...props}
    >
      {selectable && (
        <td
          className={`${getSpacingClass("lg", "px")} ${getSpacingClass("base", "py")}`}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => toggleRowSelection(id)}
            aria-label={`Select row ${id}`}
            className={getSpacingClass("none", "my")}
          />
        </td>
      )}

      {columns.map((column) => (
        <TableCell key={String(column.key)} column={column} row={row} />
      ))}

      {actions && (
        <td
          className={`${getSpacingClass("lg", "px")} ${getSpacingClass("base", "py")} text-right`}
        >
          <TableActions row={row} />
        </td>
      )}
    </tr>
  );
}
