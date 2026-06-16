import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimePicker from "./TimePicker";

describe("TimePicker", () => {
  it("renders correctly", () => {
    render(<TimePicker />);
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("displays label when provided", () => {
    render(<TimePicker label="Select Time" />);
    expect(screen.getByText("Select Time")).toBeInTheDocument();
  });

  it("handles 24h format", () => {
    const handleChange = vi.fn();
    render(<TimePicker format="24h" onChange={handleChange} />);
    // TimePicker opens on click, but we can test the input
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("handles 12h format", () => {
    render(<TimePicker format="12h" />);
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<TimePicker disabled />);
    const input = screen.getByRole("combobox");
    expect(input).toBeDisabled();
  });

  it("displays error state", () => {
    render(<TimePicker error helperText="Invalid time" />);
    expect(screen.getByText("Invalid time")).toBeInTheDocument();
  });

  it("parses midnight (00:xx) in 24h format without coercing to noon", async () => {
    // Regression: `h || 12` coerced a legitimate 0 hour to 12, so the
    // popup spinner desynced from the trigger and incrementing midnight
    // jumped to 13:00 instead of 01:00.
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <TimePicker defaultValue="00:30" format="24h" onChange={handleChange} />,
    );

    const trigger = screen.getByRole("combobox") as HTMLInputElement;
    expect(trigger.value).toBe("00:30");

    await act(async () => {
      await user.click(trigger);
    });

    const hours = await screen.findByRole("spinbutton", { name: "Hours" });
    expect(hours).toHaveAttribute("aria-valuenow", "0");
    expect(hours).toHaveAttribute("aria-valuetext", "00");

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Increment hours" }));
    });
    expect(handleChange).toHaveBeenLastCalledWith("01:30");
  });
});
