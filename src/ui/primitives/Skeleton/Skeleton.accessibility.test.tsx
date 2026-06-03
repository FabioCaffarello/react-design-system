/**
 * Skeleton Accessibility Tests
 *
 * Dedicated a11y test scaffold for Skeleton — the loading-placeholder
 * primitive. Two structural shapes:
 *
 *   - **Single block** (default): one role=status element with
 *     aria-busy=true.
 *   - **Text with lines > 1**: an outer role=status wrapper with N
 *     decorative inner divs marked aria-hidden=true. The wrapper
 *     announces "Loading text content" once; the line bars are
 *     visual-only.
 *
 *   - ARIA Labels and Roles: role=status, aria-busy=true,
 *     aria-label computed from the variant ("Loading text content",
 *     "Loading card content", …); consumer-supplied aria-label
 *     overrides the default
 *   - Keyboard Navigation: skeleton is non-interactive
 *   - Focus Management: not focusable
 *   - Screen Reader Support: multi-line text variant uses ONE
 *     role=status outer with aria-hidden inner bars (so AT users
 *     don't hear "Loading content, Loading content, Loading content"
 *     for a 3-line skeleton)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("default: role=status with aria-busy=true", () => {
      render(<Skeleton />);

      const sk = screen.getByRole("status");
      expect(sk).toHaveAttribute("aria-busy", "true");
    });

    it("default aria-label is computed from variant: 'Loading <variant> content'", () => {
      render(<Skeleton variant="card" />);

      expect(
        screen.getByRole("status", { name: "Loading card content" }),
      ).toBeInTheDocument();
    });

    it("custom aria-label overrides the computed default", () => {
      render(<Skeleton aria-label="Loading user profile" />);

      expect(
        screen.getByRole("status", { name: "Loading user profile" }),
      ).toBeInTheDocument();
    });

    it("circle variant has its own default label", () => {
      render(<Skeleton variant="circle" />);

      expect(
        screen.getByRole("status", { name: "Loading circle content" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("skeleton is non-interactive (no tabindex)", () => {
      render(<Skeleton />);

      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("skeleton is not focusable", () => {
      render(<Skeleton />);

      // No tabindex means not in the tab order. Anchor the contract:
      // a future refactor adding tabindex would break this.
      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("multi-line text: single role=status wrapper announces ONCE, line bars are aria-hidden", () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);

      // Exactly one role=status (the wrapper). Without this contract a
      // 3-line skeleton would announce "Loading text content" three
      // times — confusing and noisy.
      const statusElements = screen.getAllByRole("status");
      expect(statusElements).toHaveLength(1);

      // The three inner line bars must be aria-hidden so AT skips them.
      const hiddenBars = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenBars.length).toBe(3);
    });

    it("single-line text: NO inner aria-hidden bars (the wrapper itself is the visual)", () => {
      const { container } = render(<Skeleton variant="text" lines={1} />);

      // With lines=1 there's no inner wrapper; the skeleton itself is
      // the visible bar AND the role=status announcer.
      const statusElements = screen.getAllByRole("status");
      expect(statusElements).toHaveLength(1);

      // No nested aria-hidden bars in single-line mode.
      const hidden = container.querySelectorAll('[aria-hidden="true"]');
      expect(hidden.length).toBe(0);
    });

    it("aria-busy=true so AT announces a loading state, not the empty placeholder", () => {
      render(<Skeleton variant="list" />);

      // aria-busy is what differentiates "loading" from "empty content
      // ready to be read". Without it, a screen reader user might think
      // the region is just blank.
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });
  });
});
