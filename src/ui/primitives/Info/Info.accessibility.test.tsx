/**
 * Info Accessibility Tests
 *
 * Dedicated a11y test scaffold for Info — the inline status/info banner
 * (info / warning / error variants).
 *
 *   - ARIA Labels and Roles: role=alert so AT users hear the message
 *     when it appears; children carry the announcement content
 *   - Keyboard Navigation: non-interactive (children may be — those are
 *     the consumer's concern)
 *   - Focus Management: not in tab order
 *   - Screen Reader Support: variant prop is visual-only (the color
 *     tone differentiates info/warning/error visually; the meaning is
 *     in the text content, not the variant)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Info from "./Info";

describe("Info Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=alert", () => {
      render(<Info>Heads up</Info>);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("children become the alert announcement content", () => {
      render(<Info>Saved successfully</Info>);

      expect(screen.getByRole("alert")).toHaveTextContent("Saved successfully");
    });

    it("does not set a competing aria-label by default", () => {
      render(<Info>Heads up</Info>);

      // The text content carries the announcement — no aria-label
      // override unless the consumer adds one.
      expect(screen.getByRole("alert")).not.toHaveAttribute("aria-label");
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order itself", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Info>Heads up</Info>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // The Info wrapper itself is not tabbable.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("has no tabindex", () => {
      render(<Info>Heads up</Info>);

      expect(screen.getByRole("alert")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("variant prop is visual-only — same AT announce across variants", () => {
      const { rerender } = render(<Info variant="info">Heads up</Info>);

      const infoContent = screen.getByRole("alert").textContent;

      rerender(<Info variant="warning">Heads up</Info>);
      const warningContent = screen.getByRole("alert").textContent;

      rerender(<Info variant="error">Heads up</Info>);
      const errorContent = screen.getByRole("alert").textContent;

      // AT users hear the same message regardless of color tone — the
      // semantic meaning lives in the children, not the variant.
      expect(infoContent).toBe(warningContent);
      expect(warningContent).toBe(errorContent);
    });
  });
});
