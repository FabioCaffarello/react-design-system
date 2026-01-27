'use client';

import { useId, type ReactNode } from 'react';
import { DialogProvider } from '../../providers/DialogProvider';
import { DialogTrigger } from './DialogTrigger';
import { DialogContent } from './DialogContent';
import { DialogHeader } from './DialogHeader';
import { DialogTitle } from './DialogTitle';
import { DialogDescription } from './DialogDescription';
import { DialogFooter } from './DialogFooter';
import { DialogClose } from './DialogClose';

export interface DialogProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Dialog Component
 * 
 * A flexible dialog component using compound components pattern.
 * Supports both controlled and uncontrolled modes.
 * Includes portal rendering, focus trap, and full accessibility.
 * 
 * @example
 * ```tsx
 * // Uncontrolled
 * <Dialog>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *       <Dialog.Description>Dialog description</Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Footer>
 *       <Button onClick={handleClose}>Close</Button>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * 
 * // Controlled
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *     </Dialog.Header>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
function Dialog({ children, open, defaultOpen, onOpenChange }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      titleId={titleId}
      descriptionId={descriptionId}
    >
      {children}
    </DialogProvider>
  );
}

// Compound components
Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;

export default Dialog;
