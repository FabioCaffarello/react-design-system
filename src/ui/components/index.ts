export { default as Card } from "./Card/Card";

export * from "./Form";

export { default as Breadcrumb } from "./Breadcrumb/Breadcrumb";
export type { BreadcrumbItem } from "./Breadcrumb/Breadcrumb";

export { default as Pagination } from "./Pagination/Pagination";

export { default as EmptyState } from "./EmptyState/EmptyState";
export type { EmptyStateProps } from "./EmptyState/EmptyState";

export { default as Dropdown } from "./Dropdown/Dropdown";
export type { DropdownProps, DropdownItem } from "./Dropdown/Dropdown";

export * from "./DatePicker";

export * from "./Tabs";

export { default as SearchInput } from "./SearchInput/SearchInput";
export type { SearchInputProps } from "./SearchInput/SearchInput";

export * from "./Autocomplete";
export type {
  AutocompleteProps,
  AutocompleteOption,
  AutocompleteOptionProps,
  AutocompleteListProps,
} from "./Autocomplete";

export * from "./MultiSelect";
export type { MultiSelectProps } from "./MultiSelect";

export { default as Rating } from "./Rating/Rating";
export type { RatingProps, RatingSize, RatingVariant } from "./Rating/Rating";

export { default as FileUpload } from "./FileUpload/FileUpload";
export type { FileUploadProps, FileUploadFile } from "./FileUpload/FileUpload";

export { default as TimePicker } from "./TimePicker/TimePicker";
export type { TimePickerProps, TimeFormat } from "./TimePicker/TimePicker";

export { default as ColorPicker } from "./ColorPicker/ColorPicker";
export type { ColorPickerProps, ColorFormat } from "./ColorPicker/ColorPicker";

export * from "./Drawer";
export type {
  DrawerProps,
  DrawerPosition,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerFooterProps,
} from "./Drawer";

export * from "./Menu";
export type {
  MenuProps,
  MenuPlacement,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuSeparatorProps,
} from "./Menu";

export { default as Accordion } from "./Accordion/Accordion";
export type {
  AccordionProps,
  AccordionItem,
  AccordionType,
} from "./Accordion/Accordion";

export { default as Popover } from "./Popover/Popover";
export type { PopoverProps, PopoverPlacement } from "./Popover/Popover";

export * from "./Header";
export type { HeaderProps, HeaderVariant, HeaderMaxWidth } from "./Header";

export * from "./Navigation";
export type {
  NavigationProps,
  NavigationOrientation,
  NavigationVariant,
  NavItem,
} from "./Navigation";

export * from "./PageHeader";
export type { PageHeaderProps, PageHeaderVariant } from "./PageHeader";
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
export type {
  StepperProps,
  StepperStep,
  StepperStatus,
} from "./Stepper/Stepper";

export { default as Timeline } from "./Timeline/Timeline";
export type {
  TimelineProps,
  TimelineItem,
  TimelineOrientation,
} from "./Timeline/Timeline";

export { default as CommandPalette } from "./CommandPalette/CommandPalette";
export type {
  CommandPaletteProps,
  CommandItem,
} from "./CommandPalette/CommandPalette";

export { default as DataGrid } from "./DataGrid/DataGrid";
export type {
  DataGridProps,
  DataGridColumn,
  DataGridGroup,
} from "./DataGrid/DataGrid";
// Patterns - Reusable design patterns that combine multiple components
// These solve common UX problems with specific component combinations

export {
  DataTablePattern,
  type DataTablePatternProps,
  type DataTableColumn,
} from "./DataTablePattern";
export {
  FormWizardPattern,
  type FormWizardPatternProps,
  type FormWizardStep,
} from "./FormWizardPattern";
export {
  SearchAndFilterPattern,
  type SearchAndFilterPatternProps,
  type FilterConfig,
  type FilterOption,
} from "./SearchAndFilterPattern";
// Templates - Complete page layouts that combine organisms, molecules, and atoms
// These are full page structures that are configurable but have sensible defaults

export { DashboardLayout, type DashboardLayoutProps } from "./DashboardLayout";
