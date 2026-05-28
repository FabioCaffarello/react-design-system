import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders spinner", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<Spinner label="Loading data" />);
    const spinner = screen.getByLabelText("Loading data");
    expect(spinner).toBeInTheDocument();
  });

  it("has default aria-label when no label provided", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
  });

  it("applies size classes correctly", () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("h-4", "w-4");
  });

  it("applies variant classes correctly", () => {
    const { container } = render(<Spinner variant="primary" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-fg-brand");
  });
});
