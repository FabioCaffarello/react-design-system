import { useState, useMemo, memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Label } from '../../../atoms';
import { Input } from '../../../atoms';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';

export interface SliderControlProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  showLabels?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

/**
 * SliderControl Component
 * 
 * Slider control with labels, value display, and unit support.
 * 
 * @example
 * ```tsx
 * <SliderControl
 *   label="Font Size"
 *   value={16}
 *   onChange={setFontSize}
 *   min={8}
 *   max={72}
 *   step={1}
 *   unit="px"
 *   showValue
 * />
 * ```
 */
export const SliderControl = memo(function SliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  showValue = true,
  showLabels = true,
  formatValue,
  className,
}: SliderControlProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(String(value));
  const isDark = theme === 'dark';

  const formattedValue = useMemo(() => {
    if (formatValue) return formatValue(value);
    return `${value}${unit}`;
  }, [value, unit, formatValue]);

  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    setInputValue(String(newValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          {showValue && (
            <span
              className={cn(
                'text-sm font-medium',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {formattedValue}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {showLabels && (
          <span
            className={cn(
              'text-xs w-12 text-right shrink-0',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            {min}{unit}
          </span>
        )}

        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className={cn(
              'w-full h-2 rounded-lg appearance-none cursor-pointer',
              isDark ? 'bg-gray-700' : 'bg-gray-200',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-4',
              '[&::-webkit-slider-thumb]:h-4',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-blue-500',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:w-4',
              '[&::-moz-range-thumb]:h-4',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-blue-500',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer'
            )}
            style={{
              background: `linear-gradient(to right, ${
                isDark ? '#3b82f6' : '#3b82f6'
              } 0%, ${isDark ? '#3b82f6' : '#3b82f6'} ${percentage}%, ${
                isDark ? '#374151' : '#e5e7eb'
              } ${percentage}%, ${isDark ? '#374151' : '#e5e7eb'} 100%)`,
            }}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
          />
        </div>

        {showLabels && (
          <span
            className={cn(
              'text-xs w-12 text-left shrink-0',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            {max}{unit}
          </span>
        )}

        {showValue && (
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 shrink-0"
            aria-label={`${label} input`}
          />
        )}
      </div>
    </div>
  );
});
