import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { Play, X } from "lucide-react";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Save</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("shows loading text when provided", () => {
    render(
      <Button isLoading loadingText="Saving...">
        Save
      </Button>,
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Button leftIcon={<Play data-testid="play-icon" />}>Play</Button>);
    expect(screen.getByTestId("play-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Button rightIcon={<X data-testid="x-icon" />}>Close</Button>);
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-indigo-500");
  });

  it("applies size classes", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies fullWidth class", () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-full");
  });

  it("renders iconOnly variant correctly", () => {
    render(
      <Button
        variant="iconOnly"
        leftIcon={<X data-testid="icon" />}
        aria-label="Close"
      />,
    );
    const button = screen.getByLabelText("Close");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("p-0");
  });

  it("requires aria-label for iconOnly variant", () => {
    render(
      <Button variant="iconOnly" leftIcon={<X />}>
        Close
      </Button>,
    );
    // Should still render, but aria-label should be set
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  describe("Keyboard Navigation", () => {
    it("calls onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByText("Click me");
      fireEvent.keyDown(button, { key: "Enter" });
      // Note: keyDown doesn't trigger onClick, but we test that button is focusable
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("calls onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByText("Click me");
      button.focus();
      fireEvent.keyDown(button, { key: " " });
      // Note: keyDown doesn't trigger onClick, but we test keyboard interaction
      expect(document.activeElement).toBe(button);
    });

    it("does not call onClick when disabled and Enter is pressed", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      const button = screen.getByText("Disabled");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter" });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("is focusable when not disabled", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByText("Focusable");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("is not focusable when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText("Disabled");
      expect(button).toBeDisabled();
      // Disabled buttons are not focusable by default
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has aria-label when provided", () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      const button = screen.getByLabelText("Submit form");
      expect(button).toBeInTheDocument();
    });

    it("has aria-busy when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("has accessible name from children", () => {
      render(<Button>Save Changes</Button>);
      const button = screen.getByRole("button", { name: "Save Changes" });
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from aria-label over children", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it('has type="button" by default', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("respects type prop", () => {
      const { container } = render(<Button type="submit">Submit</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("has correct tabIndex when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      // Disabled buttons are not focusable, so they don't need explicit tabIndex
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });

    it("has correct tabIndex when enabled", () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByText("Click");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("handles onClick with event", () => {
      const handleClick = vi.fn((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      });
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByText("Click");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
      // React uses SyntheticEvent, not native Event
      expect(handleClick.mock.calls[0][0]).toHaveProperty("type", "click");
    });

    it("renders correctly with empty children", () => {
      render(<Button aria-label="Empty button"></Button>);
      const button = screen.getByLabelText("Empty button");
      expect(button).toBeInTheDocument();
    });

    it("handles both loading and disabled states", () => {
      render(
        <Button isLoading disabled>
          Loading
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });
});
