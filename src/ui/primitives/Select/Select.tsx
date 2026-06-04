"use client";

import { forwardRef, memo, useMemo, useCallback } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";
import {
  getTypographyClasses,
  getTypographySize,
} from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { cn, cva } from "../../utils";

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

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "size"
> {
  options: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  placeholder?: string;
  label?: ReactNode;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  size?: SelectSize;
}

/**
 * Select Component
 *
 * A styled select dropdown component for forms.
 * Follows Atomic Design principles as an Atom component.
 * Supports both flat options and option groups.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Choose option"
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   placeholder="Select an option"
 * />
 * ```
 */
const Select = memo(
  forwardRef<HTMLSelectElement, SelectProps>(function Select(
    {
      options = [],
      optionGroups,
      placeholder,
      label,
      error = false,
      success = false,
      helperText,
      size = "md",
      className = "",
      disabled = false,
      id,
      ...props
    },
    ref,
  ) {
    // Memoize IDs
    const selectId = useMemo(
      () => id || `select-${Math.random().toString(36).substr(2, 9)}`,
      [id],
    );

    const errorId = useMemo(
      () => (error ? `${selectId}-error` : undefined),
      [error, selectId],
    );

    const helperId = useMemo(
      () => (helperText ? `${selectId}-helper` : undefined),
      [helperText, selectId],
    );

    // Memoize focus ring colors
    const primaryFocusRing = useMemo(() => "focus:border-line-focus", []);

    const errorFocusRing = useMemo(() => "focus:border-error", []);

    const successFocusRing = useMemo(() => "focus:border-success", []);

    // Memoize focus ring color function
    const getFocusRingColor = useCallback(
      (stateType?: "error" | "success"): string => {
        if (stateType === "error") {
          return errorFocusRing.replace("focus:border-", "focus:ring-");
        }
        if (stateType === "success") {
          return successFocusRing.replace("focus:border-", "focus:ring-");
        }
        return primaryFocusRing.replace("focus:border-", "focus:ring-");
      },
      [errorFocusRing, successFocusRing, primaryFocusRing],
    );

    // Select variants using CVA — memoize so the function reference is
    // stable across renders. selectClasses below depends on this; without
    // memoization a fresh cva() each render would invalidate that memo
    // on every render (defeating its purpose).
    const selectVariants = useMemo(
      () =>
        cva(
          // Base classes
          cn(
            "block",
            "w-full",
            getRadiusClass("md"),
            "border",
            "bg-surface-base",
            "transition-colors",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-offset-2",
            "disabled:opacity-50",
            "disabled:cursor-not-allowed",
          ),
          {
            variants: {
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
                default: cn("border-line-default", getFocusRingColor()),
                error: cn("border-error", getFocusRingColor("error")),
                success: cn("border-success", getFocusRingColor("success")),
              },
            },
            defaultVariants: {
              size: "md",
              state: "default",
            },
          },
        ),
      [getFocusRingColor],
    );

    // Memoize state
    const selectState = useMemo(
      () => (error ? "error" : success ? "success" : "default"),
      [error, success],
    );

    // Memoize classes
    const selectClasses = useMemo(
      () => cn(selectVariants({ size, state: selectState }), className),
      [selectVariants, size, selectState, className],
    );

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

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className={labelClasses}>
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-required={props.required}
          aria-describedby={errorId || helperId}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {optionGroups && optionGroups.length > 0
            ? optionGroups.map((group, groupIndex) => (
                <optgroup key={groupIndex} label={group.label}>
                  {(group.options || []).map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : (options || []).map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
        </select>
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

Select.displayName = "Select";

export default Select;
