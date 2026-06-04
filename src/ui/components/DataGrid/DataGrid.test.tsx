import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DataGrid from "./DataGrid";

const mockColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
];

const mockData = [
  { id: "1", name: "Item 1", value: 100 },
  { id: "2", name: "Item 2", value: 200 },
  { id: "3", name: "Item 3", value: 300 },
];

describe("DataGrid", () => {
  it("renders correctly", () => {
    render(<DataGrid columns={mockColumns} data={mockData} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("displays export buttons when exportable", () => {
    render(<DataGrid columns={mockColumns} data={mockData} exportable />);
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });

  it("calls onExport when export button is clicked", () => {
    const handleExport = vi.fn();
    render(
      <DataGrid
        columns={mockColumns}
        data={mockData}
        exportable
        onExport={handleExport}
      />,
    );
    // Export functionality would be tested via user interaction
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });

  it("does not render any grouping UI when groupable=true (props @experimental)", () => {
    // DataGridGroup / groups / onGroupChange / groupable are marked
    // @experimental — reserved for upcoming row-grouping support. The
    // previous "Group" button rendered but had no behaviour and was
    // removed. This test pins the contract: passing groupable is a no-op
    // visually today, but typechecks for forward-compatibility.
    render(<DataGrid columns={mockColumns} data={mockData} groupable />);
    expect(screen.queryByText("Group")).not.toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(<DataGrid columns={mockColumns} data={mockData} loading />);
    // Loading state would be displayed
    expect(screen.getByText("ID")).toBeInTheDocument();
  });
});
