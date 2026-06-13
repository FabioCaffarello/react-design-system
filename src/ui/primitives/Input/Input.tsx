"use client";

import { forwardRef, useState, memo, useId, useMemo, useCallback } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  getTypographyClasses,
  getTypographySize,
} from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { cn, cva } from "../../utils";
import { X, Eye, EyeOff } from "lucide-react";
import Button from "../Button/Button";

/**
 * Helper Text Component
 * Memoized component for helper/error text
 */
const HelperText = memo(function HelperText({
  error,
  success,
  helperText,
  errorId,
  helperId,
}: {
  error: boolean;
  success: boolean;
  helperText?: string;
  errorId?: string;
  helperId?: string;
}) {
  const helperClasses = useMemo(
    () =>
      cn(
        getSpacingClass("xs", "mt"),
        getTypographyClasses("caption"),
        error && "text-fg-error",
        success && "text-fg-success",
        !error && !success && "text-fg-secondary",
      ),
    [error, success],
  );

  const text = useMemo(
    () => helperText || (error ? "Error" : success ? "Success" : ""),
    [helperText, error, success],
  );

  return (
    <div
      id={errorId || helperId}
      className={helperClasses}
      role={error || success ? "alert" : undefined}
    >
      {text}
    </div>
  );
});

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "outlined" | "filled";
export type InputState = "default" | "error" | "success";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: ReactNode;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
}

/**
 * Input Component
 *
 * A styled text input component with label, error/success states, icons, and clear button.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 *
 * @example
 * ```tsx
 * <Input
 *   id="email"
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={hasError}
 *   helperText={errorMessage}
 *   leftIcon={<MailIcon />}
 * />
 * ```
 */
const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      id,
      label,
      error = false,
      success = false,
      helperText,
      size = "md",
      variant = "outlined",
      leftIcon,
      rightIcon,
      showClearButton = false,
      onClear,
      className = "",
      disabled = false,
      type = "text",
      value,
      onChange,
      ...props
    },
    ref,
  ) {
    // Stable fallback id when the consumer doesn't provide one. useId
    // is SSR-safe and stable across renders, replacing the deprecated
    // Math.random().substr() pattern.
    const reactId = useId();
    const inputId = id || `input-${reactId}`;

    // Memoize error and helper IDs
    const errorId = useMemo(
      () => (error ? `${inputId}-error` : undefined),
      [error, inputId],
    );

    const helperId = useMemo(
      () => (helperText ? `${inputId}-helper` : undefined),
      [helperText, inputId],
    );

    // Password toggle state
    const [showPassword, setShowPassword] = useState(false);

    // Memoize password-related values
    const isPassword = useMemo(() => type === "password", [type]);
    const inputType = useMemo(
      () => (isPassword && showPassword ? "text" : type),
      [isPassword, showPassword, type],
    );

    // Memoize state
    const state = useMemo<InputState>(
      () => (error ? "error" : success ? "success" : "default"),
      [error, success],
    );

    // Memoize clear button visibility
    const hasValue = useMemo(
      () => value !== undefined && value !== null && value !== "",
      [value],
    );

    const shouldShowClear = useMemo(
      () => showClearButton && hasValue && !disabled,
      [showClearButton, hasValue, disabled],
    );

    // Memoize focus ring colors
    const primaryFocusRing = useMemo(() => "focus:border-line-focus", []);

    const errorFocusRing = useMemo(() => "focus:border-error", []);

    const successFocusRing = useMemo(() => "focus:border-success", []);

    const getFocusRingColor = useMemo(
      () => primaryFocusRing.replace("focus:border-", "focus:ring-"),
      [primaryFocusRing],
    );

    const getStateFocusRingColor = useCallback(
      (stateType: "error" | "success"): string => {
        return stateType === "error"
          ? errorFocusRing.replace("focus:border-", "focus:ring-")
          : successFocusRing.replace("focus:border-", "focus:ring-");
      },
      [errorFocusRing, successFocusRing],
    );

    // Input variants using CVA — memoize so the function reference is
    // stable across renders. inputClasses below depends on this; without
    // memoization a fresh cva() each render would invalidate that memo
    // on every render (defeating its purpose).
    const inputVariants = useMemo(
      () =>
        cva(
          // Base classes
          cn(
            "w-full",
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
                default: cn(
                  "border-0",
                  "border-b-2",
                  "border-line-default",
                  "focus:border-line-focus",
                ),
                outlined: cn(
                  "border",
                  "border-line-default",
                  "focus:border-line-focus",
                ),
                filled: cn(
                  "bg-surface-muted",
                  "border-0",
                  "focus:bg-surface-base",
                  "focus:ring-2",
                  getFocusRingColor,
                ),
              },
              size: {
                sm: cn(
                  "h-8",
                  getTypographySize("bodySmall"),
                  getSpacingClass("md", "px"),
                ),
                md: cn(
                  "h-10",
                  getTypographySize("body"),
                  getSpacingClass("base", "px"),
                ),
                lg: cn(
                  "h-12",
                  getTypographySize("bodyLarge"),
                  getSpacingClass("lg", "px"),
                ),
              },
              state: {
                default: "",
                error: cn(
                  "border-error",
                  "focus:border-error",
                  getStateFocusRingColor("error"),
                ),
                success: cn(
                  "border-success",
                  "focus:border-success",
                  getStateFocusRingColor("success"),
                ),
              },
            },
            defaultVariants: {
              variant: "outlined",
              size: "md",
              state: "default",
            },
          },
        ),
      [getFocusRingColor, getStateFocusRingColor],
    );

    // Memoize input classes
    const inputClasses = useMemo(
      () =>
        cn(
          inputVariants({ variant, size, state }),
          // Icon padding - specific values for icon positioning.
          // `pl-9` / `pr-9` aren't on the spacing scale (no semantic
          // key for 36px); they stay raw until a future PR either
          // extends the scale or refactors the icon-padding contract.
          leftIcon &&
            (size === "sm"
              ? "pl-9"
              : size === "lg"
                ? getSpacingClass("3xl", "pl")
                : getSpacingClass("2xl", "pl")),
          (rightIcon || shouldShowClear || isPassword) &&
            (size === "sm"
              ? "pr-9"
              : size === "lg"
                ? getSpacingClass("3xl", "pr")
                : getSpacingClass("2xl", "pr")),
          className,
        ),
      [
        inputVariants,
        variant,
        size,
        state,
        leftIcon,
        rightIcon,
        shouldShowClear,
        isPassword,
        className,
      ],
    );

    // Memoize label classes
    const labelClasses = useMemo(
      () =>
        cn(
          "block",
          getTypographyClasses("label"),
          getSpacingClass("xs", "mb"),
          disabled && "opacity-50",
        ),
      [disabled],
    );

    // Memoize icon size and position
    const iconSize = useMemo(
      () => (size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4"),
      [size],
    );

    const iconPosition = useMemo(
      () => (size === "sm" ? "top-2" : size === "lg" ? "top-3.5" : "top-2.5"),
      [size],
    );

    // Memoize clear handler
    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClear) {
          onClear();
        } else if (onChange) {
          // Create synthetic event to clear input
          const inputElement = e.currentTarget
            .closest(".relative")
            ?.querySelector("input") as HTMLInputElement;
          if (inputElement) {
            const syntheticEvent = {
              target: inputElement,
              currentTarget: inputElement,
              bubbles: true,
              cancelable: true,
              defaultPrevented: false,
              eventPhase: 2,
              isTrusted: false,
              nativeEvent: new Event("change"),
              preventDefault: () => {},
              stopPropagation: () => {},
              persist: () => {},
              timeStamp: Date.now(),
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            Object.defineProperty(syntheticEvent.target, "value", {
              value: "",
              writable: true,
            });
            Object.defineProperty(syntheticEvent.currentTarget, "value", {
              value: "",
              writable: true,
            });
            onChange(syntheticEvent);
          }
        }
      },
      [onClear, onChange],
    );

    // Memoize password toggle handler
    const handleTogglePassword = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className={`absolute left-3 ${iconPosition} text-fg-secondary opacity-60 pointer-events-none`}
            >
              <div className={iconSize}>{leftIcon}</div>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            value={value}
            onChange={onChange}
            aria-invalid={error}
            aria-required={props.required}
            aria-describedby={errorId || helperId}
            suppressHydrationWarning
            {...props}
          />
          <div
            className={`absolute right-3 top-0 bottom-0 flex items-center ${getSpacingClass("xs", "gap")}`}
          >
            {shouldShowClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className={`h-auto ${getSpacingClass("xs", "p")}`}
                aria-label="Clear input"
              >
                <X className={iconSize} />
              </Button>
            )}
            {isPassword && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePassword}
                className={`h-auto ${getSpacingClass("xs", "p")}`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className={iconSize} />
                ) : (
                  <Eye className={iconSize} />
                )}
              </Button>
            )}
            {rightIcon && !shouldShowClear && !isPassword && (
              <div
                className={`text-fg-secondary opacity-60 pointer-events-none ${iconSize}`}
              >
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        {(error || success || helperText) && (
          <HelperText
            error={error}
            success={success}
            helperText={helperText}
            errorId={errorId}
            helperId={helperId}
          />
        )}
      </div>
    );
  }),
);

Input.displayName = "Input";

export default Input;
