'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { TableContext, type TableContextValue, type PaginationMode } from './TableContext';
import type { TableColumn } from './TableTypes';
import type { FilterConfig, FilterValue } from './TableFilters/TableFilters';
import type { TableAction } from './TableActions/TableActions';

export interface TableProviderProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  
  // Pagination
  paginationMode?: PaginationMode;
  page?: number; // controlled
  pageSize?: number; // controlled
  total?: number; // required for server mode
  onPageChange?: (page: number) => void; // required for server mode
  onPageSizeChange?: (size: number) => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  
  // Sorting
  sortColumn?: string; // controlled
  sortDirection?: 'asc' | 'desc'; // controlled
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
  
  // Filters
  filters?: FilterConfig[];
  filterValues?: Record<string, FilterValue>; // controlled
  onFilter?: (filters: Record<string, FilterValue>) => void;
  initialFilterValues?: Record<string, FilterValue>;
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[]; // controlled
  onSelectionChange?: (selected: string[]) => void;
  rowId?: (row: T) => string;
  
  // Actions
  actions?: (row: T) => TableAction<T>[];
  
  // Empty state
  emptyMessage?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateIllustration?: ReactNode;
  emptyStateAction?: ReactNode;
  
  // Callbacks
  onRowClick?: (row: T) => void;
  
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
  
  children: ReactNode;
}

/**
 * TableProvider Component
 * 
 * Manages table state (pagination, sorting, filters, selection) and provides it via Context.
 * Supports both client-side and server-side pagination with auto-detection.
 */
export function TableProvider<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  paginationMode: explicitMode,
  page: controlledPage,
  pageSize: controlledPageSize,
  total: externalTotal,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = 10,
  pageSizeOptions: _pageSizeOptions,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSort,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  filters,
  filterValues: controlledFilterValues,
  onFilter,
  initialFilterValues = {},
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  rowId,
  actions,
  emptyMessage = "No data available",
  emptyStateTitle,
  emptyStateMessage,
  emptyStateIllustration,
  emptyStateAction,
  onRowClick,
  resizable = false,
  columnWidths,
  onColumnResize,
  virtualScrolling,
  virtualScrollingOptions: _virtualScrollingOptions,
  children,
}: TableProviderProps<T>) {
  // Detect pagination mode
  const paginationMode: PaginationMode = useMemo(() => {
    if (explicitMode) return explicitMode;
    
    // Auto-detect: if total and onPageChange are provided, it's server-side
    if (externalTotal !== undefined && onPageChange) {
      return 'server';
    }
    
    return 'client';
  }, [explicitMode, externalTotal, onPageChange]);

  // Pagination state
  const isPaginationControlled = controlledPage !== undefined;
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  
  const page = isPaginationControlled ? controlledPage! : internalPage;
  const pageSize = controlledPageSize ?? internalPageSize;
  
  const total = useMemo(() => {
    if (paginationMode === 'server') {
      return externalTotal ?? 0;
    }
    return data.length;
  }, [paginationMode, externalTotal, data.length]);
  
  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  // Sorting state
  const isSortingControlled = controlledSortColumn !== undefined;
  const [internalSortColumn, setInternalSortColumn] = useState(defaultSortColumn || '');
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  
  const sortColumn = isSortingControlled ? controlledSortColumn! : internalSortColumn;
  const sortDirection = isSortingControlled ? (controlledSortDirection || 'asc') : internalSortDirection;

  // Filter state
  const isFilterControlled = controlledFilterValues !== undefined;
  const [internalFilterValues, setInternalFilterValues] = useState<Record<string, unknown>>(initialFilterValues);
  
  const filterValues = isFilterControlled ? controlledFilterValues! : internalFilterValues;

  // Selection state
  const isSelectionControlled = controlledSelectedRows !== undefined;
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);
  
  const selectedRows = isSelectionControlled ? controlledSelectedRows! : internalSelectedRows;

  // Apply client-side filtering
  const filteredData = useMemo(() => {
    if (!filters || filters.length === 0) return data;
    
    return data.filter((row) => {
      return filters.every((filter) => {
        const value = filterValues[filter.key];
        if (!value || value === '') return true;
        
        const rowValue = (row as unknown)[filter.key];
        if (filter.type === 'text') {
          return String(rowValue || '').toLowerCase().includes(String(value).toLowerCase());
        }
        return String(rowValue) === String(value);
      });
    });
  }, [data, filters, filterValues]);

  // Apply client-side sorting (only if not controlled externally)
  const sortedData = useMemo(() => {
    // If sorting is controlled externally (onSort provided), don't sort here
    // The parent component should handle sorting on the server or before passing data
    // However, we still apply sorting if sortColumn is set and no onSort callback
    if (isSortingControlled && onSort) {
      // When controlled, assume data is already sorted by parent
      return filteredData;
    }
    
    // Only apply internal sorting if sortColumn is set
    if (!sortColumn) return filteredData;
    
    // Apply internal sorting
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = (a as unknown)[sortColumn];
      const bValue = (b as unknown)[sortColumn];
      const comparison = String(aValue || '').localeCompare(String(bValue || ''));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredData, sortColumn, sortDirection, onSort, isSortingControlled]);

  // Apply client-side pagination
  const paginatedData = useMemo(() => {
    if (paginationMode === 'server') {
      return sortedData; // Server already paginated
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, paginationMode, page, pageSize]);

  // Selection helpers
  const getRowId = useCallback((row: T, index: number): string => {
    if (rowId) {
      return rowId(row);
    }
    return (row as unknown)?.id?.toString() || index.toString();
  }, [rowId]);

  const isAllSelected = useMemo(() => {
    if (!selectable || paginatedData.length === 0) return false;
    return paginatedData.every((row, index) => {
      const id = getRowId(row, index);
      return selectedRows.includes(id);
    });
  }, [selectable, paginatedData, selectedRows, getRowId]);

  const isIndeterminate = useMemo(() => {
    if (!selectable) return false;
    const selectedCount = selectedRows.length;
    return selectedCount > 0 && selectedCount < paginatedData.length;
  }, [selectable, selectedRows.length, paginatedData.length]);

  // Methods
  const setPage = useCallback((newPage: number) => {
    if (isPaginationControlled) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  }, [isPaginationControlled, onPageChange]);

  const setPageSize = useCallback((newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setInternalPageSize(newSize);
    }
    setPage(1); // Reset to first page
  }, [onPageSizeChange, setPage]);

  const setSorting = useCallback((column: string, direction: 'asc' | 'desc') => {
    if (isSortingControlled) {
      onSort?.(column, direction);
    } else {
      setInternalSortColumn(column);
      setInternalSortDirection(direction);
    }
  }, [isSortingControlled, onSort]);

  const setFilters = useCallback((newFilters: Record<string, FilterValue>) => {
    if (isFilterControlled) {
      onFilter?.(newFilters);
    } else {
      setInternalFilterValues(newFilters);
    }
    // Reset to first page when filters change
    setPage(1);
  }, [isFilterControlled, onFilter, setPage]);

  const setSelection = useCallback((selected: string[]) => {
    if (isSelectionControlled) {
      onSelectionChange?.(selected);
    } else {
      setInternalSelectedRows(selected);
    }
  }, [isSelectionControlled, onSelectionChange]);

  const toggleRowSelection = useCallback((rowId: string) => {
    const newSelected = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];
    setSelection(newSelected);
  }, [selectedRows, setSelection]);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelection([]);
    } else {
      const allIds = paginatedData.map((row, index) => getRowId(row, index));
      setSelection(allIds);
    }
  }, [isAllSelected, paginatedData, getRowId, setSelection]);

  // Column resizing state
  const [internalColumnWidths, setInternalColumnWidths] = useState<Record<string, number>>({});
  const isColumnWidthsControlled = columnWidths !== undefined;
  const finalColumnWidths = isColumnWidthsControlled ? columnWidths! : internalColumnWidths;

  const setColumnWidth = useCallback((columnKey: string, width: number) => {
    if (isColumnWidthsControlled) {
      onColumnResize?.(columnKey, width);
    } else {
      setInternalColumnWidths((prev) => ({
        ...prev,
        [columnKey]: width,
      }));
    }
  }, [isColumnWidthsControlled, onColumnResize]);

  // Use controlledColumnWidths from props if provided
  const _controlledColumnWidths = columnWidths;

  // Context value
  const contextValue: TableContextValue<T> = useMemo(() => ({
    columns,
    data,
    paginatedData,
    loading,
    paginationState: {
      page,
      pageSize,
      total,
      totalPages,
    },
    sortState: {
      column: sortColumn,
      direction: sortDirection,
    },
    filterState: {
      values: filterValues,
      config: filters || [],
    },
    selectionState: {
      selectedRows,
      isAllSelected,
      isIndeterminate,
    },
    paginationMode,
    selectable,
    rowId,
    actions,
    resizable,
    columnWidths: finalColumnWidths,
    virtualScrolling,
    emptyMessage,
    emptyStateTitle,
    emptyStateMessage,
    emptyStateIllustration,
    emptyStateAction,
    setPage,
    setPageSize,
    setSorting,
    setFilters,
    setSelection,
    toggleRowSelection,
    toggleSelectAll,
    getRowId,
    setColumnWidth,
    onPageChange,
    onPageSizeChange,
    onSort,
    onFilter,
    onSelectionChange,
    onRowClick,
    onColumnResize,
  }), [
    columns,
    data,
    paginatedData,
    loading,
    page,
    pageSize,
    total,
    totalPages,
    sortColumn,
    sortDirection,
    filterValues,
    filters,
    selectedRows,
    isAllSelected,
    isIndeterminate,
    paginationMode,
    selectable,
    rowId,
    actions,
    emptyMessage,
    emptyStateTitle,
    emptyStateMessage,
    emptyStateIllustration,
    emptyStateAction,
    setPage,
    setPageSize,
    setSorting,
    setFilters,
    setSelection,
    toggleRowSelection,
    toggleSelectAll,
    getRowId,
    setColumnWidth,
    onPageChange,
    onPageSizeChange,
    onSort,
    onFilter,
    onSelectionChange,
    onRowClick,
    onColumnResize,
    resizable,
    finalColumnWidths,
    virtualScrolling,
  ]);

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}
