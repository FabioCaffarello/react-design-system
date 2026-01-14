import { useState, useCallback, useEffect, useRef } from 'react';

export interface PlaygroundState<T = Record<string, unknown>> {
  config: T;
  version: string;
  timestamp: number;
}

export interface UsePlaygroundStateOptions<T> {
  initialState: T;
  storageKey?: string;
  validate?: (config: T) => boolean | string;
  onStateChange?: (state: T) => void;
}

export interface UsePlaygroundStateReturn<T> {
  state: T;
  setState: (updater: T | ((prev: T) => T)) => void;
  updateState: (key: keyof T, value: unknown) => void;
  reset: () => void;
  isValid: boolean;
  validationError?: string;
}

/**
 * usePlaygroundState Hook
 * 
 * Centralized state management for playgrounds with validation and persistence.
 * 
 * @example
 * ```tsx
 * const { state, setState, updateState, reset, isValid } = usePlaygroundState({
 *   initialState: { primary: '#6366f1', spacing: 'base' },
 *   storageKey: 'theme-playground',
 *   validate: (config) => config.primary !== undefined,
 * });
 * ```
 */
export function usePlaygroundState<T extends Record<string, unknown>>({
  initialState,
  storageKey,
  validate,
  onStateChange,
}: UsePlaygroundStateOptions<T>): UsePlaygroundStateReturn<T> {
  const [state, setStateInternal] = useState<T>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.config || initialState;
        }
      } catch (err) {
        console.warn('Failed to load state from storage:', err);
      }
    }
    return initialState;
  });

  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string | undefined>();
  const prevStateRef = useRef<T>(state);

  // Validate state
  useEffect(() => {
    if (validate) {
      const result = validate(state);
      if (result === true) {
        setIsValid(true);
        setValidationError(undefined);
      } else {
        setIsValid(false);
        setValidationError(typeof result === 'string' ? result : 'Validation failed');
      }
    } else {
      setIsValid(true);
      setValidationError(undefined);
    }
  }, [state, validate]);

  // Persist to localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined' && state !== prevStateRef.current) {
      try {
        const playgroundState: PlaygroundState<T> = {
          config: state,
          version: '1.0.0',
          timestamp: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(playgroundState));
        prevStateRef.current = state;
      } catch (err) {
        console.warn('Failed to save state to storage:', err);
      }
    }
  }, [state, storageKey]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && state !== prevStateRef.current) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  const setState = useCallback((updater: T | ((prev: T) => T)) => {
    setStateInternal((prev) => {
      if (typeof updater === 'function') {
        return (updater as (prev: T) => T)(prev);
      }
      return updater;
    });
  }, []);

  const updateState = useCallback((key: keyof T, value: unknown) => {
    setStateInternal((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setStateInternal(initialState);
  }, [initialState]);

  return {
    state,
    setState,
    updateState,
    reset,
    isValid,
    validationError,
  };
}
