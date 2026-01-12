'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import { getColorClass } from '../../tokens/colors';
import Spinner from '../Spinner/Spinner';

export type ButtonVariant = 'primary' | 'regular' | 'secondary' | 'error' | 'outline' | 'ghost' | 'iconOnly';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'as'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  loadingIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  as?: ElementType;
  href?: string;
}

/**
 * Button Component Builder
 * Uses Builder Pattern for constructing button classes
 */
class ButtonClassBuilder {
  private classes: string[] = [];

  addBase(): this {
    this.classes.push(
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-md',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
    return this;
  }

  addVariant(variant: ButtonVariant): this {
    // Map 'regular' to 'primary' for backward compatibility
    // TODO: Remove 'regular' in next major version
    const normalizedVariant = variant === 'regular' ? 'primary' : variant;
    
    if (variant === 'regular' && process.env.NODE_ENV === 'development') {
      console.warn(
        'Button variant "regular" is deprecated. Use "primary" instead. ' +
        'This mapping will be removed in the next major version.'
      );
    }
    
    type NormalizedVariant = Exclude<ButtonVariant, 'regular'>;
    
    const variantClasses: Record<NormalizedVariant, string[]> = {
      primary: [
        getColorClass('primary', 'DEFAULT', 'bg'),
        'text-white',
        'hover:opacity-90',
        'focus:ring-indigo-500',
      ],
      secondary: [
        getColorClass('secondary', 'DEFAULT', 'bg'),
        'text-white',
        'hover:opacity-90',
        'focus:ring-violet-500',
      ],
      error: [
        getColorClass('error', 'DEFAULT', 'bg'),
        'text-white',
        'hover:opacity-90',
        'focus:ring-red-500',
      ],
      outline: [
        'border-2',
        getColorClass('neutral', 'DEFAULT', 'border'),
        'bg-transparent',
        getColorClass('neutral', 'dark', 'text'),
        'hover:bg-gray-50',
        'focus:ring-gray-500',
      ],
      ghost: [
        'bg-transparent',
        getColorClass('neutral', 'dark', 'text'),
        'hover:bg-gray-100',
        'focus:ring-gray-500',
      ],
      iconOnly: [
        'bg-transparent',
        getColorClass('neutral', 'dark', 'text'),
        'hover:bg-gray-100',
        'focus:ring-gray-500',
        'p-0',
      ],
    };

    this.classes.push(...variantClasses[normalizedVariant as NormalizedVariant]);
    return this;
  }

  addSize(size: ButtonSize, variant: ButtonVariant): this {
    // Normalize variant for size calculation
    const normalizedVariant = variant === 'regular' ? 'primary' : variant;
    
    // IconOnly variant has different sizing
    if (normalizedVariant === 'iconOnly') {
      const iconSizeClasses: Record<ButtonSize, string[]> = {
        sm: ['h-8', 'w-8', 'p-0'],
        md: ['h-10', 'w-10', 'p-0'],
        lg: ['h-12', 'w-12', 'p-0'],
      };
      this.classes.push(...iconSizeClasses[size]);
      return this;
    }

    const sizeClasses: Record<ButtonSize, string[]> = {
      sm: ['px-3', 'py-1.5', 'text-sm', 'gap-1.5'],
      md: ['px-4', 'py-2', 'text-base', 'gap-2'],
      lg: ['px-6', 'py-3', 'text-lg', 'gap-2.5'],
    };

    this.classes.push(...sizeClasses[size]);
    return this;
  }

  addFullWidth(): this {
    this.classes.push('w-full');
    return this;
  }

  addCustom(className: string): this {
    if (className) {
      this.classes.push(className);
    }
    return this;
  }

  build(): string {
    return this.classes.filter(Boolean).join(' ');
  }
}

/**
 * Icon Wrapper Component
 * Handles icon spacing and alignment consistently
 */
function IconWrapper({ 
  children, 
  position 
}: { 
  children: ReactNode; 
  position: 'left' | 'right';
}) {
  if (!children) return null;
  
  return (
    <span className={`inline-flex items-center ${position === 'left' ? 'mr-0' : 'ml-0'}`}>
      {children}
    </span>
  );
}

/**
 * Button Component
 * 
 * A styled button component with variants, sizes, and loading states.
 * Follows Atomic Design principles as an Atom component.
 * Uses Builder Pattern for class construction.
 * Supports polymorphic `as` prop for rendering as different elements (Link, NextLink, etc.).
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // With icons
 * <Button leftIcon={<Icon />} rightIcon={<Icon />}>
 *   Action
 * </Button>
 * 
 * // Loading state
 * <Button isLoading loadingText="Saving...">
 *   Save
 * </Button>
 * 
 * // As Link
 * <Button as={Link} href="/page">
 *   Navigate
 * </Button>
 * 
 * // Icon only
 * <Button variant="iconOnly" leftIcon={<Icon />} aria-label="Close" />
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  loadingIcon,
  leftIcon,
  rightIcon,
  fullWidth = false,
  as: Component = 'button',
  className = '',
  disabled = false,
  children,
  'aria-label': ariaLabel,
  ...props
}, ref) {
  const builder = new ButtonClassBuilder();
  const classes = builder
    .addBase()
    .addVariant(variant)
    .addSize(size, variant)
    .addFullWidth(fullWidth)
    .addCustom(className)
    .build();

  // Determine if button is icon-only (no children, only icons)
  const isIconOnly = variant === 'iconOnly' || (!children && (leftIcon || rightIcon));
  
  // Aria label is required for icon-only buttons
  const finalAriaLabel = isIconOnly && !ariaLabel && !children
    ? 'Button' // Fallback, but should be provided
    : ariaLabel;

  // Normalize variant for spinner
  const normalizedVariant = variant === 'regular' ? 'primary' : variant;
  
  // Determine spinner variant based on button variant
  const getSpinnerVariant = (): 'primary' | 'secondary' | 'neutral' => {
    if (normalizedVariant === 'error') return 'primary'; // Red buttons use primary spinner (white)
    if (normalizedVariant === 'primary' || normalizedVariant === 'secondary') return 'neutral'; // Colored buttons use neutral spinner
    return 'primary'; // Default
  };
  
  // Loading state
  const displayLoadingIcon = loadingIcon || (
    <Spinner 
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} 
      variant={getSpinnerVariant()}
    />
  );

  const buttonProps = {
    className: classes,
    disabled: disabled || isLoading,
    'aria-busy': isLoading,
    'aria-label': finalAriaLabel,
    'aria-disabled': disabled || isLoading,
    ...(Component === 'button' ? { type: 'button' as const } : {}),
    ...props,
  };

  return (
    <Component
      ref={ref}
      {...buttonProps}
    >
      {isLoading ? (
        <>
          {displayLoadingIcon}
          {loadingText && <span className="ml-2">{loadingText}</span>}
          {!loadingText && children && <span className="ml-2 opacity-0">{children}</span>}
        </>
      ) : (
        <>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          {children}
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
