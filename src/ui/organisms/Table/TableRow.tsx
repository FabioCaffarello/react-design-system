'use client';

import type { HTMLAttributes } from 'react';
import { useTableContext } from './TableContext';
import { Checkbox } from '../../atoms';
import TableCell from './TableCell';
import TableActions from './TableActions';

export interface TableRowProps<T extends Record<string, unknown> = Record<string, unknown>> extends Omit<HTMLAttributes<HTMLTableRowElement>, 'style'> {
  row: T;
  rowIndex: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * TableRow Component
 * 
 * Renders a table row (tr) with cells.
 * Supports selection and row click.
 * Must be used within a Table component.
 */
export default function TableRow<T extends Record<string, unknown> = Record<string, unknown>>({
  row,
  rowIndex,
  className = '',
  onClick,
  style,
  ...props
}: TableRowProps<T>) {
  const {
    columns,
    selectable,
    selectionState,
    toggleRowSelection,
    getRowId,
    actions,
    onRowClick,
  } = useTableContext<T>();

  const id = getRowId(row, rowIndex);
  const isSelected = selectionState.selectedRows.includes(id);

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <tr
      role="row"
      aria-selected={selectable ? isSelected : undefined}
      aria-rowindex={rowIndex + 1}
      className={`hover:bg-gray-50 ${isSelected ? 'bg-indigo-50' : ''} ${className}`}
      onClick={handleClick}
      style={style}
      {...props}
    >
      {selectable && (
        <td className="px-6 py-4">
          <Checkbox
            checked={isSelected}
            onChange={() => toggleRowSelection(id)}
            aria-label={`Select row ${id}`}
            className="my-0"
          />
        </td>
      )}
      
      {columns.map((column) => (
        <TableCell key={column.key} column={column} row={row} />
      ))}
      
      {actions && (
        <td className="px-6 py-4 text-right">
          <TableActions row={row} />
        </td>
      )}
    </tr>
  );
}
