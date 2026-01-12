'use client';

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface NavbarGroupProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

/**
 * NavbarGroup Component
 * 
 * A clickable group in the navbar that can expand a sidebar.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <NavbarGroup
 *   label="Agile"
 *   isActive={activeGroup === 'agile'}
 *   onClick={() => setActiveGroup('agile')}
 * />
 * ```
 */
export default function NavbarGroup({
  label,
  isActive = false,
  icon,
  onClick,
  className = "",
  children,
  ...props
}: NavbarGroupProps) {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "px-3",
    "py-2",
    "text-sm",
    "font-medium",
    "rounded-md",
    "transition-colors",
  ];

  const variantClasses = isActive
    ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-600"
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const classes = [
    ...baseClasses,
    variantClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-expanded={isActive}
      aria-haspopup="true"
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
      {children}
    </button>
  );
}
