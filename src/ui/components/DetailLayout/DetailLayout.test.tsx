"use client";

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailLayout } from "./DetailLayout";

vi.mock("../../hooks/useScrollSpy", () => ({
  useScrollSpy: vi.fn(() => null),
}));

const sections = [
  {
    id: "votos",
    navLabel: "Votações",
    title: "Votações Recentes",
    subtitle: "Últimos 30 dias",
    content: <p>Conteúdo das votações</p>,
  },
  {
    id: "gastos",
    navLabel: "Gastos",
    content: <p>Conteúdo dos gastos</p>,
  },
  {
    id: "proposicoes",
    navLabel: "Proposições",
    title: "Proposições Apresentadas",
    content: <p>Conteúdo das proposições</p>,
  },
];

describe("DetailLayout", () => {
  it("renders section content", () => {
    render(<DetailLayout sections={sections} />);
    // Content appears in both mobile Accordion and desktop SectionCards
    const votacoesEls = screen.getAllByText("Conteúdo das votações");
    expect(votacoesEls.length).toBeGreaterThan(0);
  });

  it("renders breadcrumb slot when provided", () => {
    render(
      <DetailLayout
        sections={sections}
        breadcrumb={<nav aria-label="Breadcrumb">Home / Perfil</nav>}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("renders header slot when provided", () => {
    render(
      <DetailLayout sections={sections} header={<h1>Parlamentar Fulano</h1>} />,
    );
    expect(
      screen.getByRole("heading", { name: "Parlamentar Fulano" }),
    ).toBeInTheDocument();
  });

  it("renders stats slot when provided", () => {
    render(
      <DetailLayout
        sections={sections}
        stats={<div data-testid="stats-block">Stats</div>}
      />,
    );
    expect(screen.getByTestId("stats-block")).toBeInTheDocument();
  });

  it("renders SectionNav with navLabel items on desktop", () => {
    render(<DetailLayout sections={sections} navAriaLabel="Page sections" />);
    // SectionNav landmark is always in the DOM (hidden via CSS)
    const nav = screen.getByRole("navigation", { name: "Page sections" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Votações" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gastos" })).toBeInTheDocument();
  });

  it("passes stickyNavTop to SectionNav and SectionCard as scrollOffset", () => {
    render(<DetailLayout sections={sections} stickyNavTop="3.5rem" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveStyle({ top: "3.5rem" });
    // All SectionCard roots should have scrollMarginTop
    const sectionEls = screen.getAllByRole("region");
    sectionEls.forEach((el) => {
      expect(el).toHaveStyle({ scrollMarginTop: "3.5rem" });
    });
  });

  it("renders Accordion items with navLabel titles for mobile", () => {
    render(<DetailLayout sections={sections} />);
    // Accordion buttons are always rendered (mobile, CSS-hidden on desktop)
    const buttons = screen.getAllByRole("button");
    const labels = buttons.map((b) => b.textContent ?? "");
    expect(labels.some((l) => l.includes("Votações"))).toBe(true);
    expect(labels.some((l) => l.includes("Gastos"))).toBe(true);
  });

  it("defaults Accordion open to first section id", () => {
    // defaultOpen = ['votos'] — first section
    render(<DetailLayout sections={sections} />);
    // The first Accordion item should start expanded (aria-expanded="true")
    const buttons = screen.getAllByRole("button");
    const firstButton = buttons[0];
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
  });

  it("respects defaultOpenMobile override", () => {
    render(<DetailLayout sections={sections} defaultOpenMobile={["gastos"]} />);
    const buttons = screen.getAllByRole("button");
    const gastosButton = buttons.find((b) => b.textContent?.includes("Gastos"));
    expect(gastosButton).toHaveAttribute("aria-expanded", "true");
    const votacoesButton = buttons.find((b) =>
      b.textContent?.includes("Votações"),
    );
    expect(votacoesButton).toHaveAttribute("aria-expanded", "false");
  });

  it("uses title for SectionCard when provided (different from navLabel)", () => {
    render(<DetailLayout sections={sections} />);
    // SectionCard title for 'votos' should be 'Votações Recentes', not 'Votações'
    const cardHeadings = screen.getAllByRole("heading", {
      name: "Votações Recentes",
    });
    expect(cardHeadings.length).toBeGreaterThan(0);
  });

  it("falls back to navLabel for SectionCard title when title is omitted", () => {
    render(<DetailLayout sections={sections} />);
    const cardHeadings = screen.getAllByRole("heading", { name: "Gastos" });
    expect(cardHeadings.length).toBeGreaterThan(0);
  });

  it("wraps desktopGridIds content in a grid div", () => {
    const { container } = render(
      <DetailLayout sections={sections} desktopGridIds={["votos"]} />,
    );
    // The desktop panel for votos should have a grid-cols-2 wrapper inside its SectionCard
    const gridDivs = container.querySelectorAll(".grid-cols-2");
    expect(gridDivs.length).toBeGreaterThan(0);
  });

  it("does not wrap non-grid sections in a grid div", () => {
    const { container } = render(
      <DetailLayout sections={sections} desktopGridIds={["votos"]} />,
    );
    const sectionCards = container.querySelectorAll("section");
    // gastos and proposicoes should NOT have .grid-cols-2 inside them
    const gastos = Array.from(sectionCards).find((s) => s.id === "gastos");
    expect(gastos?.querySelector(".grid-cols-2")).toBeNull();
  });

  it("renders with empty sections without crashing", () => {
    render(<DetailLayout sections={[]} />);
    // Should still render a nav and the desktop/mobile containers
    expect(document.body).toBeTruthy();
  });

  it("applies custom className to root div", () => {
    const { container } = render(
      <DetailLayout sections={sections} className="my-layout" />,
    );
    expect(container.firstChild).toHaveClass("my-layout");
  });

  it("uses navAriaLabel for the SectionNav accessible name", () => {
    render(
      <DetailLayout sections={sections} navAriaLabel="Seções da página" />,
    );
    expect(
      screen.getByRole("navigation", { name: "Seções da página" }),
    ).toBeInTheDocument();
  });
});
