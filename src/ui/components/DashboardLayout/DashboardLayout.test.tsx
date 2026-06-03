import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "./DashboardLayout";

describe("DashboardLayout", () => {
  it("renders the main content inside a <main> landmark", () => {
    render(
      <DashboardLayout>
        <p>Dashboard body</p>
      </DashboardLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent("Dashboard body");
  });

  it("renders the optional header slot inside a <header> landmark when provided", () => {
    render(
      <DashboardLayout header={<span>Top bar</span>}>
        <p>Body</p>
      </DashboardLayout>,
    );

    const banner = screen.getByRole("banner");
    expect(banner).toHaveTextContent("Top bar");
  });

  it("omits the <header> landmark when no header prop is passed", () => {
    render(
      <DashboardLayout>
        <p>Body</p>
      </DashboardLayout>,
    );

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });

  it("renders the optional footer slot inside a <footer> landmark when provided", () => {
    render(
      <DashboardLayout footer={<span>Footer copy</span>}>
        <p>Body</p>
      </DashboardLayout>,
    );

    const contentinfo = screen.getByRole("contentinfo");
    expect(contentinfo).toHaveTextContent("Footer copy");
  });

  it("omits the <footer> landmark when no footer prop is passed", () => {
    render(
      <DashboardLayout>
        <p>Body</p>
      </DashboardLayout>,
    );

    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });

  it("renders the sidebar wrapped in a SideNavbar complementary landmark when provided", () => {
    render(
      <DashboardLayout sidebar={<span>Sidebar content</span>}>
        <p>Body</p>
      </DashboardLayout>,
    );

    // SideNavbar exposes an <aside> with role=complementary; the
    // visible sidebar content text appears inside it.
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("omits the SideNavbar wrapper when no sidebar prop is provided", () => {
    render(
      <DashboardLayout>
        <p>Body</p>
      </DashboardLayout>,
    );

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});
