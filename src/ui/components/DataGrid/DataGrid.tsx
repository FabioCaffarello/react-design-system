"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Download, ArrowUpDown } from "lucide-react";
import Table, { type TableColumn } from "../Table/Table";
import Button from "../../primitives/Button/Button";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";
import type { TableAction } from "../Table/TableActions/TableActions";

export type DataGridColumn<T = unknown> = TableColumn<T> & {
  groupable?: boolean;
  exportable?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
};

export interface DataGridGroup {
  column: string;
  expanded?: boolean;
}

export interface DataGridProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: DataGridColumn<T>[];
  data: T[];
  loading?: boolean;

  // Sorting
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  multiSort?: boolean;

  // Grouping
  groups?: DataGridGroup[];
  onGroupChange?: (groups: DataGridGroup[]) => void;
  groupable?: boolean;

  // Column Management
  resizable?: boolean;
  reorderable?: boolean;
  onColumnReorder?: (columns: DataGridColumn<T>[]) => void;
  columnWidths?: Record<string, number>;
  onColumnResize?: (columnKey: string, width: number) => void;

  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  rowId?: (row: T) => string;

  // Export
  exportable?: boolean;
  onExport?: (format: "csv" | "xlsx" | "json") => void;
  exportFormats?: ("csv" | "xlsx" | "json")[];

  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
  };

  // Filters
  filters?: {
    config: unknown[];
    onFilter: (filters: Record<string, unknown>) => void;
    initialValues?: Record<string, unknown>;
  };

  // Actions
  actions?: (row: T) => TableAction<T>[];
  toolbarActions?: ReactNode;

  // Virtual Scrolling
  virtualScrolling?: boolean;
  virtualScrollingOptions?: {
    itemHeight?: number;
    containerHeight?: number;
    overscan?: number;
  };

  // Empty State
  emptyMessage?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIllustration?: ReactNode;
  emptyStateAction?: ReactNode;

  className?: string;
}

/**
 * DataGrid Component
 *
 * An advanced data grid component with sorting, filtering, grouping, column management, and export.
 * Extends the Table component with additional enterprise features.
 * Follows Atomic Design principles as an Organism component.
 *
 * @example
 * ```tsx
 * <DataGrid
 *   columns={columns}
 *   data={data}
 *   groupable
 *   exportable
 *   onExport={(format) => console.log('Export as', format)}
 * />
 * ```
 */
export default function DataGrid<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  columns,
  data,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  multiSort: _multiSort = false,
  groups = [],
  onGroupChange,
  groupable = false,
  resizable = true,
  reorderable: _reorderable = false,
  onColumnReorder: _onColumnReorder,
  columnWidths,
  onColumnResize,
  selectable = false,
  selectedRows,
  onSelectionChange,
  rowId,
  exportable = false,
  onExport,
  exportFormats = ["csv", "xlsx", "json"],
  pagination,
  filters,
  actions,
  toolbarActions,
  virtualScrolling = false,
  virtualScrollingOptions,
  emptyMessage,
  emptyStateTitle,
  emptyStateMessage,
  emptyStateIllustration,
  emptyStateAction,
  className = "",
}: DataGridProps<T>) {
  const [internalGroups, setInternalGroups] = useState<DataGridGroup[]>(groups);
  const [internalColumnWidths, setInternalColumnWidths] = useState<
    Record<string, number>
  >(columnWidths || {});

  // Convert DataGrid columns to Table columns
  const tableColumns: TableColumn<T>[] = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      width: internalColumnWidths[col.key] || col.defaultWidth,
    }));
  }, [columns, internalColumnWidths]);

  const _handleGroupToggle = (columnKey: string) => {
    const newGroups = internalGroups.map((g) =>
      g.column === columnKey ? { ...g, expanded: !g.expanded } : g,
    );
    setInternalGroups(newGroups);
    onGroupChange?.(newGroups);
  };

  const handleExport = (format: "csv" | "xlsx" | "json") => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export implementation
      if (format === "csv") {
        exportToCSV(data, columns);
      } else if (format === "json") {
        exportToJSON(data);
      }
    }
  };

  const exportToCSV = (data: T[], cols: DataGridColumn<T>[]) => {
    const headers = cols
      .filter((c) => c.exportable !== false)
      .map((c) => c.label || c.key);
    const rows = data.map((row) =>
      cols
        .filter((c) => c.exportable !== false)
        .map((c) => {
          const value = row[c.key];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        }),
    );

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: T[]) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      {(exportable || groupable || toolbarActions) && (
        <div
          className={`
          flex
          items-center
          justify-between
          ${getSpacingClass("base", "p")}
          bg-surface-base
          border
          border-line-default
          ${getRadiusClass("lg")}
        `}
        >
          <div className="flex items-center gap-2">
            {groupable && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowUpDown className="h-4 w-4" />}
              >
                Group
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {toolbarActions}
            {exportable && (
              <div className="flex items-center gap-1">
                {exportFormats.map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => handleExport(format)}
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        columns={tableColumns}
        data={data}
        loading={loading}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        pagination={pagination}
        filters={filters}
        selectable={selectable}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        rowId={rowId}
        actions={actions}
        resizable={resizable}
        columnWidths={internalColumnWidths}
        onColumnResize={(key, width) => {
          setInternalColumnWidths((prev) => ({ ...prev, [key]: width }));
          onColumnResize?.(key, width);
        }}
        virtualScrolling={virtualScrolling}
        virtualScrollingOptions={virtualScrollingOptions}
        emptyMessage={emptyMessage}
        emptyStateTitle={emptyStateTitle}
        emptyStateMessage={emptyStateMessage}
        emptyStateIllustration={emptyStateIllustration}
        emptyStateAction={emptyStateAction}
      />
    </div>
  );
}
