import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommandPalette from "./CommandPalette";

const mockItems = [
  { id: "1", label: "New File", action: vi.fn() },
  { id: "2", label: "Save", action: vi.fn() },
  { id: "3", label: "Open", action: vi.fn() },
];

describe("CommandPalette", () => {
  it("renders trigger when provided", () => {
    render(
      <CommandPalette items={mockItems} trigger={<button>Open</button>} />,
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    render(
      <CommandPalette items={mockItems} trigger={<button>Open</button>} />,
    );

    const trigger = screen.getByText("Open");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Type a command/i),
      ).toBeInTheDocument();
    });
  });

  it("filters items based on search query", async () => {
    render(<CommandPalette items={mockItems} open />);

    const input = screen.getByPlaceholderText(/Type a command/i);
    fireEvent.change(input, { target: { value: "Save" } });

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.queryByText("New File")).not.toBeInTheDocument();
    });
  });

  it("handles keyboard navigation", async () => {
    render(<CommandPalette items={mockItems} open />);

    const input = screen.getByPlaceholderText(/Type a command/i);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockItems[1].action).toHaveBeenCalled();
  });

  it("closes on Escape key", async () => {
    const handleOpenChange = vi.fn();
    render(
      <CommandPalette items={mockItems} open onOpenChange={handleOpenChange} />,
    );

    const input = screen.getByPlaceholderText(/Type a command/i);
    fireEvent.keyDown(input, { key: "Escape" });

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
