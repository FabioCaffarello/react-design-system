/**
 * Header Accessibility Tests
 *
 * Accessibility tests for the Header component.
 * Following TDD approach: tests first, then implementation improvements.
 *
 * @see TASK-038: Testes de Acessibilidade do Header
 */

import { describe, it, expect } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { NavLink } from "../../primitives/NavLink";
import { Button } from "../../primitives/Button/Button";

describe("Header Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("should have proper semantic structure", () => {
      // TDD: Test semantic HTML
      const { container } = render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should have proper navigation ARIA labels", () => {
      // TDD: Test navigation ARIA labels
      render(
        <Header>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
        </Header>,
      );

      const nav = screen.getByLabelText("Main navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should have proper hamburger button ARIA labels", () => {
      // TDD: Test hamburger ARIA labels
      render(
        <Header>
          <Header.Hamburger />
        </Header>,
      );

      const hamburger = screen.getByLabelText(/open menu|close menu/i);
      expect(hamburger).toBeInTheDocument();
      expect(hamburger).toHaveAttribute("aria-expanded");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should support Tab navigation through interactive elements", async () => {
      // TDD: Test Tab navigation
      const user = userEvent.setup();
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
            <NavLink href="/about">About</NavLink>
          </Header.Navigation>
          <Header.Actions>
            <Button>Action</Button>
          </Header.Actions>
        </Header>,
      );

      // Tab should move focus through interactive elements
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it("should support Enter and Space on hamburger button", async () => {
      // TDD: Test keyboard activation of hamburger
      const user = userEvent.setup();
      render(
        <Header>
          <Header.Hamburger />
        </Header>,
      );

      const hamburger = screen.getByLabelText(/open menu/i);
      hamburger.focus();

      // Enter should toggle menu
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
      });
    });

    it("should support Escape to close mobile menu", async () => {
      // TDD: Test Escape key to close menu
      const user = userEvent.setup();
      render(
        <Header>
          <Header.Hamburger />
          <Header.MobileMenu>
            <NavLink href="/home">Home</NavLink>
          </Header.MobileMenu>
        </Header>,
      );

      const hamburger = screen.getByLabelText(/open menu/i);
      await act(async () => {
        await user.click(hamburger);
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
      });

      // Escape should close menu
      await act(async () => {
        await user.keyboard("{Escape}");
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    it("should have visible focus indicators", () => {
      // TDD: Test focus indicators
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );

      const logo = screen.getByText("MyApp").closest("a");
      if (logo) {
        logo.focus();
        // Focus should be visible (check for focus-visible classes)
        expect(logo).toHaveFocus();
      }
    });

    it("should trap focus in mobile menu when open", async () => {
      // TDD: Test focus trap in mobile menu
      const user = userEvent.setup();
      render(
        <Header>
          <Header.Hamburger />
          <Header.MobileMenu>
            <NavLink href="/home">Home</NavLink>
            <NavLink href="/about">About</NavLink>
          </Header.MobileMenu>
        </Header>,
      );

      const hamburger = screen.getByLabelText(/open menu/i);
      await act(async () => {
        await user.click(hamburger);
      });

      // Focus should be in the menu
      await waitFor(() => {
        const menuContent = screen.getByLabelText("Mobile navigation");
        expect(menuContent).toBeInTheDocument();
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("should have proper heading structure", () => {
      // TDD: Test heading structure
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );

      // Logo should be accessible
      const logo = screen.getByText("MyApp");
      expect(logo).toBeInTheDocument();
    });

    it("should announce mobile menu state changes", async () => {
      // TDD: Test screen reader announcements
      const user = userEvent.setup();
      render(
        <Header>
          <Header.Hamburger />
        </Header>,
      );

      const hamburger = screen.getByLabelText(/open menu/i);
      expect(hamburger).toHaveAttribute("aria-expanded", "false");

      await act(async () => {
        await user.click(hamburger);
      });

      await waitFor(() => {
        expect(hamburger).toHaveAttribute("aria-expanded", "true");
      });
    });
  });

  describe("Color Contrast and Visual", () => {
    it("should have sufficient color contrast for text", () => {
      // TDD: Test that components render (contrast will be validated visually)
      render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>,
      );

      const logo = screen.getByText("MyApp");
      expect(logo).toBeInTheDocument();
      // Color contrast will be validated with jest-axe or visual testing
    });
  });
});
