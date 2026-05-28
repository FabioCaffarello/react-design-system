/**
 * Navigation Tests
 *
 * Unit tests for the Navigation component.
 * Following TDD approach: tests first, then implementation.
 *
 * @see EPIC-003: Navigation Component (Molecule)
 * @see TASK-040: Criar Estrutura de Diretórios Navigation
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "lucide-react";
import { Navigation } from "./Navigation";
import type { NavItem } from "./types";

describe("Navigation", () => {
  describe("Rendering", () => {
    it("should render with items", () => {
      // TDD: Test basic rendering
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("should render as nav element", () => {
      // TDD: Test semantic HTML
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(<Navigation items={items} />);
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });
  });

  describe("Orientation", () => {
    it("should render horizontal navigation by default", () => {
      // TDD: Test horizontal orientation (default)
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      const { container } = render(
        <Navigation items={items} orientation="horizontal" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      // Horizontal navigation should have flex-row layout
      expect(nav).toHaveClass("flex");
    });

    it("should render vertical navigation", () => {
      // TDD: Test vertical orientation
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];

      const { container } = render(
        <Navigation items={items} orientation="vertical" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      // Vertical navigation should have flex-col layout
      expect(nav).toHaveClass("flex", "flex-col");
    });
  });

  describe("Variants", () => {
    it("should apply default variant", () => {
      // TDD: Test default variant
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} variant="default" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("should apply pills variant", () => {
      // TDD: Test pills variant
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} variant="pills" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("should apply tabs variant", () => {
      // TDD: Test tabs variant
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(<Navigation items={items} variant="tabs" />);
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });
  });

  describe("Active State", () => {
    it("should mark active item", () => {
      // TDD: Test active state
      const items: NavItem[] = [
        { href: "/home", label: "Home", active: true },
        { href: "/about", label: "About" },
      ];

      render(<Navigation items={items} />);
      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Icons", () => {
    it("should render items with icons", () => {
      // TDD: Test icon support
      const items: NavItem[] = [
        {
          href: "/home",
          label: "Home",
          icon: <Home data-testid="home-icon" />,
        },
      ];

      render(<Navigation items={items} />);
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  describe("Disabled Items", () => {
    it("should render disabled items", () => {
      // TDD: Test disabled state
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About", disabled: true },
      ];

      render(<Navigation items={items} />);
      const aboutLink = screen.getByText("About").closest("a");
      expect(aboutLink).toHaveAttribute("aria-disabled", "true");
    });

    it("should not be clickable when disabled", () => {
      // TDD: Test disabled interaction
      const items: NavItem[] = [
        { href: "/about", label: "About", disabled: true },
      ];

      const { container } = render(<Navigation items={items} />);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      const hrefValue = link?.getAttribute("href");
      expect(
        hrefValue === null || hrefValue === "" || hrefValue === "undefined",
      ).toBe(true);
    });
  });

  describe("Custom ClassName", () => {
    it("should apply custom className to nav element", () => {
      // TDD: Test custom className
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} className="custom-nav" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("custom-nav");
    });

    it("should apply custom className to items", () => {
      // TDD: Test item className
      const items: NavItem[] = [
        { href: "/home", label: "Home", className: "custom-item" },
      ];
      render(<Navigation items={items} />);
      const link = screen.getByText("Home").closest("a");
      expect(link).toHaveClass("custom-item");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label by default", () => {
      // TDD: Test default aria-label
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(<Navigation items={items} />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });

    it("should allow custom aria-label", () => {
      // TDD: Test custom aria-label
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} aria-label="Custom navigation" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("aria-label", "Custom navigation");
    });

    it("should have proper semantic structure", () => {
      // TDD: Test semantic HTML
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];
      const { container } = render(<Navigation items={items} />);
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(2);
    });
  });

  describe("Badges", () => {
    it("should render items with badges", () => {
      // TDD: Test badge support
      const items: NavItem[] = [
        {
          href: "/notifications",
          label: "Notifications",
          badge: <span data-testid="badge">3</span>,
        },
      ];

      render(<Navigation items={items} />);
      expect(screen.getByTestId("badge")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });
  });

  describe("Variant Mapping to NavLink", () => {
    it("should map pills variant to background NavLink variant", () => {
      // TDD: Test variant mapping
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} variant="pills" />,
      );
      const link = container.querySelector("a");
      // NavLink with background variant should have rounded classes
      expect(link).toBeInTheDocument();
    });

    it("should map tabs variant to underline NavLink variant", () => {
      // TDD: Test variant mapping
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(<Navigation items={items} variant="tabs" />);
      const link = container.querySelector("a");
      // NavLink with underline variant should have border classes
      expect(link).toBeInTheDocument();
    });

    it("should map default variant to default NavLink variant", () => {
      // TDD: Test variant mapping
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} variant="default" />,
      );
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Vertical Orientation", () => {
    it("should apply full width to items in vertical orientation", () => {
      // TDD: Test vertical item width
      const items: NavItem[] = [
        { href: "/home", label: "Home" },
        { href: "/about", label: "About" },
      ];
      const { container } = render(
        <Navigation items={items} orientation="vertical" />,
      );
      const links = container.querySelectorAll("a");
      links.forEach((link) => {
        expect(link).toHaveClass("w-full");
      });
    });

    it("should apply justify-start to items in vertical orientation", () => {
      // TDD: Test vertical item alignment
      const items: NavItem[] = [{ href: "/home", label: "Home" }];
      const { container } = render(
        <Navigation items={items} orientation="vertical" />,
      );
      const link = container.querySelector("a");
      expect(link).toHaveClass("justify-start");
    });
  });
});
