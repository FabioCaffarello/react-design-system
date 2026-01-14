'use client';

import { createContext, useContext } from 'react';
import type { NavbarContextValue } from '../types';

/**
 * Context for the Navbar subcomponent
 *
 * Provides navbar-specific state that inherits from the root SideNavbar context.
 * Must be used within a Navbar component.
 */
export const NavbarContext = createContext<NavbarContextValue | null>(null);

/**
 * Hook to access Navbar context (returns null if outside Navbar)
 */
export function useNavbar(): NavbarContextValue | null {
  return useContext(NavbarContext);
}

/**
 * Hook to access Navbar context (throws if outside Navbar)
 * @throws Error if used outside of Navbar component
 */
export function useNavbarRequired(): NavbarContextValue {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarRequired must be used within a SideNavbar.Navbar component');
  }
  return context;
}

export default NavbarContext;
