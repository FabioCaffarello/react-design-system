import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavbarGroup from "./NavbarGroup";

describe("NavbarGroup", () => {
  it("renders with label", () => {
    render(<NavbarGroup label="Agile" />);
    expect(screen.getByRole("button", { name: /agile/i })).toBeInTheDocument();
  });

  it("applies active styles when isActive is true", () => {
    render(<NavbarGroup label="Agile" isActive />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-indigo-100");
    expect(button.className).toContain("text-indigo-700");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<NavbarGroup label="Agile" onClick={handleClick} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon when provided", () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<NavbarGroup label="Agile" icon={icon} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
