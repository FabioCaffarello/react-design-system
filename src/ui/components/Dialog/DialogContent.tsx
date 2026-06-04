"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialogContext } from "../../providers/DialogContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAutoFocus } from "../../hooks/useAutoFocus";
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

  // Modal focus contract — Tab cycling + auto-focus, consumed from the
  // shared hooks introduced in Phase 3 PR 1. Replaces an inline
  // implementation that duplicated the selector / disabled-and-hidden
  // filter / boundary-check logic verbatim. The hook variant ALSO
  // closes a focus-outside-container gap the inline trap silently had
  // (it relied on auto-focus running first to mask it); the hook
  // pulls focus back to the trap edge regardless. Focus restore on
  // close is the separate concern of `useFocusRestore`, consumed in
  // `DialogProvider`.
  useFocusTrap(contentRef, isOpen);
  useAutoFocus(contentRef, isOpen);

  // ESC handling stays inline — gated by the per-Dialog `closeOnEscape`
  // prop, which the shared hooks intentionally don't know about. Same
  // shape as Drawer's parallel handler.
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
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
