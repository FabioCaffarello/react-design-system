/**
 * Select Accessibility Tests
 *
 * Dedicated a11y test scaffold for Select — wraps the native HTML
 * `<select>` with label + helper/error pattern. The native element
 * carries browser-honored combobox semantics; this scaffold focuses
 * on the wrapper contracts.
 *
 *   - ARIA Labels and Roles: label paired via htmlFor + id;
 *     aria-invalid surfaces error; aria-required mirrors required;
 *     aria-describedby points at error/helper region; optgroup labels
 *     are exposed naturally to AT
 *   - Keyboard Navigation: native select behavior (Space opens the
 *     options on most browsers; arrow keys cycle); Enter submits
 *     forms (browser default)
 *   - Focus Management: enabled select is in the tab order; disabled
 *     is not
 *   - Screen Reader Support: error region has role=alert; helperText
 *     is described, not alerted
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const options = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

describe("Select Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("label is paired to the select via htmlFor + id", () => {
      render(<Select label="Country" options={options} />);

      const select = screen.getByRole("combobox", { name: "Country" });
      const label = screen.getByText("Country");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", select.id);
    });

    it("aria-invalid surfaces the error state", () => {
      render(
        <Select
          label="Country"
          options={options}
          error
          helperText="Required"
        />,
      );

      expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("aria-required mirrors the required prop", () => {
      render(<Select label="Country" options={options} required />);

      expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    it("aria-describedby points at error/helper region", () => {
      render(
        <Select
          label="Country"
          options={options}
          helperText="Select your shipping destination"
        />,
      );

      const select = screen.getByRole("combobox", { name: "Country" });
      const describedById = select.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Select your shipping destination");
    });

    it("optgroup labels propagate to AT via the native element", () => {
      render(
        <Select
          label="Country"
          optionGroups={[
            {
              label: "North America",
              options: [{ value: "us", label: "USA" }],
            },
            { label: "Europe", options: [{ value: "uk", label: "UK" }] },
          ]}
        />,
      );

      // The native optgroup elements carry their label attribute,
      // which AT users hear as a group header before each set of
      // options. We assert the elements are in the DOM with the
      // correct labels.
      expect(screen.getByText("USA").parentElement).toHaveAttribute(
        "label",
        "North America",
      );
      expect(screen.getByText("UK").parentElement).toHaveAttribute(
        "label",
        "Europe",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("Tab moves into the select", async () => {
      const user = userEvent.setup();
      render(<Select label="Country" options={options} />);

      await user.tab();
      expect(screen.getByRole("combobox", { name: "Country" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("disabled select is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Select label="Country" options={options} disabled />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("error region has role=alert so AT announces it", () => {
      render(
        <Select
          label="Country"
          options={options}
          error
          helperText="Country is required"
        />,
      );

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Country is required",
      );
    });

    it("helperText alone is announced as description, not alert", () => {
      render(
        <Select label="Country" options={options} helperText="Optional" />,
      );

      // Same contract as Input: helperText is supplementary
      // description; only the error state escalates to role=alert.
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("placeholder option is disabled so it's not selectable as a real value", () => {
      render(
        <Select label="Country" options={options} placeholder="Choose one…" />,
      );

      // The placeholder is the first option with value="" and disabled.
      // It serves as a visible prompt but cannot be the selected value
      // — important for AT users who scan options without committing.
      const placeholder = screen.getByText("Choose one…");
      expect(placeholder.tagName).toBe("OPTION");
      expect(placeholder).toBeDisabled();
    });
  });
});
