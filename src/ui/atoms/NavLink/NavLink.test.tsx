import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NavLink from "./NavLink";

describe("NavLink", () => {
  it("renders as anchor with href", () => {
    render(<NavLink href="/test">Test Link</NavLink>);
    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders as span when disabled", () => {
    render(<NavLink variant="disabled">Disabled Link</NavLink>);
    const link = screen.getByText("Disabled Link");
    expect(link.tagName).toBe("SPAN");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("applies default variant classes", () => {
    const { container } = render(<NavLink href="/test">Link</NavLink>);
    const link = container.querySelector("a");
    expect(link).toHaveClass("border-transparent", "text-gray-500");
  });

  it("applies active variant classes", () => {
    const { container } = render(<NavLink href="/test" variant="active">Link</NavLink>);
    const link = container.querySelector("a");
    expect(link).toHaveClass("border-indigo-500", "text-gray-900");
  });

  it("applies disabled variant classes", () => {
    const { container } = render(<NavLink variant="disabled">Link</NavLink>);
    const link = container.querySelector("span");
    expect(link).toHaveClass("text-gray-300", "cursor-not-allowed");
  });

  it("applies custom className", () => {
    const { container } = render(<NavLink href="/test" className="custom-class">Link</NavLink>);
    const link = container.querySelector("a");
    expect(link).toHaveClass("custom-class");
  });
});
