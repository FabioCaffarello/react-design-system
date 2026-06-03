/**
 * ColorPicker Accessibility Tests
 *
 * Dedicated a11y test scaffold for ColorPicker — the popover-backed
 * color selection control. Tests focus on the trigger row (color
 * preview + optional Input) since opening the popover and reaching
 * preset swatches in JSDOM requires the portal + position calculations
 * the Popover primitive does at runtime; preset/sliders interactivity
 * lives in `ColorPicker.test.tsx`.
 *
 *   - ARIA Labels and Roles: when showInput=true, the trigger row
 *     renders an <input> that AT users can focus and edit directly;
 *     when label prop is supplied, it renders as a <label> adjacent
 *     to the trigger; disabled prop reaches the Input
 *   - Keyboard Navigation: the hex Input is tabbable when showInput
 *     is true
 *   - Focus Management: disabled state suppresses the Input from
 *     becoming a tab stop
 *   - Screen Reader Support: label content surfaces in the AT tree
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPicker from "./ColorPicker";

describe("ColorPicker Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("trigger row exposes an editable hex Input when showInput=true (default)", () => {
      render(<ColorPicker defaultValue="#ff0000" />);

      // Default showInput=true puts a textbox in the trigger row so AT
      // users can type a hex value directly without opening the popup.
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("#ff0000");
    });

    it("showInput=false removes the trigger-row Input from the AT tree", () => {
      render(<ColorPicker defaultValue="#ff0000" showInput={false} />);

      // When showInput is false, the trigger row is just the swatch —
      // no textbox surface, no editable name.
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("label prop renders adjacent to the trigger", () => {
      render(<ColorPicker defaultValue="#ff0000" label="Brand color" />);

      // The label text is in the DOM so AT users hear it when they
      // reach the picker.
      expect(screen.getByText("Brand color")).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("hex Input in the trigger row is reachable via Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <ColorPicker defaultValue="#ff0000" />
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // First Tab from "Before" lands on the hex Input.
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("disabled prop disables the hex Input (and prevents typing)", () => {
      render(<ColorPicker defaultValue="#ff0000" disabled />);

      const input = screen.getByRole("textbox");
      // Disabled state propagates from picker → Input — the textbox is
      // both visually and behaviorally disabled.
      expect(input).toBeDisabled();
    });
  });

  describe("Screen Reader Support", () => {
    it("controlled value is reflected in the textbox value (AT name)", () => {
      render(<ColorPicker value="#00ff00" onChange={() => {}} />);

      // Controlled mode: the value prop drives what AT users hear when
      // they focus the trigger Input.
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("#00ff00");
    });
  });
});
