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

  it("keeps an option selectable through the mousedown→click sequence", async () => {
    // Regression: the list is portalled to document.body (outside the
    // container), so the document mousedown listener used to close it
    // before the option's click fired — losing the selection.
    const handleSelect = vi.fn();
    render(<Autocomplete options={mockOptions} onSelect={handleSelect} />);
    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    const option = await screen.findByText("Option 1");
    fireEvent.mouseDown(option);
    fireEvent.click(option);

    expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
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
      const input = screen.getByRole("combobox", { name: "Fruit" });
      expect(input).toBeInTheDocument();
      const label = screen.getByText("Fruit");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", input.id);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("aria-label prop sets the input's invisible name", () => {
      render(<Autocomplete aria-label="Fruit" options={mockOptions} />);
      const input = screen.getByRole("combobox", { name: "Fruit" });
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

  describe("Form-native integration (name/form, #225)", () => {
    it("renders no hidden field when `name` is absent", () => {
      const { container } = render(
        <Autocomplete aria-label="Tema" options={mockOptions} />,
      );
      expect(
        container.querySelector('input[type="hidden"]'),
      ).not.toBeInTheDocument();
    });

    it("renders a hidden field carrying the controlled value (not the label)", () => {
      const { container } = render(
        <Autocomplete
          aria-label="Tema"
          name="tema"
          form="filtros"
          value="2"
          options={mockOptions}
        />,
      );
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).toHaveAttribute("name", "tema");
      expect(hidden).toHaveAttribute("form", "filtros");
      // The option VALUE "2", NOT the visible label "Option 2".
      expect(hidden).toHaveValue("2");
    });

    it("starts empty before any selection (uncontrolled)", () => {
      const { container } = render(
        <Autocomplete aria-label="Tema" name="tema" options={mockOptions} />,
      );
      expect(container.querySelector('input[type="hidden"]')).toHaveValue("");
    });

    it("syncs the hidden field to the selected option VALUE on select", async () => {
      const { container } = render(
        <Autocomplete aria-label="Tema" name="tema" options={mockOptions} />,
      );
      const input = screen.getByRole("combobox");
      fireEvent.focus(input);
      const option = await screen.findByText("Option 2");
      fireEvent.mouseDown(option);
      fireEvent.click(option);

      const hidden = container.querySelector('input[type="hidden"]');
      // Hidden field carries the value for native form submit; the visible
      // input shows the human-readable label.
      await waitFor(() => expect(hidden).toHaveValue("2"));
      expect(input).toHaveValue("Option 2");
    });
  });
});
