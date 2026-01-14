import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePlaygroundURLOptions<T> {
  initialState: T;
  serialize: (state: T) => Record<string, string>;
  deserialize: (params: URLSearchParams) => T;
  enabled?: boolean;
}

export interface UsePlaygroundURLReturn<T> {
  state: T;
  setState: (state: T) => void;
  shareUrl: string;
}

/**
 * usePlaygroundURL Hook
 * 
 * Bidirectional synchronization between playground state and URL parameters.
 * 
 * @example
 * ```tsx
 * const { state, setState, shareUrl } = usePlaygroundURL({
 *   initialState: { primary: '#6366f1', spacing: 'base' },
 *   serialize: (state) => ({
 *     primary: state.primary,
 *     spacing: state.spacing,
 *   }),
 *   deserialize: (params) => ({
 *     primary: params.get('primary') || '#6366f1',
 *     spacing: params.get('spacing') || 'base',
 *   }),
 * });
 * ```
 */
export function usePlaygroundURL<T>({
  initialState,
  serialize,
  deserialize,
  enabled = true,
}: UsePlaygroundURLOptions<T>): UsePlaygroundURLReturn<T> {
  const [state, setStateInternal] = useState<T>(() => {
    if (!enabled || typeof window === 'undefined') return initialState;
    try {
      const params = new URLSearchParams(window.location.search);
      return deserialize(params);
    } catch (err) {
      console.warn('Failed to deserialize URL params:', err);
      return initialState;
    }
  });

  const isUpdatingFromURLRef = useRef(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Update URL when state changes
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || isUpdatingFromURLRef.current) {
      return;
    }

    try {
      const serialized = serialize(state);
      const params = new URLSearchParams();
      Object.entries(serialized).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    } catch (err) {
      console.warn('Failed to serialize state to URL:', err);
    }
  }, [state, serialize, enabled]);

  // Update state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        isUpdatingFromURLRef.current = true;
        const params = new URLSearchParams(window.location.search);
        const newState = deserialize(params);
        setStateInternal(newState);
        setTimeout(() => {
          isUpdatingFromURLRef.current = false;
        }, 0);
      } catch (err) {
        console.warn('Failed to deserialize URL params:', err);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [deserialize, enabled]);

  const setState = useCallback(
    (newState: T) => {
      if (!isUpdatingFromURLRef.current) {
        setStateInternal(newState);
      }
    },
    []
  );

  return {
    state,
    setState,
    shareUrl,
  };
}
