"use client";

import {
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import { useTableContext } from "./TableContext";
import { getSpacingClass } from "../../tokens/spacing";
import type { TableColumn } from "./TableTypes";

export interface TableHeaderCellProps
  extends HTMLAttributes<HTMLTableCellElement> {
  column: TableColumn;
  resizable?: boolean;
  width?: number;
  onResize?: (columnKey: string, width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * TableHeaderCell Component
 *
 * Renders a header cell (th) for a column.
 * Supports sorting if column is sortable.
 * Must be used within a Table component.
 */
export default function TableHeaderCell({
  column,
  resizable = false,
  width,
  onResize,
  minWidth = 50,
  maxWidth,
  className = "",
  ...props
}: TableHeaderCellProps) {
  const { sortState, setSorting, onSort } = useTableContext();
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  const handleSort = () => {
    if (!column.sortable || (!onSort && !setSorting)) return;

    const newDirection =
      sortState.column === column.key && sortState.direction === "asc"
        ? "desc"
        : "asc";

    if (onSort) {
      onSort(column.key, newDirection);
    } else {
      setSorting(column.key, newDirection);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
    if (!isSortable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSort();
    }
  };

  const handleResizeStart = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cellRef.current || !onResize) return;

    const currentWidth = width || cellRef.current.offsetWidth;
    resizeStartRef.current = {
      x: e.clientX,
      width: currentWidth,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = moveEvent.clientX - resizeStartRef.current.x;
      const newWidth = resizeStartRef.current.width + deltaX;
      const clampedWidth = Math.max(
        minWidth,
        maxWidth ? Math.min(newWidth, maxWidth) : newWidth,
      );

      onResize(column.key, clampedWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove as unknown);
      document.removeEventListener("mouseup", handleMouseUp);
      resizeStartRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove as unknown);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const isSorted = sortState.column === column.key;
  const isSortable = column.sortable && (onSort || setSorting);
  const sortDirection = isSorted ? sortState.direction : undefined;

  return (
    <th
      ref={cellRef}
      scope="col"
      role="columnheader"
      aria-sort={
        isSorted
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : isSortable
            ? "none"
            : undefined
      }
      className={`${getSpacingClass("lg", "px")} ${getSpacingClass("md", "py")} text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider ${
        isSortable
          ? "cursor-pointer hover:bg-surface-active focus:bg-surface-active focus:outline-none focus:ring-2 focus:ring-line-focus focus:ring-offset-2 select-none"
          : ""
      } ${column.hiddenOnMobile ? "hidden md:table-cell" : ""} ${className}`}
      onClick={isSortable ? handleSort : undefined}
      onKeyDown={isSortable ? handleKeyDown : undefined}
      tabIndex={isSortable ? 0 : undefined}
      style={
        width ? { width: `${width}px`, minWidth: `${width}px` } : undefined
      }
      {...props}
    >
      <div
        className={`flex items-center ${getSpacingClass("sm", "gap")} relative`}
      >
        <span>{column.label}</span>
        {isSorted && (
          <span className="text-fg-tertiary" aria-hidden="true">
            {sortState.direction === "asc" ? "↑" : "↓"}
          </span>
        )}
        {resizable && onResize && (
          <div
            ref={resizeHandleRef}
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-surface-brand transition-colors"
            onMouseDown={handleResizeStart}
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize ${column.label} column`}
            style={{ touchAction: "none" }}
          />
        )}
      </div>
    </th>
  );
}
