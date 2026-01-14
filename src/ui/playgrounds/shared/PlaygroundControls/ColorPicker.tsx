import { useState, useMemo, memo, type ReactNode } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Label } from '../../../atoms';
import { Input } from '../../../atoms';
import { Badge } from '../../../atoms';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { cn } from '../../../utils';
import { calculateContrastResult } from '../utils/contrastCalculator';

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showPreview?: boolean;
  showContrast?: boolean;
  contrastColor?: string;
  format?: 'hex' | 'rgb' | 'hsl';
  className?: string;
}

/**
 * ColorPicker Component
 * 
 * Advanced color picker with hex/rgb/hsl inputs and contrast preview.
 * 
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Primary Color"
 *   value="#6366f1"
 *   onChange={setColor}
 *   showContrast
 *   contrastColor="#ffffff"
 * />
 * ```
 */
export const ColorPicker = memo(function ColorPicker({
  label,
  value,
  onChange,
  showPreview = true,
  showContrast = false,
  contrastColor = '#ffffff',
  format = 'hex',
  className,
}: ColorPickerProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const isDark = theme === 'dark';

  // Validate hex color
  const isValidHex = useMemo(() => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  }, [value]);

  // Calculate contrast ratio
  const contrastResult = useMemo(() => {
    if (!showContrast || !isValidHex) return null;
    return calculateContrastResult(value, contrastColor);
  }, [showContrast, isValidHex, value, contrastColor]);

  const handleColorChange = (newValue: string) => {
    setInputValue(newValue);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setInputValue(e.target.value);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <Label>{label}</Label>}

      <div className="flex items-center gap-2">
        {showPreview && (
          <div
            className="w-12 h-12 rounded border shrink-0"
            style={{
              backgroundColor: isValidHex ? value : 'transparent',
              borderColor: isDark ? '#555' : '#ddd',
            }}
          />
        )}

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              error={!isValidHex && inputValue !== ''}
              helperText={!isValidHex && inputValue !== '' ? 'Invalid hex color' : undefined}
              className="flex-1"
            />
            <input
              type="color"
              value={isValidHex ? value : '#000000'}
              onChange={handleNativeColorChange}
              className={cn(
                'w-12 h-10 rounded border cursor-pointer',
                isDark ? 'border-gray-700' : 'border-gray-300'
              )}
              aria-label="Color picker"
            />
          </div>

          {showContrast && contrastResult !== null && (
            <div
              className={cn(
                'px-2 py-1 rounded text-xs flex items-center gap-2',
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              )}
            >
              <span>Contrast:</span>
              <Badge
                variant={contrastResult.passesAA ? 'success' : 'warning'}
                size="sm"
              >
                {contrastResult.ratio.toFixed(2)}:1
              </Badge>
              <Badge
                variant={contrastResult.passesAA ? 'success' : 'error'}
                size="sm"
              >
                {contrastResult.level}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Color Palette Preview */}
      {isValidHex && (
        <div className="flex gap-1">
          {['#000000', '#ffffff', '#6366f1', '#10b981', '#f59e0b', '#ef4444', value].map(
            (color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setInputValue(color);
                }}
                className={cn(
                  'w-8 h-8 rounded border transition-transform',
                  value === color ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-105',
                  isDark ? 'border-gray-700' : 'border-gray-300'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
});
