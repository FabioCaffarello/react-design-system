"use client";

/**
 * NavLink Component
 *
 * Navigation link component with active state detection and Next.js integration.
 *
 * @see EPIC-001: NavLink Component (Atom)
 * @see RFC-001: NavLink Hook Strategy (APPROVED)
 * @see RFC-002: Next.js Integration Strategy (APPROVED)
 * @see ADR-001: Active State Detection (ACCEPTED)
 */

import React, { forwardRef, useMemo, useCallback } from "react";
import type { NavLinkProps } from "./types";
import { useNavLink } from "./hooks/useNavLink";
import { cn, cva } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";

/**
 * NavLink Variants using CVA
 * Type-safe variant system for NavLink component
 */
const navLinkVariants = cva(
  // Base classes
  cn(
    "inline-flex",
    "items-center",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "disabled:pointer-events-none",
    "no-underline",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "text-fg-primary",
          "hover:opacity-80",
          "focus-visible:opacity-100",
          "focus:ring-line-brand",
        ),
        underline: cn(
          "text-fg-primary",
          "hover:opacity-80",
          "focus-visible:opacity-100",
          "border-b-2",
          "border-transparent",
          "hover:border-current",
          "focus:ring-line-brand",
        ),
        background: cn(
          "text-fg-primary",
          "hover:bg-surface-hover",
          "rounded-md",
          getRadiusClass("md"),
          "focus:ring-line-brand",
        ),
      },
      size: {
        sm: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("bodySmall"),
        ),
        md: cn(
          getSpacingClass("base", "px"),
          getSpacingClass("sm", "py"),
          getTypographySize("body"),
        ),
        lg: cn(
          getSpacingClass("lg", "px"),
          getSpacingClass("md", "py"),
          getTypographySize("bodyLarge"),
        ),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
    compoundVariants: [
      {
        variant: "underline",
        size: "sm",
        class: getSpacingClass("0.5", "pb"),
      },
      {
        variant: "underline",
        size: "md",
        class: getSpacingClass("xs", "pb"),
      },
      {
        variant: "underline",
        size: "lg",
        class: getSpacingClass("1.5", "pb"),
      },
      {
        variant: "background",
        size: "sm",
        class: getSpacingClass("xs", "px"),
      },
      {
        variant: "background",
        size: "md",
        class: getSpacingClass("sm", "px"),
      },
      {
        variant: "background",
        size: "lg",
        class: getSpacingClass("base", "px"),
      },
    ],
  },
);

/**
 * NavLink Component
 *
 * Navigation link with active state detection and Next.js integration.
 *
 * @example
 * ```tsx
 * <NavLink href="/home">Home</NavLink>
 * <NavLink href="/about" variant="underline" active>About</NavLink>
 * <NavLink href="/contact" variant="background" size="lg">Contact</NavLink>
 * ```
 *
 * Note: Auto-detection of active state via usePathname is deferred to a future enhancement
 * to avoid issues with conditional hook calls. For now, use the `active` prop manually
 * or implement pathname detection in the parent component.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink(
    {
      href,
      children,
      active,
      disabled = false,
      variant = "default",
      size = "md",
      as,
      className,
      "aria-label": ariaLabel,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    // Calculate active state
    // Priority: manual active > false (ADR-001)
    // TODO: Add auto-detect via usePathname in future enhancement
    // This requires a wrapper component pattern to avoid conditional hook calls
    const calculatedActive = useMemo(() => {
      // Manual active prop has priority (ADR-001)
      if (active !== undefined) {
        return active;
      }

      // Default to false
      // TODO: Auto-detect using usePathname (if Next.js available)
      return false;
    }, [active]);

    // Use hook for Next.js Link integration
    const { NextLink } = useNavLink({ href, active: calculatedActive });

    // Determine Link component
    // Priority: as prop > NextLink (auto-detected) > 'a' (RFC-002)
    const LinkComponent: React.ElementType = as || NextLink || "a";

    // Active state classes
    const activeClasses = useMemo(() => {
      if (!calculatedActive) return "";

      switch (variant) {
        case "underline":
          return cn(
            "border-b-2",
            "border-line-brand",
            "text-fg-brand-emphasis",
          );
        case "background":
          return cn("bg-surface-brand-muted", "text-fg-brand-emphasis");
        case "default":
        default:
          return cn("text-fg-brand-emphasis", "font-semibold");
      }
    }, [calculatedActive, variant]);

    // Handle disabled state
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      },
      [disabled, onClick],
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (disabled) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }
        onKeyDown?.(e);
      },
      [disabled, onKeyDown],
    );

    // Prepare props for LinkComponent
    // Next.js Link has different prop structure, so we need to handle it
    const linkProps = useMemo(() => {
      const baseProps = {
        className: cn(
          navLinkVariants({ variant, size }),
          activeClasses,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        ),
        "aria-current": calculatedActive ? "page" : undefined,
        "aria-disabled": disabled ? true : undefined,
        "aria-label": ariaLabel,
        tabIndex: disabled ? -1 : undefined,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        "data-active": calculatedActive,
        "data-disabled": disabled,
        ...props,
      };

      // For Next.js Link, we need to pass href differently
      if (NextLink && !as) {
        return {
          ...baseProps,
          href: disabled ? undefined : href,
        };
      }

      // For regular anchor or custom component
      return {
        ...baseProps,
        href: disabled ? undefined : href,
      };
    }, [
      variant,
      size,
      activeClasses,
      disabled,
      className,
      calculatedActive,
      ariaLabel,
      handleClick,
      handleKeyDown,
      href,
      NextLink,
      as,
      props,
    ]);

    return (
      <LinkComponent ref={ref} {...linkProps}>
        {children}
      </LinkComponent>
    );
  },
);

NavLink.displayName = "NavLink";

export default NavLink;
