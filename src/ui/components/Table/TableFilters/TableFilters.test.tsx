import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TableFilters from "./TableFilters";

describe("TableFilters", () => {
  it("renders filter controls", () => {
    const onFilter = vi.fn();

    render(
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [{ value: "ACTIVE", label: "Active" }],
          },
        ]}
        onFilter={onFilter}
      />,
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("expands filters when clicked", () => {
    const onFilter = vi.fn();

    render(
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [{ value: "ACTIVE", label: "Active" }],
          },
        ]}
        onFilter={onFilter}
      />,
    );

    const filterButton = screen.getByText("Filters");
    fireEvent.click(filterButton);

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("calls onFilter when filter value changes", () => {
    const onFilter = vi.fn();

    render(
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "", label: "All Status" },
              { value: "ACTIVE", label: "Active" },
            ],
          },
        ]}
        onFilter={onFilter}
      />,
    );

    const filterButton = screen.getByText("Filters");
    fireEvent.click(filterButton);

    const select = screen.getByLabelText("Status");
    fireEvent.change(select, { target: { value: "ACTIVE" } });

    expect(onFilter).toHaveBeenCalledWith({ status: "ACTIVE" });
  });

  it("clears all filters when clear all is clicked", () => {
    const onFilter = vi.fn();

    render(
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [{ value: "ACTIVE", label: "Active" }],
          },
        ]}
        onFilter={onFilter}
        initialValues={{ status: "ACTIVE" }}
      />,
    );

    const filterButton = screen.getByText("Filters");
    fireEvent.click(filterButton);

    const clearAllButton = screen.getByText("Clear all");
    fireEvent.click(clearAllButton);

    expect(onFilter).toHaveBeenCalledWith({ status: "" });
  });
});
