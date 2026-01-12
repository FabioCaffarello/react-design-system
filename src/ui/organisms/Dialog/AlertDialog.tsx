'use client';

import { type ReactNode } from 'react';
import Dialog from './Dialog';
import { DialogContent } from './DialogContent';
import { DialogHeader } from './DialogHeader';
import { DialogTitle } from './DialogTitle';
import { DialogDescription } from './DialogDescription';
import { DialogFooter } from './DialogFooter';
import Button from '../../atoms/Button/Button';

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
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
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  children,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogContent size="sm" closeOnOverlayClick={false}>
        {children || (
          <>
            <DialogHeader>
              <Dialog.Title>{title}</Dialog.Title>
              {description && <Dialog.Description>{description}</Dialog.Description>}
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'destructive' ? 'error' : 'primary'}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AlertDialog;
