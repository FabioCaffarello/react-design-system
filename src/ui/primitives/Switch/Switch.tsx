"use client";

import { forwardRef, memo, useMemo, useCallback } from "react";
import type { InputHTMLAttributes } from "react";
import { getColorClass, getFocusColorClass } from "../../tokens/colors";
import { getAnimationClass } from "../../tokens/animations";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn } from "../../utils";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: SwitchSize;
  label?: string;
  description?: string;
  error?: boolean;
}

/**
 * Switch Component
 *
 * A toggle switch component for on/off states.
 * Follows Atomic Design principles as an Atom component.
 *
 * @example
 * ```tsx
 * <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
 *
 * <Switch
 *   label="Enable notifications"
 *   description="Receive email notifications"
 *   checked={notifications}
 *   onChange={(e) => setNotifications(e.target.checked)}
 * />
 * ```
 */
const Switch = memo(
  forwardRef<HTMLInputElement, SwitchProps>(function Switch(
    {
      size = "md",
      label,
      description,
      error = false,
      className = "",
      disabled = false,
      checked,
      onChange,
      id,
      ...props
    },
    ref,
  ) {
    // Memoize IDs
    const switchId = useMemo(
      () => id || `switch-${Math.random().toString(36).substr(2, 9)}`,
      [id],
    );

    const labelId = useMemo(
      () => (label ? `${switchId}-label` : undefined),
      [label, switchId],
    );

    const descriptionId = useMemo(
      () => (description ? `${switchId}-description` : undefined),
      [description, switchId],
    );

    // Memoize size configurations
    const sizeConfig = useMemo(
      () => ({
        sm: {
          track: "w-9 h-5",
          thumb: "w-4 h-4",
          translate: "translate-x-4",
        },
        md: {
          track: "w-11 h-6",
          thumb: "w-5 h-5",
          translate: "translate-x-5",
        },
        lg: {
          track: "w-14 h-7",
          thumb: "w-6 h-6",
          translate: "translate-x-7",
        },
      }),
      [],
    );

    const config = useMemo(() => sizeConfig[size], [sizeConfig, size]);

    // Memoize focus ring color
    const focusRingColor = useMemo(
      () =>
        getFocusColorClass("primary", "DEFAULT", "border").replace(
          "focus:border-",
          "focus:ring-",
        ),
      [],
    );

    // Memoize classes
    const trackClasses = useMemo(
      () =>
        cn(
          "relative",
          "inline-flex",
          "shrink-0",
          "cursor-pointer",
          "rounded-full",
          "border-2",
          "border-transparent",
          getAnimationClass("base"),
          "focus:outline-none",
          "focus:ring-2",
          focusRingColor,
          "focus:ring-offset-2",
          config.track,
          checked
            ? getColorClass("primary", "DEFAULT", "bg")
            : getColorClass("neutral", "light", "bg"),
          error && !checked && getColorClass("error", "DEFAULT", "border"),
          disabled && "opacity-50 cursor-not-allowed",
          className,
        ),
      [focusRingColor, config.track, checked, error, disabled, className],
    );

    const thumbClasses = useMemo(
      () =>
        cn(
          "pointer-events-none",
          "inline-block",
          "rounded-full",
          "bg-white",
          "shadow",
          "transform",
          getAnimationClass("base"),
          config.thumb,
          checked ? config.translate : "translate-x-0",
        ),
      [config.thumb, config.translate, checked],
    );

    return (
      <div className={cn("flex", "items-start", getSpacingClass("md", "gap"))}>
        <div className="flex items-center">
          <button
            type="button"
            className={trackClasses}
            role="switch"
            aria-checked={checked}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            disabled={disabled}
            onClick={useCallback(
              (e: React.MouseEvent<HTMLButtonElement>) => {
                if (!disabled && onChange) {
                  const syntheticEvent = {
                    ...e,
                    target: { ...e.target, checked: !checked },
                    currentTarget: { ...e.currentTarget, checked: !checked },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              },
              [disabled, onChange, checked],
            )}
            onKeyDown={useCallback(
              (e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  !disabled &&
                  onChange
                ) {
                  e.preventDefault();
                  const syntheticEvent = {
                    ...e,
                    target: { ...e.target, checked: !checked },
                    currentTarget: { ...e.currentTarget, checked: !checked },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              },
              [disabled, onChange, checked],
            )}
          >
            <span className={thumbClasses} />
          </button>
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            aria-hidden="true"
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                id={labelId}
                htmlFor={switchId}
                className={cn(
                  "block",
                  getTypographySize("bodySmall"),
                  getTypographyWeight("label"),
                  error
                    ? getColorClass("error", "DEFAULT", "text")
                    : getColorClass("neutral", "dark", "text"),
                  disabled ? "opacity-50" : "cursor-pointer",
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={descriptionId}
                className={cn(
                  getSpacingClass("xs", "mt"),
                  getTypographySize("bodySmall"),
                  error
                    ? getColorClass("error", "DEFAULT", "text")
                    : getColorClass("neutral", "DEFAULT", "text"),
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }),
);

Switch.displayName = "Switch";

export default Switch;
