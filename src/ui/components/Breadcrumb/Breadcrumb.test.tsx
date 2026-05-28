import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders breadcrumb items", () => {
    render(
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Epics" }]} />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Epics")).toBeInTheDocument();
  });

  it("has aria-label", () => {
    const { container } = render(<Breadcrumb items={[{ label: "Home" }]} />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("renders last item as current page", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
      />,
    );
    const current = screen.getByText("Current");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("renders links for non-last items with href", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
      />,
    );
    const link = screen.getByText("Home");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders separator between items", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Epics", href: "/epics" },
          { label: "Current" },
        ]}
      />,
    );
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBe(2);
  });

  it("uses custom separator", () => {
    const { container } = render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Current" }]}
        separator="›"
      />,
    );
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator?.textContent).toBe("›");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Breadcrumb items={[{ label: "Home" }]} className="custom-class" />,
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("custom-class");
  });
});
