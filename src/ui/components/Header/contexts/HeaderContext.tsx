/**
 * Header Context
 *
 * Context for managing Header component state, particularly mobile menu state.
 *
 * @see ADR-002: Header + SideNavbar Compatibility (ACCEPTED)
 * @see EPIC-002: Header Component
 * @see TASK-014: Implementar HeaderContext Completo
 */

"use client";

/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Header Context Value
 */
export interface HeaderContextValue {
  /**
   * Whether the mobile menu is open
   */
  isMobileMenuOpen: boolean;

  /**
   * Toggle mobile menu state
   */
  toggleMobileMenu: () => void;

  /**
   * Set mobile menu state explicitly
   */
  setMobileMenuOpen: (open: boolean) => void;

  /**
   * Open mobile menu
   */
  openMobileMenu: () => void;

  /**
   * Close mobile menu
   */
  closeMobileMenu: () => void;
}

/**
 * Header Context
 *
 * Independent context for Header component state.
 * Does not interfere with SideNavbar contexts (ADR-002).
 */
const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

/**
 * Header Provider Props
 */
export interface HeaderProviderProps {
  /**
   * Children components
   */
  children: ReactNode;

  /**
   * Controlled mode: mobile menu open state
   */
  mobileMenuOpen?: boolean;

  /**
   * Callback when mobile menu state changes
   */
  onMobileMenuChange?: (open: boolean) => void;

  /**
   * Default mobile menu open state (uncontrolled mode)
   * @default false
   */
  defaultMobileMenuOpen?: boolean;
}

/**
 * HeaderProvider
 *
 * Provides Header context for mobile menu state management.
 * Independent from SideNavbarContexts (ADR-002).
 *
 * Supports both controlled and uncontrolled modes.
 *
 * @example
 * ```tsx
 * // Uncontrolled mode
 * <HeaderProvider>
 *   <Header>...</Header>
 * </HeaderProvider>
 *
 * // Controlled mode
 * <HeaderProvider
 *   mobileMenuOpen={isOpen}
 *   onMobileMenuChange={setIsOpen}
 * >
 *   <Header>...</Header>
 * </HeaderProvider>
 * ```
 */
export function HeaderProvider({
  children,
  mobileMenuOpen: controlledMobileMenuOpen,
  onMobileMenuChange,
  defaultMobileMenuOpen = false,
}: HeaderProviderProps) {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(
    defaultMobileMenuOpen,
  );

  const isControlled = controlledMobileMenuOpen !== undefined;
  const isMobileMenuOpen = isControlled
    ? controlledMobileMenuOpen
    : internalMobileMenuOpen;

  const setMobileMenuOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalMobileMenuOpen(open);
      }
      onMobileMenuChange?.(open);
    },
    [isControlled, onMobileMenuChange],
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, [setMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, [setMobileMenuOpen]);

  return (
    <HeaderContext.Provider
      value={{
        isMobileMenuOpen,
        toggleMobileMenu,
        setMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

/**
 * useHeaderContext Hook
 *
 * Hook to access Header context.
 * Must be used within HeaderProvider.
 *
 * @throws Error if used outside HeaderProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobileMenuOpen, toggleMobileMenu } = useHeaderContext();
 *   return <button onClick={toggleMobileMenu}>Toggle</button>;
 * }
 * ```
 */
export function useHeaderContext(): HeaderContextValue {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within HeaderProvider");
  }
  return context;
}
