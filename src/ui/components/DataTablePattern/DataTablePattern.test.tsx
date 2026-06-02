import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataTablePattern } from "./DataTablePattern";
import type { DataTableColumn } from "./DataTablePattern";

type Row = { id: number; name: string; status: string };

const columns: DataTableColumn<Row>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
];

const rows: Row[] = [
  { id: 1, name: "Alice", status: "active" },
  { id: 2, name: "Bob", status: "pending" },
  { id: 3, name: "Charlie", status: "active" },
];

describe("DataTablePattern", () => {
  it("renders columns as table headers and each row's cells", () => {
    render(<DataTablePattern columns={columns} data={rows} />);

    // Column headers
    expect(
      screen.getByRole("columnheader", { name: "ID" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();

    // Row cells
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("filters rows when the search input changes", async () => {
    render(<DataTablePattern columns={columns} data={rows} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "alice" },
    });

    // SearchInput debounces onSearch by 300ms; wait for the rows that
    // should disappear (Alice is already in the initial render, so
    // assert on the absence of the others).
    await waitFor(() => {
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("omits the search input when enableSearch is false", () => {
    render(
      <DataTablePattern columns={columns} data={rows} enableSearch={false} />,
    );

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("renders pagination controls when data exceeds itemsPerPage", () => {
    const many: Row[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      status: "active",
    }));

    render(
      <DataTablePattern columns={columns} data={many} itemsPerPage={10} />,
    );

    // 25 rows / 10 per page = 3 pages
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();
  });

  it("does not render pagination when the single page holds every row", () => {
    render(
      <DataTablePattern columns={columns} data={rows} itemsPerPage={10} />,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("shows the configured empty message when no data is present", () => {
    render(
      <DataTablePattern
        columns={columns}
        data={[]}
        emptyMessage="Nothing yet"
      />,
    );

    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });

  it("invokes onRowClick with the row and its index in the filtered set", () => {
    const onRowClick = vi.fn();
    render(
      <DataTablePattern
        columns={columns}
        data={rows}
        onRowClick={onRowClick}
      />,
    );

    fireEvent.click(screen.getByText("Bob"));

    expect(onRowClick).toHaveBeenCalledTimes(1);
    const [row, index] = onRowClick.mock.calls[0];
    expect(row).toMatchObject({ name: "Bob" });
    expect(index).toBe(1);
  });
});
