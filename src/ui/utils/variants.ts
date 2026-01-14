/**
 * Variant Helpers
 * 
 * Helper functions for common Tailwind variant patterns.
 * Integrates with design tokens for consistency.
 */

import { cn } from './cn';
import { getColorClass, getHoverColorClass, getFocusColorClass } from '../tokens/colors';
import { getSpacingClass, getSpacing } from '../tokens/spacing';
import { getTypographySize, getTypographyWeight, getTypographyClasses } from '../tokens/typography';
import { getRadiusClass } from '../tokens/radius';

/**
 * Creates variant classes based on color role and shade
 * 
 * @example
 * ```tsx
 * variant('primary', 'DEFAULT', 'bg') // 'bg-indigo-500'
 * variant('error', 'light', 'text') // 'text-red-100'
 * ```
 */
export function variant(
  role: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral',
  shade: 'light' | 'DEFAULT' | 'dark' | 'contrast' = 'DEFAULT',
  type: 'text' | 'bg' | 'border' = 'text'
): string {
  return getColorClass(role, shade as 'light' | 'DEFAULT' | 'dark' | 'contrast', type);
}

/**
 * Creates size classes based on spacing tokens
 * 
 * @example
 * ```tsx
 * size('sm', 'px') // 'px-2'
 * size('md', 'py') // 'py-3'
 * size('md', 'gap') // 'gap-4'
 * ```
 */
export function size(
  scale: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl',
  direction: 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl' | 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml' | 'gap' | 'space-x' | 'space-y' = 'p'
): string {
  // Handle gap and space-x/y which need special handling
  if (direction === 'gap' || direction === 'space-x' || direction === 'space-y') {
    // Get the spacing value from the token
    const spacingToken = getSpacing(scale);
    const spacingValue = spacingToken.tailwind; // e.g., '3' for md
    
    if (direction === 'gap') {
      return `gap-${spacingValue}`;
    }
    if (direction === 'space-x') {
      return `space-x-${spacingValue}`;
    }
    if (direction === 'space-y') {
      return `space-y-${spacingValue}`;
    }
  }
  return getSpacingClass(scale, direction);
}

/**
 * Creates state classes (hover, focus, active, disabled)
 * 
 * @example
 * ```tsx
 * state('hover', 'primary', 'light', 'bg') // 'hover:bg-indigo-100'
 * state('focus', 'error', 'DEFAULT', 'border') // 'focus:border-red-500'
 * ```
 */
export function state(
  stateType: 'hover' | 'focus' | 'active' | 'disabled',
  role: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral',
  shade: 'light' | 'DEFAULT' | 'dark' | 'contrast' = 'DEFAULT',
  type: 'text' | 'bg' | 'border' = 'bg'
): string {
  // Normalize shade for hover/focus (they don't support 'contrast')
  const hoverFocusShade = shade === 'contrast' ? 'DEFAULT' : (shade as 'light' | 'DEFAULT' | 'dark');
  
  if (stateType === 'hover') {
    return getHoverColorClass(role, hoverFocusShade, type);
  }
  if (stateType === 'focus') {
    return getFocusColorClass(role, hoverFocusShade, type);
  }
  if (stateType === 'active') {
    return `active:${getColorClass(role, shade as 'light' | 'DEFAULT' | 'dark' | 'contrast', type)}`;
  }
  // disabled
  return `disabled:${getColorClass(role, shade as 'light' | 'DEFAULT' | 'dark' | 'contrast', type)}`;
}

/**
 * Creates responsive classes based on breakpoints
 * 
 * @example
 * ```tsx
 * responsive('md', 'flex', 'hidden') // 'hidden md:flex'
 * responsive('lg', 'text-lg', 'text-sm') // 'text-sm lg:text-lg'
 * ```
 */
export function responsive(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  classes: string,
  baseClasses: string = ''
): string {
  return cn(baseClasses, `${breakpoint}:${classes}`);
}

/**
 * Creates typography variant classes
 * 
 * @example
 * ```tsx
 * typography('body') // 'text-base leading-relaxed font-normal'
 * typography('h1') // 'text-4xl leading-tight font-bold'
 * ```
 */
export function typography(
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodySmall' | 'bodyLarge' | 'label' | 'caption' | 'button',
  options?: {
    sizeOnly?: boolean;
    weightOnly?: boolean;
  }
): string {
  if (options?.sizeOnly) {
    return getTypographySize(variant);
  }
  if (options?.weightOnly) {
    return getTypographyWeight(variant);
  }
  // Return full typography classes
  return getTypographyClasses(variant);
}

/**
 * Creates radius classes
 * 
 * @example
 * ```tsx
 * radius('md') // 'rounded-md'
 * radius('full') // 'rounded-full'
 * ```
 */
export function radius(
  size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
): string {
  return getRadiusClass(size);
}

/**
 * Combines multiple variant helpers
 * 
 * @example
 * ```tsx
 * combine(
 *   variant('primary', 'DEFAULT', 'bg'),
 *   size('md', 'px'),
 *   state('hover', 'primary', 'light', 'bg')
 * )
 * ```
 */
export function combine(...classes: (string | undefined | null | false)[]): string {
  return cn(...classes);
}
