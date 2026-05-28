import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and message", () => {
    render(<EmptyState title="No items" message="No items found" />);

    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders action button when actionLabel and onAction are provided", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No items"
        message="No items found"
        actionLabel="Create Item"
        onAction={handleAction}
      />,
    );

    const button = screen.getByText("Create Item");
    expect(button).toBeInTheDocument();

    button.click();
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("renders illustration when provided", () => {
    const illustration = <div data-testid="illustration">Illustration</div>;
    render(
      <EmptyState
        title="No items"
        message="No items found"
        illustration={illustration}
      />,
    );

    expect(screen.getByTestId("illustration")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState
        title="No items"
        message="No items found"
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
