/**
 * Label Accessibility Tests
 *
 * Dedicated a11y test scaffold for Label — the form-pairing
 * primitive. Wraps `<label>` with variant-driven visual decorations
 * for `required` (asterisk) and `optional` ("(optional)" suffix).
 *
 *   - ARIA Labels and Roles: native label element with htmlFor
 *     pointing at the paired input id; variant decorations are
 *     visual-only (the input still announces its required state
 *     via aria-required, not via the label asterisk)
 *   - Keyboard Navigation: clicking the label focuses the paired
 *     input (native behavior, native click delegation)
 *   - Focus Management: label is not in the tab order itself
 *   - Screen Reader Support: variant="required" asterisk is
 *     decorative (CSS ::after); variant="optional" text is part of
 *     the accessible name (rendered as content)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Label from "./Label";

describe("Label Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a native <label> element", () => {
      render(<Label htmlFor="email">Email</Label>);

      const label = screen.getByText("Email");
      expect(label.tagName).toBe("LABEL");
    });

    it("htmlFor pairs the label to an input id", () => {
      render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" />
        </>,
      );

      // getByLabelText computes the accessible name through the
      // label-input pairing.
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("variant='required' renders the asterisk via CSS ::after (visual decoration)", () => {
      render(
        <Label htmlFor="email" variant="required">
          Email
        </Label>,
      );

      const label = screen.getByText("Email");
      // The asterisk is a CSS pseudo-element (after:content-['*']),
      // not visible as DOM text. The accessible name stays "Email",
      // not "Email *". The input announces required state via its
      // own aria-required, which is the spec-correct surface.
      expect(label.textContent).toBe("Email");
    });
  });

  describe("Keyboard Navigation", () => {
    it("clicking the label focuses the paired input (native click delegation)", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" />
        </>,
      );

      const label = screen.getByText("Email");
      await user.click(label);

      // Native <label htmlFor> delegates clicks to the paired input.
      expect(screen.getByLabelText("Email")).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("label is not in the tab order itself", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Label htmlFor="email">Email</Label>
          <input id="email" />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab lands on the input, not the label.
      expect(screen.getByLabelText("Email")).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("variant='optional' suffix is decorative content (CSS ::after pseudo-element)", () => {
      render(
        <Label htmlFor="phone" variant="optional">
          Phone
        </Label>,
      );

      const label = screen.getByText("Phone");
      // The "(optional)" text is a CSS pseudo-element
      // (after:content-['(optional)']) — same shape as the required
      // asterisk. The accessible name stays "Phone".
      expect(label.textContent).toBe("Phone");
    });

    it("default variant has no decorations (plain label text)", () => {
      render(<Label htmlFor="name">Name</Label>);

      const label = screen.getByText("Name");
      expect(label.textContent).toBe("Name");
    });
  });
});
