import { forwardRef, memo, useMemo } from "react";
import type { ButtonHTMLAttributes, ReactNode, ElementType } from "react";
import {
  getColorClass,
  getHoverColorClass,
  getFocusRingClass,
} from "../../tokens/colors";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographyClasses,
  getTypographySize,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";
import Spinner from "../Spinner/Spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "error"
  | "outline"
  | "ghost"
  | "iconOnly";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "as"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  loadingIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  as?: ElementType;
  href?: string;
  target?: string;
}

/**
 * Button Variants using CVA
 * Type-safe variant system for Button component
 */
const buttonVariants = cva(
  // Base classes
  cn(
    "inline-flex",
    "items-center",
    "justify-center",
    getTypographyClasses("button").split(" ")[2] || "font-medium", // Extract font-medium
    getRadiusClass("md"),
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          getColorClass("primary", "DEFAULT", "bg"),
          getColorClass("primary", "contrast", "text"),
          "hover:opacity-90",
          getFocusRingClass("primary", "DEFAULT"),
        ),
        secondary: cn(
          getColorClass("secondary", "DEFAULT", "bg"),
          getColorClass("secondary", "contrast", "text"),
          "hover:opacity-90",
          getFocusRingClass("secondary", "DEFAULT"),
        ),
        error: cn(
          getColorClass("error", "DEFAULT", "bg"),
          getColorClass("error", "contrast", "text"),
          "hover:opacity-90",
          getFocusRingClass("error", "DEFAULT"),
        ),
        outline: cn(
          "border-2",
          getColorClass("neutral", "DEFAULT", "border"),
          "bg-transparent",
          getColorClass("neutral", "dark", "text"),
          getHoverColorClass("neutral", "light", "bg"),
          getFocusRingClass("neutral", "DEFAULT"),
        ),
        ghost: cn(
          "bg-transparent",
          getColorClass("neutral", "dark", "text"),
          getHoverColorClass("neutral", "light", "bg"),
          getFocusRingClass("neutral", "DEFAULT"),
        ),
        iconOnly: cn(
          "bg-transparent",
          getColorClass("neutral", "dark", "text"),
          getHoverColorClass("neutral", "light", "bg"),
          getFocusRingClass("neutral", "DEFAULT"),
          "p-0",
        ),
      },
      size: {
        sm: cn(
          "px-3", // md = 3 (12px) - matches test expectation
          "py-1.5", // 6px - not in tokens, keeping hardcoded for exact match
          getTypographySize("bodySmall"),
          "gap-1.5",
        ),
        md: cn(
          getSpacingClass("base", "px"), // px-4
          getSpacingClass("sm", "py"), // py-2
          getTypographySize("body"),
          "gap-2",
        ),
        lg: cn(
          getSpacingClass("lg", "px"), // px-6
          getSpacingClass("md", "py"), // py-3
          getTypographySize("bodyLarge"),
          "gap-2.5",
        ),
      },
    },
    compoundVariants: [
      // IconOnly variant has different sizing
      {
        variant: "iconOnly",
        size: "sm",
        class: cn("h-8", "w-8", "p-0"),
      },
      {
        variant: "iconOnly",
        size: "md",
        class: cn("h-10", "w-10", "p-0"),
      },
      {
        variant: "iconOnly",
        size: "lg",
        class: cn("h-12", "w-12", "p-0"),
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

/**
 * Icon Wrapper Component
 * Handles icon spacing and alignment consistently
 */
function IconWrapper({
  children,
  position,
}: {
  children: ReactNode;
  position: "left" | "right";
}) {
  if (!children) return null;

  return (
    <span
      className={`inline-flex items-center ${position === "left" ? "mr-0" : "ml-0"}`}
    >
      {children}
    </span>
  );
}

/**
 * Button Component
 *
 * A styled button component with variants, sizes, and loading states.
 * Follows Atomic Design principles as an Atom component.
 * Uses Builder Pattern for class construction.
 * Supports polymorphic `as` prop for rendering as different elements (Link, NextLink, etc.).
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // With icons
 * <Button leftIcon={<Icon />} rightIcon={<Icon />}>
 *   Action
 * </Button>
 *
 * // Loading state
 * <Button isLoading loadingText="Saving...">
 *   Save
 * </Button>
 *
 * // As Link
 * <Button as={Link} href="/page">
 *   Navigate
 * </Button>
 *
 * // Icon only
 * <Button variant="iconOnly" leftIcon={<Icon />} aria-label="Close" />
 * ```
 */
const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      loadingIcon,
      leftIcon,
      rightIcon,
      fullWidth = false,
      as: Component = "button",
      className = "",
      disabled = false,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    // Memoize classes computation
    const classes = useMemo(
      () =>
        cn(
          buttonVariants({
            variant,
            size,
          }),
          fullWidth && "w-full",
          className,
        ),
      [variant, size, fullWidth, className],
    );

    // Memoize icon-only check
    const isIconOnly = useMemo(
      () => variant === "iconOnly" || (!children && (leftIcon || rightIcon)),
      [variant, children, leftIcon, rightIcon],
    );

    // Memoize aria label
    const finalAriaLabel = useMemo(
      () =>
        isIconOnly && !ariaLabel && !children
          ? "Button" // Fallback, but should be provided
          : ariaLabel,
      [isIconOnly, ariaLabel, children],
    );

    // Memoize spinner variant computation
    const spinnerVariant = useMemo((): "primary" | "secondary" | "neutral" => {
      if (variant === "error") return "primary"; // Red buttons use primary spinner (white)
      if (variant === "primary" || variant === "secondary") return "neutral"; // Colored buttons use neutral spinner
      return "primary"; // Default
    }, [variant]);

    // Memoize spinner size
    const spinnerSize = useMemo(
      () => (size === "sm" ? "sm" : size === "lg" ? "lg" : "md"),
      [size],
    );

    // Memoize loading icon
    const displayLoadingIcon = useMemo(
      () =>
        loadingIcon || <Spinner size={spinnerSize} variant={spinnerVariant} />,
      [loadingIcon, spinnerSize, spinnerVariant],
    );

    // Build button props (spread props at the end to allow overrides)
    // If type is explicitly provided in props, use it; otherwise default to 'button' for button elements
    const defaultType =
      Component === "button" && !props.type ? "button" : undefined;
    const buttonProps = {
      className: classes,
      disabled: disabled || isLoading,
      "aria-busy": isLoading,
      "aria-label": finalAriaLabel,
      "aria-disabled": disabled || isLoading,
      ...(defaultType ? { type: defaultType } : {}),
      ...props,
    };

    return (
      <Component ref={ref} {...buttonProps}>
        {isLoading ? (
          <>
            {displayLoadingIcon}
            {loadingText && <span className="ml-2">{loadingText}</span>}
            {!loadingText && children && (
              <span className="ml-2 opacity-0">{children}</span>
            )}
          </>
        ) : (
          <>
            {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
            {children}
            {rightIcon && (
              <IconWrapper position="right">{rightIcon}</IconWrapper>
            )}
          </>
        )}
      </Component>
    );
  }),
);

Button.displayName = "Button";

export default Button;
export { Button };
