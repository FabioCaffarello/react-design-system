"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getShadowClass } from "../../tokens/shadows";
import { getZIndexClass } from "../../tokens/z-index";
import { getAnimationClass } from "../../tokens/animations";
import { getSpacingClass } from "../../tokens/spacing";
import { useDrawerContext } from "./DrawerContext";
import { useFocusRestore } from "../../hooks/useFocusRestore";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import { X } from "lucide-react";
import { Button } from "../../primitives";

export interface DrawerContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  /**
   * Visible title rendered as a heading at the top of the drawer AND
   * wired as the dialog's accessible name via `aria-labelledby`. Use
   * this for the canonical case ("the drawer has a title").
   */
  title?: string;
  /**
   * Invisible accessible name. Use when the drawer has no visible
   * title (e.g. a content-only side panel). One of `title`,
   * `aria-label`, or `aria-labelledby` MUST be present — without any,
   * `role="dialog"` has no accessible name and axe `aria-dialog-name`
   * (serious) flags it. A dev-only warning fires when all three are
   * missing.
   */
  "aria-label"?: string;
  /**
   * Override path: point at an id the consumer manages externally
   * (typically a heading inside a `<DrawerHeader>` they laid out
   * themselves). Takes precedence over `title` (which would otherwise
   * generate its own id).
   */
  "aria-labelledby"?: string;
}

/**
 * DrawerContent Component
 *
 * The main content container for the drawer.
 * Renders in a portal with overlay.
 *
 * Accessible name — one of three paths:
 *   1. `title="..."` → auto-renders a heading at the top and wires
 *      `aria-labelledby` to it.
 *   2. `aria-label="..."` → invisible name on the dialog.
 *   3. `aria-labelledby="external-id"` → consumer-managed id (typically
 *      a heading they place inside `<DrawerHeader>`).
 *
 * If all three are absent, the dialog has no accessible name —
 * a dev-only `console.warn` fires.
 */
export default function DrawerContent({
  children,
  className = "",
  showCloseButton = false,
  title,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledByProp,
}: DrawerContentProps) {
  const autoTitleId = useId();
  // Precedence: explicit aria-labelledby > auto-generated from title.
  const resolvedLabelledBy =
    ariaLabelledByProp ?? (title ? autoTitleId : undefined);
  const {
    isOpen,
    closeDrawer,
    position,
    size,
    closeOnOverlayClick,
    closeOnEscape,
  } = useDrawerContext();

  // Modal focus contract: trap + auto-focus + restore. The drawer ships
  // role="dialog" aria-modal="true" — WAI-ARIA's modal pattern requires
  // focus to enter on open, cycle within the surface while open, and
  // return to the opening element on close. Prior to Phase 3 PR 2 the
  // drawer declared the role without honouring any of these — a real
  // WCAG 2.4.3 gap. The three hooks compose deliberately:
  //   - useFocusRestore snapshots document.activeElement on the rising
  //     edge (before useAutoFocus moves focus inside) and restores on
  //     the falling edge.
  //   - useFocusTrap cycles Tab/Shift+Tab within contentRef and pulls
  //     errant focus back inside.
  //   - useAutoFocus moves focus to the first focusable child (or the
  //     panel itself, with tabindex=-1) on the rising edge, deferred
  //     via setTimeout(0) to run after React's commit.
  const contentRef = useRef<HTMLDivElement>(null);
  useFocusRestore(isOpen);
  useFocusTrap(contentRef, isOpen);
  useAutoFocus(contentRef, isOpen);

  // Close on escape
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeDrawer();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, closeOnEscape, closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Dev-only accessible-name warning: a `role="dialog"` without
  // aria-label/aria-labelledby fails axe `aria-dialog-name`. The fix is
  // structural — supply one of the three paths documented on the props
  // — and the warning fires when none of them are present. Same shape
  // as the Textarea 6c guard; the Drawer is a public dialog surface,
  // a silent nameless `role="dialog"` is the defect we close here.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!isOpen) return;
    if (title || ariaLabel || resolvedLabelledBy) return;
    console.warn(
      '[DrawerContent] Missing accessible name. Provide `title`, `aria-label`, or `aria-labelledby` — `role="dialog"` without a name fails axe `aria-dialog-name`.',
    );
  }, [isOpen, title, ariaLabel, resolvedLabelledBy]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: position === "left" || position === "right" ? "w-64" : "h-64",
    md: position === "left" || position === "right" ? "w-96" : "h-96",
    lg: position === "left" || position === "right" ? "w-[32rem]" : "h-[32rem]",
    xl: position === "left" || position === "right" ? "w-[42rem]" : "h-[42rem]",
    full: position === "left" || position === "right" ? "w-full" : "h-full",
  };

  const positionClasses = {
    left: "left-0 top-0 bottom-0",
    right: "right-0 top-0 bottom-0",
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
  };

  const drawerContent = (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed
          inset-0
          bg-scrim
          ${getZIndexClass("modal")}
          ${getAnimationClass("base")}
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeOnOverlayClick ? closeDrawer : undefined}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={contentRef}
        className={`
          fixed
          ${positionClasses[position]}
          ${sizeClasses[size]}
          ${position === "left" || position === "right" ? "max-w-[90vw]" : "max-h-[90vh]"}
          bg-surface-overlay
          ${getShadowClass("xl")}
          ${getZIndexClass("modal")}
          ${getAnimationClass("base")}
          flex
          flex-col
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={resolvedLabelledBy}
        aria-label={resolvedLabelledBy ? undefined : ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            className={`
            flex
            items-center
            justify-between
            ${getSpacingClass("base", "px")}
            ${getSpacingClass("md", "py")}
            border-b
            border-line-default
          `}
          >
            {title ? (
              <h2
                id={autoTitleId}
                className="text-lg font-semibold text-fg-primary"
              >
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDrawer}
                className={`h-auto ${getSpacingClass("xs", "p")}`}
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  );

  return typeof window !== "undefined"
    ? createPortal(drawerContent, document.body)
    : null;
}
