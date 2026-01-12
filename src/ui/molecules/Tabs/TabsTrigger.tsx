'use client';

import { useTabsContext } from './TabsContext';
import type { HTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import { getColorClass, getRadiusClass } from '../../tokens';

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * TabsTrigger Component
 * 
 * Individual tab trigger button.
 * Must be used within a TabsList component.
 */
export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = '',
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange, orientation: _orientation, activationMode } = useTabsContext();

  const isActive = activeValue === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (activationMode === 'automatic' || isActive) {
      onValueChange(value);
    }
    onClick?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    // In automatic mode, activate tab on focus
    if (activationMode === 'automatic' && !disabled && !isActive) {
      onValueChange(value);
    }
    props.onFocus?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Let parent handle arrow keys, Home, End
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      // These are handled by TabsList
      return;
    }

    // Handle Enter/Space for manual activation
    if (activationMode === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onValueChange(value);
      return;
    }

    onKeyDown?.(e);
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={disabled ? -1 : isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={`
        inline-flex
        items-center
        justify-center
        px-3
        py-1.5
        text-sm
        font-medium
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${getRadiusClass('sm')}
        ${isActive
          ? `${getColorClass('primary', 'DEFAULT', 'bg')} ${getColorClass('primary', 'contrast', 'text')}`
          : `${getColorClass('neutral', 'light', 'text')} hover:${getColorClass('neutral', 'DEFAULT', 'bg')}`
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
