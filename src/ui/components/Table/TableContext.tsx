"use client";

/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createGenericContext } from "../../hooks/createGenericContext";
import type { TableColumn } from "./TableTypes";
import type { FilterConfig } from "./TableFilters/TableFilters";
import type { TableAction } from "./TableActions/TableActions";

export type PaginationMode = "client" | "server" | "auto";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortState {
  column: string;
  direction: "asc" | "desc";
}

import type { FilterValue } from "./TableFilters/TableFilters";

export interface FilterState {
  values: Record<string, FilterValue>;
  config: FilterConfig[];
}

export interface SelectionState {
  selectedRows: string[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export interface TableContextValue<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  // Data
  columns: TableColumn<T>[];
  data: T[];
  paginatedData: T[];
  loading: boolean;

  // State
  paginationState: PaginationState;
  sortState: SortState;
  filterState: FilterState;
  selectionState: SelectionState;

  // Configuration
  paginationMode: PaginationMode;
  selectable: boolean;
  rowId?: (row: T) => string;
  actions?: (row: T) => TableAction<T>[];
  resizable?: boolean;
  columnWidths?: Record<string, number>;
  virtualScrolling?: boolean;
  virtualScrollingOptions?: {
    itemHeight?: number;
    containerHeight?: number;
    overscan?: number;
  };

  // Empty state
  emptyMessage?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIllustration?: ReactNode;
  emptyStateAction?: ReactNode;

  // Methods
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (column: string, direction: "asc" | "desc") => void;
  setFilters: (filters: Record<string, FilterValue>) => void;
  setSelection: (selected: string[]) => void;
  toggleRowSelection: (rowId: string) => void;
  toggleSelectAll: () => void;
  getRowId: (row: T, index: number) => string;
  setColumnWidth?: (columnKey: string, width: number) => void;

  // Callbacks (for controlled components)
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<string, FilterValue>) => void;
  onSelectionChange?: (selected: string[]) => void;
  onRowClick?: (row: T) => void;
  onColumnResize?: (columnKey: string, width: number) => void;
}

const tableContext = createGenericContext<TableContextValue>({
  displayName: "TableContext",
  errorMessage: "useTableContext must be used within a Table component",
});

/**
 * Raw React Context object. Exposed so `useContextSelector(TableContext, …)`
 * keeps working (see hooks/useContextSelector.ts, which cites Table as
 * its canonical selector consumer). Prefer the typed hooks below for
 * direct reads.
 */
export const TableContext = tableContext.Context;

/**
 * Internal Provider — consumed by `TableProvider.tsx` only. Not
 * re-exported from `Table/index.ts`; keeps the public surface unchanged.
 */
export const TableContextProvider = tableContext.Provider;

/**
 * Hook to access Table context
 *
 * @throws Error if used outside of Table component
 */
export function useTableContext<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): TableContextValue<T> {
  return tableContext.useContextRequired<TableContextValue<T>>();
}

/**
 * Hook to access Table context (optional, returns undefined if not in Table)
 */
export function useTableContextOptional<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): TableContextValue<T> | undefined {
  return tableContext.useContextOptional<TableContextValue<T>>();
}
