/**
 * HeaderHamburger Component
 *
 * Hamburger button for toggling mobile menu.
 *
 * @see EPIC-002: Header Component (Molecule)
 * @see TASK-027: Hamburger Button
 */

"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../../primitives/Button/Button";
import { useHeaderContext } from "../contexts/HeaderContext";
import { cn } from "../../../utils";

export interface HeaderHamburgerProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom icon component
   */
  icon?: React.ReactNode;

  /**
   * Custom close icon component
   */
  closeIcon?: React.ReactNode;

  /**
   * Button variant
   * @default 'ghost'
   */
  variant?: "ghost" | "outline" | "default";

  /**
   * Button size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

/**
 * HeaderHamburger Component
 *
 * Hamburger button that toggles the mobile menu.
 * Only visible on mobile devices.
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Hamburger />
 *   <Header.Logo href="/">MyApp</Header.Logo>
 * </Header>
 * ```
 */
export function HeaderHamburger({
  className,
  icon,
  closeIcon,
  variant = "ghost",
  size = "md",
}: HeaderHamburgerProps) {
  const { isMobileMenuOpen, toggleMobileMenu } = useHeaderContext();

  const MenuIcon = icon || <Menu className="h-5 w-5" />;
  const CloseIcon = closeIcon || <X className="h-5 w-5" />;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleMobileMenu}
      className={cn("md:hidden", className)}
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMobileMenuOpen}
    >
      {isMobileMenuOpen ? CloseIcon : MenuIcon}
    </Button>
  );
}
