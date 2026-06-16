import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import InputBase from "./InputBase";
import { Mail, Search } from "lucide-react";

describe("InputBase", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders an input", () => {
    render(<InputBase placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("associates the label with the input via htmlFor + id", () => {
    render(<InputBase id="email" label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "email");
  });

  it("does NOT auto-generate an id (server-safe: no useId)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<InputBase placeholder="no id" />);
    expect(container.querySelector("input")).not.toHaveAttribute("id");
    warn.mockRestore();
  });

  it("dev-warns when a label is provided without an id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<InputBase label="Orphan" />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "[InputBase] `label` was provided without an `id`",
      ),
    );
  });

  it("does not warn when label is paired with an id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<InputBase id="ok" label="Fine" />);
    expect(warn).not.toHaveBeenCalled();
  });

  it("reflects the error state (aria-invalid + helper + describedby)", () => {
    render(<InputBase id="f" error helperText="Required field" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "f-error");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("wires aria-describedby to the helper id when not in error", () => {
    render(<InputBase id="f" helperText="Hint" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "f-helper",
    );
  });

  it("renders a decorative left icon", () => {
    render(<InputBase leftIcon={<Mail data-testid="mail" />} />);
    expect(screen.getByTestId("mail")).toBeInTheDocument();
  });

  it("renders a decorative rightIcon when no rightSlot is given", () => {
    render(<InputBase rightIcon={<Search data-testid="search" />} />);
    expect(screen.getByTestId("search")).toBeInTheDocument();
  });

  it("rightSlot takes precedence over rightIcon and renders raw (interactive)", () => {
    render(
      <InputBase
        rightIcon={<Search data-testid="search" />}
        rightSlot={<button type="button">go</button>}
      />,
    );
    // The interactive slot wins; the decorative icon is not rendered.
    expect(screen.getByRole("button", { name: "go" })).toBeInTheDocument();
    expect(screen.queryByTestId("search")).not.toBeInTheDocument();
  });

  it("applies size and variant classes to the input", () => {
    const { container } = render(<InputBase size="sm" variant="filled" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-8", "text-sm", "bg-surface-muted");
  });

  it("forwards native input attributes (name, type, required, maxLength)", () => {
    render(<InputBase id="q" name="q" type="email" required maxLength={10} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "q");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("forwards a ref to the input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<InputBase ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
