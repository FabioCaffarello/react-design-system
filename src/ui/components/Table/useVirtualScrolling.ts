"use client";

import { useState, useEffect, useRef, useMemo } from "react";

export interface UseVirtualScrollingOptions {
  itemHeight: number; // Height of each row in pixels
  containerHeight?: number; // Height of visible container
  overscan?: number; // Number of items to render outside visible area
  enabled?: boolean; // Whether virtual scrolling is enabled
}

export interface VirtualScrollingResult {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    size: number;
  }>;
  totalHeight: number;
  scrollOffset: number;
  setScrollOffset: (offset: number) => void;
  scrollToIndex: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * useVirtualScrolling Hook
 *
 * Hook for virtual scrolling to improve performance with large datasets.
 * Only renders visible items plus overscan buffer.
 *
 * @example
 * ```tsx
 * const { virtualItems, totalHeight, containerRef } = useVirtualScrolling({
 *   itemHeight: 50,
 *   containerHeight: 400,
 *   overscan: 5,
 * });
 * ```
 */
export function useVirtualScrolling<T>(
  items: T[],
  options: UseVirtualScrollingOptions,
): VirtualScrollingResult {
  const { itemHeight, containerHeight, overscan = 5, enabled = true } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const virtualItems = useMemo(() => {
    if (!enabled || items.length === 0) {
      return items.map((_, index) => ({
        index,
        start: index * itemHeight,
        end: (index + 1) * itemHeight,
        size: itemHeight,
      }));
    }

    const visibleStart = Math.max(
      0,
      Math.floor(scrollOffset / itemHeight) - overscan,
    );
    const visibleEnd = containerHeight
      ? Math.min(
          items.length,
          Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan,
        )
      : items.length;

    const result: Array<{
      index: number;
      start: number;
      end: number;
      size: number;
    }> = [];
    for (let i = visibleStart; i < visibleEnd; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
      });
    }
    return result;
  }, [items, itemHeight, scrollOffset, containerHeight, overscan, enabled]);

  const totalHeight = items.length * itemHeight;

  // Handle scroll events
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const handleScroll = () => {
      setScrollOffset(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const offset = index * itemHeight;
    containerRef.current.scrollTop = offset;
    setScrollOffset(offset);
  };

  return {
    virtualItems,
    totalHeight,
    scrollOffset,
    setScrollOffset,
    scrollToIndex,
    containerRef,
  };
}
