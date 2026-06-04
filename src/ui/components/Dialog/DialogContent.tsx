"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialogContext } from "../../providers/DialogContext";
import { getRadiusClass, getShadowClass, getZIndexClass } from "../../tokens";
import { getSpacingClass } from "../../tokens/spacing";

export interface DialogContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "role"
> {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function DialogContent({
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  ...props
}: DialogContentProps) {
  const { isOpen, onClose, titleId, descriptionId } = useDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus first focusable element in dialog
    const timer = setTimeout(() => {
      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    }, 0);

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !contentRef.current) return;

      const focusableElements = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.disabled && el.offsetParent !== null);

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    fullscreen: `max-w-full h-full ${getSpacingClass("none", "m")} ${getRadiusClass("none")}`,
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  const dialogContent = (
    <div
      className={`fixed inset-0 ${getZIndexClass("modal")} overflow-y-auto`}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-scrim transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`flex min-h-full items-center justify-center ${getSpacingClass("base", "p")}`}
      >
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={`
            relative w-full
            ${sizeClasses[size]}
            bg-surface-overlay
            ${getRadiusClass("lg")}
            ${getShadowClass("xl")}
            ${className}
          `}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );

  // Portal rendering
  if (typeof window !== "undefined") {
    return createPortal(dialogContent, document.body);
  }

  return dialogContent;
}
