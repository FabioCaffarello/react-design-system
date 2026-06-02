import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children inside a div", () => {
    const { getByText, container } = render(
      <Container>
        <p>hello</p>
      </Container>,
    );
    expect(getByText("hello")).toBeInTheDocument();
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies the default maxWidth (lg) when none is provided", () => {
    const { container } = render(<Container />);
    expect(container.firstChild).toHaveClass("max-w-screen-lg");
  });

  it("applies each maxWidth variant", () => {
    const cases: Array<
      [Required<Parameters<typeof Container>[0]>["maxWidth"], string]
    > = [
      ["sm", "max-w-screen-sm"],
      ["md", "max-w-screen-md"],
      ["lg", "max-w-screen-lg"],
      ["xl", "max-w-screen-xl"],
      ["2xl", "max-w-screen-2xl"],
      ["full", "max-w-full"],
    ];
    for (const [maxWidth, cls] of cases) {
      const { container } = render(<Container maxWidth={maxWidth} />);
      expect(container.firstChild).toHaveClass(cls);
    }
  });

  it("centers the container by default (mx-auto)", () => {
    const { container } = render(<Container />);
    expect(container.firstChild).toHaveClass("mx-auto");
  });

  it("omits mx-auto when center is false", () => {
    const { container } = render(<Container center={false} />);
    expect(container.firstChild).not.toHaveClass("mx-auto");
  });

  it("applies horizontal padding via paddingX", () => {
    const { container } = render(<Container paddingX="lg" />);
    // getSpacingClass("lg", "px") → "px-6"
    expect(container.firstChild).toHaveClass("px-6");
  });

  it("applies vertical padding via paddingY", () => {
    const { container } = render(<Container paddingY="sm" />);
    // getSpacingClass("sm", "py") → "py-2"
    expect(container.firstChild).toHaveClass("py-2");
  });

  it("merges a custom className with the computed classes", () => {
    const { container } = render(
      <Container className="custom-extra" maxWidth="md" />,
    );
    expect(container.firstChild).toHaveClass("custom-extra");
    expect(container.firstChild).toHaveClass("max-w-screen-md");
  });

  it("forwards ref to the underlying div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Container ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads arbitrary HTML attributes onto the root element", () => {
    const { container } = render(
      <Container id="hero" data-section="main" aria-label="page container" />,
    );
    const el = container.firstChild as HTMLDivElement;
    expect(el).toHaveAttribute("id", "hero");
    expect(el).toHaveAttribute("data-section", "main");
    expect(el).toHaveAttribute("aria-label", "page container");
  });
});
