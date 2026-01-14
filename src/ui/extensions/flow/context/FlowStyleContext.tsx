/**
 * Flow Style Context
 * 
 * Context for managing CSS variables and theming.
 */

'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  getFlowTheme,
  themeToCSSVariables,
  applyFlowTheme,
  type FlowThemeVariables,
  type ThemeMode,
} from '../styles/flow-theme';

/**
 * Flow Style Context Value
 */
export interface FlowStyleContextValue {
  // Theme state
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // CSS Variables
  variables: FlowThemeVariables;
  setVariable: (key: keyof FlowThemeVariables, value: string) => void;
  setVariables: (variables: Partial<FlowThemeVariables>) => void;
  
  // Theme operations
  applyTheme: (theme: ThemeMode, overrides?: Partial<FlowThemeVariables>) => void;
  resetTheme: () => void;
  
  // CSS variable helpers
  getVariable: (key: keyof FlowThemeVariables) => string;
  getCSSVariable: (cssVarName: string) => string;
}

const FlowStyleContext = createContext<FlowStyleContextValue | undefined>(undefined);

/**
 * Hook to access Flow Style context
 */
export function useFlowStyleContext(): FlowStyleContextValue {
  const context = useContext(FlowStyleContext);
  if (context === undefined) {
    throw new Error('useFlowStyleContext must be used within FlowStyleProvider');
  }
  return context;
}

/**
 * Optional hook to access Flow Style context (returns undefined if not available)
 */
export function useFlowStyleContextOptional(): FlowStyleContextValue | undefined {
  return useContext(FlowStyleContext);
}

/**
 * Flow Style Provider Props
 */
export interface FlowStyleProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
  initialOverrides?: Partial<FlowThemeVariables>;
  onThemeChange?: (theme: ThemeMode) => void;
}

/**
 * Flow Style Provider
 * 
 * Provides CSS variables and theming functionality.
 */
export function FlowStyleProvider({
  children,
  initialTheme = 'light',
  initialOverrides,
  onThemeChange,
}: FlowStyleProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [overrides, setOverrides] = useState<Partial<FlowThemeVariables>>(initialOverrides || {});
  
  // Get theme variables
  const variables = useMemo(() => {
    return getFlowTheme(theme, overrides);
  }, [theme, overrides]);
  
  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const cssVariables = themeToCSSVariables(variables);
    
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Add/remove dark class
    if (theme === 'dark') {
      root.classList.add('xy-flow', 'dark');
    } else {
      root.classList.remove('dark');
    }
  }, [variables, theme]);
  
  // Set theme
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    onThemeChange?.(newTheme);
  }, [onThemeChange]);
  
  // Set single variable
  const setVariable = useCallback((key: keyof FlowThemeVariables, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  // Set multiple variables
  const setVariables = useCallback((newVariables: Partial<FlowThemeVariables>) => {
    setOverrides((prev) => ({
      ...prev,
      ...newVariables,
    }));
  }, []);
  
  // Apply theme with overrides
  const applyTheme = useCallback((newTheme: ThemeMode, newOverrides?: Partial<FlowThemeVariables>) => {
    setThemeState(newTheme);
    if (newOverrides) {
      setOverrides(newOverrides);
    }
    onThemeChange?.(newTheme);
  }, [onThemeChange]);
  
  // Reset theme
  const resetTheme = useCallback(() => {
    setThemeState(initialTheme);
    setOverrides(initialOverrides || {});
  }, [initialTheme, initialOverrides]);
  
  // Get variable value
  const getVariable = useCallback((key: keyof FlowThemeVariables): string => {
    return variables[key];
  }, [variables]);
  
  // Get CSS variable value
  const getCSSVariable = useCallback((cssVarName: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  }, []);
  
  const contextValue = useMemo<FlowStyleContextValue>(() => ({
    theme,
    setTheme,
    variables,
    setVariable,
    setVariables,
    applyTheme,
    resetTheme,
    getVariable,
    getCSSVariable,
  }), [theme, setTheme, variables, setVariable, setVariables, applyTheme, resetTheme, getVariable, getCSSVariable]);
  
  return (
    <FlowStyleContext.Provider value={contextValue}>
      {children}
    </FlowStyleContext.Provider>
  );
}
