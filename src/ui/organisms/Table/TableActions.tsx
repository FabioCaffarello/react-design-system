'use client';

import type { HTMLAttributes } from 'react';
import { useTableContext } from './TableContext';
import TableActionsComponent from './TableActions/TableActions';

export interface TableActionsProps<T extends Record<string, unknown> = Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
  row: T;
  align?: 'left' | 'right';
}

/**
 * TableActions Component
 * 
 * Renders action dropdown menu for a table row.
 * Uses actions configuration from Table context.
 * Must be used within a Table component.
 */
export default function TableActions<T extends Record<string, unknown> = Record<string, unknown>>({
  row,
  align = 'right',
  className = '',
  ...props
}: TableActionsProps<T>) {
  const { actions } = useTableContext<T>();

  if (!actions) {
    return null;
  }

  const rowActions = actions(row);

  if (rowActions.length === 0) {
    return null;
  }

  return (
    <TableActionsComponent
      row={row}
      actions={rowActions}
      align={align}
      className={className}
      {...props}
    />
  );
}
