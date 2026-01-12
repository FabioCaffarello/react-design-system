'use client';

import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "active" | "disabled";
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * NavLink Component
 * 
 * A navigation link component with active and disabled states.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <NavLink href="/dashboard" variant="active">
 *   Dashboard
 * </NavLink>
 * ```
 */
export default function NavLink({
  variant = "default",
  icon,
  className = "",
  children,
  ...props
}: NavLinkProps) {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "px-1",
    "pt-1",
    "border-b-2",
    "text-sm",
    "font-medium",
    "transition-colors",
  ];

  const variantClasses: Record<NonNullable<NavLinkProps["variant"]>, string> = {
    default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
    active: "border-indigo-500 text-gray-900",
    disabled: "border-transparent text-gray-300 cursor-not-allowed pointer-events-none",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  if (variant === "disabled") {
    return (
      <span className={classes} aria-disabled="true">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }

  return (
    <a className={classes} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </a>
  );
}
