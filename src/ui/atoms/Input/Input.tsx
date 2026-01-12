'use client';

import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { getTypographyClasses } from '../../tokens/typography';
import { getColorClass } from '../../tokens/colors';
import { X, Eye, EyeOff } from 'lucide-react';
import Button from '../Button/Button';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
}

/**
 * Input Component
 * 
 * A styled text input component with label, error/success states, icons, and clear button.
 * Follows Atomic Design principles as an Atom component.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 * 
 * @example
 * ```tsx
 * <Input 
 *   id="email"
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={hasError}
 *   helperText={errorMessage}
 *   leftIcon={<MailIcon />}
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  id,
  label,
  error = false,
  success = false,
  helperText,
  size = 'md',
  variant = 'outlined',
  leftIcon,
  rightIcon,
  showClearButton = false,
  onClear,
  className = '',
  disabled = false,
  type = 'text',
  value,
  onChange,
  ...props
}, ref) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  
  // Password toggle state
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  // Determine state
  const state: InputState = error ? 'error' : success ? 'success' : 'default';
  
  // Determine if we should show clear button
  const hasValue = value !== undefined && value !== null && value !== '';
  const shouldShowClear = showClearButton && hasValue && !disabled;

  // Size classes
  const sizeClasses: Record<InputSize, string> = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-5',
  };

  // Variant classes
  const variantClasses: Record<InputVariant, string> = {
    default: 'border-0 border-b-2 border-gray-300 focus:border-indigo-500',
    outlined: 'border border-gray-300 focus:border-indigo-500',
    filled: 'bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-indigo-500',
  };

  // State classes
  const stateClasses: Record<InputState, string> = {
    default: '',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  };

  const baseClasses = [
    'w-full',
    'rounded-md',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    stateClasses[state],
  ];

  // Add padding for icons
  if (leftIcon) {
    baseClasses.push(size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10');
  }
  if (rightIcon || shouldShowClear || isPassword) {
    baseClasses.push(size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10');
  }

  const inputClasses = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'block',
    getTypographyClasses('label'),
    'mb-1',
    disabled ? 'opacity-50' : '',
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const iconPosition = size === 'sm' ? 'top-2' : size === 'lg' ? 'top-3.5' : 'top-2.5';

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Create synthetic event to clear input
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: '' },
        currentTarget: { ...e.currentTarget, value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-3 ${iconPosition} text-gray-400 pointer-events-none`}>
            <div className={iconSize}>
              {leftIcon}
            </div>
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          value={value}
          onChange={onChange}
          aria-invalid={error}
          aria-required={props.required}
          aria-describedby={errorId || helperId}
          {...props}
        />
        <div className="absolute right-3 top-0 bottom-0 flex items-center gap-1">
          {shouldShowClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-auto p-1"
              aria-label="Clear input"
            >
              <X className={iconSize} />
            </Button>
          )}
          {isPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="h-auto p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className={iconSize} />
              ) : (
                <Eye className={iconSize} />
              )}
            </Button>
          )}
          {rightIcon && !shouldShowClear && !isPassword && (
            <div className={`text-gray-400 pointer-events-none ${iconSize}`}>
              {rightIcon}
            </div>
          )}
        </div>
      </div>
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

Input.displayName = 'Input';

export default Input;
