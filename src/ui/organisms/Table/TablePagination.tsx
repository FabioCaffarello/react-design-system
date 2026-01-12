'use client';

import type { HTMLAttributes } from 'react';
import { useTableContext } from './TableContext';
import TablePaginationComponent from './TablePagination/TablePagination';

export interface TablePaginationProps extends HTMLAttributes<HTMLDivElement> {
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  pageSizeOptions?: number[];
}

/**
 * TablePagination Component
 * 
 * Renders pagination controls for the table.
 * Uses pagination state from Table context.
 * Must be used within a Table component.
 */
export default function TablePagination({
  showPageSizeSelector = true,
  showPageInfo = true,
  pageSizeOptions,
  className = '',
  ...props
}: TablePaginationProps) {
  const { paginationState, setPage, setPageSize, paginationMode } = useTableContext();

  // Only show pagination if there's more than one page or if in server mode
  if (paginationMode === 'client' && paginationState.totalPages <= 1) {
    return null;
  }

  return (
    <TablePaginationComponent
      page={paginationState.page}
      pageSize={paginationState.pageSize}
      total={paginationState.total}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      pageSizeOptions={pageSizeOptions}
      showPageSizeSelector={showPageSizeSelector}
      showPageInfo={showPageInfo}
      className={className}
      {...props}
    />
  );
}
