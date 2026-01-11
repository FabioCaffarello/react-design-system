import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Select from "./Select";

describe("Select", () => {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  it("renders with options", () => {
    render(<Select options={options} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Select options={options} placeholder="Select an option" />);
    const placeholder = screen.getByText("Select an option");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it("applies error styling when error is true", () => {
    render(<Select options={options} error />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-red-500");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("applies custom className", () => {
    render(<Select options={options} className="custom-class" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("custom-class");
  });

  it("renders disabled options", () => {
    const optionsWithDisabled = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2", disabled: true },
    ];
    render(<Select options={optionsWithDisabled} />);
    const option2 = screen.getByText("Option 2");
    expect(option2).toBeDisabled();
  });

  it("supports defaultValue", () => {
    render(<Select options={options} defaultValue="2" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("2");
  });

  it("has accessible attributes when error", () => {
    render(<Select options={options} error id="test-select" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", "test-select-error");
  });
});
