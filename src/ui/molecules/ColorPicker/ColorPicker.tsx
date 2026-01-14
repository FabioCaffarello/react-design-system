'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { getRadiusClass } from '../../tokens/radius';
import { getShadowClass } from '../../tokens/shadows';
import { getSpacingClass } from '../../tokens/spacing';
import Input from '../../atoms/Input/Input';
import Popover from '../Popover/Popover';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorPickerProps {
  value?: string; // Hex color (e.g., "#ff0000")
  defaultValue?: string;
  format?: ColorFormat;
  onChange?: (value: string) => void;
  presets?: string[];
  showInput?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * ColorPicker Component
 * 
 * A color picker component for selecting colors.
 * Supports hex, rgb, and hsl formats with presets.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#ff0000"
 *   onChange={(color) => console.log(color)}
 * />
 * ```
 */
export default function ColorPicker({
  value: controlledValue,
  defaultValue = '#000000',
  format: _format = 'hex',
  onChange,
  presets,
  showInput = true,
  disabled = false,
  label,
  className = '',
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Update RGB when value changes
  useEffect(() => {
    if (currentValue) {
      const rgbValue = hexToRgb(currentValue);
      setRgb(rgbValue);
    }
  }, [currentValue]);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex) || hex === '') {
      if (!isControlled) {
        setInternalValue(hex);
      }
      onChange?.(hex);
      if (hex) {
        setRgb(hexToRgb(hex));
      }
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', val: number) => {
    const newRgb = { ...rgb, [component]: Math.max(0, Math.min(255, val)) };
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    if (!isControlled) {
      setInternalValue(hex);
    }
    onChange?.(hex);
  };

  const defaultPresets = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#ffa500',
  ];

  const colorPresets = presets || defaultPresets;

  const colorPickerContent = (
    <div className={`${getSpacingClass('base', 'p')} min-w-[280px]`}>
      {/* Color Preview */}
      <div
        className={`
          w-full
          h-32
          ${getRadiusClass('md')}
          ${getShadowClass('sm')}
          mb-4
          border
          border-gray-200
        `}
        style={{ backgroundColor: currentValue }}
      />

      {/* RGB Sliders */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Red: {rgb.r}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Green: {rgb.g}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Blue: {rgb.b}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      {/* Hex Input */}
      {showInput && (
        <div className="mb-4">
          <Input
            label="Hex"
            value={currentValue}
            onChange={handleHexChange}
            disabled={disabled}
            placeholder="#000000"
            className="font-mono"
          />
        </div>
      )}

      {/* Color Presets */}
      {colorPresets.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Presets
          </label>
          <div className="grid grid-cols-10 gap-1">
            {colorPresets.map((color, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    if (!isControlled) {
                      setInternalValue(color);
                    }
                    onChange?.(color);
                    setRgb(hexToRgb(color));
                  }
                }}
                disabled={disabled}
                className={`
                  w-6
                  h-6
                  ${getRadiusClass('sm')}
                  border
                  border-gray-300
                  hover:scale-110
                  ${getShadowClass('sm')}
                  ${currentValue.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}
                `}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      <Popover
        trigger={
          <div className="flex items-center gap-2">
            {label && (
              <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <div
              className={`
                w-10
                h-10
                ${getRadiusClass('md')}
                border
                border-gray-300
                ${getShadowClass('sm')}
                cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{ backgroundColor: currentValue }}
            />
            {showInput && (
              <Input
                value={currentValue}
                onChange={handleHexChange}
                disabled={disabled}
                placeholder="#000000"
                className="w-24 font-mono"
              />
            )}
          </div>
        }
        placement="bottom-start"
        showCloseButton
        title="Pick a Color"
      >
        {colorPickerContent}
      </Popover>
    </div>
  );
}
