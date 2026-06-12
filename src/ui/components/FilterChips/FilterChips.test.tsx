import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FilterChips from "./FilterChips";
import Chip from "../../primitives/Chip/Chip";

describe("FilterChips", () => {
  describe("rendering", () => {
    it("renders children chips", () => {
      render(
        <FilterChips>
          <Chip>UF: SP</Chip>
          <Chip>Partido: PT</Chip>
        </FilterChips>,
      );
      expect(screen.getByText("UF: SP")).toBeInTheDocument();
      expect(screen.getByText("Partido: PT")).toBeInTheDocument();
    });

    it("renders the label as neutral text when provided", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const label = screen.getByText("Filtros");
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("SPAN");
    });

    it("does NOT render a label slot when label is absent", () => {
      const { container } = render(
        <FilterChips>
          <span data-testid="only-child">child</span>
        </FilterChips>,
      );
      const root = container.firstChild as HTMLElement;
      // Only the child — no extra label span before it.
      expect(root.firstElementChild).toBe(screen.getByTestId("only-child"));
    });

    it("label is NOT rendered via fieldset/legend (no form implied)", () => {
      const { container } = render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(container.querySelector("fieldset")).not.toBeInTheDocument();
      expect(container.querySelector("legend")).not.toBeInTheDocument();
    });

    it("label renders before the chips in document order", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const label = screen.getByText("Filtros");
      const chip = screen.getByText("UF: SP");
      expect(
        label.compareDocumentPosition(chip) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("accepts a ReactNode label", () => {
      render(
        <FilterChips label={<em data-testid="node-label">Filtros</em>}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByTestId("node-label")).toBeInTheDocument();
    });
  });

  describe("role and aria-label", () => {
    it("root carries role='group'", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("string label doubles as the group's aria-label", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Filtros",
      );
    });

    it("non-string ReactNode label derives NO aria-label", () => {
      render(
        <FilterChips label={<em>Filtros</em>}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("aria-label");
    });

    it("absent label derives NO aria-label", () => {
      render(
        <FilterChips>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("aria-label");
    });

    it("consumer-passed aria-label overrides the derived one", () => {
      render(
        <FilterChips label="Filtros" aria-label="Filtros de parlamentares">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Filtros de parlamentares",
      );
    });
  });

  describe("wrap", () => {
    it("wrap defaults to true → flex-wrap", () => {
      render(
        <FilterChips>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const root = screen.getByRole("group");
      expect(root).toHaveClass("flex-wrap");
      expect(root).not.toHaveClass("flex-nowrap");
    });

    it("wrap={false} → flex-nowrap", () => {
      render(
        <FilterChips wrap={false}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const root = screen.getByRole("group");
      expect(root).toHaveClass("flex-nowrap");
      expect(root).not.toHaveClass("flex-wrap");
    });

    it("wrap={true} explicitly → flex-wrap", () => {
      render(
        <FilterChips wrap={true}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).toHaveClass("flex-wrap");
    });
  });

  describe("className and props passthrough", () => {
    it("merges consumer className with the base classes", () => {
      render(
        <FilterChips className="custom-class">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const root = screen.getByRole("group");
      expect(root).toHaveClass("custom-class");
      expect(root).toHaveClass("flex");
    });

    it("spreads extra div props onto the root", () => {
      render(
        <FilterChips data-testid="fc" id="filter-bar">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const root = screen.getByTestId("fc");
      expect(root).toHaveAttribute("id", "filter-bar");
      expect(root).toBe(screen.getByRole("group"));
    });
  });

  describe("composition with Chip", () => {
    it("composes with Chip asChild (anchor child)", () => {
      render(
        <FilterChips label="Filtros">
          <Chip asChild>
            <a href="?uf=SP">UF: SP</a>
          </Chip>
        </FilterChips>,
      );
      const link = screen.getByRole("link", { name: "UF: SP" });
      expect(link).toHaveAttribute("href", "?uf=SP");
      // The chip-link lives inside the group.
      expect(screen.getByRole("group")).toContainElement(link);
    });
  });
});
