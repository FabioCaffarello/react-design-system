"use client";

import { useMemo, type HTMLAttributes, ReactNode } from "react";
import { useTableContext } from "./TableContext";
import { Skeleton } from "../../primitives";
import { getSpacingClass } from "../../tokens/spacing";
import TableRow from "./TableRow";
import TableEmptyState from "./TableEmptyState";
import { useVirtualScrolling } from "./useVirtualScrolling";

export interface TableBodyProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> {
  children?: (row: T, index: number) => ReactNode;
  className?: string;
}

/**
 * TableBody Component
 *
 * Renders the table body (tbody) with rows.
 * Can render loading skeleton, empty state, or data rows.
 * Must be used within a Table component.
 */
export default function TableBody({
  children,
  className = "",
  ...props
}: TableBodyProps) {
  const {
    paginatedData,
    loading,
    columns,
    selectable,
    actions,
    virtualScrolling,
    virtualScrollingOptions,
  } = useTableContext();

  // Calculate total columns for colspan
  const totalColumns =
    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  // Virtual scrolling
  const virtualScrollingResult = useVirtualScrolling(paginatedData, {
    itemHeight: virtualScrollingOptions?.itemHeight || 50,
    containerHeight: virtualScrollingOptions?.containerHeight,
    overscan: virtualScrollingOptions?.overscan || 5,
    enabled: virtualScrolling || false,
  });

  const rowsToRender = useMemo(() => {
    if (virtualScrolling && virtualScrollingResult.virtualItems.length > 0) {
      return virtualScrollingResult.virtualItems
        .map((item) => ({
          row: paginatedData[item.index],
          index: item.index,
        }))
        .filter((item) => item.row !== undefined);
    }
    return paginatedData.map((row, index) => ({ row, index }));
  }, [virtualScrolling, virtualScrollingResult.virtualItems, paginatedData]);

  if (loading) {
    return (
      <tbody
        className={`bg-surface-base divide-y divide-line-default ${className}`}
        {...props}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            {Array.from({ length: totalColumns }).map((_, colIndex) => (
              <td
                key={colIndex}
                className={`${getSpacingClass("lg", "px")} ${getSpacingClass("base", "py")}`}
              >
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <tbody
        className={`bg-surface-base divide-y divide-line-default ${className}`}
        {...props}
      >
        <tr>
          <td
            colSpan={totalColumns}
            className={`${getSpacingClass("lg", "px")} ${getSpacingClass("3xl", "py")}`}
          >
            <TableEmptyState />
          </td>
        </tr>
      </tbody>
    );
  }

  // If children is a render function, use it
  if (typeof children === "function") {
    return (
      <tbody
        className={`bg-surface-base divide-y divide-line-default ${className}`}
        {...props}
      >
        {paginatedData.map((row, index) => children(row, index))}
      </tbody>
    );
  }

  // Default: render TableRow for each data item
  return (
    <tbody
      className={`bg-surface-base divide-y divide-line-default ${className}`}
      role="rowgroup"
      {...props}
    >
      {virtualScrolling &&
      virtualScrollingResult.virtualItems.length > 0 &&
      rowsToRender.length > 0 ? (
        // Virtual scrolling: render with spacer rows
        <>
          {virtualScrollingResult.virtualItems[0]?.start > 0 && (
            <tr
              style={{ height: virtualScrollingResult.virtualItems[0].start }}
              aria-hidden="true"
            >
              <td colSpan={totalColumns} />
            </tr>
          )}
          {rowsToRender.map(({ row, index }) => (
            <TableRow key={index} row={row} rowIndex={index} />
          ))}
          {virtualScrollingResult.virtualItems.length > 0 && (
            <tr
              style={{
                height: Math.max(
                  0,
                  virtualScrollingResult.totalHeight -
                    (virtualScrollingResult.virtualItems[
                      virtualScrollingResult.virtualItems.length - 1
                    ]?.end || 0),
                ),
              }}
              aria-hidden="true"
            >
              <td colSpan={totalColumns} />
            </tr>
          )}
        </>
      ) : (
        // Normal rendering
        rowsToRender.map(({ row, index }) => (
          <TableRow key={index} row={row} rowIndex={index} />
        ))
      )}
    </tbody>
  );
}
