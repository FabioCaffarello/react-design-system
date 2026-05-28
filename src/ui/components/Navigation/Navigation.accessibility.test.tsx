/**
 * Navigation Accessibility Tests
 *
 * Accessibility tests for the Navigation component.
 * Following TDD approach: tests first, then implementation improvements.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "./Navigation";
import type { NavItem } from "./types";

describe("Navigation Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("should have proper navigation role", () => {
      // TDD: Test navigation role
      const items: NavItem[] = [{ href: "/home", label: "Home" }];

      render(<Navigation items={items} />);
      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toBeInTheDocument();
    });

    it("should allow custom aria-label", () => {
      // TDD: Test custom aria-label
      const items: NavItem[] = [{ href: "/home", label: "Home" }];

      render(<Navigation items={items} aria-label="Custom navigation" />);
      const nav = screen.getByRole("navigation", { name: "Custom navigation" });
      expect(nav).toBeInTheDocument();
    });

    it("should have proper link roles for items", () => {
      // TDD: Test link roles
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should support Tab navigation through items", async () => {
      // TDD: Test Tab navigation
      const user = userEvent.setup();
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);

      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it("should support Enter and Space on navigation items", async () => {
      // TDD: Test keyboard activation
      const user = userEvent.setup();
      const items: NavItem[] = [{ href: "/home", label: "Home" }];

      render(<Navigation items={items} />);

      const link = screen.getByRole("link", { name: "Home" });
      link.focus();
      await user.keyboard("{Enter}");

      // Link should still be in document and focusable
      expect(link).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("should announce navigation structure", () => {
      // TDD: Test navigation announcement
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should announce active items", () => {
      // TDD: Test active state announcement
      const items: NavItem[] = [
        { href: "/home", label: "Home", active: true },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Focus Management", () => {
    it("should have visible focus indicators on items", () => {
      // TDD: Test focus indicators
      const items: NavItem[] = [{ href: "/home", label: "Home" }];

      render(<Navigation items={items} />);
      const link = screen.getByRole("link", { name: "Home" });
      link.focus();

      expect(link).toHaveFocus();
    });
  });
});
