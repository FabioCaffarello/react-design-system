import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-gray-100");
  });

  it("renders with success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-green-100", "text-green-800", "border-green-500");
  });

  it("renders with warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText("Warning");
    expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800", "border-yellow-500");
  });

  it("renders with error variant", () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge).toHaveClass("bg-red-100", "text-red-800", "border-red-500");
  });

  it("renders with info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText("Info");
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800", "border-blue-500");
  });

  it("renders with neutral variant", () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    const badge = screen.getByText("Neutral");
    expect(badge).toHaveClass("bg-gray-100", "text-gray-800", "border-gray-500");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Test</Badge>);
    const badge = screen.getByText("Test");
    expect(badge).toHaveClass("custom-class");
  });

  it("has accessible role and aria-label for string children", () => {
    render(<Badge>Accessible Badge</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label", "Accessible Badge");
  });

  it("renders with custom children", () => {
    render(
      <Badge>
        <span>Custom Content</span>
      </Badge>
    );
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });
});
