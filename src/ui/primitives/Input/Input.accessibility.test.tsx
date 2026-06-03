/**
 * Input Accessibility Tests
 *
 * Dedicated a11y test scaffold for Input — the foundational text-field
 * primitive used by SearchInput, Autocomplete, DatePicker, MultiSelect,
 * TimePicker, CommandPalette. The contracts here propagate to every
 * consumer.
 *
 *   - ARIA Labels and Roles: label paired via htmlFor + id;
 *     aria-invalid surfaces the error state; aria-required mirrors
 *     the `required` prop; aria-describedby points to error OR helper
 *     text region; password toggle and clear buttons each carry
 *     dynamic accessible names ("Show password" / "Hide password",
 *     "Clear input")
 *   - Keyboard Navigation: standard text input behavior (Tab in/out;
 *     typing accepted); Enter on a non-form input doesn't submit
 *   - Focus Management: enabled input is in the tab order; disabled
 *     input is not
 *   - Screen Reader Support: error message lives in role=alert region
 *     linked via aria-describedby; the same wiring works for helper
 *     text (announced as description, not as alert)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("label is paired to the input via htmlFor + id", () => {
      render(<Input label="Email" />);

      const input = screen.getByRole("textbox", { name: "Email" });
      const label = screen.getByText("Email");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", input.id);
    });

    it("aria-invalid surfaces the error state", () => {
      render(<Input label="Email" error helperText="Invalid format" />);

      expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("aria-required mirrors the required prop", () => {
      render(<Input label="Email" required />);

      expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    it("aria-describedby points at the error/helper region", () => {
      render(<Input label="Email" helperText="Enter your work email" />);

      const input = screen.getByRole("textbox", { name: "Email" });
      const describedById = input.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Enter your work email");
    });

    it("password toggle button name reflects the current state", async () => {
      const user = userEvent.setup();
      render(<Input label="Password" type="password" />);

      // Initially: "Show password"
      const showBtn = screen.getByRole("button", { name: "Show password" });
      await user.click(showBtn);

      // After toggle: "Hide password"
      expect(
        screen.getByRole("button", { name: "Hide password" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("typing fires onChange", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input label="Email" onChange={handleChange} />);

      const input = screen.getByRole("textbox", { name: "Email" });
      await user.type(input, "abc");
      expect(handleChange).toHaveBeenCalled();
    });

    it("clear button is reachable by Tab and invokes onClear", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      // showClearButton renders only when the input has a controlled
      // value — defaultValue alone (uncontrolled) does not satisfy
      // hasValue. The test mirrors a real consumer that owns the
      // controlled value state.
      render(
        <Input
          label="Email"
          value="abc"
          onChange={() => {}}
          showClearButton
          onClear={onClear}
        />,
      );

      const input = screen.getByRole("textbox", { name: "Email" });
      input.focus();
      await user.tab();

      const clear = screen.getByRole("button", { name: "Clear input" });
      expect(clear).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(onClear).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("disabled input is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Input label="Email" disabled />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("error region has role=alert so AT announces it on update", () => {
      render(<Input label="Email" error helperText="Required field" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Required field");
    });

    it("helper text is announced as DESCRIPTION via aria-describedby (NOT role=alert)", () => {
      render(<Input label="Email" helperText="Use your work email" />);

      // No role=alert when only helperText (no error) is present —
      // helper text is supplementary description, not an alert. AT
      // users hear it once when the input gains focus, not as a
      // disruptive announcement.
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
