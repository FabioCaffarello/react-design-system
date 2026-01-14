import { useMemo } from 'react';
import type { CodeFormat } from '../PlaygroundControls/CodeDisplay';

export interface UsePlaygroundCodeOptions<T> {
  state: T;
  format: CodeFormat;
  playgroundName: string;
  generateCode: (state: T, format: CodeFormat) => string;
}

export interface UsePlaygroundCodeReturn {
  code: string;
  formats: CodeFormat[];
  setFormat: (format: CodeFormat) => void;
}

/**
 * usePlaygroundCode Hook
 * 
 * Code generation for playground states in multiple formats.
 * 
 * @example
 * ```tsx
 * const { code, formats, setFormat } = usePlaygroundCode({
 *   state: { primary: '#6366f1', spacing: 'base' },
 *   format: 'typescript',
 *   playgroundName: 'theme',
 *   generateCode: (state, format) => {
 *     if (format === 'typescript') {
 *       return `const theme = { primary: '${state.primary}' };`;
 *     }
 *     return '';
 *   },
 * });
 * ```
 */
export function usePlaygroundCode<T>({
  state,
  format,
  playgroundName,
  generateCode,
}: UsePlaygroundCodeOptions<T>): UsePlaygroundCodeReturn {
  const formats: CodeFormat[] = ['typescript', 'css', 'tailwind', 'json'];

  const code = useMemo(() => {
    try {
      return generateCode(state, format);
    } catch (err) {
      console.error('Failed to generate code:', err);
      return `// Error generating ${format} code`;
    }
  }, [state, format, generateCode]);

  const setFormat = (newFormat: CodeFormat) => {
    // Format change would be handled by parent component
    // This is just for type safety
  };

  return {
    code,
    formats,
    setFormat,
  };
}
