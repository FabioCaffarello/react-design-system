/**
 * Navigation Active State Tests
 *
 * Tests for automatic active state detection in Navigation component.
 * Following TDD approach: tests first, then implementation.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navigation } from "./Navigation";
import type { NavItem } from "./types";

describe("Navigation Active State Detection", () => {
  it("should auto-detect active item when pathname is provided", () => {
    // TDD: Test automatic active state detection via pathname prop
    const items: NavItem[] = [
      { href: "/home", label: "Home" },
      { href: "/about", label: "About" },
    ];

    render(<Navigation items={items} pathname="/home" />);

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("should respect manual active prop over auto-detect", () => {
    // TDD: Test that manual active prop has priority
    const items: NavItem[] = [
      { href: "/home", label: "Home" },
      { href: "/about", label: "About", active: true }, // Manual active
    ];

    render(<Navigation items={items} />);

    const aboutLink = screen.getByText("About").closest("a");
    expect(aboutLink).toHaveAttribute("aria-current", "page");
  });

  it("should handle nested paths correctly", () => {
    // TDD: Test that /home matches /home and /home/child
    const items: NavItem[] = [
      { href: "/home", label: "Home" },
      { href: "/about", label: "About" },
    ];

    render(<Navigation items={items} pathname="/home/child" />);

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("should work without Next.js (no usePathname)", () => {
    // TDD: Test graceful degradation when Next.js is not available
    const items: NavItem[] = [
      { href: "/home", label: "Home" },
      { href: "/about", label: "About" },
    ];

    // When Next.js is not available, should not crash
    render(<Navigation items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});
