/**
 * Avatar Accessibility Tests
 *
 * Dedicated a11y test scaffold for Avatar — the user-identity image
 * primitive with a graceful fallback. The defining contract: the
 * Avatar is ALWAYS announced once as a `role="img"` with a
 * consumer-supplied `aria-label` (or `alt`-derived default). The
 * inner `<img>` and the fallback `<span>` are BOTH `aria-hidden` so
 * AT users never hear the avatar twice.
 *
 *   - ARIA Labels and Roles: role=img on the wrapper, aria-label
 *     prefers consumer `aria-label` → falls back to `alt` → falls
 *     back to "User avatar"; inner image and fallback are
 *     aria-hidden so the outer is the single AT-readable token
 *   - Keyboard Navigation: Avatar is non-interactive
 *   - Focus Management: not in the natural tab order
 *   - Screen Reader Support: when image fails to load, the fallback
 *     text is visible to sighted users but the AT-readable name is
 *     still the consumer-supplied aria-label/alt (NOT the fallback
 *     initials, which are aria-hidden)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=img on the wrapper", () => {
      render(<Avatar src="/user.jpg" alt="Jane Doe" />);

      const avatar = screen.getByRole("img", { name: "Jane Doe" });
      expect(avatar).toBeInTheDocument();
    });

    it("aria-label priority: consumer aria-label > alt > 'User avatar' default", () => {
      // Consumer aria-label wins.
      const { rerender } = render(
        <Avatar src="/u.jpg" alt="Jane Doe" aria-label="Account owner" />,
      );
      expect(
        screen.getByRole("img", { name: "Account owner" }),
      ).toBeInTheDocument();

      // Fall back to alt when no aria-label.
      rerender(<Avatar src="/u.jpg" alt="Jane Doe" />);
      expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();

      // Fall back to default when neither is set.
      rerender(<Avatar src="/u.jpg" />);
      expect(
        screen.getByRole("img", { name: "User avatar" }),
      ).toBeInTheDocument();
    });

    it("inner <img> is aria-hidden so the wrapper is the only AT-readable token", () => {
      const { container } = render(<Avatar src="/user.jpg" alt="Jane Doe" />);

      const img = container.querySelector("img");
      // Inner img must be aria-hidden; otherwise AT users hear the
      // avatar twice ("Jane Doe, image" then "Jane Doe, image").
      expect(img).toHaveAttribute("aria-hidden", "true");
    });

    it("fallback span is aria-hidden so initials don't double-announce", () => {
      const { container } = render(<Avatar fallback="JD" alt="Jane Doe" />);

      // The visible "JD" initials are decorative — they reinforce the
      // identity visually but should not be announced separately. The
      // wrapper's "Jane Doe" name carries the AT-readable identity.
      const span = container.querySelector("span");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Avatar is non-interactive (no tabindex)", () => {
      render(<Avatar src="/u.jpg" alt="Jane" />);

      expect(screen.getByRole("img")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("Avatar is not focusable", () => {
      render(<Avatar src="/u.jpg" alt="Jane" />);

      // No tabindex means not in the tab order — Avatar is a
      // decorative-identity element, not a control.
      expect(screen.getByRole("img")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("fallback initials are visible but NOT the accessible name", () => {
      render(<Avatar fallback="JD" alt="Jane Doe" />);

      // Sighted users see "JD"; AT users hear "Jane Doe, image".
      // The two surfaces serve different audiences and must NOT merge.
      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
    });

    it("'?' fallback for missing fallback prop is decorative", () => {
      const { container } = render(<Avatar alt="Mystery user" />);

      // When neither src nor fallback are provided, "?" displays. It's
      // aria-hidden so AT users only hear "Mystery user, image".
      const span = container.querySelector("span");
      expect(span).toHaveTextContent("?");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });

    it("string fallback truncates to 2 uppercased characters (visual contract)", () => {
      render(<Avatar fallback="jane" alt="Jane Doe" />);

      // The visible fallback is "JA" — uppercased and truncated.
      // The contract is purely visual; the AT-readable name stays
      // "Jane Doe".
      expect(screen.getByText("JA")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
    });
  });
});
