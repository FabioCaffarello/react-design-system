import { useCallback } from 'react';
import type { PlaygroundState } from './usePlaygroundState';

export interface UsePlaygroundExportOptions<T> {
  playgroundName: string;
  state: T;
  version?: string;
}

export interface UsePlaygroundExportReturn {
  exportToJSON: (filename?: string) => void;
  importFromJSON: (file: File) => Promise<PlaygroundState>;
  exportToURL: () => string;
}

/**
 * usePlaygroundExport Hook
 * 
 * Export and import functionality for playground configurations.
 * 
 * @example
 * ```tsx
 * const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
 *   playgroundName: 'theme',
 *   state: { primary: '#6366f1' },
 * });
 * 
 * // Export
 * exportToJSON('my-theme.json');
 * 
 * // Import
 * const file = ...; // File input
 * const imported = await importFromJSON(file);
 * ```
 */
export function usePlaygroundExport<T extends Record<string, unknown>>({
  playgroundName,
  state,
  version = '1.0.0',
}: UsePlaygroundExportOptions<T>): UsePlaygroundExportReturn {
  const exportToJSON = useCallback(
    (filename?: string) => {
      try {
        const playgroundState: PlaygroundState<T> = {
          config: state,
          version,
          timestamp: Date.now(),
        };

        const json = JSON.stringify(playgroundState, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `${playgroundName}-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to export playground state:', err);
        throw err;
      }
    },
    [state, version, playgroundName]
  );

  const importFromJSON = useCallback(
    async (file: File): Promise<PlaygroundState<T>> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const parsed = JSON.parse(text) as PlaygroundState<T>;
            
            // Basic validation
            if (!parsed.config || !parsed.version) {
              throw new Error('Invalid playground state format');
            }

            resolve(parsed);
          } catch (err) {
            reject(new Error(`Failed to parse JSON: ${err instanceof Error ? err.message : 'Unknown error'}`));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    },
    []
  );

  const exportToURL = useCallback(() => {
    try {
      const playgroundState: PlaygroundState<T> = {
        config: state,
        version,
        timestamp: Date.now(),
      };

      const json = JSON.stringify(playgroundState);
      const encoded = encodeURIComponent(json);
      return `${window.location.origin}${window.location.pathname}?import=${encoded}`;
    } catch (err) {
      console.error('Failed to export to URL:', err);
      return window.location.href;
    }
  }, [state, version]);

  return {
    exportToJSON,
    importFromJSON,
    exportToURL,
  };
}
