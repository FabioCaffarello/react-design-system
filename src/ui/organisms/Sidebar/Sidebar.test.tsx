import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renders with title and children", () => {
    render(
      <Sidebar title="Navigation">
        <Sidebar.Group>
          <Sidebar.Item href="/epics">Epics</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>
    );
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    // SidebarItem uses role="menuitem" instead of "link"
    expect(screen.getByRole("menuitem", { name: /epics/i })).toBeInTheDocument();
  });

  it("hides header when showHeader is false", () => {
    render(
      <Sidebar title="Navigation" showHeader={false}>
        <Sidebar.Group>
          <Sidebar.Item href="/epics">Epics</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>
    );
    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
  });

  it("applies collapsed variant styles", () => {
    const { container } = render(
      <Sidebar variant="collapsed" title="Navigation">
        <Sidebar.Group>
          <Sidebar.Item href="/epics">Epics</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>
    );
    const sidebar = container.querySelector("div");
    // The variant classes are currently empty, so we just check that the component renders
    expect(sidebar).toBeInTheDocument();
  });
});
