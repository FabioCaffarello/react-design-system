import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Separator from "./Separator";

describe("Separator", () => {
  describe("rendering", () => {
    it("renders correctly", () => {
      render(<Separator />);
      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
    });

    it("renders an <hr> element for the horizontal default", () => {
      render(<Separator />);
      expect(screen.getByRole("separator").tagName).toBe("HR");
    });

    it("renders a <div> for vertical separators (hr has no rotated semantic in HTML)", () => {
      render(<Separator orientation="vertical" />);
      expect(screen.getByRole("separator").tagName).toBe("DIV");
    });
  });

  describe("orientation", () => {
    it("renders horizontal separator by default", () => {
      render(<Separator />);
      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("renders vertical separator", () => {
      render(<Separator orientation="vertical" />);
      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("variants", () => {
    it("applies border-solid for variant=solid", () => {
      render(<Separator variant="solid" />);
      expect(screen.getByRole("separator")).toHaveClass("border-solid");
    });

    it("applies border-dashed for variant=dashed", () => {
      render(<Separator variant="dashed" />);
      expect(screen.getByRole("separator")).toHaveClass("border-dashed");
    });

    it("applies border-dotted for variant=dotted", () => {
      render(<Separator variant="dotted" />);
      expect(screen.getByRole("separator")).toHaveClass("border-dotted");
    });

    it("composes orientation and variant classes (vertical + dashed)", () => {
      render(<Separator orientation="vertical" variant="dashed" />);
      const sep = screen.getByRole("separator");
      expect(sep).toHaveClass("border-l");
      expect(sep).toHaveClass("border-dashed");
    });
  });

  describe("passthrough", () => {
    it("merges a custom className with the computed classes", () => {
      render(<Separator className="custom-divider" />);
      const sep = screen.getByRole("separator");
      expect(sep).toHaveClass("custom-divider");
      expect(sep).toHaveClass("border-t");
    });

    it("spreads arbitrary HTML attributes onto the root element", () => {
      render(<Separator id="hero-divider" data-section="header" />);
      const sep = screen.getByRole("separator");
      expect(sep).toHaveAttribute("id", "hero-divider");
      expect(sep).toHaveAttribute("data-section", "header");
    });
  });
});
