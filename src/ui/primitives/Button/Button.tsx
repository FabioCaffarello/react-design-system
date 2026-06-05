import { forwardRef, memo, useMemo } from "react";
import type { ButtonHTMLAttributes, ReactNode, ElementType } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { getRadiusClass } from "../../tokens/radius";

// Ambient declaration so the dev-only warn below typechecks without
// pulling @types/node into the app tsconfig. At runtime the consumer's
// bundler (webpack/turbopack/etc.) replaces `process.env.NODE_ENV` with
// a literal; the `typeof process` guard keeps the branch safe in
// browser/edge runtimes where `process` doesn't exist.
declare const process: { env: { NODE_ENV?: string } };
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

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "as"
> {
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
  /**
   * When true, render via Radix `Slot`: classes, ARIA, ref and remaining
   * props are projected onto the single child element instead of an
   * intrinsic `<button>`. The child keeps its own element type and props
   * intact — including framework-native props like `<Link href prefetch>`.
   *
   * `asChild` takes precedence over `as`: if both are supplied, `as` is
   * ignored and a dev-only warning is logged.
   *
   * @example
   * ```tsx
   * <Button asChild variant="primary">
   *   <Link href="/profile" prefetch>Open profile</Link>
   * </Button>
   * // → <a class="…button classes" href="/profile" data-prefetch>Open profile</a>
   * ```
   */
  asChild?: boolean;
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
          "bg-surface-brand-strong",
          "text-fg-inverse",
          "hover:opacity-90",
          "focus:ring-line-brand",
        ),
        secondary: cn(
          "bg-surface-secondary",
          "text-fg-inverse",
          "hover:opacity-90",
          "focus:ring-line-secondary",
        ),
        error: cn(
          "bg-error",
          "text-fg-inverse",
          "hover:opacity-90",
          "focus:ring-error",
        ),
        outline: cn(
          "border-2",
          "border-line-default",
          "bg-transparent",
          "text-fg-primary",
          "hover:bg-surface-hover",
          "focus:ring-line-focus",
        ),
        ghost: cn(
          "bg-transparent",
          "text-fg-primary",
          "hover:bg-surface-hover",
          "focus:ring-line-focus",
        ),
        iconOnly: cn(
          "bg-transparent",
          "text-fg-primary",
          "hover:bg-surface-hover",
          "focus:ring-line-focus",
          getSpacingClass("none", "p"),
        ),
      },
      size: {
        sm: cn(
          getSpacingClass("md", "px"),
          getSpacingClass("1.5", "py"),
          getTypographySize("bodySmall"),
          getSpacingClass("1.5", "gap"),
        ),
        md: cn(
          getSpacingClass("base", "px"),
          getSpacingClass("sm", "py"),
          getTypographySize("body"),
          getSpacingClass("sm", "gap"),
        ),
        lg: cn(
          getSpacingClass("lg", "px"),
          getSpacingClass("md", "py"),
          getTypographySize("bodyLarge"),
          getSpacingClass("2.5", "gap"),
        ),
      },
    },
    compoundVariants: [
      // IconOnly variant has different sizing
      {
        variant: "iconOnly",
        size: "sm",
        class: cn("h-8", "w-8", getSpacingClass("none", "p")),
      },
      {
        variant: "iconOnly",
        size: "md",
        class: cn("h-10", "w-10", getSpacingClass("none", "p")),
      },
      {
        variant: "iconOnly",
        size: "lg",
        class: cn("h-12", "w-12", getSpacingClass("none", "p")),
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
      className={`inline-flex items-center ${position === "left" ? getSpacingClass("none", "mr") : getSpacingClass("none", "ml")}`}
    >
      {children}
    </span>
  );
}

/**
 * Button Component
 *
 * A styled button with variants, sizes, and loading states.
 *
 * Polymorphism — two APIs:
 *   - `as` (legacy): swap the root element type. `<Button as={Link} href="…">`.
 *   - `asChild` (recommended): project Button's styling onto the single
 *     child element. Idiomatic Radix Slot pattern, preserves the child's
 *     own props and TS type (e.g. `<Link href prefetch>`). When `asChild`
 *     is true, `as` is ignored.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="md" onClick={handleClick}>Click me</Button>
 *
 * // With icons
 * <Button leftIcon={<Icon />} rightIcon={<Icon />}>Action</Button>
 *
 * // Loading state
 * <Button isLoading loadingText="Saving...">Save</Button>
 *
 * // Polymorphic via asChild (preserves Next Link's TS type and native props)
 * <Button asChild variant="primary">
 *   <Link href="/page" prefetch>Open</Link>
 * </Button>
 *
 * // Polymorphic via legacy `as`
 * <Button as="a" href="/page">Navigate</Button>
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
      asChild = false,
      as,
      className = "",
      disabled = false,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    // asChild wins over `as`. Warn in dev so the precedence is observable
    // instead of being a silent override. Production builds strip this branch.
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      asChild &&
      as !== undefined &&
      as !== "button"
    ) {
      console.warn(
        "[Button] `as` is ignored when `asChild` is true; the child element is used as the root. Drop one of the two props to silence this warning.",
      );
    }

    const Component: ElementType = asChild ? Slot : (as ?? "button");

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

    // Build button props (spread props at the end to allow overrides).
    // `type="button"` default applies only when rendering an intrinsic
    // <button>. asChild and `as` (custom) projections leave it off so we
    // don't paint a meaningless `type` attribute onto <a> / <Link>.
    const defaultType =
      !asChild && (as === undefined || as === "button") && !props.type
        ? "button"
        : undefined;
    const buttonProps = {
      className: classes,
      disabled: disabled || isLoading,
      "aria-busy": isLoading,
      "aria-label": finalAriaLabel,
      "aria-disabled": disabled || isLoading,
      ...(defaultType ? { type: defaultType } : {}),
      ...props,
    };

    // asChild path: render Slot with the icons and Slottable as direct
    // sibling children (NOT wrapped in a React.Fragment). Slot's
    // children-processing inspects each direct child for Slottable; if
    // the children are wrapped in a Fragment, Slot's SlotClone merges
    // the projected props into the Fragment itself (a silent no-op for
    // className / aria / ref), and nothing reaches the consumer's
    // element. Hence the two distinct branches below: same content
    // shape, different host element, different child layout.
    if (asChild) {
      return (
        <Component ref={ref} {...buttonProps}>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          <Slottable>{children}</Slottable>
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </Component>
      );
    }

    return (
      <Component ref={ref} {...buttonProps}>
        {isLoading ? (
          <>
            {displayLoadingIcon}
            {loadingText && (
              <span className={getSpacingClass("sm", "ml")}>{loadingText}</span>
            )}
            {!loadingText && children && (
              <span className={`${getSpacingClass("sm", "ml")} opacity-0`}>
                {children}
              </span>
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
