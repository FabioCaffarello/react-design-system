/**
 * DatePicker Accessibility Tests
 *
 * Dedicated a11y test scaffold for DatePicker — the **composite**
 * picker pattern: an Input + a Popover containing a grid Calendar.
 *
 * The DatePickerCalendar (inner grid + keyboard nav) has its own
 * a11y surface tested via main test suites — this scaffold targets
 * the **wrapper composition**:
 *
 *   - ARIA Labels and Roles: input has type=text with consumer
 *     aria-label; popup is role=dialog with aria-modal="false"
 *     (NON-modal — focus is not trapped, AT users can keep tabbing);
 *     popup has aria-label="Date picker calendar"
 *   - Keyboard Navigation: input focus opens the popup; clicking
 *     outside closes (mousedown-based, so the close fires BEFORE the
 *     click target gets the event — important for compound layouts
 *     where the trigger and popup share a parent)
 *   - Focus Management: focus enters the popup naturally because it
 *     renders a focusable calendar grid; no focus trap (intentional —
 *     this is a non-modal dialog)
 *   - Screen Reader Support: popup announces as "Date picker calendar
 *     dialog"; range mode and single mode both expose the same outer
 *     dialog name (the calendar inside distinguishes the modes)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePicker from "./DatePicker";

describe("DatePicker Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("input is reachable as a text field with consumer aria-label", () => {
      render(<DatePicker aria-label="Booking date" />);

      // The input is a text field (custom format display); the
      // calendar handles actual selection.
      expect(screen.getByLabelText("Booking date")).toBeInTheDocument();
    });

    it("opening the popup yields role=dialog with aria-modal='false'", async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);

      const input = screen.getByLabelText("Date");
      await act(async () => {
        await user.click(input);
      });

      const dialog = await screen.findByRole("dialog", {
        name: "Date picker calendar",
      });
      // aria-modal="false" intentionally: the calendar does not trap
      // focus. AT users can keep tabbing in and out without losing
      // their place.
      expect(dialog).toHaveAttribute("aria-modal", "false");
    });

    it("popup carries the discriminator name 'Date picker calendar'", async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);

      const input = screen.getByLabelText("Date");
      await act(async () => {
        await user.click(input);
      });

      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label", "Date picker calendar");
    });
  });

  describe("Keyboard Navigation", () => {
    it("focusing the input opens the popup", async () => {
      render(<DatePicker aria-label="Date" />);

      const input = screen.getByLabelText("Date");
      await act(async () => {
        input.focus();
      });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    it("non-modal: the popup does NOT trap focus (no aria-modal=true)", async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);

      const input = screen.getByLabelText("Date");
      await act(async () => {
        await user.click(input);
      });

      const dialog = await screen.findByRole("dialog");
      // The contract: focus can leave the popup without being yanked
      // back. aria-modal=false advertises this to AT users so they
      // can tab past without surprise.
      expect(dialog).not.toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Screen Reader Support", () => {
    it("range mode exposes the same outer dialog name as single mode", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <DatePicker aria-label="Date" mode="single" />,
      );

      let input = screen.getByLabelText("Date");
      await act(async () => {
        await user.click(input);
      });

      let dialog = await screen.findByRole("dialog");
      const singleModeName = dialog.getAttribute("aria-label");

      rerender(<DatePicker aria-label="Booking range" mode="range" />);

      input = screen.getByLabelText("Booking range");
      await act(async () => {
        await user.click(input);
      });

      // The outer wrapper dialog name does not depend on mode —
      // the calendar inside distinguishes single vs range via its
      // grid semantics (handled in DatePickerCalendar).
      dialog = await screen.findByRole("dialog");
      expect(dialog.getAttribute("aria-label")).toBe(singleModeName);
    });
  });
});
