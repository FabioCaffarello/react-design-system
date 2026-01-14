import { useState, memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Button } from '../../../atoms';
import { Card } from '../../../molecules';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';

export type CodeFormat = 'typescript' | 'css' | 'tailwind' | 'json';

export interface CodeDisplayProps {
  code: string;
  format?: CodeFormat;
  language?: string;
  title?: string;
  showCopyButton?: boolean;
  showFormatSelector?: boolean;
  onCopy?: (code: string) => void;
  className?: string;
}

/**
 * CodeDisplay Component
 * 
 * Code display with syntax highlighting, copy button, and format selector.
 * 
 * @example
 * ```tsx
 * <CodeDisplay
 *   code="const theme = { primary: '#6366f1' };"
 *   format="typescript"
 *   showCopyButton
 *   title="Generated Code"
 * />
 * ```
 */
export function CodeDisplay({
  code,
  format = 'typescript',
  language,
  title,
  showCopyButton = true,
  showFormatSelector = false,
  onCopy,
  className,
}: CodeDisplayProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const displayLanguage = language || format;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Card className={className}>
      {(title || showCopyButton) && (
        <div
          className={cn(
            'flex items-center justify-between',
            'p-4 border-b',
            isDark ? 'border-gray-700' : 'border-gray-200'
          )}
        >
          {title && (
            <h3
              className={cn(
                'm-0 font-semibold',
                isDark ? 'text-white' : 'text-gray-900'
              )}
              style={{ fontSize: '16px' }}
            >
              {title}
            </h3>
          )}
          <div className="flex items-center gap-2">
            {showFormatSelector && (
              <select
                className={cn(
                  'px-2 py-1 rounded text-sm border',
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
                value={format}
                onChange={(e) => {
                  // Format change would be handled by parent
                }}
              >
                <option value="typescript">TypeScript</option>
                <option value="css">CSS</option>
                <option value="tailwind">Tailwind</option>
                <option value="json">JSON</option>
              </select>
            )}
            {showCopyButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                aria-label="Copy code"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </Button>
            )}
          </div>
        </div>
      )}
      <div
        className={cn(
          'p-4 overflow-x-auto',
          'font-mono text-sm',
          isDark
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gray-50 text-gray-900'
        )}
        style={{
          padding: SPACING_TOKENS.md.px,
        }}
      >
        <pre
          className="m-0"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          }}
        >
          <code
            className={cn(
              displayLanguage === 'typescript' && 'language-typescript',
              displayLanguage === 'css' && 'language-css',
              displayLanguage === 'tailwind' && 'language-html',
              displayLanguage === 'json' && 'language-json'
            )}
          >
            {code}
          </code>
        </pre>
      </div>
    </Card>
  );
}
