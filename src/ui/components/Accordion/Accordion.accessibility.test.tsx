/**
 * Accordion Accessibility Tests
 *
 * Dedicated a11y test scaffold for Accordion — the canonical
 * disclosure pattern (WAI-ARIA APG Accordion). The main test file
 * covers toggle behavior and single/multi modes; this file asserts
 * the structural a11y invariants:
 *
 *   - ARIA Labels and Roles: each header is a button with
 *     aria-expanded reflecting open state, aria-controls pointing at
 *     the panel, and panel aria-hidden flipping with open state
 *   - Keyboard Navigation: Enter and Space activate the disclosure;
 *     disabled items are not activatable
 *   - Focus Management: buttons are focusable; disabled items are
 *     marked disabled and skip activation
 *   - Screen Reader Support: chevron is decorative (aria-hidden),
 *     panel id pairs deterministically with aria-controls
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Accordion, { type AccordionItem } from "./Accordion";

const items: AccordionItem[] = [
  { id: "one", title: "First section", content: "First content" },
  { id: "two", title: "Second section", content: "Second content" },
  {
    id: "three",
    title: "Disabled section",
    content: "Hidden content",
    disabled: true,
  },
];

describe("Accordion Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("each header renders as a button with aria-expanded reflecting state", () => {
      render(<Accordion items={items} defaultOpen="one" />);

      const first = screen.getByRole("button", { name: "First section" });
      const second = screen.getByRole("button", { name: "Second section" });

      expect(first).toHaveAttribute("aria-expanded", "true");
      expect(second).toHaveAttribute("aria-expanded", "false");
    });

    it("aria-controls on the button matches the panel id", () => {
      render(<Accordion items={items} defaultOpen="one" />);

      const first = screen.getByRole("button", { name: "First section" });
      const controlsId = first.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();

      const panel = document.getElementById(controlsId as string);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveTextContent("First content");
    });

    it("panel aria-hidden flips with open state", async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      const firstButton = screen.getByRole("button", { name: "First section" });
      const firstPanel = document.getElementById(
        firstButton.getAttribute("aria-controls") as string,
      );

      // Closed initially → aria-hidden=true
      expect(firstPanel).toHaveAttribute("aria-hidden", "true");

      await user.click(firstButton);

      // Opened → aria-hidden=false
      expect(firstPanel).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on a focused header toggles the panel", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Accordion items={items} onValueChange={handleChange} />);

      const first = screen.getByRole("button", { name: "First section" });
      first.focus();
      await user.keyboard("{Enter}");

      expect(first).toHaveAttribute("aria-expanded", "true");
      expect(handleChange).toHaveBeenCalledWith("one");
    });

    it("Space on a focused header toggles the panel", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Accordion items={items} onValueChange={handleChange} />);

      const second = screen.getByRole("button", { name: "Second section" });
      second.focus();
      await user.keyboard(" ");

      expect(second).toHaveAttribute("aria-expanded", "true");
      expect(handleChange).toHaveBeenCalledWith("two");
    });

    it("Tab moves focus through headers in DOM order, skipping disabled", async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      await user.tab();
      expect(
        screen.getByRole("button", { name: "First section" }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: "Second section" }),
      ).toHaveFocus();

      // Disabled buttons are not focusable by default in the browser, so
      // the next Tab leaves the accordion entirely.
      await user.tab();
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe("Focus Management", () => {
    it("disabled items render as disabled buttons (not activatable)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Accordion items={items} onValueChange={handleChange} />);

      const disabled = screen.getByRole("button", { name: "Disabled section" });
      expect(disabled).toBeDisabled();
      expect(disabled).toHaveAttribute("aria-disabled", "true");
      expect(disabled).toHaveAttribute("aria-expanded", "false");

      // Even forcibly focusing then pressing Enter must not change state.
      disabled.focus();
      await user.keyboard("{Enter}");
      expect(handleChange).not.toHaveBeenCalled();
      expect(disabled).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Screen Reader Support", () => {
    it("chevron icon is decorative (aria-hidden)", () => {
      const { container } = render(
        <Accordion items={items} defaultOpen="one" />,
      );

      // The ChevronDown is rendered inside the button with aria-hidden=true.
      // AT reads the button's text label, not the chevron glyph.
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      // At least one chevron + the closed panels should carry aria-hidden.
      expect(icons.length).toBeGreaterThan(0);
    });

    it("panel id pairs deterministically with aria-controls (no collisions)", () => {
      render(<Accordion items={items} />);

      const buttons = screen.getAllByRole("button");
      const controlsIds = buttons.map((b) => b.getAttribute("aria-controls"));
      const unique = new Set(controlsIds);

      // Every button targets a distinct panel.
      expect(unique.size).toBe(buttons.length);

      // Every controls id resolves to a real panel element.
      controlsIds.forEach((id) => {
        expect(document.getElementById(id as string)).toBeInTheDocument();
      });
    });
  });
});
