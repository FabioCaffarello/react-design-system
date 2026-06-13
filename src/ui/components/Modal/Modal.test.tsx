import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";
import { Button } from "../../primitives";

// Modal renders via createPortal(document.body). DON'T mock react-dom
// to make it render inline — `vi.mock("react-dom", ...)` is fragile
// across files: under `--no-isolate` the worker's react-dom module
// cache makes whichever Modal test file loads first win the mock, and
// the other file's mock is silently ignored. Use `screen` queries
// (which read from `document.body`) instead — same surface RTL is
// designed for, no module-cache fragility.

describe("Modal", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when ESC key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("calls onClose when the visible dim overlay layer is clicked", () => {
    // Regression: the dim backdrop a real pointer hits is the overlay
    // div, not the role=dialog container. The old `e.target ===
    // e.currentTarget`-only check never fired for genuine outside
    // clicks.
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    const overlay = screen
      .getByRole("dialog")
      .querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when the panel content is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("Content"));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("uses a consumer aria-label as the dialog name when title is omitted", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} aria-label="Settings">
        <p>Content</p>
      </Modal>,
    );
    // Regression: aria-label was spread onto the inner panel, never the
    // role=dialog element, leaving a titleless dialog with no name.
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("gives each open titled Modal a unique aria-labelledby (useId)", () => {
    render(
      <>
        <Modal isOpen={true} onClose={() => {}} title="First">
          <p>One</p>
        </Modal>
        <Modal isOpen={true} onClose={() => {}} title="Second">
          <p>Two</p>
        </Modal>
      </>,
    );
    const [a, b] = screen.getAllByRole("dialog");
    expect(a.getAttribute("aria-labelledby")).toBeTruthy();
    expect(a.getAttribute("aria-labelledby")).not.toBe(
      b.getAttribute("aria-labelledby"),
    );
  });

  it("has dialog role and aria-modal", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders title when provided", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test"
        footer={<Button>Action</Button>}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
