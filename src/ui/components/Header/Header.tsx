/**
 * Header Component
 *
 * Horizontal header component with logo, navigation, and actions slots.
 * Uses compound components pattern for maximum flexibility.
 *
 * @see EPIC-002: Header Component (Molecule)
 * @see RFC-003: Header Composition Pattern (APPROVED)
 * @see ADR-002: Header + SideNavbar Compatibility (ACCEPTED)
 */

"use client";

import React from "react";
import { HeaderProvider } from "./contexts/HeaderContext";
import { HeaderLogo } from "./components/HeaderLogo";
import { HeaderNavigation } from "./components/HeaderNavigation";
import { HeaderActions } from "./components/HeaderActions";
import { HeaderHamburger } from "./components/HeaderHamburger";
import { HeaderMobileMenu } from "./components/HeaderMobileMenu";
import { getZIndexClass } from "../../tokens/z-index";
import type { HeaderProps } from "./types";
import { cn, cva } from "../../utils";
import { Container } from "../../layouts";
import { getColorClass } from "../../tokens/colors";

/**
 * Header Variants using CVA
 * Type-safe variant system for Header component
 */
const headerVariants = cva(
  // Base classes
  cn("w-full", "bg-white", "transition-shadow", "transition-colors"),
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-sm",
        bordered: cn("border-b", getColorClass("neutral", "light", "border")),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Header Component
 *
 * Horizontal header with compound components pattern.
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Logo href="/">MyApp</Header.Logo>
 *   <Header.Navigation>
 *     <NavLink href="/home">Home</NavLink>
 *     <NavLink href="/about">About</NavLink>
 *   </Header.Navigation>
 *   <Header.Actions>
 *     <Button>Sign In</Button>
 *   </Header.Actions>
 * </Header>
 * ```
 */
export function Header({
  children,
  variant = "default",
  sticky = false,
  maxWidth = "full",
  bare = false,
  className,
  ...props
}: HeaderProps) {
  const content = (
    <div className="flex items-center justify-between gap-4">
      {/* Children are rendered here - compound components handle their own layout */}
      {children}
    </div>
  );

  // Bare mode: Just render content without header/Container wrapper
  // Useful when used inside DashboardLayout which provides the wrapper
  if (bare) {
    return (
      <HeaderProvider>
        <div className={cn(className)} {...props}>
          {content}
        </div>
      </HeaderProvider>
    );
  }

  // Normal mode: Create header element with Container
  return (
    <HeaderProvider>
      <header
        className={cn(
          headerVariants({ variant }),
          sticky && `sticky top-0 ${getZIndexClass("sticky")}`,
          sticky && "backdrop-blur-sm bg-white/95",
          className,
        )}
        {...props}
      >
        <Container maxWidth={maxWidth} paddingX="base" paddingY="sm">
          {content}
        </Container>
      </header>
    </HeaderProvider>
  );
}

// Compound Components
Header.Logo = HeaderLogo;
Header.Navigation = HeaderNavigation;
Header.Actions = HeaderActions;
Header.Hamburger = HeaderHamburger;
Header.MobileMenu = HeaderMobileMenu;

export default Header;
