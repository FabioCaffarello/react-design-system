// ============================================================================
// Server entry — issue #150
// ============================================================================
//
// Re-exports ONLY the subset of RDS components whose render tree never
// touches a React client API (useState, useEffect, useId, useRef,
// useReducer, useContext, useMemo, useCallback, useLayoutEffect,
// useImperativeHandle, useTransition, useDeferredValue,
// useSyncExternalStore, useInsertionEffect, useOptimistic, createContext)
// — either in their own body or transitively through any value import
// inside src/ui/.
//
// **No `"use client";` directive at the top of this file.** That is the
// whole point: the resulting bundle (dist/server/index.{js,cjs}) is a
// plain ES module that the React Server Components runtime can evaluate
// on the server, so consumers (Next App Router 15+/16, etc.) can import
// these components directly from a Server Component without crossing a
// client boundary.
//
// The set is **verified** by `scripts/analyze-server-safe.mjs` (the
// source of truth) and gated on every commit by
// `scripts/validate-server-entry.mjs` — adding a re-export here that
// regresses to client (e.g. importing a barrel that pulls Input.tsx in)
// fails the gate at pre-push / CI time.
//
// Tokens, hooks, and utils are intentionally not re-exported from this
// entry — they belong to the main entry (".") which carries the
// `"use client"` directive that providers and stateful primitives
// require. A consumer using both entries on the same page imports
// presentational shells from `./server` and interactive widgets from
// the main entry; the two bundles live in different chunks and React
// composes them via its normal RSC client-boundary semantics.
// ============================================================================

// ---------- primitives (7) ----------
//
// Every primitive is imported from its concrete source file (not the
// folder index) so the dependency the analyser sees matches the
// dependency the bundler sees. Folder indexes sometimes re-export
// sibling client components (e.g. primitives/Chip/index.ts is named
// re-exports only — but the pattern across the codebase is mixed), and
// reading directly from the source file makes every re-export here
// transparent to `scripts/analyze-server-safe.mjs` and
// `scripts/validate-server-entry.mjs`.
export { default as Chip } from "./primitives/Chip/Chip";
export type { ChipProps, ChipSize, ChipVariant } from "./primitives/Chip/Chip";

export { default as ErrorMessage } from "./primitives/ErrorMessage/ErrorMessage";

export { default as Info } from "./primitives/Info/Info";
export type { InfoProps } from "./primitives/Info/Info";

export { default as Progress } from "./primitives/Progress/Progress";
export type {
  ProgressProps,
  ProgressSize,
  ProgressVariant,
} from "./primitives/Progress/Progress";

export { default as Skeleton } from "./primitives/Skeleton/Skeleton";
export type { SkeletonProps } from "./primitives/Skeleton/Skeleton";

export { default as Spinner } from "./primitives/Spinner/Spinner";
export type {
  SpinnerProps,
  SpinnerSize,
  SpinnerVariant,
} from "./primitives/Spinner/Spinner";

export { default as Text } from "./primitives/Text/Text";

// ---------- layouts (2) ----------
export { Container } from "./layouts/Container/Container";
export type { ContainerProps } from "./layouts/Container/Container";

export { Stack } from "./layouts/Stack/Stack";
export type { StackProps } from "./layouts/Stack/Stack";

// ---------- components (12) ----------
export { default as AutocompleteOption } from "./components/Autocomplete/AutocompleteOption";
export type {
  AutocompleteOptionProps,
  AutocompleteOptionType,
} from "./components/Autocomplete/AutocompleteOption";

export { default as Breadcrumb } from "./components/Breadcrumb/Breadcrumb";
export type { BreadcrumbItem } from "./components/Breadcrumb/Breadcrumb";

export { DialogHeader } from "./components/Dialog/DialogHeader";
export type { DialogHeaderProps } from "./components/Dialog/DialogHeader";

export { DialogFooter } from "./components/Dialog/DialogFooter";
export type { DialogFooterProps } from "./components/Dialog/DialogFooter";

export { default as DrawerHeader } from "./components/Drawer/DrawerHeader";
export type { DrawerHeaderProps } from "./components/Drawer/DrawerHeader";

export { default as DrawerFooter } from "./components/Drawer/DrawerFooter";
export type { DrawerFooterProps } from "./components/Drawer/DrawerFooter";

export { HeaderActions } from "./components/Header/components/HeaderActions";
export type { HeaderActionsProps } from "./components/Header/components/HeaderActions";

export { HeaderNavigation } from "./components/Header/components/HeaderNavigation";
export type { HeaderNavigationProps } from "./components/Header/components/HeaderNavigation";

export { default as MenuSeparator } from "./components/Menu/MenuSeparator";
export type { MenuSeparatorProps } from "./components/Menu/MenuSeparator";

export { default as NavbarSeparator } from "./components/SideNavbar/components/Navbar/NavbarSeparator";
export type { NavbarSeparatorProps } from "./components/SideNavbar/types";

export { default as TableCell } from "./components/Table/TableCell";
export type { TableCellProps } from "./components/Table/TableCell";

export { default as Timeline } from "./components/Timeline/Timeline";
export type {
  TimelineItem,
  TimelineOrientation,
  TimelineProps,
} from "./components/Timeline/Timeline";
