"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { TableProvider, type TableProviderProps } from "./TableProvider";
import type { FilterConfig, FilterValue } from "./TableFilters/TableFilters";
import type { TableAction } from "./TableActions/TableActions";
import type { TableColumn } from "./TableTypes";
import TableHeader from "./TableHeader";
import TableHeaderRow from "./TableHeaderRow";
import TableHeaderCell from "./TableHeaderCell";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import TableFilters from "./TableFilters";
import TablePagination from "./TablePagination";
import TableEmptyState from "./TableEmptyState";
import TableActions from "./TableActions";

export type { TableColumn } from "./TableTypes";

// API Simplificada Props (backward compatible)
interface SimplifiedTableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<HTMLAttributes<HTMLDivElement>, "onSort" | "children"> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  emptyMessage?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIllustration?: ReactNode;
  emptyStateAction?: ReactNode;

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
    config: FilterConfig[];
    onFilter: (filters: Record<string, FilterValue>) => void;
    initialValues?: Record<string, FilterValue>;
  };

  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  rowId?: (row: T) => string;

  // Actions
  actions?: (row: T) => TableAction<T>[];

  // Row click callback
  onRowClick?: (row: T) => void;

  // Pagination mode
  paginationMode?: "client" | "server" | "auto";
  defaultPageSize?: number;

  // Column resizing
  resizable?: boolean;
  columnWidths?: Record<string, number>;
  onColumnResize?: (columnKey: string, width: number) => void;

  // Virtual scrolling
  virtualScrolling?: boolean;
  virtualScrollingOptions?: {
    itemHeight?: number;
    containerHeight?: number;
    overscan?: number;
  };

  "aria-label"?: string;
  "aria-labelledby"?: string;

  children?: never; // Simplified API doesn't accept children
}

// API Declarativa Props (compound components)
interface DeclarativeTableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<TableProviderProps<T>, "children"> {
  children: ReactNode; // Declarative API requires children
}

type TableProps<T extends Record<string, unknown> = Record<string, unknown>> =
  | SimplifiedTableProps<T>
  | DeclarativeTableProps<T>;

/**
 * Table Component
 *
 * A comprehensive table component with sorting, pagination, filters, selection, and actions.
 * Supports both simplified API (props-based) and declarative API (compound components).
 *
 * @example
 * ```tsx
 * // Simplified API
 * <Table
 *   columns={columns}
 *   data={data}
 *   pagination={{ page, pageSize, total, onPageChange }}
 * />
 *
 * // Declarative API
 * <Table columns={columns} data={data}>
 *   <Table.Filters />
 *   <Table.Header />
 *   <Table.Body />
 *   <Table.Pagination />
 * </Table>
 * ```
 */
function TableComponent<T = unknown>(props: TableProps<T>) {
  const { className = "", ...restProps } = props;
  const hasChildren = "children" in props && props.children !== undefined;

  // Convert simplified API props to provider props
  const providerProps: TableProviderProps<T> = hasChildren
    ? (restProps as DeclarativeTableProps<T>)
    : convertSimplifiedToProviderProps(restProps as SimplifiedTableProps<T>);

  // If children are provided, use declarative API
  if (hasChildren) {
    return (
      <div
        className={`bg-surface-base shadow rounded-lg overflow-hidden ${className}`}
      >
        <TableProvider {...providerProps}>{props.children}</TableProvider>
      </div>
    );
  }

  // Otherwise, use simplified API with default structure
  return (
    <div
      className={`bg-surface-base shadow rounded-lg overflow-hidden ${className}`}
    >
      <TableProvider {...providerProps}>
        {providerProps.filters && providerProps.filters.length > 0 && (
          <TableFilters />
        )}
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-line-default"
            role="table"
            aria-label={props["aria-label"]}
            aria-labelledby={props["aria-labelledby"]}
            aria-rowcount={providerProps.total || providerProps.data.length}
            aria-colcount={
              providerProps.columns.length +
              (providerProps.selectable ? 1 : 0) +
              (providerProps.actions ? 1 : 0)
            }
          >
            <TableHeader />
            <TableBody />
          </table>
        </div>
        {/* Show pagination - TablePagination component will decide if it should render based on totalPages */}
        <TablePagination />
      </TableProvider>
    </div>
  );
}

// Helper to convert simplified API props to provider props
function convertSimplifiedToProviderProps<T extends Record<string, unknown>>(
  props: SimplifiedTableProps<T>,
): TableProviderProps<T> {
  const {
    columns,
    data,
    loading,
    onSort,
    sortColumn,
    sortDirection,
    emptyMessage,
    emptyStateTitle,
    emptyStateMessage,
    emptyStateIllustration,
    emptyStateAction,
    pagination,
    filters,
    selectable,
    selectedRows,
    onSelectionChange,
    rowId,
    actions,
    onRowClick,
    paginationMode,
    defaultPageSize,
    resizable,
    columnWidths,
    onColumnResize,
    virtualScrolling,
    virtualScrollingOptions,
  } = props;

  // Determine pagination mode
  let mode: "client" | "server" | "auto" = paginationMode || "auto";
  if (mode === "auto") {
    mode =
      pagination && pagination.total !== undefined && pagination.onPageChange
        ? "server"
        : "client";
  }

  return {
    columns,
    data,
    loading,
    paginationMode: mode,
    page: pagination?.page,
    pageSize: pagination?.pageSize,
    total: pagination?.total,
    onPageChange: pagination?.onPageChange,
    onPageSizeChange: pagination?.onPageSizeChange,
    defaultPageSize: defaultPageSize || pagination?.pageSize || 10,
    pageSizeOptions: pagination?.pageSizeOptions,
    sortColumn,
    sortDirection,
    onSort,
    filters: filters?.config,
    filterValues: filters?.initialValues,
    onFilter: filters?.onFilter,
    initialFilterValues: filters?.initialValues,
    selectable,
    selectedRows,
    onSelectionChange,
    rowId,
    actions,
    onRowClick,
    emptyMessage,
    emptyStateTitle,
    emptyStateMessage,
    emptyStateIllustration,
    emptyStateAction,
    resizable,
    columnWidths,
    onColumnResize,
    virtualScrolling,
    virtualScrollingOptions,
    children: <></>, // Placeholder, will be overridden by default structure
  };
}

// Compound Components
TableComponent.Header = TableHeader;
TableComponent.HeaderRow = TableHeaderRow;
TableComponent.HeaderCell = TableHeaderCell;
TableComponent.Body = TableBody;
TableComponent.Row = TableRow;
TableComponent.Cell = TableCell;
TableComponent.Filters = TableFilters;
TableComponent.Pagination = TablePagination;
TableComponent.EmptyState = TableEmptyState;
TableComponent.Actions = TableActions;

export default TableComponent;
