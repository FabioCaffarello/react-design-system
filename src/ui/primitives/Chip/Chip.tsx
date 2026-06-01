"use client";

import { forwardRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { cn, cva } from "../../utils";

export type ChipVariant = "default" | "outlined" | "filled";
export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  onClick?: () => void;
  tabIndex?: number;
}

/**
 * Chip Component
 *
 * A chip/tag component for displaying labels, filters, or selected items.
 * Follows Atomic Design principles as an Atom component.
 *
 * @example
 * ```tsx
 * <Chip>Tag</Chip>
 * <Chip onRemove={() => console.log('removed')}>Removable</Chip>
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

const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    children,
    variant = "default",
    size = "md",
    onRemove,
    selected = false,
    disabled = false,
    className = "",
    "aria-label": ariaLabel,
    onClick,
    tabIndex,
    ...props
  },
  ref,
) {
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

  return (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant, size, selected, disabled }),
        onRemove && getSpacingClass("xs", "pr"),
        className,
      )}
      aria-disabled={disabled}
      {...props}
    >
      {useLabelButton ? (
        <button
          type="button"
          onClick={disabled ? undefined : onClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-pressed={selected ? true : undefined}
          aria-label={ariaLabel || accessibleLabel}
          tabIndex={
            tabIndex !== undefined ? tabIndex : interactive ? 0 : undefined
          }
          className={cn(
            "flex-1",
            "bg-transparent",
            "border-0",
            "p-0",
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
