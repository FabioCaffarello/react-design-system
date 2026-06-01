import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Chip from "./Chip";

describe("Chip", () => {
  it("renders chip with text", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", () => {
    const handleRemove = vi.fn();
    render(<Chip onRemove={handleRemove}>Removable</Chip>);
    const removeButton = screen.getByLabelText("Remove Removable");
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("does not show remove button when onRemove is not provided", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.queryByLabelText(/Remove/)).not.toBeInTheDocument();
  });

  it("selected without onClick is purely decorative (no role, no toggle state)", () => {
    // `role="option"` outside `role="listbox"` violates aria-required-parent.
    // Without `onClick`, the chip cannot toggle — communicating a state via
    // aria-pressed on an inert button would lie. The selected visual still
    // applies via chipVariants; AT users perceive it as static text.
    // Consumers who want the state communicated must pair `selected` with
    // `onClick` to make it a real toggle.
    const { container } = render(<Chip selected>Selected</Chip>);
    expect(container.querySelector('[role="option"]')).toBeNull();
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("selected + onClick renders as toggle button with aria-pressed=true", () => {
    render(
      <Chip selected onClick={vi.fn()}>
        Active
      </Chip>,
    );
    const toggle = screen.getByRole("button", { pressed: true });
    expect(toggle).toBeInTheDocument();
    expect(toggle.textContent).toBe("Active");
  });

  it("selected={false} + onClick renders a toggle button in unpressed state", () => {
    // The pair `selected={true}` / `selected={false}` with onClick
    // demonstrates toggle-on AND toggle-off. AT users perceive both states
    // via aria-pressed without state being embedded in the label string.
    render(
      <Chip selected={false} onClick={vi.fn()}>
        Inactive
      </Chip>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle).toBeInTheDocument();
    // aria-pressed is only emitted when selected is truthy; absent on
    // unselected toggles keeps the DOM minimal and avoids implying state
    // on chips that aren't currently pressed.
    expect(toggle).not.toHaveAttribute("aria-pressed");
  });

  it("is disabled when disabled prop is true", () => {
    const { container } = render(<Chip disabled>Disabled</Chip>);
    const chip = container.querySelector("[aria-disabled]");
    expect(chip).toHaveAttribute("aria-disabled", "true");
  });

  describe("Accessibility", () => {
    it('has role="button" when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      expect(chip).toBeInTheDocument();
    });

    it("has aria-label when provided", () => {
      render(
        <Chip onClick={vi.fn()} aria-label="Custom label">
          Chip
        </Chip>,
      );
      const chip = screen.getByLabelText("Custom label");
      expect(chip).toBeInTheDocument();
    });

    it("uses children as aria-label when onClick is provided and no explicit aria-label", () => {
      render(<Chip onClick={vi.fn()}>Clickable Chip</Chip>);
      const chip = screen.getByRole("button", { name: "Clickable Chip" });
      expect(chip).toBeInTheDocument();
    });

    it("has fallback aria-label when onClick is provided but children is not string", () => {
      render(
        <Chip onClick={vi.fn()} aria-label="Custom">
          <span>Non-string</span>
        </Chip>,
      );
      const chip = screen.getByLabelText("Custom");
      expect(chip).toBeInTheDocument();
    });

    it("has tabIndex when interactive and not disabled", () => {
      render(<Chip onClick={vi.fn()}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      expect(chip).toHaveAttribute("tabIndex", "0");
    });

    it("does not have tabIndex when disabled", () => {
      render(
        <Chip onClick={vi.fn()} disabled>
          Disabled
        </Chip>,
      );
      const chip = screen.getByRole("button");
      expect(chip).not.toHaveAttribute("tabIndex", "0");
    });

    it("respects custom tabIndex", () => {
      render(
        <Chip onClick={vi.fn()} tabIndex={-1}>
          Chip
        </Chip>,
      );
      const chip = screen.getByRole("button");
      expect(chip).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Keyboard Navigation", () => {
    it("calls onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      fireEvent.keyDown(chip, { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      fireEvent.keyDown(chip, { key: " " });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled and Enter is pressed", () => {
      const handleClick = vi.fn();
      render(
        <Chip onClick={handleClick} disabled>
          Disabled
        </Chip>,
      );
      const chip = screen.getByRole("button");
      fireEvent.keyDown(chip, { key: "Enter" });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("prevents default behavior on Enter/Space", () => {
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");
      fireEvent(chip, enterEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("has focus ring classes when interactive", () => {
      // The label-button is a native <button> (implicit role), so we query
      // by role rather than `[role="button"]` (CSS selector matches only
      // explicit role attribute).
      render(<Chip onClick={vi.fn()}>Clickable</Chip>);
      const chip = screen.getByRole("button");
      expect(chip).toHaveClass("focus:outline-none", "focus:ring-2");
    });

    it("does not have focus ring when not interactive", () => {
      const { container } = render(<Chip>Non-interactive</Chip>);
      const chip = container.querySelector("div");
      expect(chip).not.toHaveClass("focus:ring-2");
    });
  });

  describe("Edge Cases", () => {
    it("handles both onClick and onRemove", () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();
      render(
        <Chip onClick={handleClick} onRemove={handleRemove}>
          Both
        </Chip>,
      );
      const buttons = screen.getAllByRole("button");
      const chip = buttons.find((btn) => btn.textContent?.includes("Both"));
      expect(chip).toBeDefined();
      if (chip) {
        fireEvent.click(chip);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }

      const removeButton = screen.getByLabelText(/Remove/);
      fireEvent.click(removeButton);
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledTimes(1); // onClick should not be called again
    });

    it("stops propagation when remove button is clicked", () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();
      render(
        <Chip onClick={handleClick} onRemove={handleRemove}>
          Both
        </Chip>,
      );
      const removeButton = screen.getByLabelText(/Remove/);
      const clickEvent = new MouseEvent("click", { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation");
      fireEvent(removeButton, clickEvent);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe("Clickable + removable architecture (no nested-interactive)", () => {
    // When BOTH onClick and onRemove are provided (and not selected/disabled),
    // the chip splits into two sibling <button>s — the label-button (carries
    // onClick) and the X-button (carries onRemove) — inside a non-interactive
    // outer <div>. This avoids the APG anti-pattern of an interactive role
    // containing a native <button>. The tests below guard the new structure;
    // re-introducing a role on the outer would reintroduce nested-interactive.

    it("outer div has no interactive role when onClick + onRemove are both provided", () => {
      const { container } = render(
        <Chip onClick={vi.fn()} onRemove={vi.fn()}>
          Filter
        </Chip>,
      );
      const outer = container.firstChild as HTMLElement;
      expect(outer.tagName).toBe("DIV");
      expect(outer).not.toHaveAttribute("role");
      expect(outer).not.toHaveAttribute("tabIndex");
    });

    it("renders label as a real <button> with the children as accessible name", () => {
      render(
        <Chip onClick={vi.fn()} onRemove={vi.fn()}>
          Filter 1
        </Chip>,
      );
      const labelButton = screen.getByRole("button", { name: "Filter 1" });
      expect(labelButton.tagName).toBe("BUTTON");
    });

    it("renders both label-button and X-button as siblings (not nested)", () => {
      render(
        <Chip onClick={vi.fn()} onRemove={vi.fn()}>
          Filter 1
        </Chip>,
      );
      const labelButton = screen.getByRole("button", { name: "Filter 1" });
      const xButton = screen.getByRole("button", { name: "Remove Filter 1" });
      // Neither button is an ancestor of the other — they share a parent.
      expect(labelButton.contains(xButton)).toBe(false);
      expect(xButton.contains(labelButton)).toBe(false);
      expect(labelButton.parentElement).toBe(xButton.parentElement);
    });
  });
});
