"use client";

import {
  useState,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { getRadiusClass } from "../../tokens/radius";
import { cn } from "../../utils";
import type { AvatarSize } from "./AvatarBase";

// AvatarSize is defined in AvatarBase (the server-safe base) and
// re-exported here so consumers importing from Avatar get the same type.
export type { AvatarSize } from "./AvatarBase";

export interface AvatarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  src?: string;
  alt?: string;
  fallback?: string | ReactNode;
  size?: AvatarSize;
  variant?: "circle" | "square" | "rounded";
  "aria-label"?: string;
  /**
   * Controls the browser's native lazy-loading behaviour for the avatar
   * `<img>`. Set to `"lazy"` to defer loading until the avatar is near the
   * viewport — strongly recommended for listings with many off-screen
   * profile images (e.g. a 24-card parliament listing).
   *
   * Maps directly to the native `<img loading>` attribute and has no effect
   * when `src` is absent (no `<img>` is rendered).
   *
   * @default 'eager'
   */
  loading?: "lazy" | "eager";
}

/**
 * Avatar Component
 *
 * A versatile avatar component for displaying user profile images or
 * initials. Supports fallback display when image fails to load or is not
 * provided. Fully accessible with ARIA attributes.
 *
 * ### Size scale
 *
 * | size | px  | Use case                        |
 * |------|-----|---------------------------------|
 * | xs   | 24  | Tight inline / notification dot |
 * | sm   | 32  | Comment thread, compact row     |
 * | md   | 40  | Default — card header, form row |
 * | lg   | 48  | Expanded card, sidebar profile  |
 * | xl   | 64  | Detail-page section header      |
 * | 2xl  | 96  | Hero profile (PerfilHeader)     |
 * | 3xl  | 112 | Full-bleed hero cover           |
 *
 * ### Lazy loading
 *
 * Pass `loading="lazy"` on listings to defer off-screen image loads. The
 * default is `"eager"` (matches browser default) for backward compatibility.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar src="/user.jpg" alt="John Doe" />
 *
 * // With fallback initials
 * <Avatar fallback="JD" alt="John Doe" />
 *
 * // Hero profile — larger size + lazy load
 * <Avatar src="/perfil.jpg" alt="Dep. Silva" size="2xl" />
 *
 * // Listing — lazy-load all avatars below the fold
 * <Avatar src="/user.jpg" alt="User Name" loading="lazy" />
 * ```
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    fallback,
    size = "md",
    variant = "circle",
    loading = "eager",
    "aria-label": ariaLabel,
    className = "",
    ...props
  },
  ref,
) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses: Record<AvatarSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-24 w-24 text-3xl",
    "3xl": "h-28 w-28 text-4xl",
  };

  const variantClasses = {
    circle: getRadiusClass("full"),
    square: getRadiusClass("none"),
    rounded: getRadiusClass("md"),
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
          loading={loading}
          className={cn(
            "w-full",
            "h-full",
            "object-cover",
            variantClasses[variant],
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
            variantClasses[variant],
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
