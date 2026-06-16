"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialogContext } from "../../providers/DialogContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import { getRadiusClass, getShadowClass, getZIndexClass } from "../../tokens";
import { getSpacingClass } from "../../tokens/spacing";
import { DialogClose } from "./DialogClose";

export interface DialogContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "role"
> {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  /**
   * Render the built-in close (✕) button in the top-right corner.
   *
   * Defaults to `true`, matching `Modal` and the house overlay
   * convention (`Drawer` / `Popover` expose the same prop). Set `false`
   * for **non-dismissable** dialogs where the consumer owns dismissal —
   * LGPD consent gates, destructive confirmations with escalating
   * friction, or guided wizards where a stray ✕ would abandon the flow.
   *
   * When `true`, do NOT also place an explicit `<Dialog.Close />` inside
   * the content: that compound is for *custom placement* (e.g. a close
   * affordance inside the footer) and would render a duplicate ✕. Use
   * one or the other.
   *
   * Suppressing the ✕ only removes the button — ESC and overlay-click
   * still close. For a fully non-dismissable dialog, pair this with
   * `closeOnEscape={false}` and `closeOnOverlayClick={false}`.
   */
  showCloseButton?: boolean;
}

export function DialogContent({
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  ...props
}: DialogContentProps) {
  const { isOpen, onClose, titleId, descriptionId, hasTitle, hasDescription } =
    useDialogContext();
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
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
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
          {/*
            The ✕ is rendered LAST in the DOM (after children) but
            positioned absolute top-right by DialogClose, so it never
            steals the "first focusable" auto-focus target from the
            content/form — same ordering shadcn/Radix use. Reuses the
            DialogClose compound so the close affordance has a single
            implementation (icon button + aria-label + context onClose).
          */}
          {showCloseButton && <DialogClose />}
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
