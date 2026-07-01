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
    content: <p>Conteúdo das votações</p>,
  },
  {
    id: "gastos",
    navLabel: "Gastos",
    content: <p>Conteúdo dos gastos</p>,
  },
];

describe("DetailLayout Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("SectionNav renders as a named navigation landmark", () => {
      render(
        <DetailLayout sections={sections} navAriaLabel="Seções da página" />,
      );
      expect(
        screen.getByRole("navigation", { name: "Seções da página" }),
      ).toBeInTheDocument();
    });

    it("desktop SectionCards render as named region landmarks", () => {
      render(<DetailLayout sections={sections} />);
      // Each SectionCard is a <section aria-labelledby="...">
      const regions = screen.getAllByRole("region");
      expect(regions.length).toBeGreaterThanOrEqual(sections.length);
      const regionNames = regions.map((r) => r.getAttribute("aria-labelledby"));
      expect(regionNames.some((id) => id?.includes("votos"))).toBe(true);
      expect(regionNames.some((id) => id?.includes("gastos"))).toBe(true);
    });

    it("SectionCard regions are named via their title headings", () => {
      render(<DetailLayout sections={sections} />);
      expect(
        screen.getAllByRole("region", { name: "Votações Recentes" }).length,
      ).toBeGreaterThan(0);
    });

    it("SectionNav links have correct anchor hrefs", () => {
      render(<DetailLayout sections={sections} navAriaLabel="Page sections" />);
      expect(screen.getByRole("link", { name: "Votações" })).toHaveAttribute(
        "href",
        "#votos",
      );
      expect(screen.getByRole("link", { name: "Gastos" })).toHaveAttribute(
        "href",
        "#gastos",
      );
    });

    it("Accordion triggers have aria-expanded", () => {
      render(<DetailLayout sections={sections} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("aria-expanded");
      });
    });

    it("breadcrumb slot is accessible when provided", () => {
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
  });

  describe("Keyboard Navigation", () => {
    it("SectionNav links are natively focusable", () => {
      render(<DetailLayout sections={sections} navAriaLabel="Page sections" />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.tagName).toBe("A");
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("Accordion triggers are keyboard-operable buttons", () => {
      render(<DetailLayout sections={sections} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn.tagName).toBe("BUTTON");
      });
    });
  });

  describe("Focus Management", () => {
    it("SectionCard ids are valid anchor targets for hash navigation", () => {
      const { container } = render(<DetailLayout sections={sections} />);
      const sectionEls = container.querySelectorAll("section");
      const ids = Array.from(sectionEls).map((s) => s.getAttribute("id"));
      expect(ids).toContain("votos");
      expect(ids).toContain("gastos");
    });

    it("scrollMarginTop is applied to SectionCards for sticky-nav offset", () => {
      render(<DetailLayout sections={sections} stickyNavTop="3.5rem" />);
      const regions = screen.getAllByRole("region");
      regions.forEach((region) => {
        expect(region).toHaveStyle({ scrollMarginTop: "3.5rem" });
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("section headings are present for screen reader orientation", () => {
      render(<DetailLayout sections={sections} />);
      expect(
        screen.getAllByRole("heading", { name: "Votações Recentes" }).length,
      ).toBeGreaterThan(0);
      // 'Gastos' falls back to navLabel as heading
      expect(
        screen.getAllByRole("heading", { name: "Gastos" }).length,
      ).toBeGreaterThan(0);
    });

    it("mobile Accordion and desktop SectionCards both contain section content", () => {
      render(<DetailLayout sections={sections} />);
      // Content should appear in both (Accordion hidden via CSS on desktop,
      // desktop cards hidden via CSS on mobile — both in the DOM for AT).
      const contentEls = screen.getAllByText("Conteúdo das votações");
      expect(contentEls.length).toBeGreaterThanOrEqual(2);
    });

    it("renders with empty sections without invalid landmarks", () => {
      render(<DetailLayout sections={[]} navAriaLabel="Page sections" />);
      const nav = screen.getByRole("navigation", { name: "Page sections" });
      expect(nav).toBeInTheDocument();
      expect(screen.queryAllByRole("region")).toHaveLength(0);
    });
  });
});
