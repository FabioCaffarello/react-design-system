'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { TabsContext, type TabsContextValue } from './TabsContext';

export interface TabsProviderProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  children: ReactNode;
}

/**
 * TabsProvider Component
 * 
 * Provides Tabs context to children.
 * Manages active tab state and handles controlled/uncontrolled modes.
 */
export function TabsProvider({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  children,
}: TabsProviderProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue || '');

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback((newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isControlled, onValueChange]);

  const contextValue: TabsContextValue = {
    value,
    onValueChange: handleValueChange,
    orientation,
    activationMode,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
}
