"use client";

import { useTabsContext } from "./TabsContext";
import { useRef, useEffect, type HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils";
import { getRadiusClass, getSpacingClass } from "../../tokens";

export interface TabsListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "orientation"
> {
  children: ReactNode;
  variant?: "default" | "compact";
  /**
   * Override orientation set on the `Tabs` provider. When omitted,
   * inherits from context (default "horizontal"). Controls keyboard
   * navigation axis (ArrowLeft/Right vs ArrowUp/Down), flex direction,
   * and `aria-orientation`.
   */
  orientation?: "horizontal" | "vertical";
}

/**
 * TabsList Component
 *
 * Container for tab triggers.
 * Manages keyboard navigation between tabs.
 * Must be used within a Tabs component.
 *
 * Orientation precedence: local `orientation` prop > Tabs context > "horizontal".
 */
export function TabsList({
  children,
  className = "",
  variant = "default",
  orientation: orientationProp,
  ...props
}: TabsListProps) {
  const { orientation: contextOrientation } = useTabsContext();
  const orientation = orientationProp ?? contextOrientation ?? "horizontal";
  const listRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation at list level
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const triggers = Array.from(
        list.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])',
        ),
      );
      const currentIndex = triggers.findIndex(
        (trigger) => trigger === document.activeElement,
      );

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (orientation === "horizontal") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % triggers.length;
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        }
      } else {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % triggers.length;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        }
      }

      if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = triggers.length - 1;
      }

      if (nextIndex !== currentIndex) {
        triggers[nextIndex]?.focus();
      }
    };

    list.addEventListener("keydown", handleKeyDown);
    return () => list.removeEventListener("keydown", handleKeyDown);
  }, [orientation]);

  // Determine display class based on variant and orientation
  // For compact vertical, use 'flex' instead of 'inline-flex' to allow full width
  const displayClass =
    variant === "compact" && orientation === "vertical"
      ? "flex"
      : "inline-flex";

  const orientationClasses =
    orientation === "vertical"
      ? cn("flex-col", getSpacingClass("xs", "gap"))
      : cn("flex-row", getSpacingClass("xs", "gap"));

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        displayClass,
        orientationClasses,
        getSpacingClass("xs", "p"),
        "bg-surface-muted",
        getRadiusClass("md"),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
