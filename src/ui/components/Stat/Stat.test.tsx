import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stat from "./Stat";
import { StatGroup } from "./StatGroup";

describe("Stat", () => {
  describe("rendering", () => {
    it("renders value, label, and hint", () => {
      render(<Stat value="9,4 mil" label="Parlamentares" hint="no banco" />);
      expect(screen.getByText("9,4 mil")).toBeInTheDocument();
      expect(screen.getByText("Parlamentares")).toBeInTheDocument();
      expect(screen.getByText("no banco")).toBeInTheDocument();
    });

    it("renders icon when provided", () => {
      render(
        <Stat icon={<svg data-testid="ico" />} value="42" label="Votos" />,
      );
      expect(screen.getByTestId("ico")).toBeInTheDocument();
    });

    it("does NOT render hint wrapper when hint is absent", () => {
      const { container } = render(<Stat value="42" label="Votos" />);
      // Only icon, value, label slots — no hint span.
      const spans = container.querySelectorAll("span");
      // Without icon and without hint: value + label = 2 spans.
      expect(spans).toHaveLength(2);
    });
  });

  describe("empty state (null/undefined → '—', other falsy values legitimate)", () => {
    it("null → renders em-dash with aria-label 'No data'", () => {
      render(<Stat value={null} label="Alinhamento" />);
      const empty = screen.getByLabelText("No data");
      expect(empty).toHaveTextContent("—");
      // The label is still readable separately.
      expect(screen.getByText("Alinhamento")).toBeInTheDocument();
    });

    it("undefined → renders em-dash with aria-label 'No data'", () => {
      render(<Stat value={undefined} label="Alinhamento" />);
      const empty = screen.getByLabelText("No data");
      expect(empty).toHaveTextContent("—");
    });

    it("0 is a legitimate value — NOT empty", () => {
      render(<Stat value={0} label="Votos" />);
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.queryByLabelText("No data")).not.toBeInTheDocument();
    });

    it("empty string is a legitimate value — NOT empty", () => {
      const { container } = render(<Stat value="" label="Sem nome" />);
      // empty string doesn't render visible text, but the empty-state
      // branch must not fire — no aria-label "No data" must exist.
      expect(screen.queryByLabelText("No data")).not.toBeInTheDocument();
      // The value span exists (with empty content), confirming the
      // non-empty branch ran.
      expect(container.querySelectorAll("span").length).toBeGreaterThan(0);
    });

    it("false is a legitimate value — NOT empty", () => {
      // React renders `false` as nothing visually, but the empty-state
      // branch must not fire.
      render(<Stat value={false as unknown as React.ReactNode} label="Flag" />);
      expect(screen.queryByLabelText("No data")).not.toBeInTheDocument();
    });
  });

  describe("align prop", () => {
    it("default is start (items-start text-left)", () => {
      const { container } = render(<Stat value="42" label="Votos" />);
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("items-start");
      expect(root.className).toContain("text-left");
    });

    it("align=center applies items-center text-center", () => {
      const { container } = render(
        <Stat value="42" label="Votos" align="center" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("items-center");
      expect(root.className).toContain("text-center");
    });
  });

  describe("tone tints ONLY the hint (contract from JSDoc)", () => {
    it("default tone='neutral' → hint uses fg-tertiary", () => {
      render(<Stat value="42" label="Votos" hint="contexto" />);
      const hint = screen.getByText("contexto");
      expect(hint.className).toContain("text-fg-tertiary");
    });

    it("tone='success' → hint uses fg-success", () => {
      render(<Stat value="42" label="Votos" hint="+3%" tone="success" />);
      const hint = screen.getByText("+3%");
      expect(hint.className).toContain("text-fg-success");
    });

    it("tone='warning' → hint uses fg-warning", () => {
      render(<Stat value="42" label="Votos" hint="abaixo" tone="warning" />);
      const hint = screen.getByText("abaixo");
      expect(hint.className).toContain("text-fg-warning");
    });

    it("tone='error' → hint uses fg-error", () => {
      render(<Stat value="42" label="Votos" hint="crítico" tone="error" />);
      const hint = screen.getByText("crítico");
      expect(hint.className).toContain("text-fg-error");
    });

    it("tone does NOT change value's class (always fg-primary)", () => {
      render(<Stat value="42" label="Votos" hint="ok" tone="error" />);
      const value = screen.getByText("42");
      expect(value.className).toContain("text-fg-primary");
      expect(value.className).not.toContain("text-fg-error");
    });

    it("tone does NOT change label's class (always fg-secondary)", () => {
      render(<Stat value="42" label="Votos" hint="ok" tone="error" />);
      const label = screen.getByText("Votos");
      expect(label.className).toContain("text-fg-secondary");
      expect(label.className).not.toContain("text-fg-error");
    });
  });

  describe("forwards HTMLDivElement attrs", () => {
    it("accepts data-testid and className spread", () => {
      const { container } = render(
        <Stat
          value="42"
          label="Votos"
          data-testid="stat"
          className="custom-class"
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("data-testid", "stat");
      expect(root.className).toContain("custom-class");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// StatGroup
//
// DOM structure (after the floatingBadge refactor):
//
//   <div class="relative [pt-4?]" {...props}>   ← outer wrapper (root)
//     [<div class="absolute …">…</div>]          ← badge (conditional)
//     <div class="bg-line-default …">             ← inner visual container
//       {children}
//     </div>
//   </div>
//
// Tests that inspect visual-container classes query the INNER div via
// `container.firstChild.lastChild` (always the inner container, regardless
// of whether the badge is rendered, since the badge is prepended and the
// inner container is always the last child).
// ─────────────────────────────────────────────────────────────────────────────

/** Helper: return the inner visual container (bg-line-default div). */
function getInnerContainer(container: HTMLElement): HTMLElement {
  const outer = container.firstChild as HTMLElement;
  // The inner container is always the last child of the outer wrapper.
  return outer.lastChild as HTMLElement;
}

describe("StatGroup", () => {
  describe("layout='grid' (default)", () => {
    it("renders grid layout with mobile=2 cols", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
          <Stat value="2" label="b" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("grid");
      expect(inner.className).toContain("grid-cols-2");
    });

    it("cols=4 (default) → md:grid-cols-4", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("md:grid-cols-4");
    });

    it("cols=3 → md:grid-cols-3", () => {
      const { container } = render(
        <StatGroup cols={3}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("md:grid-cols-3");
      expect(inner.className).not.toContain("md:grid-cols-4");
    });

    it("cols=2 → md:grid-cols-2 (mobile and desktop both 2-up)", () => {
      const { container } = render(
        <StatGroup cols={2}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("md:grid-cols-2");
    });
  });

  describe("layout='strip'", () => {
    it("renders flex layout (single row), NOT grid", () => {
      const { container } = render(
        <StatGroup layout="strip">
          <Stat value="1" label="a" />
          <Stat value="2" label="b" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("flex");
      expect(inner.className).not.toContain("grid-cols-2");
      expect(inner.className).not.toContain("md:grid-cols");
    });

    it("ignores cols in strip layout (no md:grid-cols class)", () => {
      const { container } = render(
        <StatGroup layout="strip" cols={3}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).not.toContain("md:grid-cols");
    });
  });

  describe("divider technique (1px)", () => {
    it("inner container carries bg-line-default for divider expose + gap-px", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const inner = getInnerContainer(container);
      expect(inner.className).toContain("bg-line-default");
      expect(inner.className).toContain("gap-px");
    });

    it("each Stat masks its own area with bg-surface-base", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" data-testid="s1" />
          <Stat value="2" label="b" data-testid="s2" />
        </StatGroup>,
      );
      const s1 = container.querySelector('[data-testid="s1"]') as HTMLElement;
      const s2 = container.querySelector('[data-testid="s2"]') as HTMLElement;
      expect(s1.className).toContain("bg-surface-base");
      expect(s2.className).toContain("bg-surface-base");
    });
  });

  describe("floatingBadge slot", () => {
    it("renders the badge node when floatingBadge is provided", () => {
      render(
        <StatGroup floatingBadge={<span>Fonte oficial</span>}>
          <Stat value="726" label="Parlam." />
        </StatGroup>,
      );
      expect(screen.getByText("Fonte oficial")).toBeInTheDocument();
    });

    it("does NOT render a badge wrapper when floatingBadge is absent", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="726" label="Parlam." />
        </StatGroup>,
      );
      const outer = container.firstChild as HTMLElement;
      // Without floatingBadge, the outer wrapper has exactly one child (inner container).
      expect(outer.childElementCount).toBe(1);
    });

    it("outer wrapper gains pt-4 (pt-base spacing) when floatingBadge is present", () => {
      const { container } = render(
        <StatGroup floatingBadge={<span>Badge</span>}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("pt-4");
    });

    it("outer wrapper does NOT gain pt-4 when floatingBadge is absent", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).not.toContain("pt-4");
    });

    it("badge wrapper is absolutely positioned (for overlay effect)", () => {
      render(
        <StatGroup floatingBadge={<span data-testid="badge">Fonte</span>}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const badge = screen.getByTestId("badge");
      const badgeWrapper = badge.parentElement as HTMLElement;
      expect(badgeWrapper.className).toContain("absolute");
      expect(badgeWrapper.className).toContain("-translate-y-1/2");
      expect(badgeWrapper.className).toContain("left-1/2");
      expect(badgeWrapper.className).toContain("-translate-x-1/2");
    });

    it("badge appears before stat content in DOM (correct AT reading order)", () => {
      render(
        <StatGroup floatingBadge={<span>Fonte oficial</span>}>
          <Stat value="726" label="Parlam." />
        </StatGroup>,
      );
      const badge = screen.getByText("Fonte oficial");
      const value = screen.getByText("726");
      // badge must appear BEFORE the stat value in document order.
      expect(
        badge.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("inner visual container is unaffected by floatingBadge (same classes)", () => {
      const { container: withBadge } = render(
        <StatGroup floatingBadge={<span>Badge</span>}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const { container: withoutBadge } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const innerWith = getInnerContainer(withBadge);
      const innerWithout = getInnerContainer(withoutBadge);
      expect(innerWith.className).toBe(innerWithout.className);
    });

    it("forwards props (data-testid, className) to the outer wrapper", () => {
      const { container } = render(
        <StatGroup
          floatingBadge={<span>Badge</span>}
          data-testid="stat-group"
          className="custom"
        >
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const outer = container.firstChild as HTMLElement;
      expect(outer).toHaveAttribute("data-testid", "stat-group");
      expect(outer.className).toContain("custom");
    });
  });

  describe("outer wrapper is always relative", () => {
    it("outer wrapper carries relative class (enables badge positioning)", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("relative");
    });
  });
});
