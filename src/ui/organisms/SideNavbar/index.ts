// Main component
export { default, default as SideNavbar } from './SideNavbar';

// Types
export type {
  // Mode and variant types
  SideNavbarMode,
  SideNavbarVariant,
  SideNavbarMobileVariant,
  SideNavbarTogglePosition,
  SideNavbarToggleVariant,
  SideNavbarPadding,
  // Context types
  SideNavbarThemeContextValue,
  SideNavbarConfigContextValue,
  SideNavbarStateContextValue,
  // Provider props
  SideNavbarThemeProviderProps,
  SideNavbarConfigProviderProps,
  SideNavbarStateProviderProps,
  SideNavbarProviderProps,
  // Component props
  SideNavbarProps,
  SideNavbarRootProps,
  SideNavbarToggleProps,
  SideNavbarResizeHandleProps,
  SideNavbarBackdropProps,
  // Hook types
  UseResizeOptions,
  UseResizeReturn,
  UseResponsiveSidebarOptions,
  UseResponsiveSidebarReturn,
  UseKeyboardShortcutOptions,
  UseFocusManagementOptions,
  UseGroupStateOptions,
  UseGroupStateReturn,
  // Navbar subcomponent types
  NavbarContextValue,
  NavbarProps,
  NavbarItemProps,
  NavbarSeparatorProps,
  NavbarToggleProps,
  NavbarTogglePosition,
  NavbarLabelMode,
  NavbarGroupProps,
  // Sidebar subcomponent types
  SidebarContextValue,
  SidebarProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupProps,
  // Slot system types
  SidebarSlotContextValue,
  SidebarSlotProviderProps,
  SlotDefinition,
} from './types';

// Contexts
export {
  SideNavbarThemeContext,
  useSideNavbarTheme,
  useSideNavbarThemeRequired,
  defaultThemeValues,
} from './contexts/SideNavbarThemeContext';

export {
  SideNavbarConfigContext,
  useSideNavbarConfig,
  useSideNavbarConfigRequired,
  defaultConfigValues,
} from './contexts/SideNavbarConfigContext';

export {
  SideNavbarStateContext,
  useSideNavbarState,
  useSideNavbarStateRequired,
} from './contexts/SideNavbarStateContext';

// Navbar Subcomponent Context
export {
  NavbarContext,
  useNavbar,
  useNavbarRequired,
} from './contexts/NavbarContext';

// Sidebar Subcomponent Context
export {
  SidebarContext,
  useSidebar,
  useSidebarRequired,
} from './contexts/SidebarContext';

// Sidebar Slot Context
export {
  SidebarSlotContext,
  useSidebarSlot,
  useSidebarSlotRequired,
} from './contexts/SidebarSlotContext';

// Toggle Context
export {
  SideNavbarToggleContext,
  useSideNavbarToggleContext,
  useSideNavbarToggleContextRequired,
} from './contexts/SideNavbarToggleContext';
export type { SideNavbarToggleContextValue } from './contexts/SideNavbarToggleContext';

// Providers
export { SideNavbarProvider } from './providers/SideNavbarProvider';
export { SideNavbarThemeProvider } from './providers/SideNavbarThemeProvider';
export { SideNavbarConfigProvider } from './providers/SideNavbarConfigProvider';
export { SideNavbarStateProvider } from './providers/SideNavbarStateProvider';
export { SidebarSlotProvider } from './providers/SidebarSlotProvider';

// Components (for standalone usage)
export { default as SideNavbarRoot } from './components/SideNavbarRoot';
export { default as SideNavbarToggle } from './components/SideNavbarToggle';
export { default as SideNavbarResizeHandle } from './components/SideNavbarResizeHandle';
export { default as SideNavbarBackdrop } from './components/SideNavbarBackdrop';

// Navbar Subcomponent (for standalone usage)
export { Navbar, NavbarToggle, NavbarItem, NavbarSeparator, NavbarGroup } from './components/Navbar';

// Sidebar Subcomponent (for standalone usage)
export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarSlot, SidebarSlotContent } from './components/Sidebar';

// Hooks
export {
  useResize,
  useResponsiveSidebar,
  useKeyboardShortcut,
  useFocusManagement,
  useGroupState,
  useSideNavbarCombined,
  useSideNavbarNavigation,
  useSideNavbarContent,
} from './hooks/useSideNavbar';

// Utilities
export {
  parseWidthToPixels,
  validateWidthBounds,
  clampWidth,
  parseKeyboardShortcut,
  formatKeyboardShortcut,
} from './utils';
export type { ParsedKeyboardShortcut } from './utils';
