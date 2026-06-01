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

  // Architecture path:
  //   useLabelButton = onClick + onRemove + not selected + not disabled
  //   The label and the X are two sibling <button>s inside a non-interactive
  //   outer <div>. This avoids nested-interactive (axe) when the consumer
  //   asks the chip to BOTH toggle and remove — APG anti-pattern otherwise.
  //   Cases NOT covered by this path (single behavior, or selected-as-option)
  //   keep the historical outer-is-interactive structure.
  const useLabelButton =
    onClick !== undefined && onRemove !== undefined && !selected && !disabled;

  const isInteractive =
    !useLabelButton &&
    (onClick !== undefined || (selected !== false && selected !== undefined));
  const role = selected ? "option" : isInteractive ? "button" : undefined;
  const shouldHaveAriaLabel = role === "button" && !accessibleLabel;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant, size, selected, disabled }),
        onRemove && getSpacingClass("xs", "pr"),
        isInteractive &&
          !disabled &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-line-focus focus:ring-offset-2",
        className,
      )}
      role={role}
      aria-selected={selected ? true : undefined}
      aria-disabled={disabled}
      aria-label={
        useLabelButton
          ? undefined
          : shouldHaveAriaLabel
            ? "Chip"
            : ariaLabel || (role === "button" ? accessibleLabel : undefined)
      }
      tabIndex={
        useLabelButton
          ? undefined
          : tabIndex !== undefined
            ? tabIndex
            : isInteractive && !disabled
              ? 0
              : undefined
      }
      onClick={useLabelButton || disabled ? undefined : onClick}
      onKeyDown={useLabelButton ? undefined : handleKeyDown}
      {...props}
    >
      {useLabelButton ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
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
