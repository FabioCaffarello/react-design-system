/**
 * Spinner Accessibility Tests
 *
 * Dedicated a11y test scaffold for Spinner — a status-region loading
 * primitive that AT users hear as an announcement when it mounts.
 *
 *   - ARIA Labels and Roles: role=status with aria-live=polite,
 *     aria-label defaults to "Loading" (consumer override accepted);
 *     inner spinning icon is aria-hidden
 *   - Keyboard Navigation: non-interactive
 *   - Focus Management: not focusable
 *   - Screen Reader Support: optional label is rendered as sr-only
 *     content so sighted users see just the spinner while AT users
 *     hear the label text
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("role=status with aria-live=polite", () => {
      render(<Spinner />);

      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("aria-live", "polite");
    });

    it("default aria-label is 'Loading'", () => {
      render(<Spinner />);

      expect(
        screen.getByRole("status", { name: "Loading" }),
      ).toBeInTheDocument();
    });

    it("custom label overrides the default aria-label", () => {
      render(<Spinner label="Saving file…" />);

      expect(
        screen.getByRole("status", { name: "Saving file…" }),
      ).toBeInTheDocument();
    });

    it("inner spinning icon is aria-hidden", () => {
      const { container } = render(<Spinner />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("non-interactive (no tabindex)", () => {
      render(<Spinner />);

      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("not focusable", () => {
      render(<Spinner />);

      expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("optional label renders sr-only so sighted users see just the spinner", () => {
      render(<Spinner label="Saving" />);

      // The label text is in the DOM (for AT) but visually hidden via
      // sr-only. Asserting the class anchors the visual contract.
      const labelSpan = screen.getByText("Saving");
      expect(labelSpan).toHaveClass("sr-only");
    });
  });
});
