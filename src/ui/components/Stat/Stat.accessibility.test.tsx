/**
 * Stat Accessibility Tests
 *
 * Mirrors the four-section scaffold of Header.accessibility.test.tsx
 * (ARIA Labels and Roles / Keyboard Navigation / Focus Management /
 * Screen Reader Support). The defining a11y contract for Stat:
 *
 *   - The em-dash empty-state placeholder must NOT be announced as
 *     "travessão" (em dash) by screen readers. The wrapper carries
 *     `aria-label="No data"`, which AT engines pronounce instead of the
 *     literal glyph. Axe does not flag bare "—" in text content, so this
 *     contract is enforced exclusively by the test below — the
 *     equivalent for a11y of the "prove the gate fails when it should"
 *     discipline from `.claude/rules/ci-gates.md`.
 *   - Reading order follows source order (icon → value → label → hint),
 *     regardless of `align` prop. `align` is a visual property
 *     (`text-left` / `text-center` and `items-start` / `items-center`);
 *     it MUST NOT rearrange the DOM. A screen-reader user navigating
 *     the document tree sees the same sequence whether the visual
 *     layout is centered or left-aligned.
 *   - Stat is presentation, not interaction. It carries no role, no
 *     tabIndex, no event handlers — there is no Keyboard Navigation
 *     or Focus Management surface to test affirmatively. The
 *     corresponding sections are present and explain the absence; this
 *     is the same discipline as Card's a11y suite (the Card non-
 *     interactive variant has the same "no role, no tab" contract).
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stat from "./Stat";

describe("Stat Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("empty value (null) → wrapper carries aria-label='No data'", () => {
      render(<Stat value={null} label="Alinhamento" />);
      const empty = screen.getByLabelText("No data");
      expect(empty).toBeInTheDocument();
      // The em-dash is the visible text — the aria-label overrides the
      // glyph pronunciation for AT users.
      expect(empty).toHaveTextContent("—");
    });

    it("empty value (undefined) → same aria-label contract", () => {
      render(<Stat value={undefined} label="Alinhamento" />);
      expect(screen.getByLabelText("No data")).toBeInTheDocument();
    });

    it("non-empty value (0) does NOT expose the 'No data' label", () => {
      // 0 is a legitimate metric value — empty-state semantics must not
      // mask it. Verifies the value !== null check, not value-falsy.
      render(<Stat value={0} label="Votos" />);
      expect(screen.queryByLabelText("No data")).not.toBeInTheDocument();
    });

    it("label is rendered as visible text adjacent to value", () => {
      // The visual label is the consumer's affordance; AT users read it
      // immediately after the value in source order, providing the
      // "what does this number mean" context.
      render(<Stat value="42" label="Votos" hint="no banco" />);
      const value = screen.getByText("42");
      const label = screen.getByText("Votos");
      const hint = screen.getByText("no banco");
      // value precedes label which precedes hint in document order.
      expect(
        value.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(
        label.compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("Stat as a whole has NO interactive role (no button, no link)", () => {
      render(<Stat value="42" label="Votos" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Stat has no keyboard interaction (non-interactive by design)", () => {
      render(<Stat value="42" label="Votos" />);
      const value = screen.getByText("42");
      // No focusable surface inside Stat. The closest container is the
      // root <div>, which carries no tabIndex.
      const root = value.parentElement;
      expect(root).not.toHaveAttribute("tabindex");
    });
  });

  describe("Focus Management", () => {
    it("Stat does not receive focus (no tabIndex on root)", () => {
      const { container } = render(<Stat value="42" label="Votos" />);
      const root = container.firstChild as HTMLElement;
      expect(root).not.toHaveAttribute("tabindex");
      // Confirm no inner element accidentally introduces focusability.
      const focusables = container.querySelectorAll(
        "a, button, [tabindex], input, textarea, select",
      );
      expect(focusables).toHaveLength(0);
    });
  });

  describe("Screen Reader Support", () => {
    it("source order (icon → value → label → hint) is preserved regardless of align", () => {
      // align='center' must not reverse or reorder the DOM — a
      // start-aligned Stat and a center-aligned Stat MUST read the same
      // to an AT user. Visual property only.
      const { container, rerender } = render(
        <Stat
          icon={<svg data-testid="ico" />}
          value="42"
          label="Votos"
          hint="contexto"
          align="start"
        />,
      );
      const orderStart = Array.from(
        container.querySelectorAll('[data-testid="ico"], span'),
      )
        .map(
          (el) =>
            (el as HTMLElement).getAttribute("data-testid") ||
            (el as HTMLElement).textContent,
        )
        .filter((t) => t !== "" && t != null);

      rerender(
        <Stat
          icon={<svg data-testid="ico" />}
          value="42"
          label="Votos"
          hint="contexto"
          align="center"
        />,
      );
      const orderCenter = Array.from(
        container.querySelectorAll('[data-testid="ico"], span'),
      )
        .map(
          (el) =>
            (el as HTMLElement).getAttribute("data-testid") ||
            (el as HTMLElement).textContent,
        )
        .filter((t) => t !== "" && t != null);

      expect(orderCenter).toEqual(orderStart);
      // Sanity-check the order itself: icon, then value, then label, then hint.
      expect(orderStart).toEqual(["ico", "42", "Votos", "contexto"]);
    });

    it("empty state in source order: '—' occupies the value slot", () => {
      // The em-dash placeholder sits in the same slot the value would,
      // so AT users encounter it between any icon and the label — the
      // semantic position is preserved.
      const { container } = render(
        <Stat
          icon={<svg data-testid="ico" />}
          value={null}
          label="Alinhamento"
        />,
      );
      const ordered = Array.from(
        container.querySelectorAll('[data-testid="ico"], span'),
      )
        .map((el) => {
          const ariaLabel = (el as HTMLElement).getAttribute("aria-label");
          if (ariaLabel === "No data") return "[empty]";
          return (
            (el as HTMLElement).getAttribute("data-testid") ||
            (el as HTMLElement).textContent
          );
        })
        .filter((t) => t !== "" && t != null);
      expect(ordered).toEqual(["ico", "[empty]", "Alinhamento"]);
    });
  });
});
