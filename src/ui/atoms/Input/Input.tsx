'use client';

import { forwardRef, useState, memo, useMemo, useCallback } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { getTypographyClasses, getTypographySize } from '../../tokens/typography';
import { getColorClass, getFocusColorClass } from '../../tokens/colors';
import { getRadiusClass } from '../../tokens/radius';
import { getSpacingClass } from '../../tokens/spacing';
import { cn, cva } from '../../utils';
import { X, Eye, EyeOff } from 'lucide-react';
import Button from '../Button/Button';

/**
 * Helper Text Component
 * Memoized component for helper/error text
 */
const HelperText = memo(function HelperText({
  error,
  success,
  helperText,
  errorId,
  helperId,
}: {
  error: boolean;
  success: boolean;
  helperText?: string;
  errorId?: string;
  helperId?: string;
}) {
  const helperClasses = useMemo(() => cn(
    getSpacingClass('xs', 'mt'),
    getTypographyClasses('caption'),
    error && getColorClass('error', 'DEFAULT', 'text'),
    success && getColorClass('success', 'DEFAULT', 'text'),
    !error && !success && getColorClass('neutral', 'DEFAULT', 'text')
  ), [error, success]);

  const text = useMemo(() => 
    helperText || (error ? 'Error' : success ? 'Success' : ''),
    [helperText, error, success]
  );

  return (
    <div
      id={errorId || helperId}
      className={helperClasses}
      role={error || success ? 'alert' : undefined}
    >
      {text}
    </div>
  );
});

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
const Input = memo(forwardRef<HTMLInputElement, InputProps>(function Input({
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
  // Memoize input ID
  const inputId = useMemo(() => 
    id || `input-${Math.random().toString(36).substr(2, 9)}`,
    [id]
  );
  
  // Memoize error and helper IDs
  const errorId = useMemo(() => 
    error ? `${inputId}-error` : undefined,
    [error, inputId]
  );
  
  const helperId = useMemo(() => 
    helperText ? `${inputId}-helper` : undefined,
    [helperText, inputId]
  );
  
  // Password toggle state
  const [showPassword, setShowPassword] = useState(false);
  
  // Memoize password-related values
  const isPassword = useMemo(() => type === 'password', [type]);
  const inputType = useMemo(() => 
    isPassword && showPassword ? 'text' : type,
    [isPassword, showPassword, type]
  );
  
  // Memoize state
  const state = useMemo<InputState>(() => 
    error ? 'error' : success ? 'success' : 'default',
    [error, success]
  );
  
  // Memoize clear button visibility
  const hasValue = useMemo(() => 
    value !== undefined && value !== null && value !== '',
    [value]
  );
  
  const shouldShowClear = useMemo(() => 
    showClearButton && hasValue && !disabled,
    [showClearButton, hasValue, disabled]
  );

  // Memoize focus ring colors
  const primaryFocusRing = useMemo(() => 
    getFocusColorClass('primary', 'DEFAULT', 'border'),
    []
  );
  
  const errorFocusRing = useMemo(() => 
    getFocusColorClass('error', 'DEFAULT', 'border'),
    []
  );
  
  const successFocusRing = useMemo(() => 
    getFocusColorClass('success', 'DEFAULT', 'border'),
    []
  );
  
  const getFocusRingColor = useMemo(() => 
    primaryFocusRing.replace('focus:border-', 'focus:ring-'),
    [primaryFocusRing]
  );

  const getStateFocusRingColor = useCallback((stateType: 'error' | 'success'): string => {
    return stateType === 'error' 
      ? errorFocusRing.replace('focus:border-', 'focus:ring-')
      : successFocusRing.replace('focus:border-', 'focus:ring-');
  }, [errorFocusRing, successFocusRing]);

  // Input variants using CVA
  const inputVariants = cva(
    // Base classes
    cn(
      'w-full',
      getRadiusClass('md'),
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    ),
    {
      variants: {
        variant: {
          default: cn(
            'border-0',
            'border-b-2',
            getColorClass('neutral', 'DEFAULT', 'border'),
            getFocusColorClass('primary', 'DEFAULT', 'border')
          ),
          outlined: cn(
            'border',
            getColorClass('neutral', 'DEFAULT', 'border'),
            getFocusColorClass('primary', 'DEFAULT', 'border')
          ),
          filled: cn(
            getColorClass('neutral', 'light', 'bg'),
            'border-0',
            'focus:bg-white',
            'focus:ring-2',
            getFocusRingColor()
          ),
        },
        size: {
          sm: cn(
            'h-8',
            getTypographySize('bodySmall'),
            getSpacingClass('md', 'px')
          ),
          md: cn(
            'h-10',
            getTypographySize('body'),
            getSpacingClass('base', 'px')
          ),
          lg: cn(
            'h-12',
            getTypographySize('bodyLarge'),
            getSpacingClass('lg', 'px')
          ),
        },
        state: {
          default: '',
          error: cn(
            getColorClass('error', 'DEFAULT', 'border'),
            getFocusColorClass('error', 'DEFAULT', 'border'),
            getStateFocusRingColor('error')
          ),
          success: cn(
            getColorClass('success', 'DEFAULT', 'border'),
            getFocusColorClass('success', 'DEFAULT', 'border'),
            getStateFocusRingColor('success')
          ),
        },
      },
      defaultVariants: {
        variant: 'outlined',
        size: 'md',
        state: 'default',
      },
    }
  );

  // Memoize input classes
  const inputClasses = useMemo(() => cn(
    inputVariants({ variant, size, state }),
    // Icon padding - specific values for icon positioning
    leftIcon && (size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10'),
    (rightIcon || shouldShowClear || isPassword) && (size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10'),
    className
  ), [variant, size, state, leftIcon, rightIcon, shouldShowClear, isPassword, className]);

  // Memoize label classes
  const labelClasses = useMemo(() => cn(
    'block',
    getTypographyClasses('label'),
    getSpacingClass('xs', 'mb'),
    disabled && 'opacity-50'
  ), [disabled]);

  // Memoize icon size and position
  const iconSize = useMemo(() => 
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
    [size]
  );
  
  const iconPosition = useMemo(() => 
    size === 'sm' ? 'top-2' : size === 'lg' ? 'top-3.5' : 'top-2.5',
    [size]
  );

  // Memoize clear handler
  const handleClear = useCallback((e: React.MouseEvent) => {
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
  }, [onClear, onChange]);

  // Memoize password toggle handler
  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

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
          <div className={`absolute left-3 ${iconPosition} ${getColorClass('neutral', 'DEFAULT', 'text')} opacity-60 pointer-events-none`}>
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
              onClick={handleTogglePassword}
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
            <div className={`${getColorClass('neutral', 'DEFAULT', 'text')} opacity-60 pointer-events-none ${iconSize}`}>
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      {(error || success || helperText) && (
        <HelperText
          error={error}
          success={success}
          helperText={helperText}
          errorId={errorId}
          helperId={helperId}
        />
      )}
    </div>
  );
}));

Input.displayName = 'Input';

export default Input;
