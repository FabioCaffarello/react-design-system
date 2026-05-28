"use client";

import type { HTMLAttributes } from "react";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { Button } from "../../../primitives";
import { MoreVertical } from "lucide-react";

export interface TableAction<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TableActionsProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends HTMLAttributes<HTMLDivElement> {
  actions: TableAction<T>[];
  row: T;
  align?: "left" | "right";
}

/**
 * TableActions Component
 *
 * Dropdown menu for row actions in tables.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <TableActions
 *   row={rowData}
 *   actions={[
 *     { label: 'Edit', onClick: (row) => handleEdit(row) },
 *     { label: 'Delete', onClick: (row) => handleDelete(row), variant: 'danger' },
 *   ]}
 * />
 * ```
 */
export default function TableActions<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  actions,
  row,
  align = "right",
  className = "",
  ...props
}: TableActionsProps<T>) {
  const dropdownItems = actions.map((action) => ({
    label: action.label,
    onClick: () => action.onClick(row),
    variant: action.variant,
    disabled: action.disabled,
  }));

  return (
    <div className={`inline-flex ${className}`} {...props}>
      <Dropdown
        trigger={
          <Button
            variant="ghost"
            size="sm"
            aria-label="Row actions"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        }
        items={dropdownItems}
        align={align}
      />
    </div>
  );
}
