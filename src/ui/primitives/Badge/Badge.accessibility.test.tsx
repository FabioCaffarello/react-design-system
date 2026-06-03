/**
 * Badge Accessibility Tests
 *
 * Dedicated a11y test scaffold for Badge — the status/label primitive.
 *
 *   - ARIA Labels and Roles: role=status (so AT users hear the label as
 *     a live status); aria-label resolves from children when string,
 *     from nested single-child text node, or from explicit prop
 *   - Keyboard Navigation: non-interactive — no tab stop, no key handlers
 *   - Focus Management: no focus ring, no tabindex
 *   - Screen Reader Support: variant prop is visual-only; the AT
 *     announcement comes from the aria-label, not the color tone
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Badge from "./Badge";

describe("Badge Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=status", () => {
      render(<Badge>Active</Badge>);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("aria-label resolves from string children", () => {
      render(<Badge>Active</Badge>);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Active",
      );
    });

    it("explicit aria-label takes precedence over children", () => {
      render(<Badge aria-label="System status: active">Active</Badge>);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "System status: active",
      );
    });

    it("aria-label resolves from nested single-child text node", () => {
      render(
        <Badge>
          <span>Critical</span>
        </Badge>,
      );

      // The component walks one level into a wrapper to pull text.
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Critical",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Badge>Status</Badge>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips the badge — purely informational primitive.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("has no tabindex", () => {
      render(<Badge>Active</Badge>);

      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("variant prop is visual-only — same AT announce across variants", () => {
      const { rerender } = render(<Badge variant="success">Active</Badge>);

      const successLabel = screen
        .getByRole("status")
        .getAttribute("aria-label");

      rerender(<Badge variant="error">Active</Badge>);
      const errorLabel = screen.getByRole("status").getAttribute("aria-label");

      // AT users hear the same "Active" regardless of color tone — the
      // semantic role-meaning lives in the text, not in the variant.
      expect(successLabel).toBe(errorLabel);
    });

    it("style prop (solid/outline) is visual-only", () => {
      const { rerender } = render(<Badge style="solid">New</Badge>);

      const solidLabel = screen.getByRole("status").getAttribute("aria-label");

      rerender(<Badge style="outline">New</Badge>);
      const outlineLabel = screen
        .getByRole("status")
        .getAttribute("aria-label");

      expect(solidLabel).toBe(outlineLabel);
    });
  });
});
