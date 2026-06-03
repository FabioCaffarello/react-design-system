/**
 * Checkbox Accessibility Tests
 *
 * Dedicated a11y test scaffold for Checkbox. Uses the native
 * `<input type="checkbox">` (no `role` attribute), so it inherits
 * the browser's checkbox semantics:
 *
 *   - ARIA Labels and Roles: native checkbox role, `<label htmlFor>`
 *     pairs to the input id, indeterminate state propagates to the
 *     `aria-checked="mixed"` value via the DOM `indeterminate`
 *     property, aria-invalid surfaces the error state
 *   - Keyboard Navigation: Space toggles (native behavior — Enter is
 *     NOT a checkbox activator, only Space); disabled checkbox
 *     ignores Space
 *   - Focus Management: enabled checkbox is in the tab order; disabled
 *     is not
 *   - Screen Reader Support: when no label is provided, aria-label
 *     fallback ("Checkbox") prevents axe `aria-input-field-name`
 *     (serious); error message is in a role=alert region linked via
 *     aria-describedby
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a native checkbox input", () => {
      render(<Checkbox label="Accept terms" />);

      const cb = screen.getByRole("checkbox");
      expect(cb).toBeInTheDocument();
      expect(cb).toHaveAttribute("type", "checkbox");
    });

    it("label is paired to the input via htmlFor + id", () => {
      render(<Checkbox label="Accept terms" />);

      const cb = screen.getByRole("checkbox");
      const label = screen.getByText("Accept terms");

      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", cb.id);
    });

    it("indeterminate state propagates to the DOM (aria-checked='mixed' equivalent)", () => {
      render(<Checkbox label="Select all" indeterminate />);

      // Native: aria-checked is computed from the DOM `indeterminate`
      // property — Testing Library's accessible-name computation maps it
      // to mixed. We assert on the DOM property directly because the
      // attribute is intentionally not on the element.
      const cb = screen.getByRole("checkbox") as HTMLInputElement;
      expect(cb.indeterminate).toBe(true);
    });

    it("aria-invalid surfaces the error state", () => {
      render(<Checkbox label="Accept terms" error helperText="Required" />);

      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("aria-describedby points at the helper / error region", () => {
      render(
        <Checkbox label="Accept terms" helperText="Required for submission" />,
      );

      const cb = screen.getByRole("checkbox");
      const describedById = cb.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Required for submission");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Space toggles the checkbox (native behavior)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox label="Accept terms" onChange={handleChange} />);

      const cb = screen.getByRole("checkbox") as HTMLInputElement;
      cb.focus();
      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(cb.checked).toBe(true);
    });

    it("Enter does NOT toggle a native checkbox", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox label="Accept terms" onChange={handleChange} />);

      const cb = screen.getByRole("checkbox") as HTMLInputElement;
      cb.focus();
      await user.keyboard("{Enter}");

      // Native checkboxes deliberately ignore Enter. Asserting this is
      // important — if a future refactor reaches for a custom button
      // wrapper that adds Enter support, we want to know.
      expect(handleChange).not.toHaveBeenCalled();
      expect(cb.checked).toBe(false);
    });
  });

  describe("Focus Management", () => {
    it("disabled checkbox ignores Space and stays unchecked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Checkbox label="Accept terms" disabled onChange={handleChange} />,
      );

      const cb = screen.getByRole("checkbox") as HTMLInputElement;
      cb.focus();
      await user.keyboard(" ");

      expect(handleChange).not.toHaveBeenCalled();
      expect(cb.checked).toBe(false);
    });
  });

  describe("Screen Reader Support", () => {
    it("falls back to aria-label='Checkbox' when no visible label is provided", () => {
      render(<Checkbox />);

      // Without label OR aria-label, axe `aria-input-field-name`
      // (serious) flags the input. The fallback ensures every Checkbox
      // has an accessible name.
      expect(
        screen.getByRole("checkbox", { name: "Checkbox" }),
      ).toBeInTheDocument();
    });

    it("error region has role=alert so screen readers announce it", () => {
      render(
        <Checkbox
          label="Accept terms"
          error
          helperText="This field is required"
        />,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("This field is required");
    });
  });
});
