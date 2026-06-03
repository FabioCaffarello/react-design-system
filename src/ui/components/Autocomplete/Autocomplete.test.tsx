import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Autocomplete from "./Autocomplete";

const mockOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

describe("Autocomplete", () => {
  it("renders input", () => {
    render(<Autocomplete options={mockOptions} />);
    expect(
      screen.getByPlaceholderText("Type to search..."),
    ).toBeInTheDocument();
  });

  it("shows options when typing", async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.change(input, { target: { value: "Option" } });

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  it("filters options based on input", async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.change(input, { target: { value: "1" } });

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    });
  });

  it("calls onSelect when option is clicked", async () => {
    const handleSelect = vi.fn();
    render(<Autocomplete options={mockOptions} onSelect={handleSelect} />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.change(input, { target: { value: "Option" } });

    await waitFor(() => {
      const option = screen.getByText("Option 1");
      fireEvent.click(option);
      expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  it("shows loading state", async () => {
    render(<Autocomplete options={mockOptions} loading />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("shows empty message when no options", async () => {
    render(<Autocomplete options={[]} emptyMessage="No results" />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("No results")).toBeInTheDocument();
    });
  });

  it("handles keyboard navigation", async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.change(input, { target: { value: "Option" } });

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(input).toHaveValue("Option 1");
    });
  });

  it("closes list on Escape", async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type to search...");

    fireEvent.change(input, { target: { value: "Option" } });

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Accessible name (aria-input-field-name)", () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it("label prop renders a visible label associated via htmlFor", () => {
      render(<Autocomplete label="Fruit" options={mockOptions} />);
      const input = screen.getByRole("textbox", { name: "Fruit" });
      expect(input).toBeInTheDocument();
      const label = screen.getByText("Fruit");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", input.id);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("aria-label prop sets the input's invisible name", () => {
      render(<Autocomplete aria-label="Fruit" options={mockOptions} />);
      const input = screen.getByRole("textbox", { name: "Fruit" });
      expect(input).toBeInTheDocument();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("aria-labelledby prop points at an external label id", () => {
      render(
        <>
          <span id="ext-label">Fruit</span>
          <Autocomplete aria-labelledby="ext-label" options={mockOptions} />
        </>,
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("external <label htmlFor={id}> matches the input id (auto-generated)", () => {
      const { container } = render(
        <>
          <label htmlFor="my-ac">Fruit</label>
          <Autocomplete id="my-ac" options={mockOptions} />
        </>,
      );
      const input = container.querySelector("input");
      expect(input?.id).toBe("my-ac");
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("warns in dev when no accessible-name source is provided", () => {
      render(<Autocomplete options={mockOptions} />);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[Autocomplete] Missing accessible name"),
      );
    });
  });
});
