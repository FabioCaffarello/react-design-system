'use client';

import React, { useState, useMemo } from 'react';
import { Table } from '../../organisms';
import { Pagination, SearchInput } from '../../molecules';
import { Container } from '../../layouts/Container/Container';
import { Stack } from '../../layouts/Stack/Stack';
import type { TableColumn } from '../../organisms/Table/TableTypes';

// Extended TableColumn type for DataTablePattern (supports accessor and header for backward compatibility)
export interface DataTableColumn<T = unknown> extends Omit<TableColumn<T>, 'key' | 'label'> {
  key?: keyof T | string;
  label?: string;
  // Legacy support
  accessor?: keyof T | string | ((row: T) => unknown);
  header?: string;
}

export interface DataTablePatternProps<T = unknown> {
  /**
   * Table columns configuration
   * Supports both TableColumn format (key, label) and legacy format (accessor, header)
   */
  columns: DataTableColumn<T>[];
  /**
   * Table data rows
   */
  data: T[];
  /**
   * Search placeholder text
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * Enable search functionality
   * @default true
   */
  enableSearch?: boolean;
  /**
   * Items per page
   * @default 10
   */
  itemsPerPage?: number;
  /**
   * Enable pagination
   * @default true
   */
  enablePagination?: boolean;
  /**
   * Action buttons to display above the table
   */
  actions?: React.ReactNode;
  /**
   * Callback when row is clicked
   */
  onRowClick?: (row: T, index: number) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
}

/**
 * DataTablePattern - A complete data table pattern combining Table, Pagination, Search, and Actions
 * 
 * This pattern solves the common UX problem of displaying searchable, paginated data tables
 * with actions. It combines multiple components into a cohesive solution.
 * 
 * @example
 * ```tsx
 * <DataTablePattern
 *   columns={columns}
 *   data={data}
 *   enableSearch
 *   enablePagination
 *   actions={<Button>Export</Button>}
 * />
 * ```
 */
export function DataTablePattern<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  enableSearch = true,
  itemsPerPage = 10,
  enablePagination = true,
  actions,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}: DataTablePatternProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Convert columns to Table format (key/label from accessor/header if needed)
  const tableColumns: TableColumn<T>[] = useMemo(() => {
    return columns.map((column) => {
      // If using legacy format (accessor/header), convert to key/label
      if (column.accessor || column.header) {
        const key = column.key || (typeof column.accessor === 'string' ? column.accessor : String(column.accessor));
        const label = column.label || column.header || '';
        return {
          ...column,
          key: key as keyof T | string,
          label,
        } as TableColumn<T>;
      }
      // Otherwise use as-is (already in TableColumn format)
      return column as TableColumn<T>;
    });
  }, [columns]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return tableColumns.some((column) => {
        const value = (row as Record<string, unknown>)[String(column.key)];
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, tableColumns]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return filteredData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, enablePagination]);

  const totalPages = enablePagination
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <Container maxWidth="full" paddingX="base" paddingY="base">
      <Stack spacing="md">
        {/* Header with Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          {enableSearch && (
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onSearch={handleSearchChange}
              />
            </div>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Table */}
        <Table
          columns={tableColumns}
          data={paginatedData}
          loading={loading}
          emptyMessage={emptyMessage}
          onRowClick={onRowClick ? (row) => {
            // Find the index of the row in filteredData (not paginated) for accurate index
            const globalIndex = filteredData.findIndex((r) => r === row);
            onRowClick(row, globalIndex >= 0 ? globalIndex : paginatedData.findIndex((r) => r === row));
          } : undefined}
        />

        {/* Pagination */}
        {enablePagination && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Results count */}
        {enableSearch && (
          <div className="text-sm text-gray-600 text-center">
            Showing {paginatedData.length} of {filteredData.length} results
          </div>
        )}
      </Stack>
    </Container>
  );
}
