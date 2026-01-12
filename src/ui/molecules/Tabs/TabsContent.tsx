'use client';

import { useTabsContext } from './TabsContext';
import type { HTMLAttributes, ReactNode } from 'react';

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  forceMount?: boolean;
}

/**
 * TabsContent Component
 * 
 * Content panel for a tab.
 * Only renders when the tab is active (unless forceMount is true).
 * Must be used within a Tabs component.
 */
export function TabsContent({
  value,
  children,
  forceMount = false,
  className = '',
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();

  const isActive = activeValue === value;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={`
        mt-2
        focus:outline-none
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
