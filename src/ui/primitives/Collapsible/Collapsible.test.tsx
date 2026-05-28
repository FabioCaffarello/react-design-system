import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Collapsible from "./Collapsible";

describe("Collapsible", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    try {
      localStorage.clear();
    } catch {
      // If clear is not available, remove items manually
      Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
    }
  });

  afterEach(() => {
    // Clear localStorage after each test
    try {
      localStorage.clear();
    } catch {
      // If clear is not available, remove items manually
      Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
    }
  });

  it("renders trigger and children", () => {
    render(
      <Collapsible trigger={<span>Toggle</span>} defaultOpen={true}>
        <div>Content</div>
      </Collapsible>,
    );

    expect(screen.getByText("Toggle")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("starts open when defaultOpen is true", () => {
    render(
      <Collapsible trigger={<span>Toggle</span>} defaultOpen={true}>
        <div>Content</div>
      </Collapsible>,
    );

    const content = screen.getByText("Content").parentElement?.parentElement;
    expect(content).toHaveAttribute("aria-hidden", "false");
  });

  it("starts closed when defaultOpen is false", () => {
    render(
      <Collapsible trigger={<span>Toggle</span>} defaultOpen={false}>
        <div>Content</div>
      </Collapsible>,
    );

    const content = screen.getByText("Content").parentElement?.parentElement;
    expect(content).toHaveAttribute("aria-hidden", "true");
  });

  it("toggles content when trigger is clicked", async () => {
    render(
      <Collapsible trigger={<span>Toggle</span>} defaultOpen={true}>
        <div>Content</div>
      </Collapsible>,
    );

    const button = screen.getByText("Toggle").closest("button");
    const content = screen.getByText("Content").parentElement?.parentElement;

    expect(content).toHaveAttribute("aria-hidden", "false");

    fireEvent.click(button);

    await waitFor(() => {
      expect(content).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("calls onOpenChange when provided (controlled mode)", () => {
    const handleOpenChange = vi.fn();
    render(
      <Collapsible
        trigger={<span>Toggle</span>}
        open={true}
        onOpenChange={handleOpenChange}
      >
        <div>Content</div>
      </Collapsible>,
    );

    const button = screen.getByText("Toggle").closest("button");
    fireEvent.click(button!);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("persists state in localStorage when storageKey is provided", async () => {
    const storageKey = "test-collapsible";

    const { rerender } = render(
      <Collapsible
        trigger={<span>Toggle</span>}
        defaultOpen={true}
        storageKey={storageKey}
      >
        <div>Content</div>
      </Collapsible>,
    );

    const button = screen.getByText("Toggle").closest("button");
    fireEvent.click(button!);

    await waitFor(() => {
      expect(localStorage.getItem(storageKey)).toBe("false");
    });

    // Re-render and check state is restored
    rerender(
      <Collapsible
        trigger={<span>Toggle</span>}
        defaultOpen={true}
        storageKey={storageKey}
      >
        <div>Content</div>
      </Collapsible>,
    );

    const content = screen.getByText("Content").parentElement?.parentElement;
    expect(content).toHaveAttribute("aria-hidden", "true");
  });

  it("does not toggle when disabled", async () => {
    render(
      <Collapsible
        trigger={<span>Toggle</span>}
        defaultOpen={true}
        disabled={true}
      >
        <div>Content</div>
      </Collapsible>,
    );

    const button = screen.getByText("Toggle").closest("button");
    const content = screen.getByText("Content").parentElement?.parentElement;

    expect(button).toBeDisabled();
    expect(content).toHaveAttribute("aria-hidden", "false");

    fireEvent.click(button!);

    // State should not change
    await waitFor(
      () => {
        expect(content).toHaveAttribute("aria-hidden", "false");
      },
      { timeout: 100 },
    );
  });

  it("has correct ARIA attributes", () => {
    render(
      <Collapsible trigger={<span>Toggle</span>} defaultOpen={true}>
        <div>Content</div>
      </Collapsible>,
    );

    const button = screen.getByText("Toggle").closest("button");
    const content = screen.getByText("Content").parentElement?.parentElement;

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls");
    expect(content).toHaveAttribute("id");
    expect(content).toHaveAttribute("aria-hidden", "false");
  });
});
