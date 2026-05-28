"use client";

import { type HTMLAttributes } from "react";
import { useSideNavbarStateRequired } from "../contexts/SideNavbarStateContext";
import { useSideNavbarThemeRequired } from "../contexts/SideNavbarThemeContext";
import { useSideNavbarConfigRequired } from "../contexts/SideNavbarConfigContext";

export interface SideNavbarBackdropProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Override visibility (uses context by default)
   */
  visible?: boolean;

  /**
   * Click handler override
   */
  onBackdropClick?: () => void;
}

/**
 * SideNavbar Backdrop Component
 *
 * Semi-transparent overlay for mobile overlay mode.
 * Automatically manages visibility based on sidebar state.
 *
 * @example
 * ```tsx
 * // Usually rendered automatically by SideNavbarRoot
 * <SideNavbar.Backdrop />
 *
 * // Or with custom click handler
 * <SideNavbar.Backdrop onBackdropClick={() => console.log('clicked')} />
 * ```
 */
export default function SideNavbarBackdrop({
  visible: visibleOverride,
  onBackdropClick,
  className = "",
  style,
  ...props
}: SideNavbarBackdropProps) {
  const { collapsed, setCollapsed, isMobile } = useSideNavbarStateRequired();
  const { animationDuration } = useSideNavbarThemeRequired();
  const { mobileVariant, overlayBackdrop } = useSideNavbarConfigRequired();

  // Determine visibility
  const isOverlayMode = isMobile && mobileVariant === "overlay";
  const shouldShow =
    visibleOverride ?? (isOverlayMode && overlayBackdrop && !collapsed);

  const handleClick = () => {
    if (onBackdropClick) {
      onBackdropClick();
    } else {
      setCollapsed(true);
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0
        bg-black/50
        z-40
        ${className}
      `}
      style={{
        animation: `fadeIn ${animationDuration}ms ease-in-out`,
        ...style,
      }}
      onClick={handleClick}
      aria-hidden="true"
      data-testid="side-navbar-backdrop"
      {...props}
    />
  );
}
