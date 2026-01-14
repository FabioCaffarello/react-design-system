import { memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Card } from '../../../molecules';
import { Button } from '../../../atoms';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';

export interface ComparisonViewProps<T> {
  leftConfig: T;
  rightConfig: T;
  leftLabel?: string;
  rightLabel?: string;
  renderPreview: (config: T) => ReactNode;
  getDifferences?: (left: T, right: T) => string[];
  className?: string;
}

/**
 * ComparisonView Component
 * 
 * Side-by-side comparison view for playground configurations.
 * 
 * @example
 * ```tsx
 * <ComparisonView
 *   leftConfig={config1}
 *   rightConfig={config2}
 *   leftLabel="Before"
 *   rightLabel="After"
 *   renderPreview={(config) => <Preview config={config} />}
 * />
 * ```
 */
export const ComparisonView = memo(function ComparisonView<T>({
  leftConfig,
  rightConfig,
  leftLabel = 'Configuration A',
  rightLabel = 'Configuration B',
  renderPreview,
  getDifferences,
  className,
}: ComparisonViewProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const differences = getDifferences ? getDifferences(leftConfig, rightConfig) : [];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h3
          className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: '18px' }}
        >
          Comparison
        </h3>
        {differences.length > 0 && (
          <div className="text-sm text-gray-500">
            {differences.length} difference{differences.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div
            className={cn(
              'p-4 border-b font-semibold',
              isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
            )}
          >
            {leftLabel}
          </div>
          <div className="p-4">{renderPreview(leftConfig)}</div>
        </Card>

        <Card>
          <div
            className={cn(
              'p-4 border-b font-semibold',
              isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
            )}
          >
            {rightLabel}
          </div>
          <div className="p-4">{renderPreview(rightConfig)}</div>
        </Card>
      </div>

      {differences.length > 0 && (
        <Card>
          <div
            className={cn(
              'p-4 border-b font-semibold',
              isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
            )}
          >
            Differences
          </div>
          <div className="p-4">
            <ul className="list-disc list-inside space-y-1">
              {differences.map((diff, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {diff}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}) as <T>(props: ComparisonViewProps<T>) => JSX.Element;
