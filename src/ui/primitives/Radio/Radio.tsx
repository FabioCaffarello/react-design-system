"use client";

import { forwardRef, memo, useMemo } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { getTypographyClasses } from "../../tokens/typography";
import { getColorClass, getFocusColorClass } from "../../tokens/colors";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  error?: boolean;
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

    const errorFocusRing = useMemo(
      () => getFocusColorClass("error", "DEFAULT", "border"),
      [],
    );

    const focusRingColor = useMemo(
      () =>
        error
          ? errorFocusRing.replace("focus:border-", "focus:ring-")
          : primaryFocusRing.replace("focus:border-", "focus:ring-"),
      [error, errorFocusRing, primaryFocusRing],
    );

    // Memoize classes
    const radioClasses = useMemo(
      () =>
        cn(
          "h-4",
          "w-4",
          "border",
          getColorClass("neutral", "DEFAULT", "border"),
          "text-fg-brand",
          "focus:ring-2",
          focusRingColor,
          "focus:ring-offset-2",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          "cursor-pointer",
          error && getColorClass("error", "DEFAULT", "border"),
          className,
        ),
      [focusRingColor, error, className],
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
        {(error || helperText) && (
          <div
            id={errorId || helperId}
            className={cn(
              getSpacingClass("xs", "mt"),
              getTypographyClasses("caption"),
              error
                ? getColorClass("error", "DEFAULT", "text")
                : getColorClass("neutral", "DEFAULT", "text"),
            )}
            role={error ? "alert" : undefined}
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
