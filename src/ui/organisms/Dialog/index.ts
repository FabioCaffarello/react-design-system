/**
 * Dialog Components
 * 
 * Compound component pattern for flexible dialogs.
 * 
 * NOTE: DialogProvider and DialogContext have been moved to src/ui/providers/
 * to avoid circular dependencies. They are exported from src/ui/index.ts.
 * 
 * IMPORTANT: Do NOT re-export providers here to avoid duplicate exports
 * that create circular dependencies in Turbopack/Next.js bundling.
 * Import providers directly from the main package entry point:
 * 
 * ```ts
 * import { DialogProvider } from '@fabio.caffarello/react-design-system';
 * ```
 */

// Export dialog components
export { default as Dialog } from './Dialog';
export { DialogTrigger } from './DialogTrigger';
export { DialogContent } from './DialogContent';
export { DialogHeader } from './DialogHeader';
export { DialogTitle } from './DialogTitle';
export { DialogDescription } from './DialogDescription';
export { DialogFooter } from './DialogFooter';
export { DialogClose } from './DialogClose';
export { default as AlertDialog } from './AlertDialog';

export type { DialogProps } from './Dialog';
export type { DialogTriggerProps } from './DialogTrigger';
export type { DialogContentProps } from './DialogContent';
export type { DialogHeaderProps } from './DialogHeader';
export type { DialogTitleProps } from './DialogTitle';
export type { DialogDescriptionProps } from './DialogDescription';
export type { DialogFooterProps } from './DialogFooter';
export type { AlertDialogProps } from './AlertDialog';
