'use client';

import { useRef, useEffect, useState, forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { getColorClass } from '../../tokens/colors';
import { getSpacingClass } from '../../tokens/spacing';
import { getAnimationClass } from '../../tokens/animations';

export type SliderVariant = 'single' | 'range';
export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  variant?: SliderVariant;
  size?: SliderSize;
  disabled?: boolean;
  showValue?: boolean;
  marks?: number[];
  onChange?: (value: number | [number, number]) => void;
  onValueChange?: (value: number | [number, number]) => void;
  label?: string;
}

/**
 * Slider Component
 * 
 * A range input component for selecting numeric values.
 * Supports single and dual thumb (range) modes.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Slider
 *   value={50}
 *   min={0}
 *   max={100}
 *   onChange={(value) => console.log(value)}
 * />
 * 
 * <Slider
 *   variant="range"
 *   value={[20, 80]}
 *   min={0}
 *   max={100}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  variant = 'single',
  size = 'md',
  disabled = false,
  showValue = false,
  marks = [],
  onChange,
  onValueChange,
  label,
  className = '',
  ...props
}, ref) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    defaultValue || (variant === 'range' ? [min, max] : min)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const getValueFromPosition = (clientX: number): number => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const handleMouseDown = (e: React.MouseEvent, thumb: 'min' | 'max' = 'min') => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumb);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!sliderRef.current) return;
      const newValue = getValueFromPosition(moveEvent.clientX);
      updateValue(newValue, thumb);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveThumb(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const updateValue = (newValue: number, thumb: 'min' | 'max' = 'min') => {
    const clampedValue = Math.max(min, Math.min(max, newValue));

    if (variant === 'range') {
      const [minVal, maxVal] = Array.isArray(currentValue) ? currentValue : [min, max];
      let updatedValue: [number, number];

      if (thumb === 'min') {
        updatedValue = [Math.min(clampedValue, maxVal), maxVal];
      } else {
        updatedValue = [minVal, Math.max(clampedValue, minVal)];
      }

      if (!isControlled) {
        setInternalValue(updatedValue);
      }
      onChange?.(updatedValue);
      onValueChange?.(updatedValue);
    } else {
      if (!isControlled) {
        setInternalValue(clampedValue);
      }
      onChange?.(clampedValue);
      onValueChange?.(clampedValue);
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled || isDragging) return;
    const newValue = getValueFromPosition(e.clientX);
    updateValue(newValue);
  };

  const sizeConfig = {
    sm: { track: 'h-1', thumb: 'w-3 h-3' },
    md: { track: 'h-2', thumb: 'w-4 h-4' },
    lg: { track: 'h-3', thumb: 'w-5 h-5' },
  };

  const config = sizeConfig[size];
  const singleValue = typeof currentValue === 'number' ? currentValue : currentValue[0];
  const minValue = Array.isArray(currentValue) ? currentValue[0] : min;
  const maxValue = Array.isArray(currentValue) ? currentValue[1] : singleValue;

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div ref={ref} className={`w-full ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {showValue && (
            <span className="ml-2 text-gray-500">
              {variant === 'range'
                ? `${minValue} - ${maxValue}`
                : singleValue}
            </span>
          )}
        </label>
      )}
      <div
        ref={sliderRef}
        className={`
          relative
          ${config.track}
          ${getColorClass('neutral', 'light', 'bg')}
          rounded-full
          cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleTrackClick}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={singleValue}
        aria-disabled={disabled}
        aria-label={label}
      >
        {/* Active track */}
        <div
          className={`
            absolute
            ${config.track}
            ${getColorClass('primary', 'DEFAULT', 'bg')}
            rounded-full
            ${getAnimationClass('base')}
          `}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Marks */}
        {marks.map((mark) => {
          const markPercentage = getPercentage(mark);
          return (
            <div
              key={mark}
              className="absolute w-1 h-1 bg-gray-400 rounded-full -translate-x-1/2"
              style={{ left: `${markPercentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
            />
          );
        })}

        {/* Thumbs */}
        {variant === 'range' ? (
          <>
            <div
              className={`
                absolute
                ${config.thumb}
                ${getColorClass('primary', 'DEFAULT', 'bg')}
                rounded-full
                border-2
                border-white
                shadow-md
                cursor-grab
                active:cursor-grabbing
                ${getAnimationClass('base')}
                ${activeThumb === 'min' ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                -translate-x-1/2
                -translate-y-1/2
                top-1/2
              `}
              style={{ left: `${minPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'min')}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={maxValue}
              aria-valuenow={minValue}
            />
            <div
              className={`
                absolute
                ${config.thumb}
                ${getColorClass('primary', 'DEFAULT', 'bg')}
                rounded-full
                border-2
                border-white
                shadow-md
                cursor-grab
                active:cursor-grabbing
                ${getAnimationClass('base')}
                ${activeThumb === 'max' ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                -translate-x-1/2
                -translate-y-1/2
                top-1/2
              `}
              style={{ left: `${maxPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'max')}
              role="slider"
              aria-valuemin={minValue}
              aria-valuemax={max}
              aria-valuenow={maxValue}
            />
          </>
        ) : (
          <div
            className={`
              absolute
              ${config.thumb}
              ${getColorClass('primary', 'DEFAULT', 'bg')}
              rounded-full
              border-2
              border-white
              shadow-md
              cursor-grab
              active:cursor-grabbing
              ${getAnimationClass('base')}
              ${isDragging ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
              -translate-x-1/2
              -translate-y-1/2
              top-1/2
            `}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={(e) => handleMouseDown(e)}
          />
        )}

        {showValue && !label && (
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
              {variant === 'range' ? `${minValue} - ${maxValue}` : singleValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;
