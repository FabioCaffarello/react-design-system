import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Text from "./Text";

describe("Text", () => {
  it("renders text content", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders as paragraph by default", () => {
    const { container } = render(<Text>Content</Text>);
    const text = container.querySelector("p");
    expect(text).toBeInTheDocument();
  });

  it("renders as heading when variant is heading", () => {
    const { container } = render(<Text variant="heading">Heading</Text>);
    const text = container.querySelector("h2");
    expect(text).toBeInTheDocument();
  });

  it("renders as list item when variant is list", () => {
    const { container } = render(<Text variant="list">List item</Text>);
    const text = container.querySelector("li");
    expect(text).toBeInTheDocument();
  });

  it("renders as custom element when as prop is provided", () => {
    const { container } = render(<Text as="span">Content</Text>);
    const text = container.querySelector("span");
    expect(text).toBeInTheDocument();
  });

  it("applies bold class when bold prop is true", () => {
    const { container } = render(<Text bold>Bold text</Text>);
    const text = container.querySelector("p");
    expect(text).toHaveClass("font-bold");
  });

  it("applies italic class when italic prop is true", () => {
    const { container } = render(<Text italic>Italic text</Text>);
    const text = container.querySelector("p");
    expect(text).toHaveClass("italic");
  });

  it("applies color class when color prop is provided", () => {
    const { container } = render(
      <Text colorRole="error" colorShade="dark">
        Colored text
      </Text>,
    );
    const text = container.querySelector("p");
    // Component uses getColorClass which returns semantic color classes
    expect(text).toHaveClass("text-red-600"); // error dark variant
  });

  it("applies custom className", () => {
    const { container } = render(<Text className="custom-class">Content</Text>);
    const text = container.querySelector("p");
    expect(text).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(<Text data-testid="text">Content</Text>);
    expect(screen.getByTestId("text")).toBeInTheDocument();
  });
});
