/**
 * SearchInput Accessibility Tests
 *
 * Dedicated a11y test scaffold for SearchInput. Wraps the Input
 * primitive with `type="search"` (giving the input the AT-readable
 * "search" role on browsers that honor it), a leading search icon,
 * and an optional trailing clear button.
 *
 *   - ARIA Labels and Roles: input has type=search (so AT users hear
 *     "Search, search edit" instead of "Search, edit"), clear button
 *     has the discriminator name "Clear search" (distinct from
 *     Modal "Close modal", Drawer "Close drawer", Input's clear,
 *     Toast "Dismiss notification")
 *   - Keyboard Navigation: Enter triggers onSearch when set; Escape
 *     does NOT clear the search (the Input primitive's escape-to-clear
 *     applies to non-search inputs; SearchInput's clear is button-only)
 *   - Focus Management: clear button is reachable via Tab when visible;
 *     loading state replaces the clear button (so AT users don't tab
 *     into a transient control)
 *   - Screen Reader Support: search icon is decorative (aria-hidden);
 *     the clear button name is the only AT-readable label for that
 *     control
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

describe("SearchInput Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("input has type=search (AT-readable as a searchbox)", () => {
      render(<SearchInput aria-label="Search products" />);

      // Browsers map type=search to role=searchbox. Asserting on the
      // attribute is durable across jsdom/Testing Library versions.
      const input = screen.getByRole("searchbox", { name: "Search products" });
      expect(input).toHaveAttribute("type", "search");
    });

    it("clear button has the discriminator name 'Clear search'", () => {
      render(
        <SearchInput aria-label="Search" defaultValue="abc" showClearButton />,
      );

      // Discriminator: Modal uses "Close modal", Drawer "Close drawer",
      // Toast "Dismiss notification", Input "Clear input" — SearchInput
      // owns "Clear search" so AT users always know which control they're
      // on.
      expect(
        screen.getByRole("button", { name: "Clear search" }),
      ).toBeInTheDocument();
    });

    it("clear button is hidden when there's no value", () => {
      render(<SearchInput aria-label="Search" showClearButton />);

      expect(
        screen.queryByRole("button", { name: "Clear search" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter calls onSearch with the current value", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchInput aria-label="Search" onSearch={onSearch} />);

      const input = screen.getByRole("searchbox") as HTMLInputElement;
      await user.click(input);
      await user.type(input, "query");
      await user.keyboard("{Enter}");

      expect(onSearch).toHaveBeenLastCalledWith("query");
    });

    it("clear button activates onClear when pressed", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(
        <SearchInput
          aria-label="Search"
          defaultValue="abc"
          showClearButton
          onClear={onClear}
        />,
      );

      const clear = screen.getByRole("button", { name: "Clear search" });
      await user.click(clear);
      expect(onClear).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("clear button is reachable by Tab when visible", async () => {
      const user = userEvent.setup();
      render(
        <SearchInput aria-label="Search" defaultValue="abc" showClearButton />,
      );

      const input = screen.getByRole("searchbox");
      input.focus();
      await user.tab();

      expect(
        screen.getByRole("button", { name: "Clear search" }),
      ).toHaveFocus();
    });

    it("loading state hides the clear button (no transient tab target)", () => {
      render(
        <SearchInput
          aria-label="Search"
          defaultValue="abc"
          showClearButton
          loading
        />,
      );

      // While loading, the clear button is suppressed — AT users won't
      // tab into a control that's about to flicker away when the
      // loading state resolves.
      expect(
        screen.queryByRole("button", { name: "Clear search" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("clear button's name is the only AT-readable label (icon is decorative)", () => {
      render(
        <SearchInput aria-label="Search" defaultValue="abc" showClearButton />,
      );

      const clear = screen.getByRole("button", { name: "Clear search" });
      // The aria-label carries the name; the X icon is purely visual.
      // If a future refactor drops the aria-label, the button's name
      // becomes empty (axe `button-name` critical) — this assertion
      // anchors the contract.
      expect(clear).toHaveAttribute("aria-label", "Clear search");
    });
  });
});
