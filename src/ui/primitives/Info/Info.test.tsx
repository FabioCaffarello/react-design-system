import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Info from "./Info";

describe("Info", () => {
  it("renders info message", () => {
    render(<Info>This is an info message</Info>);
    expect(screen.getByText("This is an info message")).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Info>Info message</Info>);
    const info = screen.getByRole("alert");
    expect(info).toBeInTheDocument();
  });

  it("applies info variant classes by default", () => {
    const { container } = render(<Info>Info message</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass("bg-info-bg", "text-info-dark", "border-info");
  });

  it("applies warning variant classes", () => {
    const { container } = render(
      <Info variant="warning">Warning message</Info>,
    );
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass(
      "bg-warning-bg",
      "text-warning-dark",
      "border-warning",
    );
  });

  it("applies error variant classes", () => {
    const { container } = render(<Info variant="error">Error message</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass("bg-error-bg", "text-error-dark", "border-error");
  });

  it("applies custom className", () => {
    const { container } = render(<Info className="custom-class">Info</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(<Info data-testid="info">Info message</Info>);
    expect(screen.getByTestId("info")).toBeInTheDocument();
  });
});
