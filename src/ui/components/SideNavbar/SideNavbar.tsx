"use client";

import React, { useMemo } from "react";
import { SideNavbarProvider } from "./providers/SideNavbarProvider";
import { SideNavbarThemeProvider } from "./providers/SideNavbarThemeProvider";
import { SideNavbarConfigProvider } from "./providers/SideNavbarConfigProvider";
import { SideNavbarStateProvider } from "./providers/SideNavbarStateProvider";
import { SidebarSlotProvider } from "./providers/SidebarSlotProvider";
import { SideNavbarToggleContext } from "./contexts/SideNavbarToggleContext";
import SideNavbarRoot from "./components/SideNavbarRoot";
import SideNavbarToggle from "./components/SideNavbarToggle";
import SideNavbarResizeHandle from "./components/SideNavbarResizeHandle";
import SideNavbarBackdrop from "./components/SideNavbarBackdrop";
// Subcomponents with their own contexts
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import type { SideNavbarProps } from "./types";

/**
 * SideNavbar Component
 *
 * A flexible, compound sidebar component with layered context architecture.
 * Supports multiple modes, resizing, responsive behavior, and content groups.
 *
 * ## Architecture
 *
 * Uses hierarchical context system:
 * - **Root Contexts** (3 layers): Theme, Config, State
 * - **Subcomponent Contexts**: Navbar, Sidebar (inherit from root)
 *
 * ## Modes
 *
 * - `full`: Navigation + Content (default) - Full sidebar with collapsible content
 * - `navigation`: Navigation only - Just the icon bar, no collapsible content
 * - `minimal`: Navigation with hover expand (future)
 *
 * ## Subcomponents (with own contexts)
 *
 * - `SideNavbar.Navbar` - Icon navigation column with its own NavbarContext
 *   - Main toggle button is rendered at top-right of navbar by default
 *   - `SideNavbar.Navbar.Item` - Navigation item with icon
 *   - `SideNavbar.Navbar.Toggle` - Internal toggle button (optional, inside navbar)
 *   - `SideNavbar.Navbar.Separator` - Visual separator
 *
 * - `SideNavbar.Sidebar` - Expandable content area with its own SidebarContext
 *   - `SideNavbar.Sidebar.Header` - Header section
 *   - `SideNavbar.Sidebar.Content` - Scrollable content area
 *   - `SideNavbar.Sidebar.Footer` - Footer section
 *   - `SideNavbar.Sidebar.Group` - Collapsible groups
 *   - `SideNavbar.Sidebar.Slot` - Content slot (exclusive to Sidebar, not Navbar)
 *   - `SideNavbar.Sidebar.SlotContent` - Renders active slot content
 *
 * ## Utility Components
 *
 * - `SideNavbar.Toggle` - Toggle button component (rendered in Navbar by default)
 * - `SideNavbar.ResizeHandle` - Resize handle for resizable sidebars
 * - `SideNavbar.Backdrop` - Mobile overlay backdrop
 *
 * ## Providers (for advanced usage)
 *
 * - `SideNavbar.Provider` - Combined provider
 * - `SideNavbar.ThemeProvider`, `SideNavbar.ConfigProvider`, `SideNavbar.StateProvider`
 * - `SideNavbar.SlotProvider` - Slot system provider (exclusive to Sidebar content)
 *
 * ## Slot System (Sidebar Only)
 *
 * The slot system allows dynamic content switching within the Sidebar.
 * **Important: Slots only work within the Sidebar component, not the Navbar.**
 * Use `SidebarSlotProvider` to wrap Sidebar content, then use `SidebarSlot` and
 * `SidebarSlotContent` to manage dynamic content.
 *
 * @example
 * ```tsx
 * @example
 * ```tsx
 * <SideNavbar mode="full" variant="elevated">
 *   <SideNavbar.Navbar showToggle togglePosition="bottom">
 *     <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *     <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
 *   </SideNavbar.Navbar>
 *
 *   <SideNavbar.Sidebar>
 *     <SideNavbar.Sidebar.Header title="Dashboard" />
 *     <SideNavbar.Sidebar.Content>
 *       <SideNavbar.Sidebar.Group id="stats" title="Statistics">
 *         <StatsList />
 *       </SideNavbar.Sidebar.Group>
 *     </SideNavbar.Sidebar.Content>
 *     <SideNavbar.Sidebar.Footer>
 *       <Button>Apply</Button>
 *     </SideNavbar.Sidebar.Footer>
 *   </SideNavbar.Sidebar>
 * </SideNavbar>
 * ```
 * ```
 */
function SideNavbar({
  // Mode
  mode = "full",

  // Theme
  variant = "default",
  navigationWidth = "56px",
  width = "320px",
  animationDuration = 300,

  // Config
  resizable = false,
  minWidth,
  maxWidth,
  snapPoints,
  responsive = false,
  mobileBreakpoint = 768,
  mobileVariant = "collapse",
  overlayBackdrop = true,
  storageKey,
  persistWidth = false,

  // State
  defaultCollapsed = false,
  collapsed,
  onCollapseChange,
  onWidthChange,
  onMobileChange,
  exclusiveGroups = false,

  // Toggle
  showToggle = true,
  togglePosition = "floating",

  // Rest
  children,
  ...rootProps
}: SideNavbarProps) {
  // Memoize toggle context value to prevent unnecessary re-renders
  const toggleContextValue = useMemo(
    () => ({
      showMainToggle: showToggle,
      mainTogglePosition: togglePosition,
    }),
    [showToggle, togglePosition],
  );

  return (
    <SideNavbarToggleContext.Provider value={toggleContextValue}>
      <SideNavbarProvider
        // Theme
        variant={variant}
        navigationWidth={navigationWidth}
        contentWidth={width}
        animationDuration={animationDuration}
        // Config
        mode={mode}
        resizable={resizable}
        minWidth={minWidth}
        maxWidth={maxWidth}
        snapPoints={snapPoints}
        responsive={responsive}
        mobileBreakpoint={mobileBreakpoint}
        mobileVariant={mobileVariant}
        overlayBackdrop={overlayBackdrop}
        storageKey={storageKey}
        persistWidth={persistWidth}
        // State
        defaultCollapsed={defaultCollapsed}
        collapsed={collapsed}
        onCollapseChange={onCollapseChange}
        onWidthChange={onWidthChange}
        onMobileChange={onMobileChange}
        exclusiveGroups={exclusiveGroups}
      >
        <SideNavbarRoot {...rootProps}>{children}</SideNavbarRoot>
      </SideNavbarProvider>
    </SideNavbarToggleContext.Provider>
  );
}

// ============================================================================
// Subcomponents (with their own contexts)
// ============================================================================
SideNavbar.Navbar = Navbar;
SideNavbar.Sidebar = Sidebar;

// ============================================================================
// Utility Components
// ============================================================================
SideNavbar.Toggle = SideNavbarToggle;
SideNavbar.ResizeHandle = SideNavbarResizeHandle;
SideNavbar.Backdrop = SideNavbarBackdrop;

// ============================================================================
// Providers (for advanced usage)
// ============================================================================
SideNavbar.Provider = SideNavbarProvider;
SideNavbar.ThemeProvider = SideNavbarThemeProvider;
SideNavbar.ConfigProvider = SideNavbarConfigProvider;
SideNavbar.StateProvider = SideNavbarStateProvider;
SideNavbar.SlotProvider = SidebarSlotProvider;

export default SideNavbar;
