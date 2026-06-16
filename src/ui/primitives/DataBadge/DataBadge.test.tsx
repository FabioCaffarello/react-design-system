/**
 * DataBadge behavior tests — label/source rendering, tone & size variants,
 * icon, and prop pass-through. A11y contract lives in
 * DataBadge.accessibility.test.tsx. Coverage floor: 80%.
 */

import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DataBadge from "./DataBadge";

function rootOf(container: HTMLElement): HTMLElement {
  return container.firstChild as HTMLElement;
}

describe("DataBadge", () => {
  describe("rendering", () => {
    it("renders the label", () => {
      render(<DataBadge label="L2" />);
      expect(screen.getByText("L2")).toBeInTheDocument();
    });

    it("renders the source sub-label when provided, with a decorative separator", () => {
      render(<DataBadge label="L2" source="Portal Transparência" />);
      expect(screen.getByText("Portal Transparência")).toBeInTheDocument();
      const separator = screen.getByText("·");
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });

    it("omits the source and the separator when source is absent", () => {
      render(<DataBadge label="Aprovada" />);
      expect(screen.queryByText("·")).not.toBeInTheDocument();
    });

    it("omits the source block when source is an empty string", () => {
      render(<DataBadge label="Aprovada" source="" />);
      expect(screen.queryByText("·")).not.toBeInTheDocument();
    });

    it("renders a decorative leading icon (aria-hidden)", () => {
      render(<DataBadge label="L2" icon={<svg data-testid="badge-icon" />} />);
      const icon = screen.getByTestId("badge-icon");
      expect(icon).toBeInTheDocument();
      expect(icon.closest("[aria-hidden='true']")).not.toBeNull();
    });
  });

  describe("tone", () => {
    it("defaults to the neutral tone", () => {
      const { container } = render(<DataBadge label="L2" />);
      expect(rootOf(container)).toHaveClass(
        "bg-surface-muted",
        "text-fg-primary",
        "border-line-default",
      );
    });

    it.each([
      ["success", ["bg-success-bg", "text-success-dark", "border-success"]],
      ["warning", ["bg-warning-bg", "text-warning-dark", "border-warning"]],
      ["error", ["bg-error-bg", "text-error-dark", "border-error"]],
      ["info", ["bg-info-bg", "text-info-dark", "border-info"]],
      [
        "primary",
        [
          "bg-surface-brand-subtle",
          "text-fg-brand-emphasis",
          "border-line-brand",
        ],
      ],
      [
        "secondary",
        [
          "bg-surface-secondary-subtle",
          "text-fg-brand-secondary-emphasis",
          "border-line-secondary",
        ],
      ],
    ] as const)("applies the %s tone classes", (tone, classes) => {
      const { container } = render(<DataBadge label="x" tone={tone} />);
      expect(rootOf(container)).toHaveClass(...classes);
    });
  });

  describe("size", () => {
    it("applies md padding by default", () => {
      const { container } = render(<DataBadge label="L2" />);
      expect(rootOf(container)).toHaveClass("px-2");
    });

    it("applies sm padding when size='sm'", () => {
      const { container } = render(<DataBadge label="L2" size="sm" />);
      expect(rootOf(container)).toHaveClass("px-1.5");
    });
  });

  describe("props pass-through", () => {
    it("merges a custom className onto the root element", () => {
      const { container } = render(
        <DataBadge label="L2" className="custom-class" />,
      );
      expect(rootOf(container)).toHaveClass("custom-class");
    });

    it("spreads rest props onto the root element", () => {
      const { container } = render(<DataBadge label="L2" id="root-id" />);
      expect(rootOf(container)).toHaveAttribute("id", "root-id");
    });

    it("forwards its ref to the root span", () => {
      const ref = createRef<HTMLSpanElement>();
      render(<DataBadge label="L2" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });
});
