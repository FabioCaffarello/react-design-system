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

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

/**
 * jsdom offsetParent prop-up. After PR 5, Modal consumes the shared
 * useAutoFocus + useFocusTrap hooks, which filter focusable candidates
 * by `offsetParent !== null`. jsdom returns null for offsetParent on
 * every connected element (no layout engine), so without this mock
 * the hooks reject all rendered buttons and useAutoFocus falls
 * through to focusing the modal container itself. That breaks the
 * "first focusable" assertion. Same prototype-level mock used in
 * Drawer's and Dialog's a11y suites.
 */
let restoreOffsetParentDescriptor: PropertyDescriptor | undefined;
beforeEach(() => {
  restoreOffsetParentDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetParent",
  );
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      return document.body;
    },
  });
});
afterEach(() => {
  if (restoreOffsetParentDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetParent",
      restoreOffsetParentDescriptor,
    );
  } else {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .offsetParent;
  }
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
    it("moves focus to the first focusable inside the modal on open", async () => {
      // Behaviour change in PR 5: pre-migration the modal focused its
      // OWN container (the tabindex={-1} panel). The shared
      // useAutoFocus hook targets the first focusable child instead,
      // matching Dialog/Drawer. With title + default
      // showCloseButton=true, the close button renders first in DOM
      // order, so focus lands on it.
      render(
        <Modal isOpen onClose={() => {}} title="Settings">
          <p>Content</p>
        </Modal>,
      );

      await waitFor(() => {
        const closeButton = screen.getByRole("button", {
          name: /close modal/i,
        });
        expect(document.activeElement).toBe(closeButton);
      });
    });

    it("falls back to focusing the panel container when no focusable child exists", async () => {
      // Confirms the hook's no-focusable-children fallback. Without
      // a title (no auto-rendered close button), with showCloseButton
      // explicitly false, and with only text content, there is nothing
      // tabbable inside — the panel's tabindex={-1} carries the focus
      // so the dialog still owns it.
      render(
        <Modal isOpen onClose={() => {}} showCloseButton={false}>
          <p>Nothing tabbable here</p>
        </Modal>,
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        const panel = dialog.querySelector('[tabindex="-1"]');
        expect(document.activeElement).toBe(panel);
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

      // After PR 5, useFocusRestore defers the restore via
      // setTimeout(0) (matching DialogProvider's pre-existing shape).
      // Pre-migration the inline cleanup ran synchronously; the
      // assertion now needs to wait for the deferred restore to fire.
      await waitFor(() => {
        expect(externalTrigger).toHaveFocus();
      });
      externalTrigger.remove();
    });
  });

  /**
   * Modal focus contract — WCAG 2.4.3 / WAI-ARIA modal-dialog
   * obligations. Pre-PR-#141 the Modal carried `role="dialog"
   * aria-modal="true"` without honouring any of the trap obligations
   * — Tab would leak through to the page behind the overlay. This
   * block pins the trap end-to-end on top of the per-hook unit tests
   * in `src/ui/hooks/useFocusTrap.test.tsx`.
   */
  describe("Modal focus contract (trap engaged)", () => {
    it("Tab on the last focusable cycles back to the first", () => {
      render(
        <Modal isOpen onClose={() => {}} showCloseButton={false}>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Modal>,
      );

      const first = screen.getByRole("button", { name: "First" });
      const last = screen.getByRole("button", { name: "Last" });

      // Park focus on Last (defeating auto-focus, which would land
      // on First).
      last.focus();
      expect(document.activeElement).toBe(last);

      const event = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);
    });

    it("Shift+Tab on the first focusable cycles back to the last", () => {
      render(
        <Modal isOpen onClose={() => {}} showCloseButton={false}>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Modal>,
      );

      const first = screen.getByRole("button", { name: "First" });
      const last = screen.getByRole("button", { name: "Last" });

      first.focus();

      const event = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(last);
    });

    it("Tab with focus outside the modal pulls focus back to the first inside (inherited guard)", () => {
      // Inherits the focus-outside-container guard added to
      // useFocusTrap in #137 review. Pre-trap Modal had no such
      // guard, plus no auto-focus inside (focused the container) —
      // Tab from outside the container leaked straight through to
      // whatever was next in document order.
      render(
        <Modal isOpen onClose={() => {}} showCloseButton={false}>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Modal>,
      );

      const first = screen.getByRole("button", { name: "First" });

      const outside = document.createElement("button");
      outside.textContent = "Outside";
      document.body.appendChild(outside);
      outside.focus();
      expect(document.activeElement).toBe(outside);

      const event = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);

      outside.remove();
    });

    it("trap teardown leaves the document keydown listener unattached when isOpen flips false", () => {
      const { rerender } = render(
        <Modal isOpen onClose={() => {}} showCloseButton={false}>
          <button type="button">Inside</button>
        </Modal>,
      );

      rerender(
        <Modal isOpen={false} onClose={() => {}} showCloseButton={false}>
          <button type="button">Inside</button>
        </Modal>,
      );

      const outside = document.createElement("button");
      outside.textContent = "Outside";
      document.body.appendChild(outside);
      outside.focus();

      const event = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      // Trap is detached — no preventDefault and no forced focus
      // change.
      expect(event.defaultPrevented).toBe(false);
      outside.remove();
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

      // After PR 5, useAutoFocus targets the first focusable, which IS
      // the close button when title + default showCloseButton renders
      // it. So focus is already on the close button after the
      // setTimeout(0) auto-focus timer settles — no need to focus it
      // manually before pressing Enter.
      const closeButton = screen.getByRole("button", { name: /close modal/i });
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });
      await user.keyboard("{Enter}");

      expect(handleClose).toHaveBeenCalled();
    });
  });
});
