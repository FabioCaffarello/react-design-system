import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionCard } from "./SectionCard";
import Badge from "../../primitives/Badge/Badge";
import { FileText } from "lucide-react";

describe("SectionCard Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a landmark region with the section title as accessible name", () => {
      render(
        <SectionCard id="gastos" title="Gastos CEAP">
          Content
        </SectionCard>,
      );
      const region = screen.getByRole("region", { name: "Gastos CEAP" });
      expect(region).toBeInTheDocument();
    });

    it("aria-labelledby points to the correct title element id", () => {
      const { container } = render(
        <SectionCard id="proposicoes" title="Proposições">
          Content
        </SectionCard>,
      );
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("aria-labelledby", "proposicoes-title");

      const heading = document.getElementById("proposicoes-title");
      expect(heading).toBeInTheDocument();
      expect(heading?.tagName).toMatch(/^H[1-6]$/);
    });

    it("section id and aria-labelledby title id are consistent", () => {
      const { container } = render(
        <SectionCard id="votos" title="Votações">
          Content
        </SectionCard>,
      );
      const section = container.querySelector("section");
      const labelledBy = section?.getAttribute("aria-labelledby");
      expect(labelledBy).toBe("votos-title");

      const titleEl = container.querySelector(`#${labelledBy}`);
      expect(titleEl).not.toBeNull();
    });

    it("icon in title carries aria-hidden to hide it from screen readers", () => {
      render(
        <SectionCard
          id="s1"
          title="Icon Section"
          icon={<FileText aria-hidden="true" data-testid="icon" />}
        >
          Content
        </SectionCard>,
      );
      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("multiple SectionCards produce distinct landmark regions", () => {
      render(
        <>
          <SectionCard id="sec-a" title="Section Alpha">
            A
          </SectionCard>
          <SectionCard id="sec-b" title="Section Beta">
            B
          </SectionCard>
        </>,
      );
      const alpha = screen.getByRole("region", { name: "Section Alpha" });
      const beta = screen.getByRole("region", { name: "Section Beta" });
      expect(alpha).toBeInTheDocument();
      expect(beta).toBeInTheDocument();
      expect(alpha).not.toBe(beta);
    });

    it("renders title as a heading (h2 by default)", () => {
      render(
        <SectionCard id="s1" title="Meaningful Title">
          Content
        </SectionCard>,
      );
      const heading = screen.getByRole("heading", { name: "Meaningful Title" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("subtitle is in the DOM and visible", () => {
      render(
        <SectionCard id="s1" title="Title" subtitle="Últimos 30 dias">
          Content
        </SectionCard>,
      );
      const subtitle = screen.getByText("Últimos 30 dias");
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toBeVisible();
    });

    it("renders without children without a11y regressions", () => {
      render(<SectionCard id="empty" title="Empty Section" />);
      expect(
        screen.getByRole("region", { name: "Empty Section" }),
      ).toBeInTheDocument();
    });

    it("badge is visible alongside the title", () => {
      render(
        <SectionCard
          id="s1"
          title="Title"
          badge={<Badge data-testid="badge">L1</Badge>}
        >
          Content
        </SectionCard>,
      );
      expect(screen.getByTestId("badge")).toBeInTheDocument();
      expect(screen.getByTestId("badge")).toBeVisible();
    });
  });

  describe("Keyboard Navigation", () => {
    it("SectionCard itself is not focusable (no tabindex, no button role)", () => {
      const { container } = render(
        <SectionCard id="s1" title="Non-interactive">
          Content
        </SectionCard>,
      );
      const section = container.querySelector("section");
      expect(section).not.toHaveAttribute("tabindex");
      expect(section).not.toHaveAttribute("role", "button");
    });

    it("interactive children inside the card are reachable", () => {
      render(
        <SectionCard id="s1" title="With Link">
          <a href="/detail">View detail</a>
        </SectionCard>,
      );
      expect(
        screen.getByRole("link", { name: "View detail" }),
      ).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("anchor id makes the element a valid scroll target", () => {
      const { container } = render(
        <SectionCard id="target-section" title="Target">
          Content
        </SectionCard>,
      );
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("id", "target-section");
    });

    it("scrollMarginTop does not add focusability to the section", () => {
      const { container } = render(
        <SectionCard id="s1" title="Offset Section" scrollOffset="4rem">
          Content
        </SectionCard>,
      );
      const section = container.querySelector("section");
      expect(section).toHaveStyle({ scrollMarginTop: "4rem" });
      expect(section).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("heading announces section identity for screen reader users", () => {
      render(
        <SectionCard id="s1" title="Seção de Votações">
          Content
        </SectionCard>,
      );
      const heading = screen.getByRole("heading", {
        name: "Seção de Votações",
      });
      expect(heading).toBeInTheDocument();
    });

    it("region landmark is announced with the correct name by AT", () => {
      render(
        <SectionCard id="s1" title="Named Region">
          Content
        </SectionCard>,
      );
      // getByRole with name verifies ARIA landmark + accessible name chain
      expect(
        screen.getByRole("region", { name: "Named Region" }),
      ).toBeInTheDocument();
    });
  });
});
