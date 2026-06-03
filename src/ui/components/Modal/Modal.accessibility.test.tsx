/**
 * Modal Accessibility Tests
 *
 * Dedicated a11y test scaffold for Modal — focused on concerns NOT
 * already covered by Modal.test.tsx (which asserts the dialog role,
 * ESC dismissal, and overlay click). This file adds:
 *
 *   - ARIA Labels and Roles: aria-labelledby wiring, heading role
 *   - Keyboard Navigation: ESC works when content has focus
 *   - Focus Management: initial focus on open, restoration on close
 *   - Screen Reader Support: close button has accessible name
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

// Mock createPortal so the modal renders inline for jsdom queries.
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe("Modal Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("has dialog role with aria-modal", () => {
      render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("links aria-labelledby to the title id when title is provided", () => {
      render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      const labelledById = dialog.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();

      const title = document.getElementById(labelledById as string);
      expect(title).toHaveTextContent("Settings");
    });

    it("omits aria-labelledby when no title is provided", () => {
      render(
        <Modal isOpen onClose={() => {}}>
          <p>Content</p>
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("aria-labelledby");
    });

    it("renders the title as a heading", () => {
      render(
        <Modal isOpen onClose={() => {}} title="Confirm action">
          <p>Content</p>
        </Modal>,
      );

      expect(
        screen.getByRole("heading", { name: "Confirm action" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("closes on Escape even when focus is inside content", async () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen onClose={handleClose} title="Settings">
          <input aria-label="Search" />
        </Modal>,
      );

      const input = screen.getByLabelText("Search");
      input.focus();
      expect(input).toHaveFocus();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not close on unrelated key presses", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen onClose={handleClose} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      fireEvent.keyDown(document, { key: "a" });
      fireEvent.keyDown(document, { key: "Enter" });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("moves focus to the modal on open", async () => {
      render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      // Modal applies focus inside a setTimeout(0); flush microtasks.
      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        const focusable = dialog.querySelector('[tabindex="-1"]');
        expect(document.activeElement).toBe(focusable);
      });
    });

    it("restores focus to the previously-active element on close", async () => {
      const externalTrigger = document.createElement("button");
      externalTrigger.textContent = "Open";
      document.body.appendChild(externalTrigger);
      externalTrigger.focus();
      expect(externalTrigger).toHaveFocus();

      const { rerender } = render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      await waitFor(() => {
        expect(externalTrigger).not.toHaveFocus();
      });

      await act(async () => {
        rerender(
          <Modal isOpen={false} onClose={() => {}} title="Settings">
            <p>Content</p>
          </Modal>,
        );
      });

      expect(externalTrigger).toHaveFocus();
      externalTrigger.remove();
    });
  });

  describe("Screen Reader Support", () => {
    it("close button has an accessible name", () => {
      render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      expect(
        screen.getByRole("button", { name: /close modal/i }),
      ).toBeInTheDocument();
    });

    it("close button is activatable from the keyboard", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Modal isOpen onClose={handleClose} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      // Modal grabs focus via setTimeout(0) on open; wait for it to settle
      // before focusing the close button, otherwise the focus shift races
      // ahead of our user.keyboard call.
      const dialog = screen.getByRole("dialog");
      await waitFor(() => {
        expect(dialog.querySelector('[tabindex="-1"]')).toBe(
          document.activeElement,
        );
      });

      const closeButton = screen.getByRole("button", { name: /close modal/i });
      closeButton.focus();
      expect(closeButton).toHaveFocus();
      await user.keyboard("{Enter}");

      expect(handleClose).toHaveBeenCalled();
    });
  });
});
