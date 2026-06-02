import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render } from "@testing-library/react";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("renders children inside a flex div", () => {
    const { getByText, container } = render(
      <Stack>
        <p>one</p>
        <p>two</p>
      </Stack>,
    );
    expect(getByText("one")).toBeInTheDocument();
    expect(getByText("two")).toBeInTheDocument();
    expect(container.firstChild?.nodeName).toBe("DIV");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("defaults to a column with vertical gap", () => {
    const { container } = render(<Stack />);
    expect(container.firstChild).toHaveClass("flex-col");
    // getSpacingClass("base", "gap-y") → "gap-y-4"
    expect(container.firstChild).toHaveClass("gap-y-4");
  });

  it("switches to a row with horizontal gap when direction='row'", () => {
    const { container } = render(<Stack direction="row" />);
    expect(container.firstChild).toHaveClass("flex-row");
    // getSpacingClass("base", "gap-x") → "gap-x-4"
    expect(container.firstChild).toHaveClass("gap-x-4");
    expect(container.firstChild).not.toHaveClass("flex-col");
  });

  it("applies the spacing token to the gap axis", () => {
    const { container } = render(<Stack spacing="lg" />);
    // getSpacingClass("lg", "gap-y") → "gap-y-6"
    expect(container.firstChild).toHaveClass("gap-y-6");
  });

  it("applies each align variant", () => {
    const cases: Array<
      [Required<Parameters<typeof Stack>[0]>["align"], string]
    > = [
      ["start", "items-start"],
      ["center", "items-center"],
      ["end", "items-end"],
      ["stretch", "items-stretch"],
    ];
    for (const [align, cls] of cases) {
      const { container } = render(<Stack align={align} />);
      expect(container.firstChild).toHaveClass(cls);
    }
  });

  it("applies each justify variant", () => {
    const cases: Array<
      [Required<Parameters<typeof Stack>[0]>["justify"], string]
    > = [
      ["start", "justify-start"],
      ["center", "justify-center"],
      ["end", "justify-end"],
      ["between", "justify-between"],
      ["around", "justify-around"],
      ["evenly", "justify-evenly"],
    ];
    for (const [justify, cls] of cases) {
      const { container } = render(<Stack justify={justify} />);
      expect(container.firstChild).toHaveClass(cls);
    }
  });

  it("merges a custom className with the computed classes", () => {
    const { container } = render(
      <Stack className="custom-extra" align="center" />,
    );
    expect(container.firstChild).toHaveClass("custom-extra");
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("forwards ref to the underlying div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads arbitrary HTML attributes onto the root element", () => {
    const { container } = render(
      <Stack id="hero-stack" data-section="hero" role="group" />,
    );
    const el = container.firstChild as HTMLDivElement;
    expect(el).toHaveAttribute("id", "hero-stack");
    expect(el).toHaveAttribute("data-section", "hero");
    expect(el).toHaveAttribute("role", "group");
  });
});
