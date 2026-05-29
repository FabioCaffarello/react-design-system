import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import Dot from "./Dot";

describe("Dot", () => {
  // Rendering Tests
  it("renders dot element correctly", () => {
    render(<Dot />);
    const dot = screen.getByRole("status");
    expect(dot).toBeInTheDocument();
  });

  it("renders with default props", () => {
    const { container } = render(<Dot />);
    const dot = container.querySelector("span");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("inline-block", "rounded-full");
    // Default variant is offline (neutral/gray) - uses DEFAULT shade (500)
    expect(dot).toHaveClass("bg-status-neutral");
    // Default size is md
    expect(dot).toHaveClass("w-2", "h-2");
  });

  // Variant Tests
  describe("Variants", () => {
    it("renders online variant with success/green color", () => {
      const { container } = render(<Dot variant="online" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-success");
    });

    it("renders offline variant with neutral/gray color", () => {
      const { container } = render(<Dot variant="offline" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-status-neutral");
    });

    it("renders pending variant with warning/yellow color", () => {
      const { container } = render(<Dot variant="pending" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-warning");
    });

    it("renders warning variant with warning/yellow color", () => {
      const { container } = render(<Dot variant="warning" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-warning");
    });

    it("renders error variant with error/red color", () => {
      const { container } = render(<Dot variant="error" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-error");
    });

    it("renders info variant with info/blue color", () => {
      const { container } = render(<Dot variant="info" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-info");
    });

    it("renders all variants correctly", () => {
      const variants: Array<
        "online" | "offline" | "pending" | "warning" | "error" | "info"
      > = ["online", "offline", "pending", "warning", "error", "info"];

      variants.forEach((variant) => {
        const { container } = render(<Dot variant={variant} />);
        const dot = container.querySelector("span");
        expect(dot).toBeInTheDocument();
        expect(dot).toHaveClass("inline-block", "rounded-full");
      });
    });
  });

  // Size Tests
  describe("Sizes", () => {
    it("renders sm size with correct dimensions", () => {
      const { container } = render(<Dot size="sm" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("w-1.5", "h-1.5");
    });

    it("renders md size with correct dimensions", () => {
      const { container } = render(<Dot size="md" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("w-2", "h-2");
    });

    it("renders lg size with correct dimensions", () => {
      const { container } = render(<Dot size="lg" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("w-2.5", "h-2.5");
    });

    it("renders all sizes correctly", () => {
      const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];

      sizes.forEach((size) => {
        const { container } = render(<Dot size={size} />);
        const dot = container.querySelector("span");
        expect(dot).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe("Accessibility", () => {
    it('has role="status"', () => {
      render(<Dot />);
      const dot = screen.getByRole("status");
      expect(dot).toBeInTheDocument();
    });

    it("uses explicit aria-label when provided", () => {
      render(<Dot aria-label="User is online" />);
      const dot = screen.getByLabelText("User is online");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for online variant", () => {
      render(<Dot variant="online" />);
      const dot = screen.getByLabelText("Online");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for offline variant", () => {
      render(<Dot variant="offline" />);
      const dot = screen.getByLabelText("Offline");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for pending variant", () => {
      render(<Dot variant="pending" />);
      const dot = screen.getByLabelText("Pending");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for warning variant", () => {
      render(<Dot variant="warning" />);
      const dot = screen.getByLabelText("Warning");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for error variant", () => {
      render(<Dot variant="error" />);
      const dot = screen.getByLabelText("Error");
      expect(dot).toBeInTheDocument();
    });

    it("has default aria-label for info variant", () => {
      render(<Dot variant="info" />);
      const dot = screen.getByLabelText("Info");
      expect(dot).toBeInTheDocument();
    });

    it("prefers explicit aria-label over default", () => {
      render(<Dot variant="online" aria-label="Custom status" />);
      const dot = screen.getByLabelText("Custom status");
      expect(dot).toBeInTheDocument();
      // Should not be found by default label
      expect(screen.queryByLabelText("Online")).not.toBeInTheDocument();
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles custom className", () => {
      const { container } = render(<Dot className="custom-class" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("custom-class");
      // Should still have base classes
      expect(dot).toHaveClass("inline-block", "rounded-full");
    });

    it("passes through HTML attributes", () => {
      render(<Dot data-testid="dot-test" id="dot-id" />);
      const dot = screen.getByTestId("dot-test");
      expect(dot).toHaveAttribute("id", "dot-id");
    });

    it("handles ref forwarding correctly", () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Dot ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveClass("inline-block", "rounded-full");
    });

    it("combines variant and size correctly", () => {
      const { container } = render(<Dot variant="error" size="lg" />);
      const dot = container.querySelector("span");
      expect(dot).toHaveClass("bg-error"); // error variant
      expect(dot).toHaveClass("w-2.5", "h-2.5"); // lg size
    });

    it("handles multiple custom attributes", () => {
      render(
        <Dot
          data-testid="multi-attr"
          data-custom="value"
          title="Tooltip text"
        />,
      );
      const dot = screen.getByTestId("multi-attr");
      expect(dot).toHaveAttribute("data-custom", "value");
      expect(dot).toHaveAttribute("title", "Tooltip text");
    });
  });
});
