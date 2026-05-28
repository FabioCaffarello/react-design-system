import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Label from "./Label";

describe("Label", () => {
  it("renders with children", () => {
    render(<Label htmlFor="test">Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("associates with input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </>,
    );
    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox");
    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  it("renders with default variant", () => {
    const { container } = render(<Label htmlFor="test">Label</Label>);
    const label = container.querySelector("label");
    expect(label).toHaveClass(
      "block",
      "text-sm",
      "font-medium",
      "text-gray-700",
    );
  });

  it("renders with required variant", () => {
    const { container } = render(
      <Label htmlFor="test" variant="required">
        Label
      </Label>,
    );
    const label = container.querySelector("label");
    expect(label).toHaveClass(
      "after:content-['*']",
      "after:ml-0.5",
      "after:text-red-500",
    );
  });

  it("renders with optional variant", () => {
    const { container } = render(
      <Label htmlFor="test" variant="optional">
        Label
      </Label>,
    );
    const label = container.querySelector("label");
    expect(label).toHaveClass(
      "after:content-['(optional)']",
      "after:ml-1",
      "after:text-gray-400",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <Label htmlFor="test" className="custom-class">
        Label
      </Label>,
    );
    const label = container.querySelector("label");
    expect(label).toHaveClass("custom-class");
  });
});
