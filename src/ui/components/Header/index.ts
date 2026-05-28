/**
 * Header Exports
 *
 * Exports for the Header component and related types.
 */

export { default as Header } from "./Header";
export { Header as HeaderComponent } from "./Header";
export type { HeaderProps, HeaderVariant, HeaderMaxWidth } from "./types";

// Export subcomponents
export { HeaderLogo } from "./components/HeaderLogo";
export type { HeaderLogoProps } from "./components/HeaderLogo";
export { HeaderNavigation } from "./components/HeaderNavigation";
export type { HeaderNavigationProps } from "./components/HeaderNavigation";
export { HeaderActions } from "./components/HeaderActions";
export type { HeaderActionsProps } from "./components/HeaderActions";
export { HeaderHamburger } from "./components/HeaderHamburger";
export type { HeaderHamburgerProps } from "./components/HeaderHamburger";
export { HeaderMobileMenu } from "./components/HeaderMobileMenu";
export type { HeaderMobileMenuProps } from "./components/HeaderMobileMenu";

// Export context
export { HeaderProvider, useHeaderContext } from "./contexts/HeaderContext";
export type {
  HeaderContextValue,
  HeaderProviderProps,
} from "./contexts/HeaderContext";
