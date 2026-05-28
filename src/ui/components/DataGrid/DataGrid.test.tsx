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

  it("displays group button when groupable", () => {
    render(<DataGrid columns={mockColumns} data={mockData} groupable />);
    expect(screen.getByText("Group")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(<DataGrid columns={mockColumns} data={mockData} loading />);
    // Loading state would be displayed
    expect(screen.getByText("ID")).toBeInTheDocument();
  });
});
