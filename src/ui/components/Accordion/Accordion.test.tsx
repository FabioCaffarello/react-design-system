import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Accordion from "./Accordion";

const mockItems = [
  { id: "1", title: "Item 1", content: "Content 1" },
  { id: "2", title: "Item 2", content: "Content 2" },
  { id: "3", title: "Item 3", content: "Content 3", disabled: true },
];

describe("Accordion", () => {
  it("renders correctly", () => {
    render(<Accordion items={mockItems} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("expands item on click (single mode)", () => {
    render(<Accordion items={mockItems} type="single" />);
    const button = screen.getByText("Item 1").closest("button");
    fireEvent.click(button!);
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  it("collapses item when clicked again (single mode)", () => {
    render(<Accordion items={mockItems} type="single" />);
    const button = screen.getByText("Item 1").closest("button");
    fireEvent.click(button!);
    expect(screen.getByText("Content 1")).toBeVisible();
    fireEvent.click(button!);
    const contentContainer = document.querySelector("#accordion-content-1");
    if (contentContainer) {
      const ariaHidden = contentContainer.getAttribute("aria-hidden");
      expect(
        ariaHidden === "true" || !screen.queryByText("Content 1")?.isConnected,
      ).toBe(true);
    } else {
      const content = screen.queryByText("Content 1");
      expect(content).not.toBeVisible();
    }
  });

  it("allows multiple items open (multiple mode)", () => {
    render(<Accordion items={mockItems} type="multiple" />);
    const button1 = screen.getByText("Item 1").closest("button");
    const button2 = screen.getByText("Item 2").closest("button");

    fireEvent.click(button1!);
    fireEvent.click(button2!);

    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.getByText("Content 2")).toBeVisible();
  });

  it("calls onValueChange when item is toggled", () => {
    const handleChange = vi.fn();
    render(<Accordion items={mockItems} onValueChange={handleChange} />);
    const button = screen.getByText("Item 1").closest("button");
    fireEvent.click(button!);
    expect(handleChange).toHaveBeenCalledWith("1");
  });

  it("handles disabled items", () => {
    render(<Accordion items={mockItems} />);
    const disabledButton = screen.getByText("Item 3").closest("button");
    expect(disabledButton).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(disabledButton!);
    const contentContainer = document.querySelector("#accordion-content-3");
    if (contentContainer) {
      const ariaHidden = contentContainer.getAttribute("aria-hidden");
      expect(
        ariaHidden === "true" || !screen.queryByText("Content 3")?.isConnected,
      ).toBe(true);
    } else {
      const content = screen.queryByText("Content 3");
      expect(content).not.toBeVisible();
    }
  });

  it("opens default items", () => {
    render(<Accordion items={mockItems} defaultOpen="1" />);
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  it("opens multiple default items", () => {
    render(
      <Accordion items={mockItems} type="multiple" defaultOpen={["1", "2"]} />,
    );
    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.getByText("Content 2")).toBeVisible();
  });

  it("animates open panels via grid-rows with no max-height clamp (#202)", () => {
    render(<Accordion items={mockItems} defaultOpen="1" />);

    const openPanel = document.querySelector("#accordion-content-1")!;
    expect(openPanel.className).toContain("grid-rows-[1fr]");
    expect(openPanel.className).not.toMatch(/max-h-/);

    const closedPanel = document.querySelector("#accordion-content-2")!;
    expect(closedPanel.className).toContain("grid-rows-[0fr]");
    expect(closedPanel.className).not.toMatch(/max-h-/);
  });

  it("applies per-item className to the item wrapper", () => {
    render(
      <Accordion
        items={[
          {
            id: "1",
            title: "Item 1",
            content: "Content 1",
            className: "bg-surface-base px-4",
          },
        ]}
      />,
    );
    const wrapper = screen
      .getByText("Item 1")
      .closest("button")!.parentElement!;
    expect(wrapper.className).toContain("bg-surface-base");
    expect(wrapper.className).toContain("px-4");
  });

  it("triggerClassName overrides the default trigger typography", () => {
    render(
      <Accordion
        items={[
          {
            id: "1",
            title: "Item 1",
            content: "Content 1",
            triggerClassName: "font-semibold text-base",
          },
        ]}
      />,
    );
    const button = screen.getByText("Item 1").closest("button")!;
    // tailwind-merge drops the conflicting defaults (text-sm font-medium)
    expect(button.className).toContain("font-semibold");
    expect(button.className).toContain("text-base");
    expect(button.className).not.toMatch(/\btext-sm\b/);
    expect(button.className).not.toMatch(/\bfont-medium\b/);
  });

  it("applies per-item contentClassName to the content wrapper", () => {
    render(
      <Accordion
        items={[
          {
            id: "1",
            title: "Item 1",
            content: "Content 1",
            contentClassName: "pt-0",
          },
        ]}
        defaultOpen="1"
      />,
    );
    expect(screen.getByText("Content 1").className).toContain("pt-0");
  });
});
