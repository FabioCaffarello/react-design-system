'use client';

import { createContext, useContext } from 'react';

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

/**
 * Hook to access Tabs context
 * 
 * @throws Error if used outside of Tabs component
 */
export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  
  if (context === undefined) {
    throw new Error('useTabsContext must be used within a Tabs component');
  }
  
  return context;
}

/**
 * Hook to access Tabs context (optional, returns undefined if not in Tabs)
 */
export function useTabsContextOptional(): TabsContextValue | undefined {
  return useContext(TabsContext);
}

export { TabsContext };
