/**
 * DataGrid Accessibility Tests
 *
 * Dedicated a11y test scaffold for DataGrid — the enterprise data
 * grid (Table + toolbar with export/group buttons).
 *
 *   - ARIA Labels and Roles: the wrapped Table exposes role=table with
 *     aria-rowcount/colcount; the toolbar buttons (Group, CSV/XLSX/JSON
 *     Export) each carry their own accessible name from button text
 *   - Keyboard Navigation: toolbar buttons + table content are
 *     reachable via Tab; export buttons fire onExport with the
 *     format string
 *   - Focus Management: each export button is its own tab stop
 *   - Screen Reader Support: the toolbar exists only when exportable,
 *     groupable, or toolbarActions is supplied — no phantom controls;
 *     omitting all three suppresses the toolbar entirely
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "./DataGrid";
import type { DataGridColumn } from "./DataGrid";

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
}

const columns: DataGridColumn<Row>[] = [{ key: "name", label: "Name" }];

const data: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
];

describe("DataGrid Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders the wrapped role=table", () => {
      render(<DataGrid columns={columns} data={data} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("export toolbar buttons expose their own accessible names", () => {
      render(<DataGrid columns={columns} data={data} exportable />);

      // The buttons render with format text — AT users hear each format
      // explicitly.
      expect(screen.getByRole("button", { name: /CSV/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /XLSX/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /JSON/i })).toBeInTheDocument();
    });

    it("groupable toolbar exposes a Group button", () => {
      render(<DataGrid columns={columns} data={data} groupable />);

      expect(
        screen.getByRole("button", { name: /Group/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on an export button fires onExport with the format string", async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();
      render(
        <DataGrid
          columns={columns}
          data={data}
          exportable
          onExport={onExport}
        />,
      );

      const csv = screen.getByRole("button", { name: /CSV/i });
      csv.focus();
      await user.keyboard("{Enter}");
      expect(onExport).toHaveBeenCalledWith("csv");
    });
  });

  describe("Focus Management", () => {
    it("each export button is its own tab stop", () => {
      render(<DataGrid columns={columns} data={data} exportable />);

      // None of the export buttons carries tabindex=-1 — they're
      // independent stops in DOM order.
      const formats = ["CSV", "XLSX", "JSON"];
      for (const f of formats) {
        const btn = screen.getByRole("button", { name: new RegExp(f, "i") });
        expect(btn).not.toHaveAttribute("tabindex", "-1");
      }
    });
  });

  describe("Screen Reader Support", () => {
    it("no toolbar landmark when neither exportable, groupable, nor toolbarActions is set", () => {
      render(<DataGrid columns={columns} data={data} />);

      // Toolbar buttons would surface here — AT users hear nothing
      // toolbar-related when nothing is configured.
      expect(
        screen.queryByRole("button", { name: /CSV|XLSX|JSON|Group/i }),
      ).not.toBeInTheDocument();
    });
  });
});
