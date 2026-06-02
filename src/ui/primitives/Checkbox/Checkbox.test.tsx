import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useState } from "react";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders checkbox with label", () => {
    render(<Checkbox label="Test checkbox" />);
    expect(screen.getByLabelText("Test checkbox")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test" onChange={handleChange} />);

    const checkbox = screen.getByLabelText("Test");
    await userEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error state", () => {
    render(<Checkbox label="Test" error helperText="Error message" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Checkbox label="Test" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("supports keyboard navigation with Space key", async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test" onChange={handleChange} />);

    const checkbox = screen.getByLabelText("Test");
    checkbox.focus();
    await userEvent.keyboard(" ");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("supports indeterminate state", () => {
    const { container } = render(<Checkbox label="Test" indeterminate />);
    const input = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it("works as controlled component", async () => {
    const ControlledCheckbox = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label="Controlled"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    };

    render(<ControlledCheckbox />);
    const checkbox = screen.getByLabelText("Controlled") as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    await act(async () => {
      await userEvent.click(checkbox);
    });
    // Wait for state update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(checkbox.checked).toBe(true);
  });

  it("works as uncontrolled component", async () => {
    render(<Checkbox label="Uncontrolled" defaultChecked={false} />);
    const checkbox = screen.getByLabelText("Uncontrolled") as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("has aria-label when no label is provided", () => {
    render(<Checkbox aria-label="Custom label" />);
    const checkbox = screen.getByLabelText("Custom label");
    expect(checkbox).toBeInTheDocument();
  });

  it("has default aria-label when no label or aria-label provided", () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox).toHaveAttribute("aria-label", "Checkbox");
  });

  it("prioritizes error message over helperText", () => {
    render(<Checkbox label="Test" error helperText="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows helperText when no error", () => {
    render(<Checkbox label="Test" helperText="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows default error message when error is true but no helperText", () => {
    render(<Checkbox label="Test" error />);
    expect(screen.getByText("This field has an error")).toBeInTheDocument();
  });

  it("associates error message with aria-describedby", () => {
    render(
      <Checkbox
        label="Test"
        error
        helperText="Error message"
        id="test-checkbox"
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-describedby", "test-checkbox-error");
  });

  it("associates helper text with aria-describedby when no error", () => {
    render(
      <Checkbox label="Test" helperText="Helper text" id="test-checkbox" />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute(
      "aria-describedby",
      "test-checkbox-helper",
    );
  });

  it("merges custom className correctly", () => {
    const { container } = render(
      <Checkbox label="Test" className="custom-class" />,
    );
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Checkbox label="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  describe("success state", () => {
    it("applies border-success on the input when success is set", () => {
      render(<Checkbox label="Pick" success />);
      expect(screen.getByRole("checkbox")).toHaveClass("border-success");
    });

    it("renders helperText in fg-success styling when success is set", () => {
      render(<Checkbox label="Pick" success helperText="Looks good!" />);
      const helper = screen.getByText("Looks good!");
      expect(helper).toHaveClass("text-fg-success");
      expect(helper).toHaveAttribute("role", "alert");
    });

    it("lets error win when both error and success are set", () => {
      render(<Checkbox label="Pick" error success helperText="Conflict" />);
      const input = screen.getByRole("checkbox");
      expect(input).toHaveClass("border-error");
      expect(input).not.toHaveClass("border-success");
      const helper = screen.getByText("Conflict");
      expect(helper).toHaveClass("text-fg-error");
    });
  });
});
