'use client';

import type { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  hiddenOnMobile?: boolean;
}
