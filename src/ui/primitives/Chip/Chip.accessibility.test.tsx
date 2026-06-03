/**
 * Chip Accessibility Tests
 *
 * Dedicated a11y test scaffold for Chip. The architecture matters for
 * AT users: outer div is NEVER interactive — interactivity lives on
 * an inner `<button>` label (when onClick) and an inner `<button>` X
 * (when onRemove). This shape closes two historical axe violations:
 *
 *   - `aria-required-parent` (role=option needs role=listbox parent)
 *   - `nested-interactive` (clickable outer + clickable X)
 *
 *   - ARIA Labels and Roles: outer is a plain div (no role, no
 *     tabIndex); onClick yields an inner button-labeled chip; onRemove
 *     yields an inner X button with "Remove <text>" accessible name;
 *     selected with onClick uses aria-pressed (toggle button pattern,
 *     NOT role=option)
 *   - Keyboard Navigation: Enter/Space activate the inner label
 *     button (JSDOM-compatible explicit handler)
 *   - Focus Management: inner buttons are the tab stops, NOT the outer
 *   - Screen Reader Support: selected without onClick is decorative
 *     (no aria-pressed lie); accessible name is computed from string
 *     children or aria-label
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chip from "./Chip";

describe("Chip Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("non-interactive chip: outer is a plain div (no role)", () => {
      render(<Chip>Status: Active</Chip>);

      // No button is rendered when neither onClick nor onRemove is set.
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByText("Status: Active")).toBeInTheDocument();
    });

    it("onClick yields an inner button with the children as accessible name", () => {
      render(<Chip onClick={vi.fn()}>Filter</Chip>);

      expect(
        screen.getByRole("button", { name: "Filter" }),
      ).toBeInTheDocument();
    });

    it("onRemove yields an X button with 'Remove <text>' accessible name", () => {
      render(<Chip onRemove={vi.fn()}>Apple</Chip>);

      expect(
        screen.getByRole("button", { name: /Remove Apple/i }),
      ).toBeInTheDocument();
    });

    it("selected with onClick uses aria-pressed (toggle button pattern, NOT role=option)", () => {
      render(
        <Chip onClick={vi.fn()} selected>
          Filter
        </Chip>,
      );

      const btn = screen.getByRole("button", { name: "Filter" });
      expect(btn).toHaveAttribute("aria-pressed", "true");
      // Critical: outer is NOT role=option (which would require a
      // listbox parent and fail axe aria-required-parent in
      // standalone use).
      expect(btn).not.toHaveAttribute("role", "option");
    });

    it("selected WITHOUT onClick is decorative — no aria-pressed lie", () => {
      render(<Chip selected>Static</Chip>);

      // No button is rendered (no onClick), so no aria-pressed can lie
      // about toggle state. The selected styling is visual-only.
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on the inner label button activates onClick", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Chip onClick={onClick}>Filter</Chip>);

      const btn = screen.getByRole("button", { name: "Filter" });
      btn.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });

    it("disabled label button suppresses Enter activation", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Chip onClick={onClick} disabled>
          Disabled
        </Chip>,
      );

      const btn = screen.getByRole("button", { name: "Disabled" });
      btn.focus();
      await user.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("inner buttons are the tab stops, NOT the outer div", async () => {
      const user = userEvent.setup();
      render(
        <Chip onClick={vi.fn()} onRemove={vi.fn()}>
          Apple
        </Chip>,
      );

      await user.tab();
      // First tab lands on the label button (Apple).
      expect(screen.getByRole("button", { name: "Apple" })).toHaveFocus();

      await user.tab();
      // Second tab lands on the X button (Remove Apple).
      expect(
        screen.getByRole("button", { name: /Remove Apple/i }),
      ).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("non-string children with text inside still produce an accessible name", () => {
      render(
        <Chip onClick={vi.fn()}>
          <span>Filter by status</span>
        </Chip>,
      );

      // The aria-label resolution extracts the text from single-child
      // wrapped nodes, so the button still has a name.
      const btn = screen.getByRole("button");
      expect(btn).toHaveAccessibleName(/Filter by status/);
    });

    it("aria-disabled on outer reflects disabled state for AT consumers", () => {
      render(<Chip disabled>Status</Chip>);

      // The outer div carries aria-disabled even when no inner button
      // exists — AT users hear the chip itself as a disabled item.
      const outer = screen.getByText("Status");
      // Walk up to find the outer with aria-disabled.
      const wrapper = outer.closest('[aria-disabled="true"]');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
