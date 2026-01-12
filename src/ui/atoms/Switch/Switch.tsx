'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { getColorClass } from '../../tokens/colors';
import { getAnimationClass } from '../../tokens/animations';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: SwitchSize;
  label?: string;
  description?: string;
  error?: boolean;
}

/**
 * Switch Component
 * 
 * A toggle switch component for on/off states.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
 * 
 * <Switch 
 *   label="Enable notifications"
 *   description="Receive email notifications"
 *   checked={notifications}
 *   onChange={(e) => setNotifications(e.target.checked)}
 * />
 * ```
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  size = 'md',
  label,
  description,
  error = false,
  className = '',
  disabled = false,
  checked,
  onChange,
  id,
  ...props
}, ref) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = label ? `${switchId}-label` : undefined;
  const descriptionId = description ? `${switchId}-description` : undefined;

  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const config = sizeConfig[size];

  const trackClasses = [
    'relative',
    'inline-flex',
    'flex-shrink-0',
    'cursor-pointer',
    'rounded-full',
    'border-2',
    'border-transparent',
    getAnimationClass('base'),
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    config.track,
    checked
      ? getColorClass('primary', 'DEFAULT', 'bg')
      : 'bg-gray-200',
    error && !checked ? 'border-red-500' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');

  const thumbClasses = [
    'pointer-events-none',
    'inline-block',
    'rounded-full',
    'bg-white',
    'shadow',
    'transform',
    getAnimationClass('base'),
    config.thumb,
    checked ? config.translate : 'translate-x-0',
  ].filter(Boolean).join(' ');

  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center">
        <button
          type="button"
          className={trackClasses}
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          disabled={disabled}
          onClick={(e) => {
            if (!disabled && onChange) {
              const syntheticEvent = {
                ...e,
                target: { ...e.target, checked: !checked },
                currentTarget: { ...e.currentTarget, checked: !checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled && onChange) {
              e.preventDefault();
              const syntheticEvent = {
                ...e,
                target: { ...e.target, checked: !checked },
                currentTarget: { ...e.currentTarget, checked: !checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
          }}
        >
          <span className={thumbClasses} />
        </button>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              id={labelId}
              htmlFor={switchId}
              className={`block text-sm font-medium ${
                error ? getColorClass('error', 'DEFAULT', 'text') : 'text-gray-700'
              } ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className={`mt-1 text-sm ${error ? getColorClass('error', 'DEFAULT', 'text') : 'text-gray-500'}`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
