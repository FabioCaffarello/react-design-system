import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarItem from "./SidebarItem";

describe("SidebarItem", () => {
  it("renders with href and children", () => {
    render(<SidebarItem href="/epics">Epics</SidebarItem>);
    // SidebarItem uses role="menuitem" instead of "link"
    const link = screen.getByRole("menuitem", { name: /epics/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/epics");
  });

  it("applies active styles when isActive is true", () => {
    render(<SidebarItem href="/epics" isActive>Epics</SidebarItem>);
    const link = screen.getByRole("menuitem");
    expect(link.className).toContain("bg-indigo-50");
    expect(link.className).toContain("text-indigo-700");
  });

  it("renders icon when provided", () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<SidebarItem href="/epics" icon={icon}>Epics</SidebarItem>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies nested indent when nested is true", () => {
    render(<SidebarItem href="/epics" nested={true}>Epics</SidebarItem>);
    const link = screen.getByRole("menuitem");
    expect(link.className).toContain("pl-6");
  });

  it("applies nested indent for specific level", () => {
    render(<SidebarItem href="/epics" nested={2}>Epics</SidebarItem>);
    const link = screen.getByRole("menuitem");
    expect(link.className).toContain("pl-10");
  });

  it("uses default padding when not nested", () => {
    render(<SidebarItem href="/epics">Epics</SidebarItem>);
    const link = screen.getByRole("menuitem");
    expect(link.className).toContain("px-4");
    expect(link.className).not.toContain("pl-6");
  });

  it("applies correct icon size classes", () => {
    const icon = <span>Icon</span>;
    const { rerender } = render(
      <SidebarItem href="/test" icon={icon} iconSize="sm">Test</SidebarItem>
    );
    let iconSpan = screen.getByText("Icon").parentElement;
    expect(iconSpan?.className).toContain("h-4 w-4");

    rerender(
      <SidebarItem href="/test" icon={icon} iconSize="md">Test</SidebarItem>
    );
    iconSpan = screen.getByText("Icon").parentElement;
    expect(iconSpan?.className).toContain("h-5 w-5");

    rerender(
      <SidebarItem href="/test" icon={icon} iconSize="lg">Test</SidebarItem>
    );
    iconSpan = screen.getByText("Icon").parentElement;
    expect(iconSpan?.className).toContain("h-6 w-6");
  });
});
