import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Radio from "./Radio";

describe("Radio", () => {
  it("renders radio with label", () => {
    render(<Radio name="test" label="Test radio" value="test" />);
    expect(screen.getByLabelText("Test radio")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleChange = vi.fn();
    render(
      <Radio name="test" label="Test" value="test" onChange={handleChange} />,
    );

    const radio = screen.getByLabelText("Test");
    await userEvent.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error state", () => {
    render(
      <Radio
        name="test"
        label="Test"
        value="test"
        error
        helperText="Error message"
      />,
    );
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Radio name="test" label="Test" value="test" disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
  });
});
