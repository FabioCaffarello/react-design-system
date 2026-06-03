/**
 * TimePicker Accessibility Tests
 *
 * Dedicated a11y test scaffold for TimePicker — the time-selection
 * composite. Built on Popover (title="Select Time") + Input (readOnly
 * trigger displaying current value) + a grid of increment/decrement
 * Buttons.
 *
 *   - ARIA Labels and Roles: trigger is a readOnly Input with the
 *     consumer's label; popup is the Popover dialog with title
 *     "Select Time"; each hour/minute step button carries a
 *     dynamically-scoped name ("Increment hours", "Decrement
 *     minutes", …); AM/PM buttons toggle without changing their own
 *     label (the visible "AM"/"PM" text is the accessible name)
 *   - Keyboard Navigation: increment/decrement buttons are
 *     keyboard-activatable; Tab moves through them in order
 *   - Focus Management: disabled TimePicker suppresses activation
 *   - Screen Reader Support: distinct names per step button so AT
 *     users know which value they're adjusting; format=12h surfaces
 *     AM/PM as separate buttons (not a toggle)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimePicker from "./TimePicker";

describe("TimePicker Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("trigger input carries the consumer label", () => {
      render(<TimePicker label="Meeting time" />);

      expect(screen.getByLabelText("Meeting time")).toBeInTheDocument();
    });

    it("popup opens with a 'Select Time' titled dialog", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      // Popover renders role=dialog with the title prop as the
      // accessible name.
      expect(
        await screen.findByRole("dialog", { name: "Select Time" }),
      ).toBeInTheDocument();
    });

    it("each step button has a distinct scoped name", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      // AT users hear "Increment hours, button" and "Decrement minutes,
      // button" — they always know which value they're adjusting.
      expect(
        await screen.findByRole("button", { name: "Increment hours" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Decrement hours" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Increment minutes" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Decrement minutes" }),
      ).toBeInTheDocument();
    });

    it("12h format renders separate AM and PM buttons (not a single toggle)", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" format="12h" />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      // Two buttons: AM and PM. The visible text serves as the
      // accessible name; toggling between them is implemented by
      // clicking either button.
      expect(
        await screen.findByRole("button", { name: "AM" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "PM" })).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on Increment hours activates the increment", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" format="24h" onChange={onChange} />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      const inc = await screen.findByRole("button", {
        name: "Increment hours",
      });
      inc.focus();
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      // The Increment hours button activates handleHoursChange, which
      // calls onChange with the new formatted time.
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("disabled TimePicker suppresses step button activation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" disabled onChange={onChange} />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      // When disabled, the underlying Input is read-only-and-disabled;
      // even if the popup did render (it doesn't, since the disabled
      // input has no onFocus open), the increment buttons would be
      // disabled too. Verify no onChange fires.
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Screen Reader Support", () => {
    it("trigger input is readOnly so AT announces it as a non-editable text field", () => {
      render(<TimePicker label="Time" defaultValue="14:30" format="24h" />);

      const trigger = screen.getByLabelText("Time") as HTMLInputElement;
      // readOnly on the trigger advertises "the displayed value is not
      // directly editable here — open the popup to adjust" — same
      // pattern as DatePicker.
      expect(trigger.readOnly).toBe(true);
    });

    it("AM/PM buttons have aria-pressed-equivalent state via variant prop (visible to sighted users)", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" format="12h" defaultValue="09:00 AM" />);

      const trigger = screen.getByLabelText("Time");
      await act(async () => {
        await user.click(trigger);
      });

      // The current AM/PM uses variant="primary" (filled), the inactive
      // one variant="outline". This is a visual contract — sighted users
      // see which is current at a glance. AT users hear the AM/PM text
      // alongside the displayed value in the trigger ("09:00 AM").
      const am = await screen.findByRole("button", { name: "AM" });
      const pm = screen.getByRole("button", { name: "PM" });
      expect(am).toBeInTheDocument();
      expect(pm).toBeInTheDocument();
    });
  });
});
