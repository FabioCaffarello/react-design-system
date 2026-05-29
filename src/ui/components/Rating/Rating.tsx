"use client";

import { useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getAnimationClass,
  getTypographySizeFromFontSize,
} from "../../tokens";

export type RatingSize = "sm" | "md" | "lg";
export type RatingVariant = "filled" | "outlined";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  size?: RatingSize;
  variant?: RatingVariant;
  readOnly?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;
  className?: string;
  icon?: ReactNode;
  emptyIcon?: ReactNode;
}

/**
 * Rating Component
 *
 * A rating component for displaying and selecting ratings.
 * Supports filled and outlined variants, half ratings, and read-only mode.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <Rating value={4} max={5} onChange={(value) => console.log(value)} />
 *
 * <Rating value={3.5} readOnly showValue />
 * ```
 */
export default function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  size = "md",
  variant = "filled",
  readOnly = false,
  allowHalf = false,
  showValue = false,
  onChange,
  onHover,
  className = "",
  icon,
  emptyIcon,
}: RatingProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const displayValue =
    hoverValue ?? (isControlled ? controlledValue : internalValue);

  const sizeConfig = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (newValue: number) => {
    if (readOnly) return;

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleMouseEnter = (newValue: number) => {
    if (readOnly) return;
    setHoverValue(newValue);
    onHover?.(newValue);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isHalf =
      allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;
    const isFilled = displayValue >= starValue;

    const starClasses = cn(
      sizeConfig[size],
      getAnimationClass("base"),
      !readOnly && "cursor-pointer",
      isFilled || isHalf ? "text-fg-warning" : "text-fg-disabled",
    );

    const CustomIcon = icon || (
      <Star className={starClasses} fill={isFilled ? "currentColor" : "none"} />
    );
    const CustomEmptyIcon = emptyIcon || (
      <Star className={starClasses} fill="none" />
    );

    return (
      <span
        key={index}
        className="relative inline-block"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        role={readOnly ? undefined : "button"}
        tabIndex={readOnly ? undefined : 0}
        aria-label={`Rate ${starValue} out of ${max}`}
        onKeyDown={(e) => {
          if (!readOnly && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick(starValue);
          }
        }}
      >
        {isHalf ? (
          <span className="relative inline-block">
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              {variant === "filled" ? (
                <Star className={starClasses} fill="currentColor" />
              ) : (
                CustomIcon
              )}
            </span>
            {variant === "filled" ? (
              <Star className={starClasses} fill="none" />
            ) : (
              CustomEmptyIcon
            )}
          </span>
        ) : isFilled ? (
          variant === "filled" ? (
            <Star className={starClasses} fill="currentColor" />
          ) : (
            CustomIcon
          )
        ) : variant === "filled" ? (
          <Star className={starClasses} fill="none" />
        ) : (
          CustomEmptyIcon
        )}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "inline-flex",
        "items-center",
        getSpacingClass("xs", "gap"),
        className,
      )}
    >
      <div
        className={cn("flex", "items-center")}
        role={readOnly ? "img" : undefined}
        aria-label={
          readOnly ? `Rating: ${displayValue} out of ${max}` : undefined
        }
      >
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
      {showValue && (
        <span
          className={cn(
            getSpacingClass("sm", "ml"),
            getTypographySizeFromFontSize("sm"),
            "text-fg-secondary",
          )}
        >
          {displayValue.toFixed(allowHalf ? 1 : 0)}/{max}
        </span>
      )}
    </div>
  );
}
