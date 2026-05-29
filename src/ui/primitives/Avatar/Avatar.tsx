"use client";

import {
  useState,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  src?: string;
  alt?: string;
  fallback?: string | ReactNode;
  size?: AvatarSize;
  variant?: "circle" | "square" | "rounded";
  "aria-label"?: string;
}

/**
 * Avatar Component
 *
 * A versatile avatar component for displaying user profile images or initials.
 * Supports fallback display when image fails to load or is not provided.
 * Fully accessible with ARIA attributes.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar src="/user.jpg" alt="John Doe" />
 *
 * // With fallback initials
 * <Avatar fallback="JD" alt="John Doe" />
 *
 * // Custom size
 * <Avatar src="/user.jpg" size="lg" />
 * ```
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    fallback,
    size = "md",
    variant = "circle",
    "aria-label": ariaLabel,
    className = "",
    ...props
  },
  ref,
) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size and variant classes (not using cva to avoid type issues with dynamic classes)
  const sizeClasses: Record<AvatarSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const variantClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-md",
  };

  const showFallback = !src || imageError;
  const displayFallback =
    typeof fallback === "string"
      ? fallback.toUpperCase().slice(0, 2)
      : fallback;

  const defaultAriaLabel = ariaLabel || alt || "User avatar";

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        "inline-flex",
        "items-center",
        "justify-center",
        "shrink-0",
        "font-medium",
        "overflow-hidden",
        sizeClasses[size],
        variantClasses[variant],
        "bg-surface-muted",
        "text-fg-primary",
        className,
      )}
      role="img"
      aria-label={defaultAriaLabel}
      {...props}
    >
      {!showFallback && src && (
        <img
          src={src}
          alt={alt || ""}
          className={cn(
            "w-full",
            "h-full",
            "object-cover",
            variant === "circle"
              ? "rounded-full"
              : variant === "square"
                ? "rounded-none"
                : "rounded-md",
            !imageLoaded ? "opacity-0" : "opacity-100",
            "transition-opacity",
            "duration-200",
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          aria-hidden="true"
        />
      )}
      {showFallback && (
        <span
          className={cn(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "h-full",
            variant === "circle"
              ? "rounded-full"
              : variant === "square"
                ? "rounded-none"
                : "rounded-md",
          )}
          aria-hidden="true"
        >
          {displayFallback || "?"}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
