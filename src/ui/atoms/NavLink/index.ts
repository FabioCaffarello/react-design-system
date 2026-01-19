/**
 * NavLink Exports
 * 
 * Exports for the NavLink component and related types.
 */

export { default as NavLink } from './NavLink';
export { NavLink as NavLinkComponent } from './NavLink';
export type { NavLinkProps, NavLinkVariant, NavLinkSize } from './types';

// Export hook for advanced usage (RFC-001 APPROVED - Hybrid approach)
export { useNavLink } from './hooks/useNavLink';
export type { UseNavLinkOptions, UseNavLinkResult } from './hooks/useNavLink';
