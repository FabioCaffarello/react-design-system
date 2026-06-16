import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  getTypographyClasses,
  getTypographySize,
} from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { cn, cva } from "../../utils";

// Ambient declaration so the dev-only warn below typechecks without
// pulling @types/node into the app tsconfig. At runtime the consumer's
// bundler replaces `process.env.NODE_ENV` with a literal; the
// `typeof process` guard keeps the branch safe in browser/edge runtimes.
declare const process: { env: { NODE_ENV?: string } };

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "outlined" | "filled";
export type InputState = "default" | "error" | "success";

/**
 * Input variant tokens (issue #224). They used to live inside `Input`
 * wrapped in `useMemo`; moving them here, to the server-safe `InputBase`,
 * removes that decorative memo and makes `InputBase` the single source of
 * the input's visual surface — the interactive `Input` inherits it by
 * composing `InputBase` rather than re-declaring the cva. The focus-ring
 * colours are inlined directly (the old code derived them via
 * `.replace("focus:border-", "focus:ring-")`, which produced exactly
 * these classes).
 */
const inputVariants = cva(
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
          "focus:ring-line-focus",
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
        error: cn("border-error", "focus:border-error", "focus:ring-error"),
        success: cn(
          "border-success",
          "focus:border-success",
          "focus:ring-success",
        ),
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
      state: "default",
    },
  },
);

/**
 * Helper / error text. De-memoized (issue #224) — the original wrapped
 * its class string and text in `useMemo`, a decorative memo that blocked
 * server-safety. Inlined here; the work is nanoseconds.
 */
function HelperText({
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
  const helperClasses = cn(
    getSpacingClass("xs", "mt"),
    getTypographyClasses("caption"),
    error && "text-fg-error",
    success && "text-fg-success",
    !error && !success && "text-fg-secondary",
  );
  const text = helperText || (error ? "Error" : success ? "Success" : "");

  return (
    <div
      id={errorId || helperId}
      className={helperClasses}
      role={error || success ? "alert" : undefined}
    >
      {text}
    </div>
  );
}

export interface InputBaseProps extends Omit<
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
  /**
   * Raw trailing-affix slot rendered inside the input's right edge with
   * full interactivity (no `pointer-events-none`). The interactive
   * `Input` injects its password-toggle / clear buttons here; consumers
   * can use it for a static suffix (a unit, a badge). When omitted,
   * `rightIcon` renders instead with the muted decorative treatment.
   */
  rightSlot?: ReactNode;
}

/**
 * InputBase
 *
 * The **presentational core** of the text input — label, the `<input>`
 * itself, decorative left/right icons, the trailing-affix slot, and the
 * helper/error line. It holds **no React client state** (no `useState`,
 * `useId`, `useCallback`), so it is server-safe and ships from the
 * `./server` entry (issue #224).
 *
 * The interactive `Input` (default export of this folder) composes
 * `InputBase`, owning the password-toggle state, the clear button, and
 * the `useId` auto-id fallback — it passes the resolved `id`, the
 * toggled `type`, and its affix buttons (`rightSlot`) down. Use
 * `InputBase` directly for server-rendered / native-form inputs where
 * none of that interactivity is needed (`<form method="GET">` filters,
 * RSC pages).
 *
 * Accessible name: pass `id` when you pass `label` so the `<label
 * htmlFor>` binds — `InputBase` does NOT auto-generate an id (that needs
 * `useId`, which would make it client). A dev-only warning fires when a
 * `label` is given without an `id`.
 *
 * @example
 * ```tsx
 * // Server component / native form — zero client state.
 * <InputBase id="q" name="q" placeholder="Buscar…" />
 * ```
 */
const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  function InputBase(
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
      rightSlot,
      className = "",
      disabled = false,
      type = "text",
      ...props
    },
    ref,
  ) {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      label &&
      !id
    ) {
      console.warn(
        "[InputBase] `label` was provided without an `id`. The <label> cannot bind to the input (InputBase does not auto-generate an id — that needs a client hook). Pass an `id`, or use the interactive `Input` which auto-generates one.",
      );
    }

    const state: InputState = error ? "error" : success ? "success" : "default";

    const errorId = error && id ? `${id}-error` : undefined;
    const helperId = helperText && id ? `${id}-helper` : undefined;

    const iconSize =
      size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
    const iconPosition =
      size === "sm" ? "top-2" : size === "lg" ? "top-3.5" : "top-2.5";

    const inputClasses = cn(
      inputVariants({ variant, size, state }),
      // Icon padding — `pl-9` / `pr-9` aren't on the spacing scale (no
      // semantic key for 36px) so they stay raw at the `sm` size; md/lg use
      // the getter. Mirrors the original Input contract.
      leftIcon &&
        (size === "sm"
          ? "pl-9"
          : size === "lg"
            ? getSpacingClass("3xl", "pl")
            : getSpacingClass("2xl", "pl")),
      (rightIcon || rightSlot) &&
        (size === "sm"
          ? "pr-9"
          : size === "lg"
            ? getSpacingClass("3xl", "pr")
            : getSpacingClass("2xl", "pr")),
      className,
    );

    const labelClasses = cn(
      "block",
      getTypographyClasses("label"),
      getSpacingClass("xs", "mb"),
      disabled && "opacity-50",
    );

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className={labelClasses}>
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
            id={id}
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error}
            aria-required={props.required}
            aria-describedby={errorId || helperId}
            suppressHydrationWarning
            {...props}
          />
          {(rightIcon || rightSlot) && (
            <div
              className={`absolute right-3 top-0 bottom-0 flex items-center ${getSpacingClass("xs", "gap")}`}
            >
              {rightSlot ?? (
                <div
                  className={`text-fg-secondary opacity-60 pointer-events-none ${iconSize}`}
                >
                  {rightIcon}
                </div>
              )}
            </div>
          )}
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
  },
);

InputBase.displayName = "InputBase";

export default InputBase;
