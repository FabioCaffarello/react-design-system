import { useState, useEffect, useRef } from 'react';

/**
 * usePlaygroundDebounce Hook
 * 
 * Debounce values for performance optimization in playgrounds.
 * 
 * @example
 * ```tsx
 * const debouncedValue = usePlaygroundDebounce(value, 300);
 * ```
 */
export function usePlaygroundDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
