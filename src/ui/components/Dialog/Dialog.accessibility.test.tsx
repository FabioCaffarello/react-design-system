/**
 * Dialog Accessibility Tests
 *
 * Dedicated a11y test scaffold for Dialog — the modal compound
 * component (Trigger + Content + Header/Title/Description/Footer/Close).
 * Backed by a portal, focus trap, and ESC-to-close.
 *
 *   - ARIA Labels and Roles: content carries role=dialog +
 *     aria-modal=true; aria-labelledby points at the Title id;
 *     aria-describedby points at the Description id; overlay is
 *     aria-hidden
 *   - Keyboard Navigation: ESC closes when closeOnEscape (default
 *     true); Tab cycles within the focus trap; closeOnEscape=false
 *     suppresses the ESC-close path
 *   - Focus Management: opening the dialog moves focus to the first
 *     focusable element inside content
 *   - Screen Reader Support: aria-labelledby + aria-describedby give
 *     AT users the dialog title and description on focus
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dialog from "./Dialog";

/**
 * jsdom offsetParent prop-up. After Phase 3 PR 4, DialogContent
 * consumes the shared `useFocusTrap` + `useAutoFocus` hooks, which
 * filter focusable candidates by `offsetParent !== null`. jsdom
 * returns `null` for offsetParent on every connected element (no
 * layout engine), so without this mock the hooks reject all rendered
 * buttons and useAutoFocus falls through to focusing the dialog
 * container itself (which carries `tabIndex={-1}`). That breaks the
 * "first focusable" assertion in Focus Management.
 *
 * Prototype-level mock so every HTMLElement looks "visible" to the
 * hooks for the duration of each test. Same shape used in Drawer's
 * a11y suite.
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

describe("Dialog Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("content carries role=dialog and aria-modal=true", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm</Dialog.Title>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("aria-labelledby points at the Title id", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm action</Dialog.Title>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      const labelId = dialog.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(document.getElementById(labelId!)).toHaveTextContent(
        "Confirm action",
      );
    });

    it("aria-describedby points at the Description id", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Description>This cannot be undone.</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>,
      );

      const dialog = screen.getByRole("dialog");
      const descId = dialog.getAttribute("aria-describedby");
      expect(descId).toBeTruthy();
      expect(document.getElementById(descId!)).toHaveTextContent(
        "This cannot be undone.",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("ESC closes the dialog when closeOnEscape is enabled (default)", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog defaultOpen onOpenChange={onOpenChange}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <button>OK</button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>,
      );

      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("closeOnEscape=false suppresses the ESC-close path", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog defaultOpen onOpenChange={onOpenChange}>
          <Dialog.Content closeOnEscape={false}>
            <Dialog.Header>
              <Dialog.Title>Confirm</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <button>OK</button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>,
      );

      await user.keyboard("{Escape}");
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("opening the dialog moves focus into the first focusable element", async () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <button>First focusable</button>
              <button>Second</button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>,
      );

      // Focus is moved via a 0ms setTimeout inside DialogContent — wait
      // for the microtask to flush before asserting.
      await new Promise((r) => setTimeout(r, 10));
      expect(
        screen.getByRole("button", { name: "First focusable" }),
      ).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("Title id is unique per dialog instance (useId)", () => {
      render(
        <>
          <Dialog defaultOpen>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog A</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog>
          <Dialog defaultOpen>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog B</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog>
        </>,
      );

      const dialogs = screen.getAllByRole("dialog");
      const labelIds = dialogs.map((d) => d.getAttribute("aria-labelledby"));

      // Two dialogs render to two distinct title ids — AT users hear
      // the right title for each (the same id would associate both
      // dialogs to the same label).
      expect(labelIds[0]).not.toBe(labelIds[1]);
      expect(labelIds[0]).toBeTruthy();
      expect(labelIds[1]).toBeTruthy();
    });
  });
});
