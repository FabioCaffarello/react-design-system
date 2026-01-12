import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders with default variant", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("h-4");
  });

  it("renders with card variant", () => {
    const { container } = render(<Skeleton variant="card" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("h-32");
  });

  it("renders multiple lines for text variant", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const lines = container.querySelectorAll(".animate-pulse");
    expect(lines.length).toBe(3);
  });

  it("applies custom width and height", () => {
    const { container } = render(
      <Skeleton width="100px" height="50px" />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe("100px");
    expect(skeleton.style.height).toBe("50px");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Skeleton className="custom-class" />
    );
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("custom-class");
  });
});
