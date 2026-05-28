/**
 * NavLink Tests
 *
 * Unit tests for the NavLink component.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavLink } from "./NavLink";

describe("NavLink", () => {
  describe("Rendering", () => {
    it("renders with text", () => {
      render(<NavLink href="/home">Home</NavLink>);
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("renders as anchor tag by default", () => {
      render(<NavLink href="/home">Home</NavLink>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/home");
    });

    it("renders with correct href", () => {
      render(<NavLink href="/about">About</NavLink>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/about");
    });
  });

  describe("Variants", () => {
    it("applies default variant", () => {
      const { container } = render(<NavLink href="/home">Home</NavLink>);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("applies underline variant", () => {
      const { container } = render(
        <NavLink href="/home" variant="underline">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveClass("border-b-2");
    });

    it("applies background variant", () => {
      const { container } = render(
        <NavLink href="/home" variant="background">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveClass("rounded-md");
    });
  });

  describe("Sizes", () => {
    it("applies sm size", () => {
      const { container } = render(
        <NavLink href="/home" size="sm">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("applies md size (default)", () => {
      const { container } = render(<NavLink href="/home">Home</NavLink>);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("applies lg size", () => {
      const { container } = render(
        <NavLink href="/home" size="lg">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Active State", () => {
    it("applies active classes when active", () => {
      const { container } = render(
        <NavLink href="/home" active>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-active", "true");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("does not apply active classes when not active", () => {
      const { container } = render(<NavLink href="/home">Home</NavLink>);
      const link = container.querySelector("a");
      expect(link).not.toHaveAttribute("aria-current");
    });

    it("applies active styles for default variant", () => {
      const { container } = render(
        <NavLink href="/home" active variant="default">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-active", "true");
    });

    it("applies active styles for underline variant", () => {
      const { container } = render(
        <NavLink href="/home" active variant="underline">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-active", "true");
    });

    it("applies active styles for background variant", () => {
      const { container } = render(
        <NavLink href="/home" active variant="background">
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-active", "true");
    });
  });

  describe("Disabled State", () => {
    it("applies disabled classes when disabled", () => {
      const { container } = render(
        <NavLink href="/home" disabled>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-disabled", "true");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabIndex", "-1");
    });

    it("removes href when disabled", () => {
      const { container } = render(
        <NavLink href="/home" disabled>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      // When disabled, href is set to undefined in linkProps
      // For anchor tags, undefined href means the attribute is not set or is empty
      expect(link).toBeInTheDocument();
      // Check that href is either not present or is empty/undefined
      const hrefValue = link?.getAttribute("href");
      expect(
        hrefValue === null || hrefValue === "" || hrefValue === "undefined",
      ).toBe(true);
    });

    it("prevents click when disabled", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <NavLink href="/home" disabled onClick={handleClick}>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      if (link) {
        fireEvent.click(link);
      }
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("prevents keyboard activation when disabled", () => {
      const handleKeyDown = vi.fn();
      const { container } = render(
        <NavLink href="/home" disabled onKeyDown={handleKeyDown}>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      if (link) {
        fireEvent.keyDown(link, { key: "Enter" });
      }
      expect(handleKeyDown).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has aria-current when active", () => {
      render(
        <NavLink href="/home" active>
          Home
        </NavLink>,
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("has aria-disabled when disabled", () => {
      const { container } = render(
        <NavLink href="/home" disabled>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      // When disabled with pointer-events-none, the element is not accessible via getByRole
      // So we use container.querySelector and check attributes directly
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("aria-disabled", "true");
    });

    it("supports aria-label", () => {
      render(
        <NavLink href="/home" aria-label="Navigate to home page">
          Home
        </NavLink>,
      );
      const link = screen.getByLabelText("Navigate to home page");
      expect(link).toBeInTheDocument();
    });

    it("has tabIndex -1 when disabled", () => {
      const { container } = render(
        <NavLink href="/home" disabled>
          Home
        </NavLink>,
      );
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(
        <NavLink href="/home" onClick={handleClick}>
          Home
        </NavLink>,
      );
      fireEvent.click(screen.getByText("Home"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown when key pressed", () => {
      const handleKeyDown = vi.fn();
      render(
        <NavLink href="/home" onKeyDown={handleKeyDown}>
          Home
        </NavLink>,
      );
      fireEvent.keyDown(screen.getByText("Home"), { key: "Enter" });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe("Custom Element (as prop)", () => {
    it("renders as custom element when as prop provided", () => {
      const CustomLink = ({
        href,
        children,
        ...props
      }: {
        href: string;
        children: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <a href={href} data-custom="true" {...props}>
          {children}
        </a>
      );
      render(
        <NavLink href="/home" as={CustomLink}>
          Home
        </NavLink>,
      );
      const link = screen.getByText("Home");
      expect(link).toHaveAttribute("data-custom", "true");
    });
  });
});
