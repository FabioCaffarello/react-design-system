/**
 * Radio Accessibility Tests
 *
 * Dedicated a11y test scaffold for Radio. Uses the native
 * `<input type="radio">` (no `role` attribute), so it inherits the
 * browser's radio semantics. Radio is the single-item primitive — the
 * radiogroup pattern (arrow-nav between siblings sharing a `name`) is
 * the browser's responsibility once consumers wire several together.
 *
 *   - ARIA Labels and Roles: native radio role, `<label htmlFor>`
 *     pairs to the input id, aria-invalid surfaces the error state
 *   - Keyboard Navigation: Space toggles the radio (selecting it);
 *     Tab moves through unselected radios within a name group, then
 *     skips already-selected ones — the browser handles this and the
 *     primitive doesn't reimplement it
 *   - Focus Management: disabled radio is not focusable; selected
 *     radio is reachable by Tab
 *   - Screen Reader Support: when no label is provided, the aria-label
 *     fallback ("Radio button") prevents axe `aria-input-field-name`
 *     (serious); error message lives in role=alert
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Radio from "./Radio";

describe("Radio Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a native radio input", () => {
      render(<Radio label="Option A" name="opts" value="a" />);

      const radio = screen.getByRole("radio");
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute("type", "radio");
    });

    it("label is paired to the input via htmlFor + id", () => {
      render(<Radio label="Option A" name="opts" value="a" />);

      const radio = screen.getByRole("radio");
      const label = screen.getByText("Option A");

      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", radio.id);
    });

    it("aria-invalid surfaces the error state", () => {
      render(
        <Radio
          label="Option A"
          name="opts"
          value="a"
          error
          helperText="Required"
        />,
      );

      expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
    });

    it("aria-describedby points at the helper / error region", () => {
      render(
        <Radio
          label="Option A"
          name="opts"
          value="a"
          helperText="Pick the right one"
        />,
      );

      const radio = screen.getByRole("radio");
      const describedById = radio.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Pick the right one");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Space selects the radio (native behavior)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Radio
          label="Option A"
          name="opts"
          value="a"
          onChange={handleChange}
        />,
      );

      const radio = screen.getByRole("radio") as HTMLInputElement;
      radio.focus();
      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(radio.checked).toBe(true);
    });

    it("once selected, the radio carries the selected state via the DOM", async () => {
      const user = userEvent.setup();
      render(<Radio label="Option A" name="opts" value="a" />);

      const radio = screen.getByRole("radio") as HTMLInputElement;
      radio.focus();
      await user.keyboard(" ");

      // After selection, the browser's roving-tabindex contract within a
      // radiogroup makes the selected radio the only tab-stop in the
      // group. We can't test the group behavior with a single Radio,
      // but we assert that the selected radio's `checked` state is
      // exposed correctly.
      expect(radio.checked).toBe(true);
    });
  });

  describe("Focus Management", () => {
    it("disabled radio ignores Space and stays unchecked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Radio
          label="Option A"
          name="opts"
          value="a"
          disabled
          onChange={handleChange}
        />,
      );

      const radio = screen.getByRole("radio") as HTMLInputElement;
      radio.focus();
      await user.keyboard(" ");

      expect(handleChange).not.toHaveBeenCalled();
      expect(radio.checked).toBe(false);
    });

    it("disabled radio is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Radio label="Option A" name="opts" value="a" disabled />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips the disabled radio and lands on the next button.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("falls back to aria-label='Radio button' when no visible label is provided", () => {
      render(<Radio name="opts" value="a" />);

      // Without label OR aria-label, axe `aria-input-field-name`
      // (serious) flags the input.
      expect(
        screen.getByRole("radio", { name: "Radio button" }),
      ).toBeInTheDocument();
    });

    it("error region has role=alert so screen readers announce it", () => {
      render(
        <Radio
          label="Option A"
          name="opts"
          value="a"
          error
          helperText="Please pick one"
        />,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Please pick one");
    });
  });
});
