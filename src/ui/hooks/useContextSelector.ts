'use client';

import { useContext, useMemo, useRef, useEffect, type Context } from 'react';
import { shallowEqual } from './shallowEqual';

/**
 * Hook to use context with selector for optimized performance
 * 
 * This hook allows selecting only specific parts of a context value,
 * preventing unnecessary re-renders when other parts of the context change.
 * 
 * @template TContext - The context value type
 * @template TSelected - The selected value type
 * 
 * @param context - React context to use
 * @param selector - Function to select part of context value
 * @param equalityFn - Optional equality function for comparison (defaults to shallowEqual)
 * 
 * @returns Selected value from context
 * 
 * @example
 * ```tsx
 * // Instead of:
 * const { page, pageSize, sortColumn } = useTableContext(); // re-render on any change
 * 
 * // Use:
 * const page = useContextSelector(TableContext, state => state.paginationState.page);
 * const sortColumn = useContextSelector(TableContext, state => state.sortState.column);
 * // Only re-renders when the selected values change
 * ```
 */
export function useContextSelector<TContext, TSelected>(
  context: React.Context<TContext>,
  selector: (value: TContext) => TSelected,
  equalityFn: (a: TSelected, b: TSelected) => boolean = shallowEqual
): TSelected {
  const contextValue = useContext(context);
  
  // Get selected value
  const selected = selector(contextValue);
  
  // Store previous selected value for comparison
  const prevSelectedRef = useRef<TSelected>(selected);
  const selectorRef = useRef(selector);
  
  // Update selector ref
  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);
  
  // Memoize selected value with equality check
  const memoizedSelected = useMemo(() => {
    const currentSelected = selectorRef.current(contextValue);
    
    // Compare with previous value
    if (equalityFn(prevSelectedRef.current, currentSelected)) {
      return prevSelectedRef.current;
    }
    
    prevSelectedRef.current = currentSelected;
    return currentSelected;
  }, [contextValue, equalityFn]);
  
  return memoizedSelected;
}

/**
 * Hook to use multiple context selectors
 * 
 * Allows selecting multiple values from a context in a single hook call.
 * 
 * @template TContext - The context value type
 * @template TSelected - The selected values type
 * 
 * @param context - React context to use
 * @param selectors - Object with selector functions
 * 
 * @returns Object with selected values
 * 
 * @example
 * ```tsx
 * const { page, sortColumn } = useContextSelectors(TableContext, {
 *   page: state => state.paginationState.page,
 *   sortColumn: state => state.sortState.column,
 * });
 * ```
 */
export function useContextSelectors<TContext, TSelected extends Record<string, unknown>>(
  context: Context<TContext>,
  selectors: { [K in keyof TSelected]: (value: TContext) => TSelected[K] }
): TSelected {
  const contextValue = useContext(context);
  
  return useMemo(() => {
    const result = {} as TSelected;
    
    for (const key in selectors) {
      result[key] = selectors[key](contextValue);
    }
    
    return result;
  }, [contextValue, selectors]);
}
