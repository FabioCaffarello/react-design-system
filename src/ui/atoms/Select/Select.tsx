'use client';

import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { getTypographyClasses } from '../../tokens/typography';
import { getColorClass } from '../../tokens/colors';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  options: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  placeholder?: string;
  label?: ReactNode;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  size?: SelectSize;
}

/**
 * Select Component
 * 
 * A styled select dropdown component for forms.
 * Follows Atomic Design principles as an Atom component.
 * Supports both flat options and option groups.
 * 
 * @example
 * ```tsx
 * <Select 
 *   label="Choose option"
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   placeholder="Select an option"
 * />
 * ```
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  options,
  optionGroups,
  placeholder,
  label,
  error = false,
  success = false,
  helperText,
  size = 'md',
  className = '',
  disabled = false,
  id,
  ...props
}, ref) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  // Size classes
  const sizeClasses: Record<SelectSize, string> = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-5',
  };

  // State classes
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500'
    : success
    ? 'border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:ring-indigo-500';

  const baseClasses = [
    'block',
    'w-full',
    'rounded-md',
    'border',
    'bg-white',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    sizeClasses[size],
    stateClasses,
  ];

  const selectClasses = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'block',
    getTypographyClasses('label'),
    'mb-1',
    disabled ? 'opacity-50' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className={labelClasses}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        aria-invalid={error}
        aria-required={props.required}
        aria-describedby={errorId || helperId}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {optionGroups ? (
          optionGroups.map((group, groupIndex) => (
            <optgroup key={groupIndex} label={group.label}>
              {group.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))
        ) : (
          options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))
        )}
      </select>
      {(error || success || helperText) && (
        <div
          id={errorId || helperId}
          className={`mt-1 ${getTypographyClasses('caption')} ${
            error 
              ? getColorClass('error', 'DEFAULT', 'text')
              : success
              ? getColorClass('success', 'DEFAULT', 'text')
              : 'text-gray-500'
          }`}
          role={error || success ? 'alert' : undefined}
        >
          {helperText || (error ? 'Error' : success ? 'Success' : '')}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
