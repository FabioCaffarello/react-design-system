import { forwardRef, memo, useEffect, useId, useMemo } from "react";
import type { TextareaHTMLAttributes } from "react";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { cn } from "../../utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  /**
   * Validation success state — paints the border and (when
   * `helperText` is also set) the helper-text color green. Matches
   * the Input + Select + Checkbox + Radio + Switch convention; the
   * three feedback flags (`error`, `success`, `helperText`) cover
   * every form primitive in the DS. Error takes precedence when
   * both `error` and `success` are set.
   */
  success?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
  label?: string;
  /**
   * Secondary text rendered beneath the textarea, wired through
   * `aria-describedby`. Named `helperText` to match Input, Select,
   * Checkbox, Radio, and Switch — every form primitive in the DS
   * uses the same prop name for this role. When `error` or
   * `success` is also set, the helper text inherits the matching
   * red / green color.
   */
  helperText?: string;
}

/**
 * Textarea Component
 *
 * A styled textarea component for longer text input.
 *
 * For an accessible name, supply ONE of:
 *  - `label` prop (renders a visible `<label>` above the textarea), OR
 *  - `aria-label` / `aria-labelledby`, OR
 *  - an external `<Label htmlFor={id}>` paired with the same `id` prop
 *    (use the Label primitive when you need `variant="required" | "optional"`).
 *
 * In development, a missing accessible name logs a warning to the console.
 *
 * @example
 * ```tsx
 * <Textarea label="Description" rows={4} />
 * ```
 */
const Textarea = memo(
  forwardRef<HTMLTextAreaElement, Props>(function Textarea(
    {
      error = false,
      success = false,
      resize = "vertical",
      className = "",
      label,
      helperText,
      id: idProp,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
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

    // Memoize resize classes
    const resizeClasses = useMemo<Record<NonNullable<Props["resize"]>, string>>(
      () => ({
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
      }),
      [],
    );

    // Memoize classes — error wins over success when both flags are
    // set (a field cannot be valid AND invalid; treat it as invalid).
    const classes = useMemo(
      () =>
        cn(
          "block",
          "w-full",
          getRadiusClass("md"),
          getSpacingClass("base", "px"),
          getSpacingClass("md", "py"),
          "border",
          getTypographySize("body"),
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          resizeClasses[resize],
          error
            ? cn("border-error", focusRingColor)
            : success
              ? cn("border-success", focusRingColor)
              : cn("border-line-default", focusRingColor),
          className,
        ),
      [resize, resizeClasses, error, success, focusRingColor, className],
    );

    // Memoize aria-describedby — points to the helper paragraph when
    // helperText is provided; falls back to an error id when only
    // error is set (kept for back-compat with consumers that don't
    // pass helperText).
    const helperId = useMemo(
      () => (helperText ? `${id}-helper` : undefined),
      [helperText, id],
    );

    const ariaDescribedBy = useMemo(
      () => helperId ?? (error ? `${id}-error` : undefined),
      [helperId, error, id],
    );

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];

    // Dev-only accessibility warning: ensure some accessible name source exists.
    useEffect(() => {
      if (!import.meta.env.DEV) return;
      if (label || ariaLabel || ariaLabelledBy) return;
      const externalLabel =
        typeof document !== "undefined"
          ? document.querySelector(`label[for="${CSS.escape(id)}"]`)
          : null;
      if (externalLabel) return;
      console.warn(
        "[Textarea] Missing accessible name. Provide a `label` prop, `aria-label`, `aria-labelledby`, or pair an external `<Label htmlFor={id}>` with the same `id`.",
      );
    }, [label, ariaLabel, ariaLabelledBy, id]);

    const textareaEl = (
      <textarea
        ref={ref}
        id={id}
        className={classes}
        aria-invalid={error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );

    const helperEl = helperText ? (
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
    ) : null;

    if (!label && !helperEl) return textareaEl;

    return (
      <div className="block w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block",
              getSpacingClass("xs", "mb"),
              getTypographySize("label"),
              "font-medium",
              "text-fg-primary",
            )}
          >
            {label}
          </label>
        )}
        {textareaEl}
        {helperEl}
      </div>
    );
  }),
);

Textarea.displayName = "Textarea";

export default Textarea;
