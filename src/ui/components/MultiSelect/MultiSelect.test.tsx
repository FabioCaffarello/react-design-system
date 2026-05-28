import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MultiSelect from "./MultiSelect";

const mockOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

describe("MultiSelect", () => {
  it("renders input", () => {
    render(<MultiSelect options={mockOptions} />);
    expect(
      screen.getByPlaceholderText("Select options..."),
    ).toBeInTheDocument();
  });

  it("shows selected options as chips", async () => {
    render(<MultiSelect options={mockOptions} defaultValue={["1", "2"]} />);
    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  it("adds option when clicked", async () => {
    const handleChange = vi.fn();
    render(<MultiSelect options={mockOptions} onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Select options...");

    fireEvent.change(input, { target: { value: "Option" } });

    await waitFor(() => {
      const option = screen.getByText("Option 1");
      fireEvent.click(option);
      expect(handleChange).toHaveBeenCalledWith(["1"]);
    });
  });

  it("removes option when chip is removed", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        options={mockOptions}
        defaultValue={["1"]}
        onChange={handleChange}
      />,
    );

    await waitFor(() => {
      const removeButton = screen.getByLabelText(/Remove Option 1/i);
      fireEvent.click(removeButton);
      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });
});
