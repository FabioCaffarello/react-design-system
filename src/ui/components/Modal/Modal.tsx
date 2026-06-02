"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getZIndexClass } from "../../tokens/z-index";

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
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    // Store previous active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus modal on open
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Restore focus on close
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      previousActiveElement.current?.focus();
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
    "my-8",
    "mx-auto",
    modalSizeClasses[variant],
    "p-6",
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
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {title && (
            <div className="flex justify-between items-center mb-4">
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
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="text-fg-tertiary hover:text-fg-secondary focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className="mb-4">{children}</div>
          {footer && (
            <div className="flex justify-end gap-2 mt-4">{footer}</div>
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
