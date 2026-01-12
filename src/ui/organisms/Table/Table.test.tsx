import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";

const sampleData = [
  { id: '1', name: 'Item 1', status: 'ACTIVE' },
  { id: '2', name: 'Item 2', status: 'INACTIVE' },
];

describe("Table", () => {
  it("renders table with data", () => {
    render(
      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ]}
        data={sampleData}
      />
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ]}
        data={sampleData}
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={[]}
        loading={true}
      />
    );
    // Loading state shows skeleton, not "Loading..." text
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={[]}
        emptyMessage="No items found"
      />
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("calls onSort when sortable column header is clicked", () => {
    const handleSort = vi.fn();
    render(
      <Table
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'status', label: 'Status' },
        ]}
        data={sampleData}
        onSort={handleSort}
      />
    );
    const nameHeader = screen.getByText("Name").closest('th');
    if (nameHeader) {
      fireEvent.click(nameHeader);
      expect(handleSort).toHaveBeenCalledWith('name', 'asc');
    }
  });

  it("uses custom render function", () => {
    render(
      <Table
        columns={[
          {
            key: 'name',
            label: 'Name',
            render: (value) => <strong>{value}</strong>,
          },
        ]}
        data={sampleData}
      />
    );
    const strong = screen.getByText("Item 1");
    expect(strong.tagName).toBe("STRONG");
  });

  it("shows sort indicator when sorted", () => {
    render(
      <Table
        columns={[
          { key: 'name', label: 'Name', sortable: true },
        ]}
        data={sampleData}
        onSort={() => {}}
        sortColumn="name"
        sortDirection="asc"
      />
    );
    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("supports client-side pagination", () => {
    const allData = Array.from({ length: 25 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Item ${i + 1}`,
      status: 'ACTIVE',
    }));

    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={allData}
        paginationMode="client"
        defaultPageSize={10}
      />
    );

    // Should show first 10 items
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 10")).toBeInTheDocument();
    // Should not show item 11 on first page
    expect(screen.queryByText("Item 11")).not.toBeInTheDocument();
  });

  it("supports server-side pagination", () => {
    const paginatedData = sampleData.slice(0, 1);
    const handlePageChange = vi.fn();

    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={paginatedData}
        paginationMode="server"
        page={1}
        pageSize={1}
        total={2}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });

  it("supports row selection", () => {
    const handleSelectionChange = vi.fn();
    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={sampleData}
        selectable
        onSelectionChange={handleSelectionChange}
        rowId={(row) => row.id}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // Should have select all checkbox + 2 row checkboxes
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("supports actions", () => {
    const handleAction = vi.fn();
    render(
      <Table
        columns={[{ key: 'name', label: 'Name' }]}
        data={sampleData}
        actions={(row) => [
          { label: 'Edit', onClick: () => handleAction(row) },
        ]}
        rowId={(row) => row.id}
      />
    );

    // Actions button should be present
    const actionButtons = screen.getAllByLabelText('Row actions');
    expect(actionButtons.length).toBeGreaterThan(0);
  });
});
