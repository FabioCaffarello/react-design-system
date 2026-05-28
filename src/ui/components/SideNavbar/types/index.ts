import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from "react";

// ============================================================================
// Mode Types
// ============================================================================

/**
 * SideNavbar operating mode
 * - 'full': Navigation + Content (default)
 * - 'navigation': Only navigation column (icons only)
 * - 'minimal': Navigation with hover expand (future)
 */
export type SideNavbarMode = "full" | "navigation" | "minimal";

/**
 * Visual variant for the sidebar
 */
export type SideNavbarVariant =
  | "default"
  | "compact"
  | "elevated"
  | "minimal"
  | "bordered";

/**
 * Mobile behavior when responsive is enabled
 */
export type SideNavbarMobileVariant = "overlay" | "push" | "collapse";

/**
 * Toggle button position
 */
export type SideNavbarTogglePosition =
  | "floating"
  | "top"
  | "bottom"
  | "inside"
  | "navigation-top"
  | "navigation-bottom";

/**
 * Toggle button variant
 */
export type SideNavbarToggleVariant = "default" | "ghost" | "outline";

/**
 * Content padding size
 */
export type SideNavbarPadding = "none" | "sm" | "md" | "lg";

// ============================================================================
// Theme Context Types
// ============================================================================

export interface SideNavbarThemeContextValue {
  /** Visual variant */
  variant: SideNavbarVariant;
  /** Width of navigation column */
  navigationWidth: number | string;
  /** Total width when expanded */
  contentWidth: number | string;
  /** Animation duration in ms */
  animationDuration: number;
  /** Animation easing function */
  animationEasing: string;
}

export interface SideNavbarThemeProviderProps {
  children: ReactNode;
  /** Visual variant */
  variant?: SideNavbarVariant;
  /** Width of navigation column */
  navigationWidth?: number | string;
  /** Total width when expanded */
  contentWidth?: number | string;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Animation easing function */
  animationEasing?: string;
}

// ============================================================================
// Config Context Types
// ============================================================================

export interface SideNavbarConfigContextValue {
  /** Operating mode */
  mode: SideNavbarMode;
  /** Whether resize is enabled */
  resizable: boolean;
  /** Minimum width when resizing */
  minWidth?: number;
  /** Maximum width when resizing */
  maxWidth?: number;
  /** Snap points for resize */
  snapPoints?: number[];
  /** Whether responsive behavior is enabled */
  responsive: boolean;
  /** Mobile breakpoint in pixels */
  mobileBreakpoint: number;
  /** Mobile variant behavior */
  mobileVariant: SideNavbarMobileVariant;
  /** Whether to show backdrop in mobile overlay */
  overlayBackdrop: boolean;
  /** Whether to persist state to storage */
  persistState: boolean;
  /** Whether to persist width to storage */
  persistWidth: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Keyboard shortcut for toggle */
  keyboardShortcut: string;
  /** Whether keyboard shortcut is enabled */
  enableKeyboardShortcut: boolean;
}

export interface SideNavbarConfigProviderProps {
  children: ReactNode;
  /** Operating mode */
  mode?: SideNavbarMode;
  /** Whether resize is enabled */
  resizable?: boolean;
  /** Minimum width when resizing */
  minWidth?: number;
  /** Maximum width when resizing */
  maxWidth?: number;
  /** Snap points for resize */
  snapPoints?: number[];
  /** Whether responsive behavior is enabled */
  responsive?: boolean;
  /** Mobile breakpoint in pixels */
  mobileBreakpoint?: number;
  /** Mobile variant behavior */
  mobileVariant?: SideNavbarMobileVariant;
  /** Whether to show backdrop in mobile overlay */
  overlayBackdrop?: boolean;
  /** Whether to persist state to storage */
  persistState?: boolean;
  /** Whether to persist width to storage */
  persistWidth?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Keyboard shortcut for toggle */
  keyboardShortcut?: string;
  /** Whether keyboard shortcut is enabled */
  enableKeyboardShortcut?: boolean;
}

// ============================================================================
// State Context Types
// ============================================================================

export interface SideNavbarStateContextValue {
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Toggle the collapsed state */
  toggle: () => void;
  /** Set the collapsed state directly */
  setCollapsed: (collapsed: boolean) => void;
  /** Current actual width in pixels */
  currentWidth: number;
  /** Set the current width */
  setWidth: (width: number) => void;
  /** Whether current viewport is mobile */
  isMobile: boolean;
  /** Whether currently resizing */
  isResizing: boolean;
  /** Start resize handler */
  startResize: (event: React.MouseEvent) => void;
  /** Group collapse states */
  groupStates: Record<string, boolean>;
  /** Toggle a group's collapsed state */
  toggleGroup: (groupId: string) => void;
  /** Set a group's collapsed state */
  setGroupCollapsed: (groupId: string, collapsed: boolean) => void;
  /** Reference to sidebar container */
  sidebarRef: React.RefObject<HTMLElement | null>;
}

export interface SideNavbarStateProviderProps {
  children: ReactNode;
  /** Default collapsed state for uncontrolled mode */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Callback when width changes */
  onWidthChange?: (width: number) => void;
  /** Callback when mobile state changes */
  onMobileChange?: (isMobile: boolean) => void;
  /** Whether groups should be exclusive (only one open at a time, like ButtonGroup) */
  exclusiveGroups?: boolean;
}

// ============================================================================
// Combined Provider Types
// ============================================================================

export interface SideNavbarProviderProps
  extends SideNavbarThemeProviderProps,
    Omit<SideNavbarConfigProviderProps, "children">,
    Omit<SideNavbarStateProviderProps, "children"> {}

// ============================================================================
// Component Props Types
// ============================================================================

export interface SideNavbarProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  // Mode
  /** Operating mode */
  mode?: SideNavbarMode;

  // Theme
  /** Visual variant */
  variant?: SideNavbarVariant;
  /** Width of navigation column */
  navigationWidth?: number | string;
  /** Total width when expanded */
  width?: number | string;
  /** Animation duration in ms */
  animationDuration?: number;

  // Config
  /** Whether resize is enabled */
  resizable?: boolean;
  /** Minimum width when resizing */
  minWidth?: number;
  /** Maximum width when resizing */
  maxWidth?: number;
  /** Snap points for resize */
  snapPoints?: number[];
  /** Whether responsive behavior is enabled */
  responsive?: boolean;
  /** Mobile breakpoint in pixels */
  mobileBreakpoint?: number;
  /** Mobile variant behavior */
  mobileVariant?: SideNavbarMobileVariant;
  /** Whether to show backdrop in mobile overlay */
  overlayBackdrop?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Whether to persist width to storage */
  persistWidth?: boolean;

  // State
  /** Default collapsed state for uncontrolled mode */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Callback when width changes */
  onWidthChange?: (width: number) => void;
  /** Callback when mobile state changes */
  onMobileChange?: (isMobile: boolean) => void;
  /** Whether groups should be exclusive (only one open at a time, like ButtonGroup) */
  exclusiveGroups?: boolean;

  // Toggle
  /** Whether to show the toggle button */
  showToggle?: boolean;
  /** Position of the toggle button */
  togglePosition?: SideNavbarTogglePosition;

  /** Children components */
  children: ReactNode;
}

export interface SideNavbarRootProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Children components */
  children: ReactNode;
}

export interface SideNavbarToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Position of the toggle button */
  position?: SideNavbarTogglePosition;
  /** Offset for fine-tuning position */
  offset?: { x?: number; y?: number };
  /** Custom icon or render function */
  icon?: ReactNode | ((collapsed: boolean) => ReactNode);
  /** Icon to show when collapsed */
  expandIcon?: ReactNode;
  /** Icon to show when expanded */
  collapseIcon?: ReactNode;
  /** Button size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Button variant */
  variant?: SideNavbarToggleVariant;
  /** Whether to show tooltip */
  showTooltip?: boolean;
  /** Tooltip position */
  tooltipPosition?: "top" | "right" | "bottom" | "left";
  /** Keyboard shortcut override */
  keyboardShortcut?: string;
  /** Whether keyboard shortcut is enabled */
  enableKeyboardShortcut?: boolean;
}

export type SideNavbarResizeHandleProps = HTMLAttributes<HTMLDivElement>;

export interface SideNavbarBackdropProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Whether the backdrop is visible */
  visible?: boolean;
  /** Click handler */
  onClick?: () => void;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseResizeOptions {
  /** Initial width */
  initialWidth: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Snap points */
  snapPoints?: number[];
  /** Snap threshold in pixels */
  snapThreshold?: number;
  /** Width change callback */
  onWidthChange?: (width: number) => void;
  /** Whether resize is enabled */
  enabled?: boolean;
}

export interface UseResizeReturn {
  /** Current width */
  width: number;
  /** Whether currently resizing */
  isResizing: boolean;
  /** Start resize handler */
  startResize: (event: React.MouseEvent) => void;
  /** Set width programmatically */
  setWidth: (width: number) => void;
}

export interface UseResponsiveSidebarOptions {
  /** Mobile breakpoint in pixels */
  mobileBreakpoint?: number;
  /** Mobile state change callback */
  onMobileChange?: (isMobile: boolean) => void;
  /** Whether responsive detection is enabled */
  enabled?: boolean;
}

export interface UseResponsiveSidebarReturn {
  /** Whether viewport is mobile */
  isMobile: boolean;
  /** Current viewport width */
  viewportWidth: number;
}

export interface UseKeyboardShortcutOptions {
  /** Key to listen for */
  key: string;
  /** Require Ctrl/Cmd */
  ctrl?: boolean;
  /** Require Shift */
  shift?: boolean;
  /** Require Alt */
  alt?: boolean;
  /** Require Meta */
  meta?: boolean;
  /** Callback when triggered */
  onTrigger: () => void;
  /** Whether shortcut is enabled */
  enabled?: boolean;
  /** Whether to prevent default */
  preventDefault?: boolean;
}

export interface UseFocusManagementOptions {
  /** Whether focus trap is active */
  isActive: boolean;
  /** Container ref */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Whether to restore focus on deactivate */
  restoreFocus?: boolean;
  /** Element to focus on activate */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export interface UseGroupStateOptions {
  /** Default collapsed states */
  defaultStates?: Record<string, boolean>;
  /** Whether to persist to storage */
  persist?: boolean;
  /** Storage key */
  storageKey?: string;
}

export interface UseGroupStateReturn {
  /** Current group states */
  groupStates: Record<string, boolean>;
  /** Toggle a group */
  toggleGroup: (groupId: string) => void;
  /** Set a group's state */
  setGroupCollapsed: (groupId: string, collapsed: boolean) => void;
  /** Reset all groups */
  resetGroups: () => void;
}

// ============================================================================
// Navbar Subcomponent Types
// ============================================================================

/**
 * Navbar toggle position within the navbar
 */
export type NavbarTogglePosition = "top" | "bottom";

/**
 * Navbar context value - provides navbar-specific state
 * Inherits collapse state from the root context via hooks
 * Updated with label mode support
 */
export interface NavbarContextValue {
  // Inherited from Root (via hook in implementation)
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Toggle the collapsed state */
  toggle: () => void;

  // Navbar-specific state
  /** Reference to navbar element */
  navbarRef: React.RefObject<HTMLElement | null>;
  /** Currently active item ID */
  activeItem: string | null;
  /** Set the active item */
  setActiveItem: (id: string | null) => void;
  /** Whether the navbar is hovered */
  isHovered: boolean;
  /** Whether to show internal toggle */
  showInternalToggle: boolean;
  /** Position of internal toggle */
  togglePosition: NavbarTogglePosition;
  /** Label display mode */
  labelMode?: NavbarLabelMode;
}

/**
 * NavbarItem props with label support (defined below)
 */
export interface NavbarItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Unique identifier */
  id?: string;
  /** Icon to display */
  icon: ReactNode;
  /** Label text (shown in tooltip or expanded state) */
  label?: string;
  /** Label display mode */
  labelMode?: NavbarLabelMode;
  /** Whether to show label */
  showLabel?: boolean;
  /** Whether this item is active */
  active?: boolean;
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Badge content (number, string, or ReactNode) */
  badge?: ReactNode;
  /** Badge variant */
  badgeVariant?: "default" | "success" | "warning" | "danger";
  /** Visual variant */
  variant?: "default" | "ghost" | "subtle";
  /** Size of the item */
  size?: "sm" | "md" | "lg";
  /** Link href (renders as anchor if provided) */
  href?: string;
  /** Link target (when href is provided) */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Click handler */
  onClick?: () => void;
}

/**
 * Navbar props with expanded mode and label support (defined below)
 */
export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Whether to show the main toggle button (at top-right of navbar) */
  showMainToggle?: boolean;
  /** Position of the main toggle button */
  mainTogglePosition?: SideNavbarTogglePosition;
  /** Whether to show the internal toggle button (inside navbar) */
  showToggle?: boolean;
  /** Position of the internal toggle */
  togglePosition?: NavbarTogglePosition;
  /** Label display mode */
  labelMode?: NavbarLabelMode;
  /** Expanded width when labelMode is 'inline' */
  expandedWidth?: number | string;
  /** Children content */
  children: ReactNode;
}

export interface NavbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
}

export interface NavbarToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Custom icon or render function */
  icon?: ReactNode | ((collapsed: boolean) => ReactNode);
  /** Button size */
  size?: "xs" | "sm" | "md";
  /** Button variant */
  variant?: "default" | "ghost" | "outline";
}

// ============================================================================
// Sidebar Subcomponent Types
// ============================================================================

/**
 * Sidebar context value - provides sidebar-specific state
 * Inherits state from the root context via hooks
 */
export interface SidebarContextValue {
  // Inherited from Root (via hook in implementation)
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Current width in pixels */
  currentWidth: number;
  /** Whether viewport is mobile */
  isMobile: boolean;

  // Sidebar-specific state
  /** Reference to sidebar element */
  sidebarRef: React.RefObject<HTMLElement | null>;
  /** Current scroll position */
  scrollPosition: number;
  /** Set scroll position */
  setScrollPosition: (position: number) => void;
  /** Whether sidebar has a header */
  hasHeader: boolean;
  /** Whether sidebar has a footer */
  hasFooter: boolean;
  /** Register header presence */
  registerHeader: () => void;
  /** Register footer presence */
  registerFooter: () => void;
  /** Unregister header */
  unregisterHeader: () => void;
  /** Unregister footer */
  unregisterFooter: () => void;
  /** Currently active group ID */
  activeGroup: string | null;
  /** Set the active group */
  setActiveGroup: (id: string | null) => void;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Children content */
  children: ReactNode;
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Whether to show bottom border */
  showBorder?: boolean;
  /** Children content (overrides title/subtitle) */
  children?: ReactNode;
}

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the content should be scrollable */
  scrollable?: boolean;
  /** Padding size */
  padding?: SideNavbarPadding;
  /** Children content */
  children?: ReactNode;
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding size */
  padding?: SideNavbarPadding;
  /** Whether to show top border */
  showBorder?: boolean;
  /** Children content */
  children: ReactNode;
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for the group */
  id: string;
  /** Group header title */
  title?: string;
  /** Header icon */
  icon?: ReactNode;
  /** Header action buttons */
  actions?: ReactNode;
  /** Whether the group can be collapsed */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Children content */
  children: ReactNode;
}

// ============================================================================
// Phase 2: Enhanced Navbar Types
// ============================================================================

/**
 * Label display modes for NavbarItem
 */
export type NavbarLabelMode = "tooltip" | "inline" | "below";

// ============================================================================
// Phase 3: Slot System Types
// ============================================================================

/**
 * Slot definition for dynamic sidebar content
 */
export interface SlotDefinition {
  id: string;
  content: ReactNode;
}

/**
 * Sidebar slot context value
 */
export interface SidebarSlotContextValue {
  /** Currently active slot ID */
  activeSlot: string | null;
  /** Set the active slot */
  setActiveSlot: (slotId: string | null) => void;
  /** Map of registered slots */
  slots: Map<string, ReactNode>;
  /** Register a slot */
  registerSlot: (id: string, content: ReactNode) => void;
  /** Unregister a slot */
  unregisterSlot: (id: string) => void;
}

/**
 * Sidebar slot provider props
 */
export interface SidebarSlotProviderProps {
  /** Children content */
  children: ReactNode;
  /** Default active slot ID */
  defaultSlot?: string | null;
}

// ============================================================================
// Phase 4: NavbarGroup Types
// ============================================================================

/**
 * NavbarGroup props for grouping navbar items
 */
export interface NavbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier */
  id?: string;
  /** Group label */
  label?: string;
  /** Whether the group can be collapsed */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Children content */
  children: ReactNode;
}
