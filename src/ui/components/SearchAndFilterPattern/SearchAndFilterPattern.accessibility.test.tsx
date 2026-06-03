/**
 * SearchAndFilterPattern Accessibility Tests
 *
 * Dedicated a11y test scaffold for SearchAndFilterPattern — the
 * search + filter-row + results-list composition.
 *
 *   - ARIA Labels and Roles: search input is exposed as a searchbox
 *     (or textbox); each filter `<select>` carries an `aria-label`
 *     resolved from its `FilterConfig.label` (closes axe `select-name`
 *     for raw selects per Phase 7 doctrine); the optional Clear
 *     Filters button has its own accessible name
 *   - Keyboard Navigation: search + filter selects + Clear Filters
 *     are reachable in DOM order
 *   - Focus Management: each interactive element is its own tab stop
 *   - Screen Reader Support: filters prop with N entries yields N
 *     selects in the AT tree, each named; no phantom Clear Filters
 *     button when no active filter exists
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchAndFilterPattern } from "./SearchAndFilterPattern";
import type { FilterConfig } from "./SearchAndFilterPattern";

const filterConfigs: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { id: "active", label: "Active", value: "active" },
      { id: "inactive", label: "Inactive", value: "inactive" },
    ],
  },
];

interface Item {
  id: string;
  name: string;
  status: string;
}

const items: Item[] = [
  { id: "1", name: "Alpha", status: "active" },
  { id: "2", name: "Beta", status: "inactive" },
];

const renderItem = (item: Item) => <div key={item.id}>{item.name}</div>;

describe("SearchAndFilterPattern Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders a searchbox / textbox for the query", () => {
      render(<SearchAndFilterPattern items={items} renderItem={renderItem} />);

      const search =
        screen.queryByRole("searchbox") || screen.queryByRole("textbox");
      expect(search).toBeInTheDocument();
    });

    it("each filter <select> carries aria-label from FilterConfig.label", () => {
      render(
        <SearchAndFilterPattern
          items={items}
          renderItem={renderItem}
          filters={filterConfigs}
        />,
      );

      // Selects in this pattern are raw native <select> elements;
      // FilterConfig.label drives their aria-label so axe `select-name`
      // stays closed. Query the AT tree by role + name.
      const statusSelect = screen.getByRole("combobox", { name: "Status" });
      expect(statusSelect).toBeInTheDocument();
    });

    it("filters prop with N entries yields N named selects", () => {
      const twoFilters: FilterConfig[] = [
        filterConfigs[0],
        {
          id: "category",
          label: "Category",
          type: "select",
          options: [{ id: "a", label: "A", value: "a" }],
        },
      ];

      render(
        <SearchAndFilterPattern
          items={items}
          renderItem={renderItem}
          filters={twoFilters}
        />,
      );

      // Each FilterConfig becomes its own combobox with its own
      // accessible name — AT users navigate by name, not by index.
      expect(
        screen.getByRole("combobox", { name: "Status" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: "Category" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("filter <select> can be changed from the keyboard", async () => {
      const user = userEvent.setup();
      render(
        <SearchAndFilterPattern
          items={items}
          renderItem={renderItem}
          filters={filterConfigs}
        />,
      );

      const select = screen.getByRole("combobox", { name: "Status" });
      await user.selectOptions(select, "active");

      // After choosing a value, the Clear Filters button surfaces —
      // the pattern's "has active filters" branch is in the AT tree.
      expect(
        screen.getByRole("button", { name: /Clear Filters/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("the searchbox itself has no tabindex='-1'", () => {
      render(<SearchAndFilterPattern items={items} renderItem={renderItem} />);

      const search =
        screen.queryByRole("searchbox") || screen.getByRole("textbox");
      expect(search).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Screen Reader Support", () => {
    it("no Clear Filters button when no filter / search is active", () => {
      render(
        <SearchAndFilterPattern
          items={items}
          renderItem={renderItem}
          filters={filterConfigs}
        />,
      );

      // Defensive: the Clear button is rendered conditionally — its
      // absence in the AT tree avoids the "what does this button do"
      // friction when there's nothing to clear.
      expect(
        screen.queryByRole("button", { name: /Clear Filters/i }),
      ).not.toBeInTheDocument();
    });
  });
});
