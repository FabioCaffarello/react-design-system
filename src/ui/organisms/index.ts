export { default as LoginBox } from "./LoginBox/LoginBox";

export { default as Modal } from "./Modal/Modal";

export * from "./Table";

export { default as SideNavbar } from "./SideNavbar";
export * from "./SideNavbar";

// Dialog and Toast components (providers are exported from src/ui/index.ts)
// Export only components, not providers, to avoid duplicate exports
export { default as Dialog } from "./Dialog/Dialog";
export { DialogTrigger } from "./Dialog/DialogTrigger";
export { DialogContent } from "./Dialog/DialogContent";
export { DialogHeader } from "./Dialog/DialogHeader";
export { DialogTitle } from "./Dialog/DialogTitle";
export { DialogDescription } from "./Dialog/DialogDescription";
export { DialogFooter } from "./Dialog/DialogFooter";
export { DialogClose } from "./Dialog/DialogClose";
export { default as AlertDialog } from "./Dialog/AlertDialog";
export type { DialogProps } from "./Dialog/Dialog";
export type { DialogTriggerProps } from "./Dialog/DialogTrigger";
export type { DialogContentProps } from "./Dialog/DialogContent";
export type { DialogHeaderProps } from "./Dialog/DialogHeader";
export type { DialogTitleProps } from "./Dialog/DialogTitle";
export type { DialogDescriptionProps } from "./Dialog/DialogDescription";
export type { DialogFooterProps } from "./Dialog/DialogFooter";
export type { AlertDialogProps } from "./Dialog/AlertDialog";

export { ToastContainer } from "./Toast/ToastContainer";
export { Toast } from "./Toast/Toast";
export { useToast } from "./Toast/useToast";
export type { ToastContainerProps } from "./Toast/ToastContainer";
export type { ToastProps } from "./Toast/Toast";
export type { ToastOptions } from "./Toast/useToast";

export { default as Stepper } from "./Stepper/Stepper";
export type { StepperProps, StepperStep, StepperStatus } from "./Stepper/Stepper";

export { default as Timeline } from "./Timeline/Timeline";
export type { TimelineProps, TimelineItem, TimelineOrientation } from "./Timeline/Timeline";

export { default as CommandPalette } from "./CommandPalette/CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./CommandPalette/CommandPalette";

export { default as DataGrid } from "./DataGrid/DataGrid";
export type { DataGridProps, DataGridColumn, DataGridGroup } from "./DataGrid/DataGrid";

// Flow components have been moved to extensions/flow
// Use: import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system/extensions/flow'
// or: import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system/extensions'
