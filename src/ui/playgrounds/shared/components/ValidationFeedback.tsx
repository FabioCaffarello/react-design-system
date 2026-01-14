import { memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Badge } from '../../../atoms';
import { cn } from '../../../utils';
import type { ValidationResult } from '../utils/playgroundValidation';

export interface ValidationFeedbackProps {
  validation: ValidationResult;
  showSuggestions?: boolean;
  className?: string;
}

/**
 * ValidationFeedback Component
 * 
 * Visual feedback for validation results with errors, warnings, and suggestions.
 * 
 * @example
 * ```tsx
 * <ValidationFeedback
 *   validation={validatePlaygroundConfig(config)}
 *   showSuggestions
 * />
 * ```
 */
export const ValidationFeedback = memo(function ValidationFeedback({
  validation,
  showSuggestions = true,
  className,
}: ValidationFeedbackProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (validation.isValid && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {validation.errors.length > 0 && (
        <div
          className={cn(
            'p-3 rounded border',
            isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="error" size="sm">
              Errors
            </Badge>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div
          className={cn(
            'p-3 rounded border',
            isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning" size="sm">
              Warnings
            </Badge>
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              {validation.warnings.length} warning{validation.warnings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && validation.suggestions.length > 0 && (
        <div
          className={cn(
            'p-3 rounded border',
            isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="sm">
              Suggestions
            </Badge>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {validation.suggestions.length} suggestion{validation.suggestions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
            {validation.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
