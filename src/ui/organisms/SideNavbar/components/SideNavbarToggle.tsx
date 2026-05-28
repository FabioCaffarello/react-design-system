"use client";

import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSideNavbarStateRequired } from "../contexts/SideNavbarStateContext";
import { useSideNavbarThemeRequired } from "../contexts/SideNavbarThemeContext";
import { useSideNavbarConfigRequired } from "../contexts/SideNavbarConfigContext";
import Tooltip from "../../../primitives/Tooltip/Tooltip";
import type {
  SideNavbarToggleProps,
  SideNavbarTogglePosition,
  SideNavbarToggleVariant,
} from "../types";

const sizeClasses = {
  xs: "w-5 h-5",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const iconSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const positionClasses: Record<SideNavbarTogglePosition, string> = {
  floating: "absolute z-[100]", // Right edge of navbar, vertically centered - position set via style
  top: "absolute top-2 right-2 z-10",
  bottom: "absolute bottom-2 right-2 z-10",
  inside: "relative z-10",
  "navigation-top": "relative mt-2 mx-auto z-10",
  "navigation-bottom": "relative mt-auto mb-2 mx-auto z-10",
};

const variantClasses: Record<SideNavbarToggleVariant, string> = {
  default:
    "bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-accent)] hover:shadow",
  ghost: "bg-transparent hover:bg-[var(--color-accent)] border-0",
  outline:
    "bg-transparent border border-[var(--color-border)] hover:bg-[var(--color-accent)]",
};

const tooltipPositionMap: Record<
  SideNavbarTogglePosition,
  "top" | "right" | "bottom" | "left"
> = {
  floating: "right",
  top: "bottom",
  bottom: "top",
  inside: "right",
  "navigation-top": "right",
  "navigation-bottom": "right",
};

/**
 * SideNavbarToggle Component
 *
 * A flexible toggle button for collapsing/expanding the SideNavbar.
 * Supports custom icons, multiple positions, and variants.
 *
 * @example
 * ```tsx
 * // Default usage (with PanelLeft icons)
 * <SideNavbar.Toggle />
 *
 * // Custom icons
 * <SideNavbar.Toggle
 *   icon={(collapsed) => collapsed ? <ChevronRight /> : <ChevronLeft />}
 * />
 *
 * // Or separate icons
 * <SideNavbar.Toggle
 *   expandIcon={<ChevronRight />}
 *   collapseIcon={<ChevronLeft />}
 * />
 *
 * // Inside navigation
 * <SideNavbar.Navbar>
 *   <NavItems />
 *   <SideNavbar.Toggle position="navigation-bottom" variant="ghost" />
 * </SideNavbar.Navbar>
 * ```
 */
export default function SideNavbarToggle({
  position = "floating",
  offset,
  icon,
  expandIcon,
  collapseIcon,
  size = "sm",
  variant = "default",
  showTooltip = true,
  tooltipPosition: tooltipPositionOverride,
  keyboardShortcut: keyboardShortcutOverride,
  enableKeyboardShortcut: enableKeyboardShortcutOverride,
  className = "",
  style,
  "aria-label": ariaLabel,
  ...props
}: SideNavbarToggleProps) {
  const { collapsed, toggle } = useSideNavbarStateRequired();
  const {
    animationDuration,
    animationEasing,
    navigationWidth: _navigationWidth,
    contentWidth: _contentWidth,
    minWidth: _minWidth,
  } = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();

  // Use config values as defaults, allow prop overrides
  const keyboardShortcut = keyboardShortcutOverride ?? config.keyboardShortcut;
  const enableKeyboardShortcut =
    enableKeyboardShortcutOverride ?? config.enableKeyboardShortcut;

  // Render icon logic
  const renderIcon = () => {
    // Custom render function
    if (typeof icon === "function") {
      return icon(collapsed);
    }

    // Static custom icon
    if (icon) {
      return icon;
    }

    // Separate expand/collapse icons
    if (collapsed && expandIcon) {
      return expandIcon;
    }
    if (!collapsed && collapseIcon) {
      return collapseIcon;
    }

    // Default Lucide icons - sem animação de transform
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
    return (
      <Icon
        className={iconSizeClasses[size]}
        style={{
          transition: "none",
          transform: "none",
          willChange: "auto",
        }}
      />
    );
  };

  const defaultAriaLabel = collapsed ? "Expand sidebar" : "Collapse sidebar";
  const tooltipPosition =
    tooltipPositionOverride ?? tooltipPositionMap[position];

  const tooltipContent = showTooltip
    ? `${collapsed ? "Expand" : "Collapse"} sidebar${enableKeyboardShortcut ? ` (${keyboardShortcut})` : ""}`
    : undefined;

  // Calculate offset styles
  const offsetStyle = offset
    ? {
        transform: `translate(${offset.x ?? 0}px, ${offset.y ?? 0}px)`,
      }
    : {};

  // Determine if this is an inline position (inside navigation)
  const _isInlinePosition =
    position === "inside" ||
    position === "navigation-top" ||
    position === "navigation-bottom";

  // Edge-following toggle positioning (right edge of sidebar)
  // The toggle is now positioned in SideNavbarRoot (at <aside> level), not in <nav>
  // This means it's positioned relative to the entire sidebar, not just the navbar
  // When collapsed: sidebar width = nav width, toggle at right edge
  // When expanded: sidebar width = nav + content, toggle at right edge of full sidebar
  // Position: right edge of sidebar, aligned with first navbar item (home icon)
  // The toggle will automatically follow the sidebar's width when resized
  const edgeFollowingStyle =
    position === "floating"
      ? {
          // Toggle sempre na borda direita da sidebar completa (<aside>)
          // O <aside> é o container pai, então right: -12px sempre posiciona na borda direita da sidebar
          // Isso faz o toggle acompanhar o resize da sidebar automaticamente
          right: "-12px",
          // Posicionar na mesma altura do primeiro ícone (home)
          // Usando 1rem (16px) para melhor alinhamento com o primeiro item
          // Considerando p-2 (8px) + gap-2 (8px) + metade do primeiro item = ~16px
          top: "1rem",
          transform: "translateY(-50%)",
          // Transição suave para acompanhar o resize da sidebar
          transition: `right ${animationDuration}ms ${animationEasing}`,
          ...offsetStyle,
        }
      : offsetStyle;

  const button = (
    <button
      type="button"
      onClick={toggle}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-1
        ${position === "floating" ? "" : positionClasses[position]}
        ${className}
      `}
      style={{
        ...(position === "floating"
          ? {
              position: "absolute", // Absolute within the floating wrapper
              // The custom wrapper is at sidebar's content edge (right: 0 = 319px, sidebar has 1px border)
              // The Tooltip wrapper (div.static.inline-block) is inside the custom wrapper and doesn't interfere
              // Position button so its RIGHT edge is 12px outside sidebar's border edge
              // Sidebar border edge: 320px, desired right edge: 320 - 12 = 308px
              // Button width: 24px, so left edge should be: 308 - 24 = 284px
              // Wrapper is at content edge (319px), so button right should be: 319 - (320 - 308) = 307px
              // But we want right edge at 308px, so: right = -12px - 1px (border) = -13px
              // Actually, if wrapper is at 319px and we want button right at 308px: 319 - 308 = 11px offset
              // So: right = -11px (but this positions right edge at 319 - 11 = 308px ✓)
              right: "-11px", // Position button's right edge 11px outside wrapper (319px) = 308px (12px outside sidebar border)
              left: "auto", // Ensure left doesn't interfere
            }
          : {}),
        ...(position !== "floating" ? edgeFollowingStyle : {}),
        ...(position === "floating" ? { zIndex: 100 } : {}), // Ensure z-index is applied inline for floating position
        ...style,
      }}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-expanded={!collapsed}
      aria-controls="side-navbar-sidebar"
      data-position={position}
      {...props}
    >
      {renderIcon()}
    </button>
  );

  // For floating position, wrap in a container positioned relative to the sidebar (<aside>)
  // This ensures the toggle is always at the right edge of the entire sidebar, not just the nav
  // The toggle will automatically follow the sidebar's width when resized
  // The toggle should be positioned 12px outside the sidebar edge (half button width for visual balance)
  if (position === "floating") {
    // Create a wrapper that positions the toggle at the sidebar's right edge
    // The wrapper is positioned at sidebar's right edge (<aside>), and the button is positioned 12px outside
    const floatingButton =
      showTooltip && tooltipContent ? (
        <Tooltip
          content={tooltipContent}
          position={tooltipPosition}
          preservePositioning={true}
        >
          {button}
        </Tooltip>
      ) : (
        button
      );

    return (
      <div
        style={{
          position: "absolute",
          right: "0", // Align to sidebar's content edge (319px with 1px border)
          // Note: sidebar has box-sizing: border-box, so right: 0 positions at content edge
          // We compensate by adjusting the button's right value
          top: "1rem",
          transform: "translateY(-50%)",
          zIndex: 100,
        }}
      >
        {floatingButton}
      </div>
    );
  }

  if (showTooltip && tooltipContent) {
    return (
      <Tooltip content={tooltipContent} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
