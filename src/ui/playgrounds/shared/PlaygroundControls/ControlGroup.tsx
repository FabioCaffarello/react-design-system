import { useState, memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Card } from '../../../molecules';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';

export interface ControlGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  validationState?: 'valid' | 'warning' | 'error';
  validationMessage?: string;
  className?: string;
}

/**
 * ControlGroup Component
 * 
 * Container for grouping playground controls with optional collapsible state
 * and validation feedback.
 * 
 * @example
 * ```tsx
 * <ControlGroup
 *   title="Colors"
 *   description="Adjust color tokens"
 *   defaultExpanded
 *   validationState="warning"
 *   validationMessage="Some colors may not meet contrast requirements"
 * >
 *   <ColorPicker />
 * </ControlGroup>
 * ```
 */
export const ControlGroup = memo(function ControlGroup({
  title,
  description,
  children,
  defaultExpanded = true,
  collapsible = true,
  validationState,
  validationMessage,
  className,
}: ControlGroupProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isDark = theme === 'dark';

  const validationColors = {
    valid: isDark ? 'text-green-400' : 'text-green-600',
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    error: isDark ? 'text-red-400' : 'text-red-600',
  };

  return (
    <Card className={className}>
      <div
        className={cn(
          'flex items-center justify-between',
          'p-4 border-b',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'm-0 font-semibold',
                isDark ? 'text-white' : 'text-gray-900'
              )}
              style={{
                fontSize: '18px',
              }}
            >
              {title}
            </h3>
            {validationState && (
              <span
                className={cn(
                  'text-xs font-medium',
                  validationColors[validationState]
                )}
                title={validationMessage}
              >
                {validationState === 'valid' && '✓'}
                {validationState === 'warning' && '⚠'}
                {validationState === 'error' && '✗'}
              </span>
            )}
          </div>
          {description && (
            <p
              className={cn(
                'm-0 mt-1 text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {description}
            </p>
          )}
          {validationMessage && validationState && (
            <p
              className={cn(
                'm-0 mt-1 text-xs',
                validationColors[validationState]
              )}
            >
              {validationMessage}
            </p>
          )}
        </div>
        {collapsible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'ml-4 p-1 rounded transition-colors',
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            aria-expanded={expanded}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
      </div>
      {expanded && (
        <div
          className="p-4 flex flex-col gap-4"
          style={{
            padding: SPACING_TOKENS.md.px,
            gap: SPACING_TOKENS.md.px,
          }}
        >
          {children}
        </div>
      )}
    </Card>
  );
});
