/**
 * CVA Utility - Class Variance Authority
 * 
 * Type-safe utility for creating component variants with compound variants support.
 * Based on class-variance-authority but integrated with our design system.
 * 
 * @example
 * ```tsx
 * const buttonVariants = cva('base-class', {
 *   variants: {
 *     variant: { primary: 'bg-blue-500', secondary: 'bg-gray-500' },
 *     size: { sm: 'text-sm', md: 'text-base' }
 *   },
 *   defaultVariants: { variant: 'primary', size: 'md' }
 * })
 * ```
 */

import { type VariantProps, cva as cvaLib } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { cn } from './cn';

/**
 * Re-export VariantProps for type inference
 */
export type { VariantProps };

/**
 * Creates a type-safe variant function with compound variants support.
 * 
 * Integrates with our cn() utility for proper Tailwind conflict resolution.
 * This is a thin wrapper around class-variance-authority's cva function
 * that ensures cn() is used for final class merging.
 * 
 * @param base - Base classes that always apply
 * @param config - Variant configuration with variants, compoundVariants, and defaultVariants
 * @returns Function that returns className based on variant props
 * 
 * @example
 * ```tsx
 * // Simple variants
 * const buttonVariants = cva('base-class', {
 *   variants: {
 *     variant: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white'
 *     },
 *     size: {
 *       sm: 'px-2 py-1 text-sm',
 *       md: 'px-4 py-2 text-base'
 *     }
 *   },
 *   defaultVariants: {
 *     variant: 'primary',
 *     size: 'md'
 *   }
 * });
 * 
 * // Usage
 * buttonVariants({ variant: 'primary', size: 'sm' })
 * 
 * // Compound variants
 * const badgeVariants = cva('base', {
 *   variants: {
 *     variant: { success: '', error: '' },
 *     style: { solid: '', outline: '' }
 *   },
 *   compoundVariants: [
 *     { variant: 'success', style: 'solid', class: 'bg-green-500' },
 *     { variant: 'error', style: 'outline', class: 'border-red-500' }
 *   ]
 * });
 * ```
 */
export const cva = <T extends Record<string, Record<string, ClassValue>>>(
  base?: ClassValue,
  config?: Parameters<typeof cvaLib<T>>[1]
) => {
  const variantFn = cvaLib(base, config);
  
  // Wrap to ensure cn() is used for final merge
  return ((props?: Parameters<typeof variantFn>[0]) => {
    const variantClasses = variantFn(props);
    return cn(variantClasses);
  }) as typeof variantFn;
};
