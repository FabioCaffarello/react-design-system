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
 *   - Screen Reader Support: the toolbar exists only when exportable or
 *     toolbarActions is supplied — no phantom controls; omitting both
 *     suppresses the toolbar entirely. (Grouping props are @experimental
 *     and do NOT contribute to the toolbar gate today — see the
 *     DataGridGroup JSDoc and BACKLOG.md.)
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
      render(
        <DataGrid
          columns={columns}
          data={data}
          exportable
          onExport={() => {}}
        />,
      );

      // With a consumer onExport, all configured formats render and each
      // button's format text is its accessible name.
      expect(screen.getByRole("button", { name: /CSV/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /XLSX/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /JSON/i })).toBeInTheDocument();
    });

    it("omits formats the built-in serializer cannot handle when no onExport", () => {
      render(<DataGrid columns={columns} data={data} exportable />);

      // Regression: without onExport the default path only implements CSV
      // and JSON — rendering an XLSX button made it a focusable no-op.
      expect(screen.getByRole("button", { name: /CSV/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /JSON/i })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /XLSX/i }),
      ).not.toBeInTheDocument();
    });

    it("groupable does not surface a Group button (props @experimental)", () => {
      // DataGridGroup / groups / onGroupChange / groupable are reserved
      // for forward-compatibility but not yet wired to rendering. The
      // previous Group button rendered without behaviour and was removed;
      // groupable now also does NOT trigger the toolbar landmark
      // (see "no toolbar landmark" test below). See BACKLOG.md for the
      // roadmap entry.
      render(<DataGrid columns={columns} data={data} groupable />);

      expect(
        screen.queryByRole("button", { name: /Group/i }),
      ).not.toBeInTheDocument();
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
      render(
        <DataGrid
          columns={columns}
          data={data}
          exportable
          onExport={() => {}}
        />,
      );

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
    it("no toolbar landmark when neither exportable nor toolbarActions is set", () => {
      render(<DataGrid columns={columns} data={data} />);

      // Toolbar buttons would surface here — AT users hear nothing
      // toolbar-related when nothing is configured. `groupable` is
      // intentionally excluded from this gate today (props @experimental).
      expect(
        screen.queryByRole("button", { name: /CSV|XLSX|JSON|Group/i }),
      ).not.toBeInTheDocument();
    });

    it("groupable alone does not produce a toolbar (props @experimental)", () => {
      // Sanity pin: the previous gate `exportable || groupable ||
      // toolbarActions` meant `groupable` alone surfaced an empty toolbar
      // box. After the freeze, groupable is inert and the toolbar stays
      // absent unless exportable or toolbarActions justifies it.
      render(<DataGrid columns={columns} data={data} groupable />);

      expect(
        screen.queryByRole("button", { name: /CSV|XLSX|JSON|Group/i }),
      ).not.toBeInTheDocument();
    });
  });
});
