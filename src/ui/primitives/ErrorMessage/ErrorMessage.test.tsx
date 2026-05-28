import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message", () => {
    render(<ErrorMessage message="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<ErrorMessage message="Error message" />);
    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
  });

  it("has aria-live attribute", () => {
    const { container } = render(<ErrorMessage message="Error message" />);
    const error = container.querySelector('[role="alert"]');
    expect(error).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom id", () => {
    render(<ErrorMessage message="Error message" id="custom-error-id" />);
    const error = screen.getByRole("alert");
    expect(error).toHaveAttribute("id", "custom-error-id");
  });

  it("displays error icon", () => {
    const { container } = render(<ErrorMessage message="Error message" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ErrorMessage message="Error" className="custom-class" />,
    );
    const error = container.querySelector('[role="alert"]');
    expect(error).toHaveClass("custom-class");
  });
});
