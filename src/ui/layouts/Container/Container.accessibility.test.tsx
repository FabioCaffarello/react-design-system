/**
 * Container Accessibility Tests
 *
 * Dedicated a11y test scaffold for Container — the width-constraint
 * layout primitive (max-width + horizontal/vertical padding +
 * optional centering).
 *
 *   - ARIA Labels and Roles: plain <div> wrapper — no role pollution,
 *     no landmark role (consumers wrap Container in <main>/<header>/
 *     <footer> when they need landmarks; Container itself stays neutral)
 *   - Keyboard Navigation: non-interactive — Container is structural
 *   - Focus Management: not in tab order
 *   - Screen Reader Support: maxWidth / paddingX / paddingY / center
 *     props are all visual-only — none of them changes the AT tree
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Container } from "./Container";

describe("Container Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("wrapper is a plain <div> with no role", () => {
      const { container } = render(
        <Container>
          <span>Content</span>
        </Container>,
      );

      const root = container.firstElementChild;
      expect(root?.tagName).toBe("DIV");
      // No landmark role — Container stays neutral. Consumers wrap it
      // in <main>/<header>/<footer> when they need a landmark.
      expect(root).not.toHaveAttribute("role");
    });

    it("children retain their own accessible identities", () => {
      render(
        <Container>
          <button>Click</button>
          <h1>Title</h1>
        </Container>,
      );

      expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 1, name: "Title" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Container itself is not a tab stop; children tab in DOM order", async () => {
      const user = userEvent.setup();
      render(
        <Container>
          <button>First</button>
          <button>Second</button>
        </Container>,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

      await user.tab();
      // No focus stop on Container — DOM order drives Tab.
      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("wrapper has no tabindex", () => {
      const { container } = render(
        <Container>
          <span>X</span>
        </Container>,
      );

      expect(container.firstElementChild).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("maxWidth prop is visual-only — same children in the AT tree", () => {
      const { rerender } = render(
        <Container maxWidth="sm">
          <button>Action</button>
        </Container>,
      );

      const smButton = screen.getByRole("button").textContent;

      rerender(
        <Container maxWidth="xl">
          <button>Action</button>
        </Container>,
      );

      const xlButton = screen.getByRole("button").textContent;

      // max-width change is CSS-only — no impact on AT.
      expect(smButton).toBe(xlButton);
    });

    it("padding/center props are visual-only", () => {
      const { rerender } = render(
        <Container paddingX="xs" paddingY="xs" center>
          <button>Action</button>
        </Container>,
      );

      expect(screen.getByRole("button")).toHaveAccessibleName("Action");

      rerender(
        <Container paddingX="xl" paddingY="xl" center={false}>
          <button>Action</button>
        </Container>,
      );

      // Padding/centering change — accessible name is unchanged.
      expect(screen.getByRole("button")).toHaveAccessibleName("Action");
    });
  });
});
