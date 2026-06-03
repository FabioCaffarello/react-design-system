/**
 * Switch Accessibility Tests
 *
 * Dedicated a11y test scaffold for Switch. The Switch is a toggle
 * control that exposes `role="switch"` + `aria-checked` on a button
 * — a distinct ARIA pattern from Checkbox (which uses the native
 * `<input type="checkbox">` plus `aria-checked` semantics).
 *
 *   - ARIA Labels and Roles: role=switch, aria-checked tracks state
 *     (including in uncontrolled mode — historically a critical
 *     `aria-required-attr` axe failure when aria-checked was missing),
 *     aria-labelledby pairs to the visible label, aria-describedby
 *     pairs to helper/error text
 *   - Keyboard Navigation: Enter and Space toggle the switch
 *   - Focus Management: disabled switch ignores activation (no state
 *     change); enabled switch is in the natural tab order
 *   - Screen Reader Support: helperText forms the description via
 *     aria-describedby; visible label forms the name via
 *     aria-labelledby (NOT just aria-label, so the textual label
 *     remains for sighted users too)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Switch from "./Switch";

describe("Switch Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders with role=switch", () => {
      render(<Switch label="Notifications" />);

      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("aria-checked tracks state in controlled mode", () => {
      const { rerender } = render(
        <Switch label="Notifications" checked={false} />,
      );

      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false",
      );

      rerender(<Switch label="Notifications" checked={true} />);
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("aria-checked is present in uncontrolled mode (no missing-attr regression)", () => {
      // Regression guard for the prior axe `aria-required-attr` (critical)
      // failure: in uncontrolled mode the `currentChecked` fallback must
      // produce a concrete boolean so the attribute renders.
      render(<Switch label="Notifications" />);

      const sw = screen.getByRole("switch");
      const value = sw.getAttribute("aria-checked");
      expect(value === "false" || value === "true").toBe(true);
    });

    it("aria-labelledby points at the visible label element", () => {
      render(<Switch label="Notifications" />);

      const sw = screen.getByRole("switch");
      const labelledById = sw.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();

      const label = document.getElementById(labelledById as string);
      expect(label).toHaveTextContent("Notifications");
    });

    it("aria-describedby points at helper text when provided", () => {
      render(
        <Switch
          label="Notifications"
          helperText="Receive emails about updates"
        />,
      );

      const sw = screen.getByRole("switch");
      const describedById = sw.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Receive emails about updates");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Space toggles the switch", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch label="Notifications" onChange={handleChange} />);

      const sw = screen.getByRole("switch");
      sw.focus();
      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalled();
      expect(sw).toHaveAttribute("aria-checked", "true");
    });

    it("Enter toggles the switch", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch label="Notifications" onChange={handleChange} />);

      const sw = screen.getByRole("switch");
      sw.focus();
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalled();
      expect(sw).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Focus Management", () => {
    it("disabled switch ignores activation attempts", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch label="Notifications" disabled onChange={handleChange} />);

      const sw = screen.getByRole("switch");
      sw.focus();
      await user.keyboard(" ");
      await user.keyboard("{Enter}");

      expect(handleChange).not.toHaveBeenCalled();
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    it("enabled switch is in the natural tab order", async () => {
      const user = userEvent.setup();
      render(<Switch label="Notifications" />);

      await user.tab();
      expect(screen.getByRole("switch")).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("name is the visible label (via aria-labelledby, NOT aria-label)", () => {
      render(<Switch label="Notifications" />);

      const sw = screen.getByRole("switch", { name: "Notifications" });
      expect(sw).toBeInTheDocument();
      // The contract: the label text is in the DOM as visible content,
      // pointed at by aria-labelledby. This keeps the label visible to
      // sighted users while satisfying the accessible-name computation.
      expect(sw).toHaveAttribute("aria-labelledby");
      expect(sw).not.toHaveAttribute("aria-label", "Notifications");
    });
  });
});
