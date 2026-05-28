/**
 * Header Tests
 *
 * Unit tests for the Header component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { useHeaderContext } from "./contexts/HeaderContext";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";

describe("Header", () => {
  describe("Rendering", () => {
    it("renders with children", () => {
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );
      expect(screen.getByText("MyApp")).toBeInTheDocument();
    });

    it("renders as header element", () => {
      const { container } = render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Compound Components", () => {
    it("renders Header.Logo", () => {
      render(
        <Header>
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      expect(screen.getByText("Logo")).toBeInTheDocument();
    });

    it("renders Header.Navigation", () => {
      render(
        <Header>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
        </Header>,
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("renders Header.Actions", () => {
      render(
        <Header>
          <Header.Actions>
            <Button>Sign In</Button>
          </Header.Actions>
        </Header>,
      );
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies default variant", () => {
      const { container } = render(
        <Header variant="default">
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("applies elevated variant", () => {
      const { container } = render(
        <Header variant="elevated">
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("shadow-sm");
    });

    it("applies bordered variant", () => {
      const { container } = render(
        <Header variant="bordered">
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("border-b");
    });
  });

  describe("Sticky Positioning", () => {
    it("applies sticky class when sticky is true", () => {
      const { container } = render(
        <Header sticky>
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky", "top-0", "z-[1020]");
    });

    it("does not apply sticky class when sticky is false", () => {
      const { container } = render(
        <Header sticky={false}>
          <Header.Logo href="/">Logo</Header.Logo>
        </Header>,
      );
      const header = container.querySelector("header");
      expect(header).not.toHaveClass("sticky");
    });
  });

  describe("Layout", () => {
    it("renders all slots together", () => {
      render(
        <Header>
          <Header.Logo href="/">Logo</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
          <Header.Actions>
            <Button>Action</Button>
          </Header.Actions>
        </Header>,
      );
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders without Navigation slot", () => {
      render(
        <Header>
          <Header.Logo href="/">Logo</Header.Logo>
          <Header.Actions>
            <Button>Action</Button>
          </Header.Actions>
        </Header>,
      );
      expect(screen.getByText("Logo")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  describe("Context", () => {
    it("provides HeaderContext", () => {
      const TestComponent = () => {
        const { isMobileMenuOpen, toggleMobileMenu } = useHeaderContext();
        return (
          <div>
            <span data-testid="menu-state">
              {isMobileMenuOpen ? "open" : "closed"}
            </span>
            <button onClick={toggleMobileMenu}>Toggle</button>
          </div>
        );
      };

      render(
        <Header>
          <TestComponent />
        </Header>,
      );

      expect(screen.getByTestId("menu-state")).toHaveTextContent("closed");
    });
  });

  // TODO: Add more tests
  // - Mobile menu functionality (when implemented)
  // - Accessibility
  // - Controlled/Uncontrolled modes
});
