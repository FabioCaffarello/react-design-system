"use client";

import { useState, useEffect, useCallback } from "react";

export interface UseResponsiveSidebarOptions {
  /**
   * Breakpoint in pixels for mobile detection
   * @default 768
   */
  mobileBreakpoint?: number;

  /**
   * Callback when mobile state changes
   */
  onMobileChange?: (isMobile: boolean) => void;

  /**
   * Whether responsive behavior is enabled
   * @default true
   */
  enabled?: boolean;
}

export interface UseResponsiveSidebarReturn {
  /**
   * Whether current viewport is mobile
   */
  isMobile: boolean;

  /**
   * Current viewport width
   */
  viewportWidth: number;
}

/**
 * Hook for responsive sidebar behavior
 *
 * Detects mobile breakpoints and provides responsive state.
 *
 * @example
 * ```tsx
 * const { isMobile, viewportWidth } = useResponsiveSidebar({
 *   mobileBreakpoint: 768,
 *   onMobileChange: (isMobile) => console.log('Mobile:', isMobile)
 * });
 * ```
 */
export function useResponsiveSidebar({
  mobileBreakpoint = 768,
  onMobileChange,
  enabled = true,
}: UseResponsiveSidebarOptions = {}): UseResponsiveSidebarReturn {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined"
      ? window.innerWidth < mobileBreakpoint
      : false,
  );

  const handleResize = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    const newWidth = window.innerWidth;
    const newIsMobile = newWidth < mobileBreakpoint;

    setViewportWidth(newWidth);

    if (newIsMobile !== isMobile) {
      setIsMobile(newIsMobile);
      onMobileChange?.(newIsMobile);
    }
  }, [enabled, mobileBreakpoint, isMobile, onMobileChange]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Set initial state
    const initialWidth = window.innerWidth;
    const initialIsMobile = initialWidth < mobileBreakpoint;
    setViewportWidth(initialWidth);
    setIsMobile(initialIsMobile);

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for more accurate detection
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [enabled, mobileBreakpoint, handleResize]);

  return {
    isMobile,
    viewportWidth,
  };
}
