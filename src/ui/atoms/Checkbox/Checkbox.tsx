'use client';

import { useRef, useEffect } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { getTypographyClasses } from '../../tokens/typography';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: boolean;
  helperText?: string;
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 * 
 * A styled checkbox input component.
 * Follows Atomic Design principles as an Atom component.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 * 
 * @example
 * ```tsx
 * <Checkbox 
 *   id="terms"
 *   label="I agree to the terms"
 *   checked={checked}
 *   onChange={handleChange}
 * />
 * ```
 */
export default function Checkbox({
  id,
  label,
  error = false,
  helperText,
  className = '',
  disabled = false,
  indeterminate = false,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const helperId = helperText ? `${checkboxId}-helper` : undefined;

  const baseClasses = [
    'h-4',
    'w-4',
    'rounded',
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

  const checkboxClasses = [
    ...baseClasses,
    errorClasses,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    getTypographyClasses('label'),
    'ml-2',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].filter(Boolean).join(' ');

  // Set indeterminate state via ref
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`flex flex-col my-2 ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          ref={checkboxRef}
          className={checkboxClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
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
