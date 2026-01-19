'use client';

/**
 * useFlowStyles Hook
 * 
 * Hook for accessing and managing Flow CSS variables and theming.
 */

import { useFlowStyleContext, useFlowStyleContextOptional } from '../context/FlowStyleContext';
import type { FlowThemeVariables, ThemeMode } from '../styles/flow-theme';

/**
 * Flow Styles Hook Return
 */
export interface UseFlowStylesReturn {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // CSS Variables
  variables: FlowThemeVariables;
  getVariable: (key: keyof FlowThemeVariables) => string;
  setVariable: (key: keyof FlowThemeVariables, value: string) => void;
  setVariables: (variables: Partial<FlowThemeVariables>) => void;
  
  // CSS Variable helpers
  getCSSVariable: (cssVarName: string) => string;
  setCSSVariable: (cssVarName: string, value: string) => void;
  
  // Theme operations
  applyTheme: (theme: ThemeMode, overrides?: Partial<FlowThemeVariables>) => void;
  resetTheme: () => void;
  
  // Convenience getters
  getNodeColor: () => string;
  getNodeBackgroundColor: () => string;
  getEdgeStroke: () => string;
  getHandleBackgroundColor: () => string;
}

/**
 * Hook for accessing and managing Flow styles
 */
export function useFlowStyles(): UseFlowStylesReturn {
  const context = useFlowStyleContext();
  
  // CSS Variable helpers
  const setCSSVariable = (cssVarName: string, value: string): void => {
    document.documentElement.style.setProperty(cssVarName, value);
  };
  
  // Convenience getters
  const getNodeColor = (): string => {
    return context.getVariable('nodeColor');
  };
  
  const getNodeBackgroundColor = (): string => {
    return context.getVariable('nodeBackgroundColor');
  };
  
  const getEdgeStroke = (): string => {
    return context.getVariable('edgeStroke');
  };
  
  const getHandleBackgroundColor = (): string => {
    return context.getVariable('handleBackgroundColor');
  };
  
  return {
    ...context,
    setCSSVariable,
    getNodeColor,
    getNodeBackgroundColor,
    getEdgeStroke,
    getHandleBackgroundColor,
  };
}

/**
 * Optional hook for accessing Flow styles (returns null if provider not available)
 */
export function useFlowStylesOptional(): UseFlowStylesReturn | null {
  const context = useFlowStyleContextOptional();
  
  if (!context) {
    return null;
  }
  
  // CSS Variable helpers
  const setCSSVariable = (cssVarName: string, value: string): void => {
    document.documentElement.style.setProperty(cssVarName, value);
  };
  
  // Convenience getters
  const getNodeColor = (): string => {
    return context.getVariable('nodeColor');
  };
  
  const getNodeBackgroundColor = (): string => {
    return context.getVariable('nodeBackgroundColor');
  };
  
  const getEdgeStroke = (): string => {
    return context.getVariable('edgeStroke');
  };
  
  const getHandleBackgroundColor = (): string => {
    return context.getVariable('handleBackgroundColor');
  };
  
  return {
    ...context,
    setCSSVariable,
    getNodeColor,
    getNodeBackgroundColor,
    getEdgeStroke,
    getHandleBackgroundColor,
  };
}
