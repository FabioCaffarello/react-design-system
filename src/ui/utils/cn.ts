/**
 * CN Utility - ClassName Merge
 *
 * Utility function for merging classNames with Tailwind conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution.
 *
 * @example
 * ```tsx
 * cn('base-class', condition && 'conditional-class', className)
 * cn(['class1', 'class2'], { 'class3': true })
 * ```
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges classNames and resolves Tailwind class conflicts.
 *
 * Uses clsx for conditional class handling and tailwind-merge
 * to intelligently merge Tailwind classes, resolving conflicts
 * (e.g., 'p-2' and 'p-4' -> 'p-4').
 *
 * @param inputs - Class values to merge (strings, arrays, objects)
 * @returns Merged className string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('base-class', 'another-class') // 'base-class another-class'
 *
 * // Conditional classes
 * cn('base', isActive && 'active', className)
 *
 * // Arrays and objects
 * cn(['class1', 'class2'], { 'class3': true, 'class4': false })
 *
 * // Tailwind conflict resolution
 * cn('p-2', 'p-4') // 'p-4' (p-2 is overridden)
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
