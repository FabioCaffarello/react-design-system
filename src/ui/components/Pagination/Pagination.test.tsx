import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renders pagination controls", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange when Next is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when Previous is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange when page number is clicked", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    const page3 = screen.getByLabelText("Go to page 3");
    fireEvent.click(page3);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("shows page info when provided", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        onPageChange={() => {}}
        totalItems={100}
        itemsPerPage={10}
      />,
    );
    expect(
      screen.getByText(/Showing 11 to 20 of 100 results/),
    ).toBeInTheDocument();
  });

  it("highlights current page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
    );
    const currentPageButton = screen.getByLabelText("Go to page 3");
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
    expect(currentPageButton).toHaveClass(
      "bg-surface-brand",
      "text-fg-inverse",
    );
  });
});
