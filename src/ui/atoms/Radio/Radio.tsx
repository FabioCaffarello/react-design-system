'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { getTypographyClasses } from '../../tokens/typography';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: boolean;
  helperText?: string;
}

/**
 * Radio Component
 * 
 * A styled radio input component.
 * Follows Atomic Design principles as an Atom component.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 * 
 * @example
 * ```tsx
 * <Radio 
 *   id="option1"
 *   name="options"
 *   label="Option 1"
 *   value="1"
 *   checked={selected === "1"}
 *   onChange={handleChange}
 * />
 * ```
 */
export default function Radio({
  id,
  label,
  error = false,
  helperText,
  className = '',
  disabled = false,
  ...props
}: RadioProps) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${radioId}-error` : undefined;
  const helperId = helperText ? `${radioId}-helper` : undefined;

  const baseClasses = [
    'h-4',
    'w-4',
    'border-gray-300',
    'text-indigo-600',
    'focus:ring-2',
    'focus:ring-indigo-500',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'cursor-pointer',
  ];

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500'
    : '';

  const radioClasses = [
    ...baseClasses,
    errorClasses,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    getTypographyClasses('label'),
    'ml-2',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].filter(Boolean).join(' ');

  return (
    <div className={`flex flex-col my-2 ${className}`}>
      <div className="flex items-center">
        <input
          type="radio"
          id={radioId}
          className={radioClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className={labelClasses}
          >
            {label}
          </label>
        )}
      </div>
      {(error || helperText) && (
        <div
          id={errorId || helperId}
          className={`mt-1 ${getTypographyClasses('caption')} ${error ? 'text-red-600' : 'text-gray-500'}`}
          role={error ? 'alert' : undefined}
        >
          {helperText || (error ? 'Error' : '')}
        </div>
      )}
    </div>
  );
}
