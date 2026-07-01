"use client";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionNav } from "./SectionNav";
import { FileText, Wallet } from "lucide-react";

// useScrollSpy relies on IntersectionObserver which is not in jsdom.
// Mock the hook so unit tests focus on rendering / class logic.
vi.mock("../../hooks/useScrollSpy", () => ({
  useScrollSpy: vi.fn(() => null),
}));

import { useScrollSpy } from "../../hooks/useScrollSpy";
const mockUseScrollSpy = vi.mocked(useScrollSpy);

const baseItems = [
  { id: "votos", label: "Votações" },
  { id: "gastos", label: "Gastos" },
  { id: "proposicoes", label: "Proposições" },
];

describe("SectionNav", () => {
  beforeEach(() => {
    mockUseScrollSpy.mockReturnValue(null);
  });

  it("renders all items as anchor links", () => {
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    expect(screen.getByRole("link", { name: "Votações" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gastos" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Proposições" }),
    ).toBeInTheDocument();
  });

  it("href is the section id prefixed with #", () => {
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    const link = screen.getByRole("link", { name: "Votações" });
    expect(link).toHaveAttribute("href", "#votos");
  });

  it("renders as a <nav> landmark", () => {
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    expect(
      screen.getByRole("navigation", { name: "Page sections" }),
    ).toBeInTheDocument();
  });

  it("no link has aria-current when activeId is null", () => {
    mockUseScrollSpy.mockReturnValue(null);
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  it("marks the active link with aria-current=true", () => {
    mockUseScrollSpy.mockReturnValue("gastos");
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    expect(screen.getByRole("link", { name: "Gastos" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Votações" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("applies active styles to the active link", () => {
    mockUseScrollSpy.mockReturnValue("votos");
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    const active = screen.getByRole("link", { name: "Votações" });
    expect(active).toHaveClass(
      "bg-surface-brand-muted",
      "text-fg-brand-emphasis",
    );
  });

  it("applies inactive styles to non-active links", () => {
    mockUseScrollSpy.mockReturnValue("votos");
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    const inactive = screen.getByRole("link", { name: "Gastos" });
    expect(inactive).toHaveClass("text-fg-secondary");
  });

  it("renders icons when provided", () => {
    const itemsWithIcons = [
      {
        id: "votos",
        label: "Votações",
        icon: <FileText data-testid="icon-votos" aria-hidden="true" />,
      },
      {
        id: "gastos",
        label: "Gastos",
        icon: <Wallet data-testid="icon-gastos" aria-hidden="true" />,
      },
    ];
    render(<SectionNav items={itemsWithIcons} aria-label="Page sections" />);
    expect(screen.getByTestId("icon-votos")).toBeInTheDocument();
    expect(screen.getByTestId("icon-gastos")).toBeInTheDocument();
  });

  it("passes stickyTop as inline style top", () => {
    render(
      <SectionNav
        items={baseItems}
        aria-label="Page sections"
        stickyTop="3.5rem"
      />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveStyle({ top: "3.5rem" });
  });

  it("defaults stickyTop to 0", () => {
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveStyle({ top: "0" });
  });

  it("forwards rootMargin to useScrollSpy", () => {
    render(
      <SectionNav
        items={baseItems}
        aria-label="Page sections"
        rootMargin="-56px 0px -50% 0px"
      />,
    );
    expect(mockUseScrollSpy).toHaveBeenCalledWith(
      ["votos", "gastos", "proposicoes"],
      { rootMargin: "-56px 0px -50% 0px" },
    );
  });

  it("passes undefined options to useScrollSpy when rootMargin is omitted", () => {
    render(<SectionNav items={baseItems} aria-label="Page sections" />);
    expect(mockUseScrollSpy).toHaveBeenCalledWith(
      ["votos", "gastos", "proposicoes"],
      undefined,
    );
  });

  it("uses a custom linkComponent when provided", () => {
    const CustomLink = ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children: React.ReactNode;
      [k: string]: unknown;
    }) => (
      <a href={href} data-custom="true" {...rest}>
        {children}
      </a>
    );

    render(
      <SectionNav
        items={[{ id: "votos", label: "Votações" }]}
        aria-label="Page sections"
        linkComponent={CustomLink}
      />,
    );
    const link = screen.getByRole("link", { name: "Votações" });
    expect(link).toHaveAttribute("data-custom", "true");
  });

  it("renders empty items list without crashing", () => {
    render(<SectionNav items={[]} aria-label="Page sections" />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("applies custom className to nav", () => {
    render(
      <SectionNav
        items={baseItems}
        aria-label="Page sections"
        className="my-nav-class"
      />,
    );
    expect(screen.getByRole("navigation")).toHaveClass("my-nav-class");
  });

  it("merges custom style with stickyTop", () => {
    render(
      <SectionNav
        items={baseItems}
        aria-label="Page sections"
        stickyTop="56px"
        style={{ width: "200px" }}
      />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveStyle({ top: "56px", width: "200px" });
  });
});
