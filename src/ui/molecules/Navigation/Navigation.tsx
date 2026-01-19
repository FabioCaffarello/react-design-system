/**
 * Navigation Component
 * 
 * Horizontal or vertical navigation component using NavLink internally.
 * 
 * @see EPIC-003: Navigation Component (Molecule)
 * @see RFC-005: Navigation Composition Pattern (APPROVED)
 */

'use client';

import React, { useMemo } from 'react';
import { NavLink } from '../../atoms/NavLink';
import type { NavigationProps } from './types';
import { cn, cva } from '../../utils';

/**
 * Navigation Variants using CVA
 * Type-safe variant system for Navigation component
 */
const navigationVariants = cva(
  // Base classes
  cn('flex', 'items-center', 'gap-2'),
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      variant: {
        default: '',
        pills: '',
        tabs: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
    },
    compoundVariants: [
      {
        orientation: 'vertical',
        variant: 'default',
        class: 'items-stretch',
      },
      {
        orientation: 'vertical',
        variant: 'pills',
        class: 'items-stretch',
      },
      {
        orientation: 'vertical',
        variant: 'tabs',
        class: 'items-stretch',
      },
    ],
  }
);

/**
 * Navigation Component
 * 
 * Navigation component that uses NavLink internally.
 * Supports horizontal and vertical orientations, variants, and icons.
 * 
 * @example
 * ```tsx
 * <Navigation
 *   items={[
 *     { href: '/home', label: 'Home', active: true },
 *     { href: '/about', label: 'About' },
 *   ]}
 *   orientation="horizontal"
 *   variant="default"
 * />
 * ```
 */
/**
 * Navigation Component (Internal with pathname detection)
 * 
 * Internal component that can use Next.js usePathname hook.
 */
function NavigationWithPathname({
  items,
  orientation = 'horizontal',
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Main navigation',
  bare = false,
  pathname: providedPathname,
  ...props
}: NavigationProps & { pathname?: string }) {
  // Try to get pathname from Next.js if not provided
  // We use a wrapper pattern to safely call usePathname
  let currentPathname: string | undefined = providedPathname;
  
  if (!currentPathname) {
    // Try to use Next.js usePathname hook
    // We need to check if we can safely call it
    try {
      // @ts-expect-error - usePathname is available at runtime but not in TypeScript types
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nextNavigation = typeof require !== 'undefined' ? require('next/navigation') : null;
      if (nextNavigation?.usePathname) {
        const usePathname = nextNavigation.usePathname;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        currentPathname = usePathname();
      }
    } catch {
      // Next.js not available or hook failed - this is expected and safe
      currentPathname = undefined;
    }
  }

  // Calculate active state for items
  const itemsWithActive = useMemo(() => {
    return items.map((item) => {
      // Manual active prop has priority
      if (item.active !== undefined) {
        return item;
      }

      // Auto-detect if pathname is available
      if (currentPathname) {
        const isActive = 
          currentPathname === item.href || 
          (item.href !== '/' && currentPathname.startsWith(`${item.href}/`));
        return { ...item, active: isActive };
      }

      // Default to false
      return { ...item, active: false };
    });
  }, [items, currentPathname]);

  const content = (
    <>
      {itemsWithActive.map((item, index) => {
        // Map Navigation variants to NavLink variants
        const navLinkVariant = 
          variant === 'pills' ? 'background' : 
          variant === 'tabs' ? 'underline' : 
          'default';
        
        return (
          <NavLink
            key={item.href || index}
            href={item.href}
            active={item.active}
            disabled={item.disabled}
            variant={navLinkVariant}
            className={cn(
              'flex items-center gap-2',
              orientation === 'vertical' && 'w-full justify-start',
              item.className
            )}
          >
            {item.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.badge && <span className="ml-auto">{item.badge}</span>}
          </NavLink>
        );
      })}
    </>
  );

  // Bare mode: Just render content without nav wrapper
  // Useful when used inside Header.Navigation which provides the nav wrapper
  if (bare) {
    return (
      <div className={cn(navigationVariants({ orientation, variant }), className)} {...props}>
        {content}
      </div>
    );
  }

  // Normal mode: Create nav element
  return (
    <nav
      className={cn(navigationVariants({ orientation, variant }), className)}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </nav>
  );
}

/**
 * Navigation Component (Public API)
 * 
 * Wrapper that handles Next.js integration safely.
 * Always uses NavigationWithPathname which will try to auto-detect pathname.
 */
export function Navigation(props: NavigationProps) {
  return <NavigationWithPathname {...props} pathname={props.pathname} />;
}

export default Navigation;
