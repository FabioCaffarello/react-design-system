"use client";

import { useRef, useState, useId, forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { getAnimationClass } from "../../tokens/animations";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";

export type SliderVariant = "single" | "range";
export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  variant?: SliderVariant;
  size?: SliderSize;
  disabled?: boolean;
  showValue?: boolean;
  marks?: number[];
  onChange?: (value: number | [number, number]) => void;
  onValueChange?: (value: number | [number, number]) => void;
  /**
   * Required label for the slider. Becomes the accessible name via
   * aria-labelledby — single variant references the rendered <label>
   * element directly; range variant references the same label plus a
   * sr-only qualifier ("minimum" / "maximum") so AT users can tell
   * which handle has focus. Make this a real domain term ("Volume",
   * "Price range"), not the element type ("slider").
   */
  label: string;
}

/**
 * Slider Component
 *
 * A range input component for selecting numeric values.
 * Supports single and dual thumb (range) modes.
 *
 * @example
 * ```tsx
 * <Slider
 *   value={50}
 *   min={0}
 *   max={100}
 *   onChange={(value) => console.log(value)}
 * />
 *
 * <Slider
 *   variant="range"
 *   value={[20, 80]}
 *   min={0}
 *   max={100}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value: controlledValue,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    variant = "single",
    size = "md",
    disabled = false,
    showValue = false,
    marks = [],
    onChange,
    onValueChange,
    label,
    className = "",
    ...props
  },
  ref,
) {
  const sliderRef = useRef<HTMLDivElement>(null);
  // Stable IDs for the visible <label> and (for range) the sr-only
  // qualifier spans that distinguish min vs max handles. Range
  // accessible name = label + qualifier via aria-labelledby with two
  // ids ("Price range minimum" / "Price range maximum"), so the
  // visible label remains the single source of truth — changing
  // `label` propagates to both handles automatically.
  const labelId = useId();
  const minQualifierId = useId();
  const maxQualifierId = useId();
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    defaultValue || (variant === "range" ? [min, max] : min),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const getValueFromPosition = (clientX: number): number => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    const rawValue = min + percentage * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    thumb: "min" | "max" = "min",
  ) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumb);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!sliderRef.current) return;
      const newValue = getValueFromPosition(moveEvent.clientX);
      updateValue(newValue, thumb);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveThumb(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateValue = (newValue: number, thumb: "min" | "max" = "min") => {
    const clampedValue = Math.max(min, Math.min(max, newValue));

    if (variant === "range") {
      const [minVal, maxVal] = Array.isArray(currentValue)
        ? currentValue
        : [min, max];
      let updatedValue: [number, number];

      if (thumb === "min") {
        updatedValue = [Math.min(clampedValue, maxVal), maxVal];
      } else {
        updatedValue = [minVal, Math.max(clampedValue, minVal)];
      }

      if (!isControlled) {
        setInternalValue(updatedValue);
      }
      onChange?.(updatedValue);
      onValueChange?.(updatedValue);
    } else {
      if (!isControlled) {
        setInternalValue(clampedValue);
      }
      onChange?.(clampedValue);
      onValueChange?.(clampedValue);
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled || isDragging) return;
    const newValue = getValueFromPosition(e.clientX);
    updateValue(newValue);
  };

  // Get focus ring color using design system helper
  const getFocusRingColor = (): string => {
    return "focus:ring-line-brand" + " ring-offset-2";
  };

  // Slider variants using CVA
  const sliderTrackVariants = cva(cn("relative", "cursor-pointer"), {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  });

  const sliderThumbVariants = cva(
    cn(
      "absolute",
      "bg-surface-brand",
      getRadiusClass("full"),
      "border-2",
      "border-white",
      getShadowClass("md"),
      "cursor-grab",
      "active:cursor-grabbing",
      getAnimationClass("base"),
      "-translate-x-1/2",
      "-translate-y-1/2",
      "top-1/2",
    ),
    {
      variants: {
        size: {
          sm: "w-3 h-3",
          md: "w-4 h-4",
          lg: "w-5 h-5",
        },
        active: {
          true: getFocusRingColor(),
          false: "",
        },
      },
      defaultVariants: {
        size: "md",
        active: false,
      },
    },
  );

  // Configuration for styling variants
  // const _config = {
  //   track: sliderTrackVariants({ size, disabled }),
  //   thumb: sliderThumbVariants({ size }),
  // };
  const singleValue =
    typeof currentValue === "number" ? currentValue : currentValue[0];
  const minValue = Array.isArray(currentValue) ? currentValue[0] : min;
  const maxValue = Array.isArray(currentValue) ? currentValue[1] : singleValue;

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <label
        id={labelId}
        className={cn(
          "block",
          getTypographySize("bodySmall"),
          getTypographyWeight("label"),
          "text-fg-primary",
          getSpacingClass("sm", "mb"),
        )}
      >
        {label}
        {showValue && (
          <span
            className={cn(getSpacingClass("sm", "ml"), "text-fg-secondary")}
          >
            {variant === "range" ? `${minValue} - ${maxValue}` : singleValue}
          </span>
        )}
      </label>
      {variant === "range" && (
        <>
          <span id={minQualifierId} className="sr-only">
            minimum
          </span>
          <span id={maxQualifierId} className="sr-only">
            maximum
          </span>
        </>
      )}
      <div
        ref={sliderRef}
        className={cn(
          sliderTrackVariants({ size, disabled }),
          "bg-surface-muted",
          getRadiusClass("full"),
        )}
        onClick={handleTrackClick}
        role={variant === "range" ? undefined : "slider"}
        aria-valuemin={variant === "range" ? undefined : min}
        aria-valuemax={variant === "range" ? undefined : max}
        aria-valuenow={variant === "range" ? undefined : singleValue}
        aria-disabled={variant === "range" ? undefined : disabled}
        aria-labelledby={variant === "range" ? undefined : labelId}
      >
        {/* Active track */}
        <div
          className={cn(
            "absolute",
            sliderTrackVariants({ size }),
            "bg-surface-brand",
            getRadiusClass("full"),
            getAnimationClass("base"),
          )}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Marks */}
        {marks.map((mark) => {
          const markPercentage = getPercentage(mark);
          return (
            <div
              key={mark}
              className={cn(
                "absolute",
                "w-1",
                "h-1",
                "bg-line-strong",
                getRadiusClass("full"),
                "-translate-x-1/2",
              )}
              style={{
                left: `${markPercentage}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

        {/* Thumbs */}
        {variant === "range" ? (
          <>
            <div
              className={cn(
                sliderThumbVariants({ size, active: activeThumb === "min" }),
              )}
              style={{ left: `${minPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, "min")}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={maxValue}
              aria-valuenow={minValue}
              aria-labelledby={`${labelId} ${minQualifierId}`}
            />
            <div
              className={cn(
                sliderThumbVariants({ size, active: activeThumb === "max" }),
              )}
              style={{ left: `${maxPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, "max")}
              role="slider"
              aria-valuemin={minValue}
              aria-valuemax={max}
              aria-valuenow={maxValue}
              aria-labelledby={`${labelId} ${maxQualifierId}`}
            />
          </>
        ) : (
          <div
            className={cn(sliderThumbVariants({ size, active: isDragging }))}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={(e) => handleMouseDown(e)}
          />
        )}

        {showValue && !label && (
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <span
              className={cn(
                getTypographySize("caption"),
                "text-fg-secondary",
                "bg-surface-overlay",
                getSpacingClass("sm", "px"),
                getSpacingClass("xs", "py"),
                getRadiusClass("md"),
                "shadow",
              )}
            >
              {variant === "range" ? `${minValue} - ${maxValue}` : singleValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;
