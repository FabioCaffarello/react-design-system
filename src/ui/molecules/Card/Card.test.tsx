import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("renders with children", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with default variant", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-lg", "border", "border-gray-200");
  });

  it("applies hover variant classes", () => {
    const { container } = render(<Card variant="hover">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("hover:shadow-md", "transition-shadow", "cursor-pointer");
  });

  it("applies selected variant classes", () => {
    const { container } = render(<Card variant="selected">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("border-indigo-500", "shadow-md");
  });

  it("applies medium padding by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-4");
  });

  it("applies small padding", () => {
    const { container } = render(<Card padding="small">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-2");
  });

  it("applies large padding", () => {
    const { container } = render(<Card padding="large">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-6");
  });

  it("applies no padding", () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass("p-2", "p-4", "p-6");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });
});
