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

// ---------- primitives (11) ----------
//
// Every primitive is imported from its concrete source file (not the
// folder index) so the dependency the analyser sees matches the
// dependency the bundler sees. Folder indexes sometimes re-export
// sibling client components (e.g. primitives/Chip/index.ts is named
// re-exports only — but the pattern across the codebase is mixed), and
// reading directly from the source file makes every re-export here
// transparent to `scripts/analyze-server-safe.mjs` and
// `scripts/validate-server-entry.mjs`.
export { default as Badge } from "./primitives/Badge/Badge";
export type {
  BadgeProps,
  BadgeSize,
  BadgeStyle,
  BadgeVariant,
} from "./primitives/Badge/Badge";

// Button — promoted in issue #224. Its body held six purely-decorative
// `useMemo` calls (class-string concat, a boolean, spinner variant/size,
// the loading icon) that were inlined (same de-memoization precedent as
// Badge/Label/Card in #155), removing the only axis-1 barrier. Axis 2 is
// satisfied because Button never assigns a handler to its DOM element
// unconditionally — `onClick` and friends arrive via `...props` and are
// `undefined` until the consumer passes them, so a server-rendered
// `<Button>`/`<Button asChild><Link/></Button>`/`<button type="submit">`
// emits no function prop. The full inventory note lives in
// `.claude/rules/server-entry.md`.
export { default as Button } from "./primitives/Button/Button";
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./primitives/Button/Button";

export { default as Chip } from "./primitives/Chip/Chip";
export type { ChipProps, ChipSize, ChipVariant } from "./primitives/Chip/Chip";

export { default as ErrorMessage } from "./primitives/ErrorMessage/ErrorMessage";
export type { ErrorMessageProps } from "./primitives/ErrorMessage/ErrorMessage";

export { default as Info } from "./primitives/Info/Info";
export type { InfoProps } from "./primitives/Info/Info";

export { default as Label } from "./primitives/Label/Label";

export { default as Progress } from "./primitives/Progress/Progress";
export type {
  ProgressProps,
  ProgressSize,
  ProgressVariant,
} from "./primitives/Progress/Progress";

export { default as Separator } from "./primitives/Separator/Separator";
export type {
  SeparatorOrientation,
  SeparatorProps,
  SeparatorVariant,
} from "./primitives/Separator/Separator";

export { default as Skeleton } from "./primitives/Skeleton/Skeleton";
export type { SkeletonProps } from "./primitives/Skeleton/Skeleton";

export { default as Spinner } from "./primitives/Spinner/Spinner";
export type {
  SpinnerProps,
  SpinnerSize,
  SpinnerVariant,
} from "./primitives/Spinner/Spinner";

export { default as Text } from "./primitives/Text/Text";
export type { TextProps } from "./primitives/Text/Text";

// ---------- layouts (2) ----------
export { Container } from "./layouts/Container/Container";
export type { ContainerProps } from "./layouts/Container/Container";

export { Stack } from "./layouts/Stack/Stack";
export type { StackProps } from "./layouts/Stack/Stack";

// ---------- components (23) ----------
// AutocompleteOption was removed from this entry in the issue #160 sweep.
// The static analyser in `scripts/lib/server-safe.mjs` had classified it
// server-safe (it uses no hooks and no createContext), but the component
// emits `<div onClick={handleClick}>` unconditionally and its `onSelect`
// prop is REQUIRED — so there is no guard pattern that would make the
// emitted handler conditional. Rendering it from a Server Component
// fails RSC serialisation with "Event handlers cannot be passed to
// Client Component props". The runtime smoke in `fixtures/next-smoke/
// app/page.tsx` (extended in the same sweep to cover the entire server
// surface) is what catches this class of bug — the static analyser
// cannot, because distinguishing "always-on closure" from "consumer
// pass-through" requires AST origin tracking with a real risk of false
// positives on legitimate components. See `.claude/rules/server-entry.md`.
// AutocompleteOption stays available via the main entry (`.`), where
// it ships behind the `"use client"` banner that its own source carries.
export { default as Breadcrumb } from "./components/Breadcrumb/Breadcrumb";
export type { BreadcrumbItem } from "./components/Breadcrumb/Breadcrumb";

export { default as Card } from "./components/Card/Card";
export type { CardProps } from "./components/Card/Card";

// Card compound subcomponents. Each lives in its own source file so the
// server/client boundary is per-file: the root Card and every subcomponent
// here are presentational with no hooks, so they all ship in `./server`.
// Interactive children supplied via `<Card.Actions>` (typically `<Button>`)
// cross the RSC boundary as client references — the wrapper stays
// server-safe. `data-card-actions` on `CardActions` is the structural
// marker `CardHeader` uses via Tailwind `:has()` to switch its grid
// layout when actions are present; see CardActions.tsx.
export { CardHeader } from "./components/Card/CardHeader";
export type { CardHeaderProps } from "./components/Card/CardHeader";

export { CardTitle } from "./components/Card/CardTitle";
export type { CardTitleProps, CardTitleAs } from "./components/Card/CardTitle";

export { CardSubtitle } from "./components/Card/CardSubtitle";
export type { CardSubtitleProps } from "./components/Card/CardSubtitle";

export { CardActions } from "./components/Card/CardActions";
export type { CardActionsProps } from "./components/Card/CardActions";

export { CardBody } from "./components/Card/CardBody";
export type { CardBodyProps } from "./components/Card/CardBody";

export { DialogHeader } from "./components/Dialog/DialogHeader";
export type { DialogHeaderProps } from "./components/Dialog/DialogHeader";

export { DialogFooter } from "./components/Dialog/DialogFooter";
export type { DialogFooterProps } from "./components/Dialog/DialogFooter";

export { default as DrawerHeader } from "./components/Drawer/DrawerHeader";
export type { DrawerHeaderProps } from "./components/Drawer/DrawerHeader";

export { default as DrawerFooter } from "./components/Drawer/DrawerFooter";
export type { DrawerFooterProps } from "./components/Drawer/DrawerFooter";

// FilterChips — the chip-group filter bar shell (#162). Pure presentation
// (role="group" + neutral text label + flex wrap); the interactive
// identity lives in each Chip — including the zero-JS `<Chip asChild>
// <Link/></Chip>` form — so the wrapper never emits a handler on the DOM.
// Concrete-file re-export per rule 1 of `.claude/rules/server-entry.md`.
export { FilterChips } from "./components/FilterChips/FilterChips";
export type { FilterChipsProps } from "./components/FilterChips/FilterChips";

export { HeaderActions } from "./components/Header/components/HeaderActions";
export type { HeaderActionsProps } from "./components/Header/components/HeaderActions";

export { HeaderNavigation } from "./components/Header/components/HeaderNavigation";
export type { HeaderNavigationProps } from "./components/Header/components/HeaderNavigation";

// HeroSection — top-of-page hero shell (#163). Pure presentation: kicker /
// title / description / actions / kpis / meta slots with three visual
// treatments. No hooks, no handler on the DOM (interactive children land in
// the `actions` slot and cross the RSC boundary as client references), so the
// wrapper ships in `./server`. Concrete-file re-export per rule 1 of
// `.claude/rules/server-entry.md`.
export { default as HeroSection } from "./components/HeroSection/HeroSection";
export type {
  HeroSectionProps,
  HeroSectionVariant,
  HeroSectionAlign,
} from "./components/HeroSection/HeroSection";

export { default as MenuSeparator } from "./components/Menu/MenuSeparator";
export type { MenuSeparatorProps } from "./components/Menu/MenuSeparator";

export { default as NavbarSeparator } from "./components/SideNavbar/components/Navbar/NavbarSeparator";
export type { NavbarSeparatorProps } from "./components/SideNavbar/types";

export { default as PageHeader } from "./components/PageHeader/PageHeader";
export type {
  PageHeaderProps,
  PageHeaderVariant,
} from "./components/PageHeader/types";

// Stat + StatGroup — the consolidated metrics primitive (#166, replaces
// the originally proposed `KpiStrip` and `StatsGrid` as a single compound).
// Both are pure presentation; the consumer composes them inside `./server`
// without crossing a client boundary. Concrete-file re-exports per rule 1
// of `.claude/rules/server-entry.md`.
export { default as Stat } from "./components/Stat/Stat";
export type { StatProps, StatTone, StatAlign } from "./components/Stat/Stat";

export { StatGroup } from "./components/Stat/StatGroup";
export type {
  StatGroupProps,
  StatGroupLayout,
  StatGroupCols,
} from "./components/Stat/StatGroup";

export { default as TableCell } from "./components/Table/TableCell";
export type { TableCellProps } from "./components/Table/TableCell";

// TabsAsLinks — tabs as URL navigation (#210). The server-safe counterpart to
// the interactive `Tabs` widget: each tab is a real link, the active state is
// a caller-supplied boolean, and the root is a named <nav> with
// aria-current="page" (the navigation pattern, not role="tab"). No hooks, no
// DOM handlers; defaults to a plain <a> and accepts a `linkComponent` (e.g.
// next/link) that crosses the RSC boundary as a client reference. Concrete-file
// re-export per rule 1 of `.claude/rules/server-entry.md`.
export { default as TabsAsLinks } from "./components/TabsAsLinks/TabsAsLinks";
export type {
  TabsAsLinksProps,
  TabAsLink,
  TabsAsLinksVariant,
} from "./components/TabsAsLinks/TabsAsLinks";

export { default as Timeline } from "./components/Timeline/Timeline";
export type {
  TimelineItem,
  TimelineOrientation,
  TimelineProps,
} from "./components/Timeline/Timeline";
