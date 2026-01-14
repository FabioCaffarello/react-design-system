import { useState, useMemo, memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Label } from '../../../atoms';
import { Input } from '../../../atoms';
import { Badge } from '../../../atoms';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';

export interface TokenOption<T = string> {
  value: T;
  label: string;
  description?: string;
  preview?: ReactNode;
  category?: string;
}

export interface TokenSelectorProps<T = string> {
  label?: string;
  options: TokenOption<T>[];
  value: T;
  onChange: (value: T) => void;
  searchable?: boolean;
  groupByCategory?: boolean;
  renderPreview?: (option: TokenOption<T>) => ReactNode;
  className?: string;
}

/**
 * TokenSelector Component
 * 
 * Visual selector for design tokens with search, filtering, and grouping.
 * 
 * @example
 * ```tsx
 * <TokenSelector
 *   label="Font Size"
 *   options={fontSizeOptions}
 *   value={selectedSize}
 *   onChange={setSelectedSize}
 *   searchable
 *   groupByCategory
 * />
 * ```
 */
export const TokenSelector = memo(function TokenSelector<T = string>({
  label,
  options,
  value,
  onChange,
  searchable = false,
  groupByCategory = false,
  renderPreview,
  className,
}: TokenSelectorProps<T>) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query) ||
        opt.category?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const groupedOptions = useMemo(() => {
    if (!groupByCategory) {
      return { '': filteredOptions };
    }
    return filteredOptions.reduce(
      (acc, opt) => {
        const category = opt.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(opt);
        return acc;
      },
      {} as Record<string, TokenOption<T>[]>
    );
  }, [filteredOptions, groupByCategory]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <Label>{label}</Label>}

      {searchable && (
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<span>🔍</span>}
        />
      )}

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {Object.entries(groupedOptions).map(([category, opts]) => (
          <div key={category}>
            {groupByCategory && category && (
              <div
                className={cn(
                  'text-xs font-semibold uppercase mb-1 px-2',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {category}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {opts.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={String(option.value)}
                    onClick={() => onChange(option.value)}
                    className={cn(
                      'px-3 py-2 rounded-md border transition-all',
                      'text-left flex items-center gap-2',
                      isSelected
                        ? isDark
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-blue-50 border-blue-500 text-blue-900'
                        : isDark
                        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50',
                      className
                    )}
                    style={{
                      gap: SPACING_TOKENS.xs.px,
                    }}
                    aria-pressed={isSelected}
                  >
                    {option.preview && (
                      <span className="shrink-0">{option.preview}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.description && (
                        <div
                          className={cn(
                            'text-xs truncate',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {option.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Badge variant="primary" size="sm">
                        Selected
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedOption && (
        <div
          className={cn(
            'p-2 rounded border text-xs',
            isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
          )}
        >
          <div className="font-semibold">Selected: {selectedOption.label}</div>
          {selectedOption.description && (
            <div className="mt-1">{selectedOption.description}</div>
          )}
        </div>
      )}
    </div>
  );
}) as <T = string>(props: TokenSelectorProps<T>) => JSX.Element;
