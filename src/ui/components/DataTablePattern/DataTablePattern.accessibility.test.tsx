/**
 * DataTablePattern Accessibility Tests
 *
 * Dedicated a11y test scaffold for DataTablePattern — the
 * search-driven paginated table composition (SearchInput + Table +
 * Pagination + optional actions).
 *
 *   - ARIA Labels and Roles: the inner Table exposes role=table; the
 *     search input is a searchbox via SearchInput primitive; actions
 *     prop is a slot that retains child roles
 *   - Keyboard Navigation: typing in the search box filters data; the
 *     pattern resets to page 1 on each search (so AT users hear
 *     "Showing N of M results" reflect the new filter)
 *   - Focus Management: search box is in the tab order, table follows
 *   - Screen Reader Support: enableSearch=false suppresses the
 *     searchbox; results count text surfaces only when enableSearch is
 *     true so AT users hear filter feedback only when filtering is
 *     possible
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTablePattern } from "./DataTablePattern";
import type { DataTableColumn } from "./DataTablePattern";

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
}

const columns: DataTableColumn<Row>[] = [{ key: "name", label: "Name" }];

const data: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
  { id: "3", name: "Gamma" },
];

describe("DataTablePattern Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders the wrapped role=table", () => {
      render(<DataTablePattern columns={columns} data={data} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("search box is in the AT tree by default (enableSearch=true)", () => {
      render(<DataTablePattern columns={columns} data={data} />);

      // SearchInput renders a searchbox role; getByRole covers both
      // searchbox and textbox depending on the primitive's element
      // choice.
      const searchbox =
        screen.queryByRole("searchbox") || screen.queryByRole("textbox");
      expect(searchbox).toBeInTheDocument();
    });

    it("enableSearch=false suppresses the search box", () => {
      render(
        <DataTablePattern columns={columns} data={data} enableSearch={false} />,
      );

      // No searchbox or textbox role — AT users hear no filter
      // surface when filtering is disabled.
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("the search box is focusable from the keyboard via Tab", async () => {
      const user = userEvent.setup();
      render(<DataTablePattern columns={columns} data={data} />);

      const search =
        screen.queryByRole("searchbox") || screen.getByRole("textbox");

      await user.tab();
      // SearchInput is the first interactive surface in this pattern,
      // so the very first Tab lands on it — that's the a11y contract
      // here. The filter logic itself uses SearchInput's debounced
      // onSearch (300ms) and lives in DataTablePattern.test.tsx.
      expect(search).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("the wrapped table itself has no tabindex", () => {
      render(<DataTablePattern columns={columns} data={data} />);

      expect(screen.getByRole("table")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("actions slot renders children with their own accessible names", () => {
      render(
        <DataTablePattern
          columns={columns}
          data={data}
          actions={<button>Export</button>}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Export" }),
      ).toBeInTheDocument();
    });
  });
});
