'use client';

import type { HTMLAttributes } from 'react';
import { useTableContext } from './TableContext';
import TableHeaderRow from './TableHeaderRow';

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

/**
 * TableHeader Component
 * 
 * Renders the table header (thead) with columns.
 * Must be used within a Table component.
 */
export default function TableHeader({
  className = '',
  ...props
}: TableHeaderProps) {
  const { columns } = useTableContext();

  return (
    <thead className={`bg-gray-50 sticky top-0 z-10 ${className}`} {...props}>
      <TableHeaderRow />
    </thead>
  );
}
