"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getSpacingClass } from "../../tokens/spacing";
import { getZIndexClass } from "../../tokens/z-index";
import { useFocusRestore } from "../../hooks/useFocusRestore";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAutoFocus } from "../../hooks/useAutoFocus";

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "default" | "large" | "fullscreen";
  showCloseButton?: boolean;
  footer?: ReactNode;
}

/**
 * Modal Component
 *
 * A modal/dialog component with overlay, portal rendering, and accessibility.
 * Follows Atomic Design principles as an Organism component.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
 *   <p>Are you sure?</p>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  showCloseButton = true,
  footer,
  className = "",
  ...props
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Modal focus contract: trap + restore + auto-focus from the shared
  // Phase 3 hooks. Replaces an inline implementation that snapshotted
  // document.activeElement, focused the modal CONTAINER (not its first
  // focusable child), and restored on cleanup. The hook variant of
  // auto-focus targets the first focusable inside the modal — matching
  // Dialog/Drawer post-PR-#138/#140 — and falls back to focusing the
  // container with tabindex=-1 when no focusable child exists, so the
  // existing tabIndex={-1} on the inner div still has a job to do in
  // that fallback path. The trap was MISSING pre-PR-#141: Modal
  // declared aria-modal=true without any Tab interception, identical
  // shape to the Drawer gap closed in #138. WCAG 2.4.3.
  useFocusRestore(isOpen);
  useFocusTrap(modalRef, isOpen);
  useAutoFocus(modalRef, isOpen);

  // ESC handling stays inline. Same shape as the Dialog/Drawer parallel
  // handlers — the shared hooks intentionally don't know about
  // close-callback semantics.
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const baseClasses = [
    "fixed",
    "inset-0",
    getZIndexClass("modal"),
    "overflow-y-auto",
  ];

  const overlayClasses = ["fixed", "inset-0", "bg-scrim", "transition-opacity"];

  const modalSizeClasses: Record<NonNullable<Props["variant"]>, string> = {
    default: "max-w-md",
    large: "max-w-2xl",
    fullscreen: "max-w-full h-full",
  };

  const modalClasses = [
    "relative",
    "bg-surface-overlay",
    getRadiusClass("lg"),
    getShadowClass("xl"),
    getSpacingClass("xl", "my"),
    "mx-auto",
    modalSizeClasses[variant],
    getSpacingClass("lg", "p"),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const modalContent = (
    <div
      className={baseClasses.join(" ")}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={overlayClasses.join(" ")} aria-hidden="true" />
      <div
        className={`flex min-h-full items-center justify-center ${getSpacingClass("base", "p")}`}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {title && (
            <div
              className={`flex justify-between items-center ${getSpacingClass("base", "mb")}`}
            >
              <h2
                id="modal-title"
                className="text-xl font-semibold text-fg-primary"
              >
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-fg-tertiary hover:text-fg-secondary focus:outline-none"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
          {!title && showCloseButton && (
            <div
              className={`flex justify-end ${getSpacingClass("base", "mb")}`}
            >
              <button
                onClick={onClose}
                className="text-fg-tertiary hover:text-fg-secondary focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className={getSpacingClass("base", "mb")}>{children}</div>
          {footer && (
            <div
              className={`flex justify-end ${getSpacingClass("sm", "gap")} ${getSpacingClass("base", "mt")}`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Portal rendering to avoid z-index issues
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
