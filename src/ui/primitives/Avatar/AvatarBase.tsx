import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { getRadiusClass } from "../../tokens/radius";
import { cn } from "../../utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface AvatarBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  src?: string;
  alt?: string;
  fallback?: string | ReactNode;
  size?: AvatarSize;
  variant?: "circle" | "square" | "rounded";
  /**
   * Controls the browser's native lazy-loading behaviour for the avatar
   * `<img>`. Set to `"lazy"` to defer loading until the avatar is near the
   * viewport — strongly recommended for listings with many off-screen
   * profile images.
   *
   * Has no effect when `src` is absent (no `<img>` is rendered).
   *
   * @default 'eager'
   */
  loading?: "lazy" | "eager";
  "aria-label"?: string;
}

// Module-level constants so RSC can evaluate these without per-render alloc.
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

/**
 * AvatarBase — the **server-safe presentational core** of `Avatar` (issue #250).
 *
 * It holds no React client state (`useState` / `useEffect` / hooks of any
 * kind), so it is importable from
 * `@fabio.caffarello/react-design-system/server` and renders inside React
 * Server Components and zero-JS routes.
 *
 * ### Trade-off vs `Avatar`
 *
 * | Scenario                  | AvatarBase behaviour                              |
 * |---------------------------|---------------------------------------------------|
 * | `src` absent / null       | Renders initials fallback — fully server-rendered |
 * | `src` present, loads OK   | Renders `<img>` — same as `Avatar`                |
 * | `src` present, 404s       | Browser broken-image; no graceful JS fallback     |
 *
 * Use `Avatar` (main entry) when you need the graceful `onError` swap to
 * initials (requires `useState` — client island). Use `AvatarBase` in
 * Server Components and listings that are deliberately zero-JS, where `src`
 * is null for entries without a photo and a graceful 404 fallback is
 * acceptable to forgo.
 *
 * @example
 * ```tsx
 * // Server Component list — zero-JS, initials rendered on server when src is null
 * import { AvatarBase } from "@fabio.caffarello/react-design-system/server";
 *
 * export default function ParlamentarCard({ parlamentar }) {
 *   return (
 *     <AvatarBase
 *       src={parlamentar.fotoUrl ?? undefined}
 *       fallback={parlamentar.nome}
 *       alt={parlamentar.nome}
 *       size="md"
 *       loading="lazy"
 *     />
 *   );
 * }
 * ```
 */
const AvatarBase = forwardRef<HTMLDivElement, AvatarBaseProps>(
  function AvatarBase(
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
    const showFallback = !src;
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
        {!showFallback && (
          <img
            src={src}
            alt={alt || ""}
            loading={loading}
            className={cn(
              "w-full",
              "h-full",
              "object-cover",
              variantClasses[variant],
            )}
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
  },
);

AvatarBase.displayName = "AvatarBase";

export default AvatarBase;
