import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("renders with children", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with default variant", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "bg-surface-base",
      "rounded-lg",
      "border",
      "border-line-default",
    );
  });

  it("applies hover variant classes", () => {
    const { container } = render(<Card variant="hover">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "hover:shadow-md",
      "transition-shadow",
      "cursor-pointer",
    );
  });

  it("applies selected variant classes", () => {
    const { container } = render(<Card variant="selected">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("border-line-brand", "shadow-md");
  });

  it("applies medium padding by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-4");
  });

  it("applies small padding", () => {
    const { container } = render(<Card padding="small">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-1"); // xs spacing is p-1
  });

  it("applies large padding", () => {
    const { container } = render(<Card padding="large">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-6");
  });

  it("applies no padding", () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass("p-2", "p-4", "p-6");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });

  describe("ARIA interactivity (decoupled from variant=hover)", () => {
    // `variant="hover"` is a visual hover style only — NOT an ARIA
    // interactivity signal. The previous coupling (`isInteractive =
    // onClick || variant === "hover"`) made hover cards `role="button"
    // tabindex=0` even when the consumer composed real Buttons inside,
    // triggering axe `nested-interactive`. The fix below ties role/
    // tabindex to `onClick` only. Re-coupling regresses the violation;
    // these tests guard against that.

    it("variant=hover WITHOUT onClick has no role and no tabIndex", () => {
      const { container } = render(<Card variant="hover">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute("role");
      expect(card).not.toHaveAttribute("tabIndex");
    });

    it("variant=hover WITH onClick has role=button + tabindex=0", () => {
      const { container } = render(
        <Card variant="hover" onClick={() => {}} aria-label="Clickable">
          Content
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    it("variant=default WITH onClick still gets role=button + tabindex=0", () => {
      const { container } = render(
        <Card onClick={() => {}} aria-label="Clickable">
          Content
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });
  });
});
