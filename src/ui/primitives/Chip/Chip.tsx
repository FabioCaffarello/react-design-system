"use client";

import { forwardRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";

export type ChipVariant = "default" | "outlined" | "filled";
export type ChipSize = "sm" | "md" | "lg";

interface ChipBaseProps {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  tabIndex?: number;
}

interface ChipStandardProps extends ChipBaseProps {
  asChild?: false;
  onRemove?: () => void;
  onClick?: () => void;
  /**
   * Optional count sub-badge rendered at the end of the chip (before the
   * remove ✕, if any) — e.g. `Casa 12`, `Tramitando 340` in a filter bar.
   *
   * The sub-badge inverts with the chip surface so it always contrasts:
   * a brand pill on neutral chips, a light pill on brand chips
   * (`selected` / `variant="filled"`). The number is folded into the
   * interactive chip's accessible name (`"Casa, 12"`) so AT users hear
   * it; pass an explicit `aria-label` to override that phrasing.
   *
   * Forbidden in the `asChild` form (the consumer composes the node).
   * `0` is a legitimate value and renders `0`; omit the prop for "no
   * count".
   */
  count?: number;
}

/**
 * `asChild` collapses the chip into a single node provided by the
 * consumer (typically `<Link>`). The non-interactive frame + inner
 * label-button + X structure is intentionally NOT rendered — the child
 * IS the chip. As a consequence:
 *
 *   - `onClick` and `onRemove` are forbidden at the type level. The
 *     child's own click handler (and `href`) is what fires; consumers
 *     who need a removable selected filter use the standard
 *     (non-asChild) form.
 *   - `selected` still applies the visual classes via `chipVariants`,
 *     but NO `aria-pressed` is emitted. Toggle-button semantics on
 *     `<a>` would lie — a link isn't a two-state control. Consumers
 *     that need the selected route surfaced to AT users should pass
 *     `aria-current="page"` (or similar) directly on the child Link.
 *
 * @see `.claude/rules/components.md` and the inline a11y notes below.
 */
interface ChipAsChildProps extends ChipBaseProps {
  asChild: true;
  /**
   * `onClick` is forbidden when `asChild` is true — the child element
   * owns interaction. Pass the handler (or `href`) on the child.
   */
  onClick?: never;
  /**
   * `onRemove` is forbidden when `asChild` is true — the collapsed
   * node has no slot for an X button. Use the standard (non-asChild)
   * form when removal is required.
   */
  onRemove?: never;
  /**
   * `count` is forbidden when `asChild` is true — the collapsed node is
   * a single consumer element with no slot for the sub-badge. Render the
   * count inside the child yourself, or use the standard form.
   */
  count?: never;
}

export type ChipProps = ChipStandardProps | ChipAsChildProps;

/**
 * Chip Component
 *
 * A chip/tag for labels, filters, or selected items.
 *
 * Standard form: an outer `<div>` frame (never interactive) with an
 * inner `<button>` label (when `onClick`) and a sibling X `<button>`
 * (when `onRemove`). This shape closes two axe violations the older
 * implementation hit — `aria-required-parent` (role=option without a
 * listbox) and `nested-interactive` (clickable outer + clickable X).
 *
 * `asChild` form: a single node provided by the consumer (e.g.
 * `<Link>`), with the chip's classes projected via Radix `Slot`. See
 * the `ChipAsChildProps` JSDoc for the a11y responsibility transfer
 * — the consumer's child carries `href`, focus behavior, and any
 * route-state ARIA (`aria-current`). Forbidden in this form:
 * `onClick`, `onRemove` (TS-level).
 *
 * @example
 * ```tsx
 * <Chip>Tag</Chip>
 * <Chip onRemove={() => console.log('removed')}>Removable</Chip>
 *
 * // Navigation chip — server-rendered, zero-JS-friendly.
 * <Chip asChild variant="filled">
 *   <Link href="/filtros/ativo" prefetch aria-current="page">Active</Link>
 * </Chip>
 * ```
 */
// Chip variants using CVA
const chipVariants = cva(
  // Base classes
  cn(
    "inline-flex",
    "items-center",
    "font-medium",
    getRadiusClass("full"),
    getSpacingClass("xs", "gap"),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-surface-muted",
          "text-fg-primary",
          "border",
          "border-line-default",
        ),
        outlined: cn(
          "bg-transparent",
          "text-fg-primary",
          "border",
          "border-line-default",
        ),
        filled: cn(
          "bg-surface-brand-strong",
          "text-fg-inverse",
          "border",
          "border-transparent",
        ),
      },
      size: {
        sm: cn(
          getSpacingClass("xs", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("caption"),
        ),
        md: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("bodySmall"),
        ),
        lg: cn(
          getSpacingClass("md", "px"),
          getSpacingClass("sm", "py"),
          getTypographySize("body"),
        ),
      },
      selected: {
        true: cn(
          "bg-surface-brand-strong",
          "text-fg-inverse",
          "border",
          "border-line-brand",
        ),
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        selected: true,
        variant: "default",
        class: "", // Override variant when selected
      },
      {
        selected: true,
        variant: "outlined",
        class: "", // Override variant when selected
      },
      {
        selected: true,
        variant: "filled",
        class: "", // Override variant when selected
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      selected: false,
      disabled: false,
    },
  },
);

const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(props, ref) {
  const {
    children,
    variant = "default",
    size = "md",
    selected = false,
    disabled = false,
    className = "",
    "aria-label": ariaLabel,
    tabIndex,
    asChild = false,
  } = props;

  // Generate accessible label
  const getAccessibleLabel = (): string | undefined => {
    if (ariaLabel) return ariaLabel;
    if (typeof children === "string") return children;
    // For non-string children, try to extract text content
    if (
      typeof children === "object" &&
      children !== null &&
      "props" in children
    ) {
      const childProps = (children as { props?: { children?: unknown } }).props;
      if (childProps?.children && typeof childProps.children === "string") {
        return childProps.children;
      }
    }
    return undefined;
  };

  const accessibleLabel = getAccessibleLabel();

  // asChild path: collapse the entire chip structure (frame + label
  // button + X) into the single consumer-provided node. The frame's
  // visual classes are projected onto the child via Slot.
  //
  // A11Y RESPONSIBILITY TRANSFER. The child element owns:
  //   - focus (its native focus ring, or its own focus utilities)
  //   - activation (its own click handler / href for navigation)
  //   - route-state semantics: `aria-current="page"` on a selected
  //     Link is the right tool. `aria-pressed` is intentionally NOT
  //     emitted here — a link is not a toggle button.
  //   - disabled semantics: `aria-disabled` is set when `disabled` is
  //     true, but it does NOT block navigation. Consumers that must
  //     truly disable navigation should also gate `href` upstream.
  //
  // TS forbids `onClick` / `onRemove` in this form (see ChipAsChildProps).
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cn(
          chipVariants({ variant, size, selected, disabled }),
          className,
        )}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={tabIndex}
      >
        {children}
      </Slot>
    );
  }

  // Standard form below. Narrow `props` so the union picks up
  // onClick/onRemove/count (forbidden when asChild=true at TS level).
  const { onRemove, onClick, count } = props as ChipStandardProps;

  // Architecture:
  //   The label is a real `<button>` whenever the chip is meant to be
  //   activated (`onClick` provided). The X is a sibling `<button>` when
  //   `onRemove` is provided. The outer `<div>` is NEVER interactive —
  //   no `role`, no `tabIndex`, no event handlers. This unifies what
  //   used to be three structural variants:
  //     - `onClick` only → outer `role="button"`           [old]
  //     - `onClick` + `onRemove` (no selected) → label-button [PR68]
  //     - `selected` → outer `role="option"`               [old, axe-flagged]
  //   into one consistent shape: label is the actor, outer is the chip
  //   chrome (visual frame).
  //
  //   Why this matters for a11y:
  //     - `role="option"` outside `role="listbox"` violates `aria-required-
  //       parent`. The old `selected` path failed axe in every standalone
  //       chip. Moving the action to a native `<button>` with
  //       `aria-pressed={selected}` (toggle button pattern) communicates
  //       state correctly without requiring a listbox parent.
  //     - The interactive outer + inner X button produced nested-interactive
  //       whenever the consumer combined `selected` (or `onClick`) with
  //       `onRemove`. Outer non-interactive + sibling buttons fixes both
  //       cases at once.
  //
  //   `selected` with no `onClick` is decorative only — the chip CANNOT
  //   toggle, so it gets no `aria-pressed` (which would lie) and no role.
  //   The visual `selected` styling (chipVariants.selected) applies, but
  //   AT users read it as static text. Consumers who want the state
  //   communicated must also pass `onClick` to make it a real toggle.
  const useLabelButton = onClick !== undefined;
  const interactive = useLabelButton && !disabled;

  // Keyboard handler for the label-button. Native `<button>` activates on
  // Enter/Space in real browsers, but JSDOM does NOT simulate Enter → click,
  // so this preserves the previous test-friendly behavior AND adds explicit
  // `preventDefault` (the original outer-as-button needed it; on a native
  // button this is mostly belt-and-suspenders but harmless).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  // Count sub-badge (issue #222). Rendered as a sibling of the label so
  // the outer flex's `items-center` + `gap` handle alignment/spacing.
  // The pill inverts with the chip surface so it always contrasts:
  //   - brand-backed chip (selected || filled) → light pill
  //     (bg-surface-base + text-fg-brand-emphasis)
  //   - neutral chip (default/outlined) → brand pill
  //     (bg-surface-brand-strong + text-fg-inverse, the filled-chip combo)
  // Both pairs are AA-proven elsewhere in the system.
  const hasCount = count !== undefined;
  const chipIsBrandFilled = selected || variant === "filled";
  const countBadge = hasCount ? (
    <span
      // Interactive chips fold the count into the label-button's
      // aria-label below, so the visible badge is hidden from AT to
      // avoid a double announce. Non-interactive chips have no
      // overriding name — the badge stays readable as inline content.
      aria-hidden={useLabelButton || undefined}
      className={cn(
        "inline-flex",
        "items-center",
        "justify-center",
        "tabular-nums",
        "leading-none",
        getRadiusClass("full"),
        getSpacingClass("xs", "px"),
        getSpacingClass("0.5", "py"),
        getTypographySize("caption"),
        getTypographyWeight("label"),
        chipIsBrandFilled
          ? cn("bg-surface-base", "text-fg-brand-emphasis")
          : cn("bg-surface-brand-strong", "text-fg-inverse"),
      )}
    >
      {count}
    </span>
  ) : null;

  // When a count is present, fold it into the interactive chip's
  // accessible name ("Casa, 12") so AT users hear it. An explicit
  // consumer aria-label always wins (they own the phrasing).
  const labelWithCount =
    hasCount && accessibleLabel !== undefined
      ? `${accessibleLabel}, ${count}`
      : accessibleLabel;

  return (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant, size, selected, disabled }),
        onRemove && getSpacingClass("xs", "pr"),
        className,
      )}
      aria-disabled={disabled}
    >
      {useLabelButton ? (
        <button
          type="button"
          onClick={disabled ? undefined : onClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-pressed={selected ? true : undefined}
          aria-label={ariaLabel || labelWithCount}
          tabIndex={
            tabIndex !== undefined ? tabIndex : interactive ? 0 : undefined
          }
          className={cn(
            "flex-1",
            "bg-transparent",
            "border-0",
            getSpacingClass("none", "p"),
            "text-inherit",
            "text-left",
            "cursor-pointer",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-line-focus",
            "focus:ring-offset-2",
            getRadiusClass("full"),
          )}
        >
          {children}
        </button>
      ) : (
        <span>{children}</span>
      )}
      {countBadge}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            getSpacingClass("xs", "ml"),
            "hover:bg-tint-hover",
            getRadiusClass("full"),
            getSpacingClass("xs", "p"),
            "transition-colors",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-line-focus",
            "focus:ring-offset-1",
          )}
          aria-label={`Remove ${accessibleLabel || "chip"}`}
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

Chip.displayName = "Chip";

export default Chip;
