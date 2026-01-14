'use client';

/**
 * Hook to access Navbar context
 * 
 * Re-exports the hooks from NavbarContext for convenience.
 * Use this hook to access navbar-specific state within Navbar subcomponents.
 * 
 * @example
 * ```tsx
 * function NavbarItem() {
 *   const { activeItem, setActiveItem, collapsed } = useNavbar();
 *   // ...
 * }
 * ```
 */
export { useNavbar, useNavbarRequired } from '../contexts/NavbarContext';
