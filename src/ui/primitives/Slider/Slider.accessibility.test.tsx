/**
 * Slider Accessibility Tests
 *
 * Dedicated a11y test scaffold for Slider. The two variants expose
 * the ARIA slider pattern differently:
 *
 *   - `variant="single"`: the **track** carries `role="slider"` plus
 *     `aria-valuemin`/`max`/`now` and `aria-labelledby` pointing at
 *     the label.
 *   - `variant="range"`: each of the **two thumbs** carries
 *     `role="slider"` with its own `aria-valuemin`/`max`/`now` and an
 *     `aria-labelledby` that pairs the label id with a qualifier
 *     ("minimum" / "maximum") rendered as `sr-only` text — so AT
 *     users hear "Volume minimum, slider" and "Volume maximum,
 *     slider" instead of two indistinguishable "Volume, slider".
 *
 *   - ARIA Labels and Roles: role=slider + aria-value* on the right
 *     element per variant; aria-labelledby cascades qualifier text
 *   - Keyboard Navigation: (range/single mouse + drag handled in main
 *     Slider.test.tsx; here we cover that the slider exposes the
 *     valuenow attribute that AT depends on)
 *   - Focus Management: aria-disabled when disabled
 *   - Screen Reader Support: sr-only qualifier text exists for the
 *     range variant so the two thumbs disambiguate
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Slider from "./Slider";

describe("Slider Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("single variant: the track carries role=slider + aria-value*", () => {
      render(<Slider label="Volume" min={0} max={100} defaultValue={50} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });

    it("single variant: aria-labelledby points at the label element", () => {
      render(<Slider label="Volume" min={0} max={100} defaultValue={50} />);

      const slider = screen.getByRole("slider");
      const labelledById = slider.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();

      const label = document.getElementById(labelledById as string);
      expect(label).toHaveTextContent("Volume");
    });

    it("range variant: two sliders, one per thumb", () => {
      render(
        <Slider
          label="Price range"
          variant="range"
          min={0}
          max={1000}
          defaultValue={[100, 500]}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
    });

    it("range variant: each thumb carries its own aria-valuenow", () => {
      render(
        <Slider
          label="Price range"
          variant="range"
          min={0}
          max={1000}
          defaultValue={[100, 500]}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      const nowValues = sliders
        .map((s) => s.getAttribute("aria-valuenow"))
        .sort();
      expect(nowValues).toEqual(["100", "500"]);
    });

    it("range variant: aria-labelledby pairs label + qualifier id", () => {
      render(
        <Slider
          label="Price range"
          variant="range"
          min={0}
          max={1000}
          defaultValue={[100, 500]}
        />,
      );

      const sliders = screen.getAllByRole("slider");
      // Each thumb's aria-labelledby should reference TWO ids (label +
      // qualifier). The qualifier text is sr-only "minimum" / "maximum".
      sliders.forEach((s) => {
        const ids = s.getAttribute("aria-labelledby")?.split(" ") ?? [];
        expect(ids.length).toBe(2);
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("aria-valuenow is the AT-readable value (keyboard nav contract anchor)", () => {
      render(<Slider label="Volume" min={0} max={100} defaultValue={75} />);

      // Without aria-valuenow the keyboard contract has no anchor for
      // AT users — arrow-stepping would change visual state but the
      // announced value would be stale.
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Focus Management", () => {
    it("single variant exposes aria-disabled when disabled", () => {
      render(
        <Slider label="Volume" min={0} max={100} defaultValue={50} disabled />,
      );

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  describe("Screen Reader Support", () => {
    it("range variant has sr-only 'minimum' and 'maximum' qualifier text", () => {
      render(
        <Slider
          label="Price range"
          variant="range"
          min={0}
          max={1000}
          defaultValue={[100, 500]}
        />,
      );

      // The qualifier spans live in the DOM with .sr-only — they are
      // the second id in each thumb's aria-labelledby.
      expect(screen.getByText("minimum")).toBeInTheDocument();
      expect(screen.getByText("maximum")).toBeInTheDocument();
    });

    it("showValue prints the current value adjacent to the label (sighted-user reinforcement)", () => {
      render(
        <Slider label="Volume" min={0} max={100} defaultValue={42} showValue />,
      );

      // The visible value alongside the label complements aria-valuenow
      // for sighted users; AT users get the value via aria-valuenow only.
      // Asserting both surfaces are present guards against drift between
      // visual and AT-readable state.
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "42");
    });

    it("single variant: track has aria-valuetext fallback consistency (valuenow as string)", () => {
      // aria-valuetext is OPTIONAL; this test only enforces that
      // aria-valuenow is present and matches the controlled value. If
      // a future consumer needs aria-valuetext (e.g. formatted "42 dB"),
      // they can add it without breaking this assertion.
      render(<Slider label="Volume" min={0} max={100} value={42} />);

      const slider = screen.getByRole("slider");
      expect(slider.getAttribute("aria-valuenow")).toBe("42");
    });
  });
});
