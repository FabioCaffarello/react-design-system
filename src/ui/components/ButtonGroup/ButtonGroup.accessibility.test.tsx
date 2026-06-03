/**
 * ButtonGroup Accessibility Tests
 *
 * Dedicated a11y test scaffold for ButtonGroup — the grouped-buttons
 * composition.
 *
 *   - ARIA Labels and Roles: outer container has role=group so AT
 *     users hear the collection boundary; each child button keeps its
 *     own accessible name (no wrapping role pollution); aria-label can
 *     be supplied to name the group
 *   - Keyboard Navigation: children are reachable in DOM order (this
 *     is plain Tab semantics — no roving tabindex, no arrow-key
 *     navigation, since these are independent buttons not a radio
 *     group)
 *   - Focus Management: each button is its own tab stop
 *   - Screen Reader Support: the group landmark is announced; the
 *     orientation prop is visual-only and doesn't change AT output
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonGroup from "./ButtonGroup";

describe("ButtonGroup Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("outer container has role=group", () => {
      render(
        <ButtonGroup>
          <button>Save</button>
          <button>Cancel</button>
        </ButtonGroup>,
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("children retain their own accessible names", () => {
      render(
        <ButtonGroup>
          <button>Save</button>
          <button>Cancel</button>
        </ButtonGroup>,
      );

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("aria-label names the group as a whole", () => {
      render(
        <ButtonGroup aria-label="Editor actions">
          <button>Save</button>
          <button>Cancel</button>
        </ButtonGroup>,
      );

      expect(
        screen.getByRole("group", { name: "Editor actions" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("children are reachable in DOM order via Tab", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroup>
          <button>Save</button>
          <button>Cancel</button>
        </ButtonGroup>,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("each button is its own tab stop (no roving tabindex)", () => {
      render(
        <ButtonGroup>
          <button>Save</button>
          <button>Cancel</button>
        </ButtonGroup>,
      );

      // ButtonGroup is NOT a radio group / toolbar — independent buttons
      // remain individually tabbable. None has tabindex="-1".
      expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
        "tabindex",
        "-1",
      );
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Screen Reader Support", () => {
    it("orientation prop is visual-only — group role is unchanged", () => {
      const { rerender } = render(
        <ButtonGroup orientation="horizontal">
          <button>One</button>
          <button>Two</button>
        </ButtonGroup>,
      );

      const horizontalRole = screen.getByRole("group");
      expect(horizontalRole).toBeInTheDocument();

      rerender(
        <ButtonGroup orientation="vertical">
          <button>One</button>
          <button>Two</button>
        </ButtonGroup>,
      );

      // Vertical stacking is CSS-only; AT still hears "group".
      expect(screen.getByRole("group")).toBeInTheDocument();
    });
  });
});
