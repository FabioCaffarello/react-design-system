import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Switch from "./Switch";

describe("Switch", () => {
  it("renders correctly", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("handles checked state", () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
  });

  it("handles unchecked state", () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays label when provided", () => {
    render(
      <Switch label="Enable feature" checked={false} onChange={() => {}} />,
    );
    expect(screen.getByText("Enable feature")).toBeInTheDocument();
  });

  it("displays helperText when provided", () => {
    render(
      <Switch
        label="Enable feature"
        helperText="This will enable the feature"
        checked={false}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByText("This will enable the feature"),
    ).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("disabled");
  });

  it("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled />);
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole("switch");
    fireEvent.keyDown(switchElement, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("handles different sizes", () => {
    const { rerender } = render(
      <Switch size="sm" checked={false} onChange={() => {}} />,
    );
    let switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();

    rerender(<Switch size="md" checked={false} onChange={() => {}} />);
    switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();

    rerender(<Switch size="lg" checked={false} onChange={() => {}} />);
    switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("handles error state", () => {
    render(<Switch checked={false} onChange={() => {}} error />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  describe("Uncontrolled mode (defaultChecked) — aria-required-attr guard", () => {
    // `role="switch"` REQUIRES `aria-checked`. Before this fix the
    // primitive bound `aria-checked={checked}` directly, so a Switch
    // using only `defaultChecked` (no `checked` prop) rendered with
    // `aria-checked` undefined — axe `aria-required-attr` (critical)
    // flagged it. The tests below guard:
    //   - aria-checked is ALWAYS set, including in uncontrolled mode.
    //   - defaultChecked seeds the initial state.
    //   - clicking the uncontrolled switch toggles and aria-checked
    //     reflects the new state.

    it("aria-checked is set in uncontrolled mode (defaultChecked=false)", () => {
      render(<Switch label="Notifications" defaultChecked={false} />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    it("aria-checked is set in uncontrolled mode (defaultChecked=true)", () => {
      render(<Switch label="Notifications" defaultChecked={true} />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "true");
    });

    it("aria-checked is set when NO checked/defaultChecked provided (off by default)", () => {
      render(<Switch label="Notifications" />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    it("uncontrolled mode toggles on click and aria-checked follows", () => {
      render(<Switch label="Notifications" defaultChecked={false} />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "false");
      fireEvent.click(sw);
      expect(sw).toHaveAttribute("aria-checked", "true");
      fireEvent.click(sw);
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    it("uncontrolled mode still calls onChange when consumer listens", () => {
      const onChange = vi.fn();
      render(
        <Switch
          label="Notifications"
          defaultChecked={false}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].target.checked).toBe(true);
    });

    it("controlled mode ignores defaultChecked (checked is the source of truth)", () => {
      render(
        <Switch
          label="Notifications"
          checked={true}
          defaultChecked={false}
          onChange={() => {}}
        />,
      );
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "true");
    });
  });
});
