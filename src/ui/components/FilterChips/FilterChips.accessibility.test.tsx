/**
 * FilterChips Accessibility Tests
 *
 * Mirrors the four-section scaffold of Header.accessibility.test.tsx
 * (ARIA Labels and Roles / Keyboard Navigation / Focus Management /
 * Screen Reader Support). The defining a11y contract for FilterChips:
 *
 *   - The root is a `role="group"` so AT users perceive the chips as
 *     one named unit. The accessible name resolution ladder (explicit
 *     aria-label > string label reused > none) is the load-bearing
 *     contract — a group announced without a name is a region the user
 *     cannot identify, so the string-label reuse exists precisely to
 *     make the common `<FilterChips label="Filtros">` case named for
 *     free.
 *   - The label is plain neutral text, NOT a `<fieldset>`/`<legend>`
 *     pair — chips here are navigation/selection affordances, not form
 *     controls, and fieldset semantics would announce a form that does
 *     not exist.
 *   - The wrapper itself is presentation, not interaction. It carries
 *     no tabIndex and no handlers — keyboard operability lives in each
 *     `Chip` (or the consumer's `<Link>` via `asChild`), which must
 *     remain individually reachable through the group. The Keyboard
 *     Navigation / Focus Management sections assert that the wrapper
 *     adds no focus surface of its own and does not impede its
 *     children's — same discipline as Stat's a11y suite documents for
 *     a non-interactive component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterChips from "./FilterChips";
import Chip from "../../primitives/Chip/Chip";

describe("FilterChips Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("root exposes role='group'", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("string label gives the group its accessible name", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(
        screen.getByRole("group", { name: "Filtros" }),
      ).toBeInTheDocument();
    });

    it("explicit aria-label wins over the string label", () => {
      render(
        <FilterChips label="Filtros" aria-label="Filtros de parlamentares">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(
        screen.getByRole("group", { name: "Filtros de parlamentares" }),
      ).toBeInTheDocument();
      // The visible label text still renders — only the accessible name
      // is overridden.
      expect(screen.getByText("Filtros")).toBeInTheDocument();
    });

    it("non-string label → no derived aria-label (consumer must name the group)", () => {
      render(
        <FilterChips label={<em>Filtros</em>}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("aria-label");
    });

    it("label is NOT a legend — no fieldset/legend in the tree", () => {
      const { container } = render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(container.querySelector("fieldset")).not.toBeInTheDocument();
      expect(container.querySelector("legend")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("the wrapper itself has no keyboard surface (no tabIndex)", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("tabindex");
    });

    it("interactive chips inside the group remain Tab-reachable", async () => {
      const user = userEvent.setup();
      render(
        <FilterChips label="Filtros">
          <Chip asChild>
            <a href="?uf=SP">UF: SP</a>
          </Chip>
          <Chip asChild>
            <a href="?partido=PT">Partido: PT</a>
          </Chip>
        </FilterChips>,
      );
      await user.tab();
      expect(screen.getByRole("link", { name: "UF: SP" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: "Partido: PT" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("does not steal focus on mount", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(document.body).toHaveFocus();
    });

    it("non-interactive composition introduces zero focusable elements", () => {
      // Chips without onClick/onRemove render as static frames — the
      // group must not add focusability the chips don't have.
      const { container } = render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
          <Chip>Partido: PT</Chip>
        </FilterChips>,
      );
      const focusables = container.querySelectorAll(
        "a, button, [tabindex], input, textarea, select",
      );
      expect(focusables).toHaveLength(0);
    });
  });

  describe("Screen Reader Support", () => {
    it("source order is label first, then chips — regardless of wrap", () => {
      // wrap is a visual property (flex-wrap vs flex-nowrap); it MUST
      // NOT rearrange the DOM. An AT user reads label → chips in the
      // same sequence on both settings.
      const { rerender } = render(
        <FilterChips label="Filtros" wrap={true}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      const readOrder = () => {
        const label = screen.getByText("Filtros");
        const chip = screen.getByText("UF: SP");
        return Boolean(
          label.compareDocumentPosition(chip) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        );
      };
      expect(readOrder()).toBe(true);

      rerender(
        <FilterChips label="Filtros" wrap={false}>
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(readOrder()).toBe(true);
    });

    it("visible label text renders for AT users alongside the group name", () => {
      render(
        <FilterChips label="Filtros">
          <Chip>UF: SP</Chip>
        </FilterChips>,
      );
      expect(screen.getByText("Filtros")).toBeVisible();
    });
  });
});
