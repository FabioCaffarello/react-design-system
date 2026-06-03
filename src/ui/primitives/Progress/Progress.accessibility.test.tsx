/**
 * Progress Accessibility Tests
 *
 * Dedicated a11y test scaffold for Progress — the progressbar
 * primitive. Two modes:
 *
 *   - **Determinate** (`value` set): role=progressbar with
 *     aria-valuemin/max/now reporting concrete numbers, aria-busy=false.
 *   - **Indeterminate** (no `value`): role=progressbar with
 *     aria-busy=true; aria-valuemin/max/now intentionally OMITTED
 *     (the spec way to signal "we don't know the current value").
 *
 *   - ARIA Labels and Roles: role=progressbar, aria-valuemin/max/now
 *     present when determinate, OMITTED when indeterminate; aria-busy
 *     mirrors the mode; default aria-label is computed
 *     ("Progress: 42%" or "Loading in progress") and consumer-supplied
 *     aria-label overrides it
 *   - Keyboard Navigation: progressbar is non-interactive (no kbd nav)
 *   - Focus Management: not focusable
 *   - Screen Reader Support: visible label and percentage are
 *     consistent with the AT-readable aria-valuenow + aria-label
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Progress from "./Progress";

describe("Progress Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("determinate: role=progressbar with aria-valuemin/max/now", () => {
      render(<Progress value={42} max={100} />);

      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
      expect(bar).toHaveAttribute("aria-valuenow", "42");
    });

    it("determinate: aria-busy is false", () => {
      render(<Progress value={42} />);

      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-busy", "false");
    });

    it("indeterminate: aria-busy=true; aria-valuemin/max/now intentionally OMITTED", () => {
      render(<Progress />);

      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-busy", "true");
      // The spec way to advertise "value unknown": omit value attrs
      // entirely. Asserting omission is the contract here.
      expect(bar).not.toHaveAttribute("aria-valuenow");
      expect(bar).not.toHaveAttribute("aria-valuemin");
      expect(bar).not.toHaveAttribute("aria-valuemax");
    });

    it("custom aria-label overrides the computed default", () => {
      render(<Progress value={50} aria-label="Uploading file" />);

      expect(
        screen.getByRole("progressbar", { name: "Uploading file" }),
      ).toBeInTheDocument();
    });

    it("default aria-label is computed from value: 'Progress: N%'", () => {
      render(<Progress value={75} />);

      expect(
        screen.getByRole("progressbar", { name: "Progress: 75%" }),
      ).toBeInTheDocument();
    });

    it("default aria-label for indeterminate is 'Loading in progress'", () => {
      render(<Progress />);

      expect(
        screen.getByRole("progressbar", { name: "Loading in progress" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("progressbar is non-interactive (no tabindex)", () => {
      render(<Progress value={42} />);

      const bar = screen.getByRole("progressbar");
      expect(bar).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("progressbar is not in the natural tab order (it's not focusable)", () => {
      render(<Progress value={42} />);

      const bar = screen.getByRole("progressbar");
      // No tabindex means not focusable. Asserting this anchors the
      // contract — if a future refactor adds tabindex=0, this test
      // catches it.
      expect(bar).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("visible percentage label stays consistent with aria-valuenow", () => {
      render(<Progress value={33} max={100} showLabel />);

      const bar = screen.getByRole("progressbar");
      // The visible "33%" text and aria-valuenow="33" must match —
      // sighted users and AT users see/hear the same value.
      expect(bar).toHaveAttribute("aria-valuenow", "33");
      expect(screen.getByText("33%")).toBeInTheDocument();
    });

    it("custom visible label is independent of aria-valuenow", () => {
      render(<Progress value={50} max={100} label="Upload" showLabel />);

      // The visible textual label "Upload" describes what is in
      // progress; aria-valuenow describes how far. They serve
      // different purposes and don't need to match.
      expect(screen.getByText("Upload")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "50",
      );
    });
  });
});
