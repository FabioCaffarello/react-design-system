/**
 * Dot Accessibility Tests
 *
 * Dedicated a11y test scaffold for Dot — the colored-circle status
 * primitive (online/offline/pending/warning/error/info).
 *
 *   - ARIA Labels and Roles: role=status; default aria-label maps
 *     variant → human-readable string ("Online", "Pending", …); explicit
 *     aria-label always wins
 *   - Keyboard Navigation: non-interactive — no tab stop
 *   - Focus Management: no tabindex, no focus ring
 *   - Screen Reader Support: every variant has a default AT
 *     announcement; size prop is visual-only
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dot from "./Dot";

describe("Dot Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=status", () => {
      render(<Dot variant="online" />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("default aria-label maps variant to readable string", () => {
      render(<Dot variant="online" />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Online",
      );
    });

    it("explicit aria-label overrides variant default", () => {
      render(<Dot variant="online" aria-label="User Jane is online" />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "User Jane is online",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Dot variant="online" />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips the dot — informational primitive.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("has no tabindex", () => {
      render(<Dot variant="online" />);

      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("every variant exposes a non-empty aria-label", () => {
      const variants = [
        "online",
        "offline",
        "pending",
        "warning",
        "error",
        "info",
      ] as const;

      for (const v of variants) {
        const { unmount } = render(<Dot variant={v} />);
        const label = screen.getByRole("status").getAttribute("aria-label");
        // AT users always hear a meaningful status, never an empty
        // string — defensive against an aria-label fallback regression.
        expect(label).toBeTruthy();
        expect(label!.length).toBeGreaterThan(0);
        unmount();
      }
    });

    it("size prop is visual-only — same AT announce across sizes", () => {
      const { rerender } = render(<Dot variant="online" size="sm" />);
      const smLabel = screen.getByRole("status").getAttribute("aria-label");

      rerender(<Dot variant="online" size="lg" />);
      const lgLabel = screen.getByRole("status").getAttribute("aria-label");

      expect(smLabel).toBe(lgLabel);
    });
  });
});
