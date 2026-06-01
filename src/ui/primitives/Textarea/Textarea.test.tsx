import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Textarea from "./Textarea";

describe("Textarea", () => {
  it("renders with placeholder", () => {
    render(<Textarea aria-label="Notes" placeholder="Enter text..." />);
    const textarea = screen.getByPlaceholderText("Enter text...");
    expect(textarea).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<Textarea aria-label="Notes" defaultValue="Default text" />);
    const textarea = screen.getByDisplayValue("Default text");
    expect(textarea).toBeInTheDocument();
  });

  it("applies error styling when error is true", () => {
    render(<Textarea aria-label="Notes" error />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("border-error");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("applies custom className", () => {
    render(<Textarea aria-label="Notes" className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("applies resize-none class when resize is none", () => {
    render(<Textarea aria-label="Notes" resize="none" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("resize-none");
  });

  it("applies resize-y class when resize is vertical", () => {
    render(<Textarea aria-label="Notes" resize="vertical" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("resize-y");
  });

  it("has accessible attributes when error", () => {
    render(<Textarea aria-label="Notes" error id="test-textarea" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "test-textarea-error");
  });

  it("respects rows prop", () => {
    render(<Textarea aria-label="Notes" rows={10} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "10");
  });

  it("renders visible label associated via htmlFor when label prop is provided", () => {
    render(<Textarea label="Description" />);
    const textarea = screen.getByRole("textbox", { name: "Description" });
    expect(textarea).toBeInTheDocument();
    const labelEl = screen.getByText("Description");
    expect(labelEl.tagName).toBe("LABEL");
    expect(labelEl).toHaveAttribute("for", textarea.id);
  });

  it("does not wrap in a div when no label is provided (preserves bare textarea)", () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(container.firstChild?.nodeName).toBe("TEXTAREA");
  });

  describe("dev-only accessible-name warning", () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it("warns when no label, aria-label, aria-labelledby, or external label exists", () => {
      render(<Textarea />);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[Textarea] Missing accessible name"),
      );
    });

    it("does not warn when label prop is provided", () => {
      render(<Textarea label="Description" />);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-label is provided", () => {
      render(<Textarea aria-label="Notes" />);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(
        <>
          <span id="ext-label">Notes</span>
          <Textarea aria-labelledby="ext-label" />
        </>,
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when an external label[for=id] is present", () => {
      render(
        <>
          <label htmlFor="my-textarea">Notes</label>
          <Textarea id="my-textarea" />
        </>,
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
