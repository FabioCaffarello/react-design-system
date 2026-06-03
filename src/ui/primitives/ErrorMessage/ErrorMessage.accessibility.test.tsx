/**
 * ErrorMessage Accessibility Tests
 *
 * Dedicated a11y test scaffold for ErrorMessage — the inline validation
 * error pattern.
 *
 *   - ARIA Labels and Roles: role=alert with aria-live=polite (AT users
 *     hear the validation error when it appears next to the field);
 *     the AlertCircle glyph is aria-hidden (visual reinforcement only)
 *   - Keyboard Navigation: non-interactive
 *   - Focus Management: not in tab order; pairs with the field via `id`
 *     prop so `aria-describedby` from the input resolves here
 *   - Screen Reader Support: the message is the text content, not an
 *     attribute, so it's part of the alert announcement
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=alert", () => {
      render(<ErrorMessage message="Email is required" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("aria-live='polite' on the alert region", () => {
      render(<ErrorMessage message="Email is required" />);

      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });

    it("AlertCircle icon is aria-hidden (visual reinforcement only)", () => {
      const { container } = render(
        <ErrorMessage message="Email is required" />,
      );

      const hidden = container.querySelector('svg[aria-hidden="true"]');
      // The icon doesn't pollute the announcement — AT users hear the
      // message text via the role=alert content.
      expect(hidden).toBeInTheDocument();
    });

    it("id prop is forwarded for aria-describedby pairing", () => {
      render(<ErrorMessage id="email-error" message="Email is required" />);

      expect(screen.getByRole("alert")).toHaveAttribute("id", "email-error");
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <ErrorMessage message="Required" />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips the alert — purely informational.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("has no tabindex", () => {
      render(<ErrorMessage message="Required" />);

      expect(screen.getByRole("alert")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("message text is in the alert content (not aria-label)", () => {
      render(<ErrorMessage message="Email is required" />);

      const alert = screen.getByRole("alert");
      // The announce content comes from the text inside the region.
      expect(alert).toHaveTextContent("Email is required");
      // No competing aria-label that would replace the content.
      expect(alert).not.toHaveAttribute("aria-label");
    });
  });
});
