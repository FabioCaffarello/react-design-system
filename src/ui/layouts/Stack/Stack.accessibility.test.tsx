/**
 * Stack Accessibility Tests
 *
 * Dedicated a11y test scaffold for Stack — the row/column layout
 * primitive. Stack is structural: it lays children out, it doesn't
 * own roles, focus, or labels.
 *
 *   - ARIA Labels and Roles: plain <div> wrapper, no role pollution;
 *     children retain their own semantics
 *   - Keyboard Navigation: non-interactive — Stack itself is never a
 *     tab stop; child tab order follows DOM order
 *   - Focus Management: no tabindex, no focus ring
 *   - Screen Reader Support: spacing / direction / align / justify
 *     props are visual-only — none of them changes the AT tree
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Stack } from "./Stack";

describe("Stack Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("wrapper is a plain <div> with no role", () => {
      const { container } = render(
        <Stack>
          <span>One</span>
          <span>Two</span>
        </Stack>,
      );

      const root = container.firstElementChild;
      expect(root?.tagName).toBe("DIV");
      // Pure layout — no role pollution. AT users hear children, not
      // the wrapper.
      expect(root).not.toHaveAttribute("role");
    });

    it("children retain their own accessible identities", () => {
      render(
        <Stack>
          <button>Save</button>
          <button>Cancel</button>
        </Stack>,
      );

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Stack itself is not a tab stop; children tab in DOM order", async () => {
      const user = userEvent.setup();
      render(
        <Stack>
          <button>First</button>
          <button>Second</button>
        </Stack>,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

      await user.tab();
      // No focus stops on the Stack wrapper — DOM order drives tab.
      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("wrapper has no tabindex", () => {
      const { container } = render(
        <Stack>
          <span>One</span>
        </Stack>,
      );

      expect(container.firstElementChild).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("direction prop is visual-only — same children in the AT tree", () => {
      const { rerender } = render(
        <Stack direction="column">
          <button>One</button>
          <button>Two</button>
        </Stack>,
      );

      const columnButtons = screen
        .getAllByRole("button")
        .map((b) => b.textContent);

      rerender(
        <Stack direction="row">
          <button>One</button>
          <button>Two</button>
        </Stack>,
      );

      const rowButtons = screen
        .getAllByRole("button")
        .map((b) => b.textContent);

      // direction column→row is flex-direction CSS — no impact on AT.
      expect(columnButtons).toEqual(rowButtons);
    });

    it("spacing/align/justify props are visual-only", () => {
      const { rerender } = render(
        <Stack spacing="xs" align="start" justify="start">
          <button>Only</button>
        </Stack>,
      );

      const tightStartButton = screen.getByRole("button");
      expect(tightStartButton).toHaveAccessibleName("Only");

      rerender(
        <Stack spacing="2xl" align="end" justify="between">
          <button>Only</button>
        </Stack>,
      );

      // Spacing/alignment change — accessible name is unchanged.
      expect(screen.getByRole("button")).toHaveAccessibleName("Only");
    });
  });
});
