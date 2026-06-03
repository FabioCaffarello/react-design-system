"use client";

import { forwardRef, memo, useMemo } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { getTypographyClasses } from "../../tokens/typography";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
  error?: boolean;
  /**
   * Validation success state — paints the border and (when
   * `helperText` is also set) the helper-text color green. Matches
   * the Input + Select + Checkbox + Switch + Textarea convention;
   * the three feedback flags (`error`, `success`, `helperText`)
   * cover every form primitive in the DS. Error takes precedence
   * when both `error` and `success` are set.
   */
  success?: boolean;
  helperText?: string;
}

/**
 * Radio Component
 *
 * A styled radio input component.
 * Follows Atomic Design principles as an Atom component.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 *
 * @example
 * ```tsx
 * <Radio
 *   id="option1"
 *   name="options"
 *   label="Option 1"
 *   value="1"
 *   checked={selected === "1"}
 *   onChange={handleChange}
 * />
 * ```
 */
const Radio = memo(
  forwardRef<HTMLInputElement, RadioProps>(function Radio(
    {
      id,
      label,
      error = false,
      success = false,
      helperText,
      className = "",
      disabled = false,
      ...props
    },
    ref,
  ) {
    // Memoize IDs
    const radioId = useMemo(
      () => id || `radio-${Math.random().toString(36).substr(2, 9)}`,
      [id],
    );

    const errorId = useMemo(
      () => (error ? `${radioId}-error` : undefined),
      [error, radioId],
    );

    const helperId = useMemo(
      () => (helperText ? `${radioId}-helper` : undefined),
      [helperText, radioId],
    );

    // Memoize focus ring colors
    const primaryFocusRing = useMemo(() => "focus:border-line-focus", []);

    const errorFocusRing = useMemo(() => "focus:border-error", []);

    const focusRingColor = useMemo(
      () =>
        error
          ? errorFocusRing.replace("focus:border-", "focus:ring-")
          : primaryFocusRing.replace("focus:border-", "focus:ring-"),
      [error, errorFocusRing, primaryFocusRing],
    );

    // Memoize classes — error wins over success when both flags are
    // set (a field cannot be valid AND invalid; treat it as invalid).
    const radioClasses = useMemo(
      () =>
        cn(
          "h-4",
          "w-4",
          "border",
          "border-line-default",
          "text-fg-brand",
          "focus:ring-2",
          focusRingColor,
          "focus:ring-offset-2",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          "cursor-pointer",
          error && "border-error",
          !error && success && "border-success",
          className,
        ),
      [focusRingColor, error, success, className],
    );

    const labelClasses = useMemo(
      () =>
        cn(
          getTypographyClasses("label"),
          getSpacingClass("sm", "ml"),
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ),
      [disabled],
    );

    return (
      <div className={cn("flex", "flex-col", getSpacingClass("sm", "my"))}>
        <div className="flex items-center">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={radioClasses}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={errorId || helperId || undefined}
            aria-label={!label ? "Radio button" : undefined}
            {...props}
          />
          {label && (
            <label htmlFor={radioId} className={labelClasses}>
              {label}
            </label>
          )}
        </div>
        {(error || success || helperText) && (
          <div
            id={errorId || helperId}
            className={cn(
              getSpacingClass("xs", "mt"),
              getTypographyClasses("caption"),
              error
                ? "text-fg-error"
                : success
                  ? "text-fg-success"
                  : "text-fg-secondary",
            )}
            role={error || success ? "alert" : undefined}
          >
            {error ? helperText || "This field has an error" : helperText}
          </div>
        )}
      </div>
    );
  }),
);

Radio.displayName = "Radio";

export default Radio;
