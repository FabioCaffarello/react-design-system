"use client";

import { type ReactNode } from "react";
import Dialog from "./Dialog";
import { DialogContent } from "./DialogContent";
import { DialogHeader } from "./DialogHeader";
import { DialogFooter } from "./DialogFooter";
import { useDialogContext } from "../../providers/DialogContext";
import Button from "../../primitives/Button/Button";

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

type AlertDialogBodyProps = Pick<
  AlertDialogProps,
  | "title"
  | "description"
  | "confirmLabel"
  | "cancelLabel"
  | "variant"
  | "onConfirm"
  | "onCancel"
  | "children"
>;

/**
 * Inner body rendered as a child of <Dialog> so it can read the dialog
 * context. Closing MUST go through context `onClose` (not the external
 * `onOpenChange` prop): in uncontrolled mode `onOpenChange` is undefined,
 * so the old `onOpenChange?.(false)` was a no-op and the alert could
 * never be dismissed by its own buttons. `onClose` closes in BOTH modes
 * (it calls the provider's setIsOpen, which drives uncontrolled state and
 * still notifies a controlled consumer's onOpenChange).
 */
function AlertDialogBody({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  children,
}: AlertDialogBodyProps) {
  const { onClose } = useDialogContext();

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  // AlertDialog is a decision gate: the user must pick Confirm or
  // Cancel, so it suppresses the auto ✕ (showCloseButton={false}) and
  // overlay-click — consistent with its existing no-dismiss-affordance
  // contract. DialogContent now renders the ✕ by default (issue #221).
  return (
    <DialogContent
      size="sm"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      {children || (
        <>
          <DialogHeader>
            <Dialog.Title>{title}</Dialog.Title>
            {description && (
              <Dialog.Description>{description}</Dialog.Description>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "error" : "primary"}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
}

/**
 * AlertDialog Component
 *
 * A specialized dialog for confirmations and alerts.
 * Built on top of Dialog with pre-configured layout.
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Item"
 *   description="Are you sure? This action cannot be undone."
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function AlertDialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant,
  onConfirm,
  onCancel,
  children,
}: AlertDialogProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AlertDialogBody
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        variant={variant}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        {children}
      </AlertDialogBody>
    </Dialog>
  );
}

export default AlertDialog;
