import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Textarea from "./Textarea";

describe("Textarea", () => {
  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter text..." />);
    const textarea = screen.getByPlaceholderText("Enter text...");
    expect(textarea).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<Textarea defaultValue="Default text" />);
    const textarea = screen.getByDisplayValue("Default text");
    expect(textarea).toBeInTheDocument();
  });

  it("applies error styling when error is true", () => {
    render(<Textarea error />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("border-error");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("applies resize-none class when resize is none", () => {
    render(<Textarea resize="none" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("resize-none");
  });

  it("applies resize-y class when resize is vertical", () => {
    render(<Textarea resize="vertical" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("resize-y");
  });

  it("has accessible attributes when error", () => {
    render(<Textarea error id="test-textarea" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "test-textarea-error");
  });

  it("respects rows prop", () => {
    render(<Textarea rows={10} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "10");
  });
});
