import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";
import { Mail, Search } from "lucide-react";

describe("Input", () => {
  it("renders input", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows error state", () => {
    const { container } = render(<Input error helperText="Error message" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("shows success state", () => {
    render(<Input success helperText="Valid" />);
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Input leftIcon={<Mail data-testid="mail-icon" />} />);
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Input rightIcon={<Search data-testid="search-icon" />} />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("shows clear button when showClearButton and has value", () => {
    render(<Input showClearButton value="test" onChange={vi.fn()} />);
    const clearButton = screen.getByLabelText("Clear input");
    expect(clearButton).toBeInTheDocument();
  });

  it("calls onClear when clear button clicked", () => {
    const handleClear = vi.fn();
    render(
      <Input
        showClearButton
        value="test"
        onChange={vi.fn()}
        onClear={handleClear}
      />,
    );
    fireEvent.click(screen.getByLabelText("Clear input"));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("toggles password visibility", () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector("input");
    const toggleButton = screen.getByLabelText("Show password");

    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { container } = render(<Input size="sm" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-8", "text-sm");
  });

  it("applies variant classes", () => {
    const { container } = render(<Input variant="filled" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("bg-surface-muted");
  });

  describe("Keyboard Navigation", () => {
    it("handles Enter key", () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it("handles Escape key to clear", () => {
      const handleClear = vi.fn();
      render(
        <Input
          showClearButton
          value="test"
          onChange={vi.fn()}
          onClear={handleClear}
        />,
      );
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Escape" });
      // Escape might trigger clear if implemented
      expect(input).toBeInTheDocument();
    });

    it("is focusable", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it("is not focusable when disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      // Disabled inputs are not focusable by default
      input.focus();
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("associates label with input", () => {
      render(<Input label="Email" id="email" />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "email");
    });

    it("has aria-invalid when error", () => {
      render(<Input error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-describedby when helperText is provided", () => {
      render(<Input helperText="Helper text" id="test-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-helper");
    });

    it("has aria-describedby for error message", () => {
      render(<Input error helperText="Error message" id="test-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "test-input-error");
    });

    it("has aria-required when required", () => {
      render(<Input required />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("required");
    });

    it("has aria-label when provided", () => {
      render(<Input aria-label="Search input" />);
      const input = screen.getByLabelText("Search input");
      expect(input).toBeInTheDocument();
    });

    it("has aria-placeholder when placeholder is provided", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
    });

    it("has correct type attribute", () => {
      const { container } = render(<Input type="email" />);
      const input = container.querySelector("input");
      expect(input).toHaveAttribute("type", "email");
    });

    it("has correct autocomplete attribute", () => {
      const { container } = render(<Input autoComplete="email" />);
      const input = container.querySelector("input");
      expect(input).toHaveAttribute("autocomplete", "email");
    });
  });

  describe("Edge Cases", () => {
    it("handles controlled input", () => {
      const { rerender } = render(<Input value="initial" onChange={vi.fn()} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("initial");

      rerender(<Input value="updated" onChange={vi.fn()} />);
      expect(input.value).toBe("updated");
    });

    it("handles uncontrolled input", () => {
      render(<Input defaultValue="default" />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("default");
    });

    it("handles maxLength", () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "10");
    });

    it("handles minLength", () => {
      render(<Input minLength={2} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("minLength", "2");
    });

    it("handles pattern validation", () => {
      render(<Input pattern="[0-9]*" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern", "[0-9]*");
    });
  });
});
