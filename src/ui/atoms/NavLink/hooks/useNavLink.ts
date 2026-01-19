/**
 * useNavLink Hook
 * 
 * Custom hook for NavLink active state detection and Next.js integration.
 * 
 * @see RFC-001: NavLink Hook Strategy (APPROVED - Hybrid approach)
 * @see RFC-002: Next.js Integration Strategy (APPROVED - Auto-detect)
 * @see ADR-001: Active State Detection (ACCEPTED - Hybrid strategy)
 */

'use client';

import { useMemo } from 'react';

/**
 * useNavLink Hook Options
 */
export interface UseNavLinkOptions {
  /**
   * URL of the navigation link
   */
  href: string;

  /**
   * Manual active state (has priority over auto-detect)
   * 
   * Priority: manual active > auto-detect > false
   * @see ADR-001
   */
  active?: boolean;
}

/**
 * useNavLink Hook Result
 */
export interface UseNavLinkResult {
  /**
   * Whether the link is active
   */
  isActive: boolean;

  /**
   * Next.js Link component (if available)
   */
  NextLink?: React.ComponentType<{ href: string; children?: React.ReactNode; [key: string]: unknown }>;
}

/**
 * useNavLink Hook
 * 
 * Detects active state and provides Next.js Link integration.
 * 
 * @param options - Hook options
 * @returns Hook result with active state and Next.js Link
 * 
 * @example
 * ```tsx
 * const { isActive, NextLink } = useNavLink({ href: '/home' });
 * 
 * const LinkComponent = NextLink || 'a';
 * 
 * return (
 *   <LinkComponent href={href} className={isActive ? 'active' : ''}>
 *     {children}
 *   </LinkComponent>
 * );
 * ```
 */
export function useNavLink({ href: _href, active }: UseNavLinkOptions): UseNavLinkResult {
  // Active state detection (ADR-001 ACCEPTED)
  // Priority: manual active > auto-detect (usePathname) > false
  const isActive = useMemo(() => {
    // Manual active prop has priority
    if (active !== undefined) {
      return active;
    }

    // TODO: Auto-detect using usePathname (if Next.js available)
    // This needs to be handled in the component since we can't conditionally call hooks
    // The component will call usePathname if available and pass pathname to this hook
    // For now, default to false
    return false;
  }, [active]);

  // Auto-detect Next.js Link component (RFC-002 APPROVED)
  const NextLink = useMemo(() => {
    try {
      // Dynamic require for Next.js Link (RFC-002 APPROVED)
      // This is safe because we're in a try-catch and only for optional dependency
      // @ts-expect-error - require is available at runtime but not in TypeScript types
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nextLink = typeof require !== 'undefined' ? require('next/link') : null;
      return (nextLink as { default?: React.ComponentType<{ 
        href: string; 
        children?: React.ReactNode; 
        className?: string; 
        [key: string]: unknown;
      }> } | null)?.default;
    } catch {
      // Next.js not available - this is expected and safe
      return undefined;
    }
  }, []);

  return {
    isActive,
    NextLink,
  };
}
