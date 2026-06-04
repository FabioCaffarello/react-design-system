"use client";

import React, {
  Children,
  isValidElement,
  useState,
  useEffect,
  type ReactElement,
  type ReactNode,
} from "react";
import { useSideNavbarStateRequired } from "../contexts/SideNavbarStateContext";
import { useSideNavbarThemeRequired } from "../contexts/SideNavbarThemeContext";
import { useSideNavbarConfigRequired } from "../contexts/SideNavbarConfigContext";
import { useSideNavbarToggleContextRequired } from "../contexts/SideNavbarToggleContext";
import { cn } from "../../../utils";
import { getShadowClass } from "../../../tokens/shadows";
import { getZIndexClass } from "../../../tokens/z-index";
import SideNavbarResizeHandle from "./SideNavbarResizeHandle";
import SideNavbarBackdrop from "./SideNavbarBackdrop";
import SideNavbarToggle from "./SideNavbarToggle";
import type {
  SideNavbarRootProps,
  SideNavbarTogglePosition,
  NavbarProps,
} from "../types";

// ---------------------------------------------------------------------------
// Per-Navbar override resolution (render-driven, see Phase 2C Treatment 2)
// ---------------------------------------------------------------------------

/**
 * Type guard: is `child` a `<SideNavbar.Navbar>` element?
 *
 * Uses the static `__SIDENAVBAR_KIND__ === "navbar"` marker attached to
 * the Navbar component (set in Navbar.tsx). String tag is resilient to
 * React DevTools displayName mutations and survives function-identity
 * wrapping better than `element.type === Navbar` reference comparison.
 * The single `as` cast is confined to this guard with a `typeof !==
 * "string"` short-circuit guarding against host elements (which would
 * otherwise satisfy `isValidElement` but never carry our marker).
 */
function isNavbarElement(
  child: ReactNode,
): child is ReactElement<
  Pick<NavbarProps, "showMainToggle" | "mainTogglePosition">
> {
  if (!isValidElement(child)) return false;
  if (typeof child.type === "string") return false;
  return (
    (child.type as { __SIDENAVBAR_KIND__?: string }).__SIDENAVBAR_KIND__ ===
    "navbar"
  );
}

/**
 * Walk the direct `children` of SideNavbarRoot and return the first
 * `<SideNavbar.Navbar>` override (`showMainToggle` / `mainTogglePosition`)
 * in tree order, plus the count of overrides seen and a hint about
 * wrapper-nesting.
 *
 * Scope is deliberately ONLY direct children — deeper levels aren't
 * inspected (predictable behaviour; matches the documented compound
 * pattern of <SideNavbar><SideNavbar.Navbar/><SideNavbar.Sidebar/>...).
 *
 * The wrapper-nesting hint is a SHALLOW one-level peek: if a direct
 * child is NOT a Navbar but is an element with children that include
 * a Navbar carrying an override, we surface the fact so the caller
 * can warn the dev (Treatment 2 directive: silent failure is the
 * same defect class as the DataGrid dead button).
 *
 * Synchronous and pure — no effects, no state, no context. Correct on
 * the first render (including SSR), no hydration mismatch.
 */
function resolveNavbarOverride(children: ReactNode): {
  show?: boolean;
  position?: SideNavbarTogglePosition;
  overrideCount: number;
  wrappedNavbarWithOverride: boolean;
} {
  let firstShow: boolean | undefined = undefined;
  let firstPosition: SideNavbarTogglePosition | undefined = undefined;
  let count = 0;
  let wrappedHit = false;

  for (const child of Children.toArray(children)) {
    if (isNavbarElement(child)) {
      const { showMainToggle, mainTogglePosition } = child.props;
      const hasOverride =
        showMainToggle !== undefined || mainTogglePosition !== undefined;
      if (!hasOverride) continue;
      count++;
      if (count === 1) {
        firstShow = showMainToggle;
        firstPosition = mainTogglePosition;
      }
      continue;
    }
    // Wrapper-nesting peek: only one level deep, only if the direct
    // child is itself an element with children. Cheap and bounded.
    if (!isValidElement(child)) continue;
    const props = child.props as { children?: ReactNode };
    if (props.children === undefined) continue;
    for (const grandchild of Children.toArray(props.children)) {
      if (!isNavbarElement(grandchild)) continue;
      const { showMainToggle, mainTogglePosition } = grandchild.props;
      if (showMainToggle !== undefined || mainTogglePosition !== undefined) {
        wrappedHit = true;
        break;
      }
    }
  }

  return {
    show: firstShow,
    position: firstPosition,
    overrideCount: count,
    wrappedNavbarWithOverride: wrappedHit,
  };
}

const variantClasses = {
  default: "",
  compact: "text-sm",
  elevated: getShadowClass("lg"),
  minimal: "border-0",
  bordered: "border-2",
};

/**
 * SideNavbar Root Component
 *
 * The inner container component that renders the sidebar structure.
 * Uses all three contexts (Theme, Config, State) for rendering.
 *
 * This component is typically used internally by SideNavbar,
 * but can be used directly with individual providers for advanced customization.
 *
 * @example
 * ```tsx
 * // Usually wrapped by SideNavbar
 * <SideNavbar>
 *   <SideNavbar.Navbar>...</SideNavbar.Navbar>
 *   <SideNavbar.Sidebar>
 *     <SideNavbar.Sidebar.Content>...</SideNavbar.Sidebar.Content>
 *   </SideNavbar.Sidebar>
 * </SideNavbar>
 *
 * // Or with individual providers
 * <SideNavbar.ThemeProvider variant="elevated">
 *   <SideNavbar.ConfigProvider mode="full" resizable>
 *     <SideNavbar.StateProvider>
 *       <SideNavbarRoot>...</SideNavbarRoot>
 *     </SideNavbar.StateProvider>
 *   </SideNavbar.ConfigProvider>
 * </SideNavbar.ThemeProvider>
 * ```
 */
export default function SideNavbarRoot({
  children,
  className = "",
  style,
  "aria-label": ariaLabel,
  ...props
}: SideNavbarRootProps) {
  // Get context values
  const state = useSideNavbarStateRequired();
  const theme = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();
  const toggleContext = useSideNavbarToggleContextRequired();

  // Resolve per-Navbar main-toggle override synchronously from the
  // children of this Root render. Render-driven (no effect, no state,
  // no context roundtrip) so it's correct on the first commit and on
  // SSR — see resolveNavbarOverride header for the design rationale.
  const navbarOverride = resolveNavbarOverride(children);

  // Dev warnings, both synchronous in render so they fire identically
  // on SSR and client. Two distinct cases:
  // - Multi-Navbar with overrides: tree-order-first wins; the rest are
  //   silently dropped. Warn so the dev sees the conflict instead of
  //   having to debug why only the first override applies.
  // - Wrapper-nested Navbar: only DIRECT children are inspected. If a
  //   wrapper hides a Navbar that carries an override, it falls back
  //   to the global toggle context with no visible signal — same
  //   silent-failure class the DataGrid dead button had. Warn.
  if (import.meta.env.DEV) {
    if (navbarOverride.overrideCount > 1) {
      console.error(
        "SideNavbar: multiple <SideNavbar.Navbar> children set " +
          "main-toggle overrides (showMainToggle / mainTogglePosition). " +
          "Only the first in tree order applies; the rest are ignored. " +
          "Override is a single-Navbar feature — pass these props on at " +
          "most one <SideNavbar.Navbar>.",
      );
    }
    if (navbarOverride.wrappedNavbarWithOverride) {
      console.error(
        "SideNavbar: a <SideNavbar.Navbar> with a main-toggle override " +
          "appears nested inside a wrapper element. Overrides are only " +
          "read from DIRECT <SideNavbar.Navbar> children — move the " +
          "props up to the Navbar at the SideNavbar root, or remove the " +
          "wrapper.",
      );
    }
  }

  // First override (if any) wins; otherwise fall back to the global
  // toggle context (the existing pre-override behaviour).
  const resolvedShowMainToggle =
    navbarOverride.show ?? toggleContext.showMainToggle;
  const resolvedMainTogglePosition =
    navbarOverride.position ?? toggleContext.mainTogglePosition;

  const {
    collapsed,
    setCollapsed: _setCollapsed,
    currentWidth,
    isResizing,
    sidebarRef,
    isMobile,
  } = state;

  const {
    variant,
    navigationWidth,
    contentWidth,
    animationDuration,
    animationEasing,
  } = theme;

  const { mode, resizable, mobileVariant, overlayBackdrop } = config;

  // Parse widths
  const navWidthValue =
    typeof navigationWidth === "number"
      ? `${navigationWidth}px`
      : navigationWidth;

  const contentWidthValue =
    typeof contentWidth === "number" ? `${contentWidth}px` : contentWidth;

  // Calculate displayed width based on mode
  const calculateWidth = () => {
    if (mode === "navigation") {
      // Navigation-only mode: always show just navigation
      return navWidthValue;
    }

    if (collapsed) {
      return navWidthValue;
    }

    // Use resize width if resizable, otherwise configured width
    return resizable ? `${currentWidth}px` : contentWidthValue;
  };

  const displayedWidth = calculateWidth();

  // Mobile overlay mode
  // Usar estado para evitar hydration mismatch - só renderizar backdrop após mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isMobileOverlay = isMobile && mobileVariant === "overlay";

  // Durante SSR e antes do mount, sempre usar 'relative' para evitar hydration mismatch
  // Após mount, usar a classe correta baseada em isMobileOverlay
  // IMPORTANTE: Em desktop, sempre usar 'relative' para ficar no mesmo plano do conteúdo
  // Apenas em mobile overlay usar 'fixed' para sobrepor o conteúdo
  const shouldUseFixed = isMounted && isMobileOverlay;
  const positionClass = shouldUseFixed
    ? `fixed left-0 top-0 ${getZIndexClass("fixed")}`
    : "relative";

  return (
    <>
      {/* Mobile overlay backdrop - só renderizar após mount para evitar hydration mismatch */}
      {isMounted && isMobileOverlay && overlayBackdrop && !collapsed && (
        <SideNavbarBackdrop />
      )}

      <aside
        ref={sidebarRef as React.RefObject<HTMLElement>}
        // SideNavbarToggle's `aria-controls="side-navbar-sidebar"` must
        // resolve to an element that is ALWAYS in the DOM whenever the
        // toggle is rendered — independent of whether the consumer
        // composes in `<SideNavbar.Sidebar>` (the collapsible content
        // area) or only `<SideNavbar.Navbar>` (the icon strip, the
        // pattern DashboardLayout uses). The outer `<aside>` is that
        // anchor: it always renders, and structurally the toggle DOES
        // control this region's collapsed state. Previously the id
        // lived on Sidebar.tsx's inner `<div>`, which is conditional —
        // when Sidebar wasn't composed, the toggle's aria-controls was
        // a dangling reference (axe `aria-valid-attr-value`, critical).
        id="side-navbar-sidebar"
        className={cn(
          positionClass,
          "flex",
          "h-full",
          "overflow-visible",
          variantClasses[variant],
          shouldUseFixed && collapsed ? "-translate-x-full" : "translate-x-0",
          className,
        )}
        style={
          {
            // Em desktop: sempre 'relative' para ficar no mesmo plano do conteúdo
            // Em mobile overlay: 'fixed' para sobrepor o conteúdo
            position: shouldUseFixed ? "fixed" : "relative",
            backgroundColor: "var(--color-surface-subtle)",
            borderRight: "1px solid var(--color-line-default)",
            width: displayedWidth,
            minWidth: displayedWidth,
            transitionProperty: isResizing
              ? "none"
              : "width, min-width, transform",
            transitionDuration: `${animationDuration}ms`,
            transitionTimingFunction: animationEasing,
            ...style,
          } as React.CSSProperties
        }
        role="complementary"
        aria-label={ariaLabel || "Sidebar navigation"}
        aria-expanded={mode !== "navigation" ? !collapsed : undefined}
        data-mode={mode}
        data-collapsed={collapsed}
        {...props}
      >
        {/* Resize handle */}
        {resizable && mode !== "navigation" && !collapsed && (
          <SideNavbarResizeHandle />
        )}

        {/* Main toggle button at right edge of sidebar — show/position
            resolved synchronously from children-inspected override OR
            (when no override) the global toggle context. Always
            rendered here at the <aside> level; per-Navbar override
            does NOT relocate the DOM. */}
        {resolvedShowMainToggle && mode !== "navigation" && (
          <SideNavbarToggle position={resolvedMainTogglePosition} />
        )}

        {/* Content wrapper */}
        <div className="flex h-full w-full overflow-visible">{children}</div>
      </aside>
    </>
  );
}
