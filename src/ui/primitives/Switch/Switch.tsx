"use client";

import { forwardRef, memo, useMemo, useCallback, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { getAnimationClass } from "../../tokens/animations";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { getSwitchClasses } from "../../tokens/switch";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn } from "../../utils";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: SwitchSize;
  label?: string;
  /**
   * Secondary text rendered beneath the label, wired through
   * `aria-describedby`. Named `helperText` to match Input, Select,
   * Checkbox, and Radio — every form primitive in the DS uses the
   * same prop name for this role.
   */
  helperText?: string;
  error?: boolean;
  /**
   * Validation success state — paints the (off-state) track border
   * and (when `helperText` is also set) the helper-text color green.
   * Matches the Input + Select + Checkbox + Radio + Textarea
   * convention. Error takes precedence when both `error` and
   * `success` are set.
   */
  success?: boolean;
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
 *   helperText="Receive email notifications"
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
      helperText,
      error = false,
      success = false,
      className = "",
      disabled = false,
      checked,
      defaultChecked,
      onChange,
      id,
      ...props
    },
    ref,
  ) {
    // Controlled / uncontrolled pattern.
    //
    // Previously this primitive accepted `defaultChecked` via
    // `...props` and forwarded it to the hidden `<input type="checkbox">`
    // (form-integration shim), but the visible `<button role="switch">`
    // bound `aria-checked={checked}` directly. With `checked` undefined
    // in uncontrolled mode, `aria-checked` was missing — axe
    // `aria-required-attr` (critical) flagged every uncontrolled Switch
    // because `role="switch"` REQUIRES `aria-checked`. The visual track
    // and thumb also stuck at the off state because their classes
    // derived from the same `checked` prop.
    //
    // The fix is the standard React pattern: when `checked` is provided
    // the consumer controls state; otherwise `defaultChecked` seeds
    // internal state and the click/keydown handlers update it locally
    // AND notify `onChange`. The visible button, the hidden input, and
    // every classes() consumer all read from a single resolved
    // `currentChecked`.
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState<boolean>(
      defaultChecked ?? false,
    );
    const currentChecked = isControlled ? !!checked : internalChecked;
    // Memoize IDs
    const switchId = useMemo(
      () => id || `switch-${Math.random().toString(36).substr(2, 9)}`,
      [id],
    );

    const labelId = useMemo(
      () => (label ? `${switchId}-label` : undefined),
      [label, switchId],
    );

    const helperId = useMemo(
      () => (helperText ? `${switchId}-helper` : undefined),
      [helperText, switchId],
    );

    // Component-scoped tokens (SWITCH_TOKENS) drive track/thumb/translate.
    const config = useMemo(() => getSwitchClasses(size), [size]);

    // Memoize focus ring color
    const focusRingColor = useMemo(
      () => "focus:border-line-focus".replace("focus:border-", "focus:ring-"),
      [],
    );

    // Memoize classes — all consume `currentChecked` (the resolved
    // controlled-or-uncontrolled state), not the raw `checked` prop.
    const trackClasses = useMemo(
      () =>
        cn(
          "relative",
          "inline-flex",
          "shrink-0",
          "cursor-pointer",
          getRadiusClass("full"),
          "border-2",
          "border-transparent",
          getAnimationClass("base"),
          "focus:outline-none",
          "focus:ring-2",
          focusRingColor,
          "focus:ring-offset-2",
          config.track,
          currentChecked ? "bg-surface-brand" : "bg-surface-muted",
          // Border feedback only shows in the off state — the on-state
          // brand background already saturates the track and overrides
          // any colored outline visually. Error wins over success.
          error && !currentChecked && "border-error",
          !error && success && !currentChecked && "border-success",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        ),
      [
        focusRingColor,
        config.track,
        currentChecked,
        error,
        success,
        disabled,
        className,
      ],
    );

    const thumbClasses = useMemo(
      () =>
        cn(
          "pointer-events-none",
          "inline-block",
          getRadiusClass("full"),
          "bg-surface-base",
          "shadow",
          "transform",
          getAnimationClass("base"),
          config.thumb,
          currentChecked ? config.translate : "translate-x-0",
        ),
      [config.thumb, config.translate, currentChecked],
    );

    return (
      <div className={cn("flex", "items-start", getSpacingClass("md", "gap"))}>
        <div className="flex items-center">
          <button
            type="button"
            className={trackClasses}
            role="switch"
            aria-checked={currentChecked}
            aria-labelledby={labelId}
            aria-describedby={helperId}
            disabled={disabled}
            onClick={useCallback(
              (e: React.MouseEvent<HTMLButtonElement>) => {
                if (disabled) return;
                const next = !currentChecked;
                if (!isControlled) setInternalChecked(next);
                if (onChange) {
                  const syntheticEvent = {
                    ...e,
                    target: { ...e.target, checked: next },
                    currentTarget: { ...e.currentTarget, checked: next },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              },
              [disabled, onChange, currentChecked, isControlled],
            )}
            onKeyDown={useCallback(
              (e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (disabled) return;
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                const next = !currentChecked;
                if (!isControlled) setInternalChecked(next);
                if (onChange) {
                  const syntheticEvent = {
                    ...e,
                    target: { ...e.target, checked: next },
                    currentTarget: { ...e.currentTarget, checked: next },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              },
              [disabled, onChange, currentChecked, isControlled],
            )}
          >
            <span className={thumbClasses} />
          </button>
          {/* Hidden checkbox for form-data integration. Follows the
              resolved `currentChecked` so submission picks up the
              correct value in both controlled and uncontrolled modes.
              `aria-hidden` + tabIndex=-1 keep it out of AT and Tab
              order — interaction happens on the visible button above.
              The onChange is a no-op fallback (real state changes
              flow through the button's handler); React requires it
              alongside `checked` to suppress the controlled-input
              warning when the consumer doesn't supply onChange. */}
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={currentChecked}
            onChange={onChange ?? (() => {})}
            disabled={disabled}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            {...props}
          />
        </div>
        {(label || helperText) && (
          <div className="flex-1">
            {label && (
              <label
                id={labelId}
                htmlFor={switchId}
                className={cn(
                  "block",
                  getTypographySize("bodySmall"),
                  getTypographyWeight("label"),
                  error ? "text-fg-error" : "text-fg-primary",
                  disabled ? "opacity-50" : "cursor-pointer",
                )}
              >
                {label}
              </label>
            )}
            {helperText && (
              <p
                id={helperId}
                className={cn(
                  getSpacingClass("xs", "mt"),
                  getTypographySize("bodySmall"),
                  error
                    ? "text-fg-error"
                    : success
                      ? "text-fg-success"
                      : "text-fg-secondary",
                )}
              >
                {helperText}
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
