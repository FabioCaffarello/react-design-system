/**
 * Rating Accessibility Tests
 *
 * Dedicated a11y test scaffold for Rating — a dual-mode component
 * where the SAME visual is either interactive (each star is a
 * keyboard-activatable button) or read-only (the container is a
 * single role=img with a summary label).
 *
 *   - ARIA Labels and Roles: interactive mode → each star is a
 *     role=button with aria-label "Rate N out of M"; read-only mode
 *     → container is role=img with summary label "Rating: X out of M",
 *     individual stars have no role (decorative)
 *   - Keyboard Navigation: Enter and Space on a focused star fire
 *     onChange with that value; read-only stars do not respond
 *   - Focus Management: interactive stars have tabIndex=0 (each star
 *     is its own tab stop); read-only stars are not in the tab order
 *   - Screen Reader Support: each interactive star's label includes
 *     position ("Rate 3 out of 5") so AT users hear context; the
 *     filled-vs-empty visual state is NOT in the accessible name
 *     (per Principle 6 of colors.md — off-state is a stable role,
 *     not "disabled")
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Rating from "./Rating";

describe("Rating Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("interactive mode: each star is a role=button with positional aria-label", () => {
      render(<Rating max={5} defaultValue={0} />);

      for (let n = 1; n <= 5; n++) {
        expect(
          screen.getByRole("button", { name: `Rate ${n} out of 5` }),
        ).toBeInTheDocument();
      }
    });

    it("read-only mode: container is role=img with a summary label", () => {
      render(<Rating max={5} value={3} readOnly />);

      // No individual buttons in read-only mode.
      expect(
        screen.queryByRole("button", { name: /Rate \d+ out of/ }),
      ).not.toBeInTheDocument();

      const img = screen.getByRole("img", { name: "Rating: 3 out of 5" });
      expect(img).toBeInTheDocument();
    });

    it("read-only mode with allowHalf shows decimal in the label", () => {
      render(<Rating max={5} value={3.5} readOnly allowHalf showValue />);

      const img = screen.getByRole("img", { name: "Rating: 3.5 out of 5" });
      expect(img).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on a focused star fires onChange with that value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Rating max={5} defaultValue={0} onChange={onChange} />);

      const four = screen.getByRole("button", { name: "Rate 4 out of 5" });
      four.focus();
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith(4);
    });

    it("Space on a focused star fires onChange with that value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Rating max={5} defaultValue={0} onChange={onChange} />);

      const two = screen.getByRole("button", { name: "Rate 2 out of 5" });
      two.focus();
      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it("read-only stars do not respond to Enter (no onChange fired)", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Rating max={5} value={2} readOnly onChange={onChange} />);

      // No buttons exist in read-only mode, so no key activation is possible.
      expect(screen.queryAllByRole("button")).toHaveLength(0);
      // Defensive: even arbitrary keyDown on document doesn't reach a handler.
      await user.keyboard("{Enter}");
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("interactive stars are each their own tab stop (tabIndex=0)", () => {
      render(<Rating max={3} defaultValue={0} />);

      const stars = screen.getAllByRole("button", {
        name: /Rate \d+ out of/,
      });
      stars.forEach((star) => {
        expect(star).toHaveAttribute("tabindex", "0");
      });
    });

    it("Tab moves through stars in order (1, 2, 3, …)", async () => {
      const user = userEvent.setup();
      render(<Rating max={3} defaultValue={0} />);

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Rate 1 out of 3" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Rate 2 out of 3" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Rate 3 out of 3" }),
      ).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("filled vs empty visual state is NOT in the accessible name", () => {
      // Per Principle 6 (colors.md): off-star is a STABLE binary state of
      // a two-state control, not a "disabled" or "inactive" announcement.
      // The accessible name reflects POSITION ("Rate N out of M") — the
      // current value is conveyed by the container's role=img label
      // in read-only mode, or by visual style in interactive mode.
      render(<Rating max={3} defaultValue={2} />);

      // Buttons 1 and 2 are filled; button 3 is empty. All three should
      // carry the same positional label format — no "filled" / "empty"
      // in the name.
      expect(
        screen.getByRole("button", { name: "Rate 1 out of 3" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Rate 3 out of 3" }),
      ).toBeInTheDocument();
    });

    it("read-only label changes with value (programmatic announce on update)", () => {
      const { rerender } = render(<Rating max={5} value={2} readOnly />);

      expect(
        screen.getByRole("img", { name: "Rating: 2 out of 5" }),
      ).toBeInTheDocument();

      rerender(<Rating max={5} value={4} readOnly />);
      expect(
        screen.getByRole("img", { name: "Rating: 4 out of 5" }),
      ).toBeInTheDocument();
    });
  });
});
