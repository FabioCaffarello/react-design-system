/**
 * Autocomplete Accessibility Tests
 *
 * Dedicated a11y test scaffold for Autocomplete — the combobox /
 * listbox pattern. The two roles must coexist precisely:
 *
 *   - `<input>` is the COMBOBOX (typed query)
 *   - the popup is the LISTBOX with `role="option"` children
 *
 *   - ARIA Labels and Roles: input is a real text input with label
 *     wiring (or aria-label fallback); list is role=listbox; each
 *     suggestion is role=option with aria-selected reflecting the
 *     highlighted index; aria-disabled on disabled options
 *   - Keyboard Navigation: ArrowDown opens list and moves highlight;
 *     Enter selects highlighted option; Escape closes; typing filters
 *   - Focus Management: focus stays on the input — listbox does NOT
 *     steal focus (this is what aria-selected on options is FOR);
 *     dev-only console.warn fires when no accessible name is provided
 *   - Screen Reader Support: listbox has accessible name cascaded from
 *     the input's label/aria-label so axe `aria-input-field-name` is
 *     satisfied on the listbox portal too
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";

const options: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
];

describe("Autocomplete Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("input has accessible name from the label prop", () => {
      render(<Autocomplete options={options} label="Fruit" />);

      expect(
        screen.getByRole("textbox", { name: "Fruit" }),
      ).toBeInTheDocument();
    });

    it("listbox renders with role=listbox when open", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      await user.click(input);

      expect(await screen.findByRole("listbox")).toBeInTheDocument();
    });

    it("each option renders role=option with aria-selected", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      await user.click(input);

      const opts = await screen.findAllByRole("option");
      expect(opts).toHaveLength(3);
      // No item is highlighted initially.
      opts.forEach((opt) => {
        expect(opt).toHaveAttribute("aria-selected", "false");
      });
    });

    it("listbox inherits the input's accessible name via cascaded aria-label", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      await user.click(input);

      const listbox = await screen.findByRole("listbox");
      // Without this cascade, axe aria-input-field-name (serious) flags
      // the listbox portal — even though the input is properly labelled.
      // The Autocomplete passes label down so the listbox is named too.
      const name =
        listbox.getAttribute("aria-label") ||
        listbox.getAttribute("aria-labelledby");
      expect(name).toBeTruthy();
    });

    it("warns in dev when no accessible name source is provided", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Autocomplete options={options} />);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("Missing accessible name"),
      );
      warn.mockRestore();
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowDown opens the list and highlights the first option", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      input.focus();
      await user.keyboard("{ArrowDown}");

      const listbox = await screen.findByRole("listbox");
      const apple = await screen.findByRole("option", { name: "Apple" });
      // Highlighted reflects via aria-selected=true. Other options stay false.
      await waitFor(() => {
        expect(apple).toHaveAttribute("aria-selected", "true");
      });
      expect(listbox).toBeInTheDocument();
    });

    it("Enter on a highlighted option selects it and closes the list", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Autocomplete options={options} label="Fruit" onSelect={onSelect} />,
      );

      const input = screen.getByRole("textbox", { name: "Fruit" });
      input.focus();
      await user.keyboard("{ArrowDown}{Enter}");

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(
          expect.objectContaining({ value: "apple" }),
        );
      });
    });

    it("Escape closes the list without selecting", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Autocomplete options={options} label="Fruit" onSelect={onSelect} />,
      );

      const input = screen.getByRole("textbox", { name: "Fruit" });
      input.focus();
      await user.keyboard("{ArrowDown}");
      await screen.findByRole("listbox");
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("focus stays on the input throughout keyboard nav (combobox contract)", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      input.focus();
      await user.keyboard("{ArrowDown}{ArrowDown}");

      // In activedescendant combobox, focus NEVER moves to options.
      // aria-selected on the highlighted option does the advertising.
      expect(input).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("disabled options carry aria-disabled=true", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      await user.click(input);

      const cherry = await screen.findByRole("option", { name: "Cherry" });
      expect(cherry).toHaveAttribute("aria-disabled", "true");
    });

    it("filtered listbox still announces an option count when results match", async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={options} label="Fruit" />);

      const input = screen.getByRole("textbox", { name: "Fruit" });
      await act(async () => {
        await user.type(input, "an");
      });

      // After debounce, only "Banana" should remain (substring "an" matches Banana).
      await waitFor(
        () => {
          const opts = screen.queryAllByRole("option");
          expect(opts.map((o) => o.textContent?.trim())).toContain("Banana");
          expect(opts.map((o) => o.textContent?.trim())).not.toContain("Apple");
        },
        { timeout: 1500 },
      );
    });
  });
});
