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

describe("StatGroup", () => {
  describe("layout='grid' (default)", () => {
    it("renders grid layout with mobile=2 cols", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
          <Stat value="2" label="b" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("grid");
      expect(root.className).toContain("grid-cols-2");
    });

    it("cols=4 (default) → md:grid-cols-4", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("md:grid-cols-4");
    });

    it("cols=3 → md:grid-cols-3", () => {
      const { container } = render(
        <StatGroup cols={3}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("md:grid-cols-3");
      expect(root.className).not.toContain("md:grid-cols-4");
    });

    it("cols=2 → md:grid-cols-2 (mobile and desktop both 2-up)", () => {
      const { container } = render(
        <StatGroup cols={2}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("md:grid-cols-2");
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
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("flex");
      expect(root.className).not.toContain("grid-cols-2");
      expect(root.className).not.toContain("md:grid-cols");
    });

    it("ignores cols in strip layout (no md:grid-cols class)", () => {
      const { container } = render(
        <StatGroup layout="strip" cols={3}>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).not.toContain("md:grid-cols");
    });
  });

  describe("divider technique (1px)", () => {
    it("container carries bg-line-default for divider expose + gap-px", () => {
      const { container } = render(
        <StatGroup>
          <Stat value="1" label="a" />
        </StatGroup>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("bg-line-default");
      expect(root.className).toContain("gap-px");
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
});
