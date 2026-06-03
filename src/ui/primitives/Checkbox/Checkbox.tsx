"use client";

import {
  useRef,
  useEffect,
  forwardRef,
  memo,
  useMemo,
  useCallback,
} from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { getTypographyClasses } from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  error?: boolean;
  /**
   * Validation success state — paints the border and (when
   * `helperText` is also set) the helper-text color green. Matches
   * the Input + Select + Radio + Switch + Textarea convention; the
   * three feedback flags (`error`, `success`, `helperText`) cover
   * every form primitive in the DS. Error takes precedence when
   * both `error` and `success` are set.
   */
  success?: boolean;
  helperText?: string;
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 *
 * A styled checkbox input component.
 * Follows Atomic Design principles as an Atom component.
 * Uses Composite Pattern when combined with Label and ErrorMessage.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   id="terms"
 *   label="I agree to the terms"
 *   checked={checked}
 *   onChange={handleChange}
 * />
 * ```
 */
const Checkbox = memo(
  forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
      id,
      label,
      error = false,
      success = false,
      helperText,
      className = "",
      disabled = false,
      indeterminate = false,
      ...props
    },
    ref,
  ) {
    // Memoize IDs
    const checkboxId = useMemo(
      () => id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
      [id],
    );

    const errorId = useMemo(
      () => (error ? `${checkboxId}-error` : undefined),
      [error, checkboxId],
    );

    const helperId = useMemo(
      () => (helperText ? `${checkboxId}-helper` : undefined),
      [helperText, checkboxId],
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
    const checkboxClasses = useMemo(
      () =>
        cn(
          "h-4",
          "w-4",
          getRadiusClass("sm"),
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

    // Set indeterminate state via ref
    const internalRef = useRef<HTMLInputElement>(null);

    // Memoize callback ref
    const setRef = useCallback(
      (element: HTMLInputElement | null) => {
        internalRef.current = element;

        // Handle forwarded ref (can be function or object)
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            element;
        }

        // Set indeterminate state
        if (element) {
          element.indeterminate = indeterminate;
        }
      },
      [ref, indeterminate],
    );

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={cn("flex", "flex-col", getSpacingClass("sm", "my"))}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={setRef}
            className={checkboxClasses}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={errorId || helperId || undefined}
            aria-label={!label ? "Checkbox" : undefined}
            {...props}
          />
          {label && (
            <label htmlFor={checkboxId} className={labelClasses}>
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
