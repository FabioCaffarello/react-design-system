/**
 * Drawer Accessibility Tests
 *
 * Dedicated a11y test scaffold for Drawer. The main `Drawer.test.tsx`
 * already covers the three accessible-name paths (`title`,
 * `aria-label`, `aria-labelledby` precedence) plus the dialog role
 * and ARIA basics; this file focuses on the invariants that hold
 * ACROSS that surface:
 *
 *   - ARIA Labels and Roles: aria-modal is unconditional, dialog role
 *     survives every position variant, dev-only warning fires when no
 *     accessible name is provided
 *   - Keyboard Navigation: closeOnEscape can be opted out cleanly;
 *     unrelated keys do not close
 *   - Focus Management: close button (when shown) has accessible name
 *     and is keyboard-activatable; the modal focus contract is honoured
 *     (auto-focus on open, Tab cycling within the surface,
 *     restoration to the opening element on close — WCAG 2.4.3)
 *   - Screen Reader Support: overlay is aria-hidden so AT never
 *     announces it as a separate region; close button text is the
 *     icon's accessible name, not the icon glyph
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
import Drawer from "./Drawer";

/**
 * File-wide offsetParent prop-up. The Drawer wires `useAutoFocus`,
 * which on a container with no focusable children falls through to
 * focusing the container itself with `tabindex="-1"`. In jsdom every
 * connected element reports `offsetParent === null` (no layout
 * engine), so the focusables filter rejects everything — including the
 * close button — and the fallback steals focus from any element the
 * test has manually focused. That breaks tests that depend on a
 * specific element retaining focus (e.g. "close button activates
 * onClick from the keyboard" — Enter dispatches against the fallback
 * container, not the button).
 *
 * The fix is to mock `offsetParent` at the prototype level so every
 * HTMLElement looks "visible" to the hook. Done once at file scope so
 * every test runs against a consistent baseline. Matches the
 * `installVisibleOffsetParentMock` shape used inside the Modal Focus
 * Contract block.
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
  document.body.style.overflow = "";
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

describe("Drawer Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("dialog carries aria-modal across every position variant", () => {
      const positions = ["left", "right", "top", "bottom"] as const;
      for (const position of positions) {
        const { unmount } = render(
          <Drawer defaultOpen position={position}>
            <Drawer.Content title="Settings">
              <p>Content</p>
            </Drawer.Content>
          </Drawer>,
        );

        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
        unmount();
      }
    });

    it("aria-labelledby points at the auto-generated heading id when title is set", () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings">
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      const dialog = screen.getByRole("dialog");
      const labelledById = dialog.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();
      const heading = document.getElementById(labelledById as string);
      expect(heading?.tagName).toBe("H2");
      expect(heading).toHaveTextContent("Settings");
    });

    it("warns in dev when no accessible name is provided", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <Drawer defaultOpen>
          <Drawer.Content>
            <p>Nameless</p>
          </Drawer.Content>
        </Drawer>,
      );

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("Missing accessible name"),
      );
      warn.mockRestore();
    });
  });

  describe("Keyboard Navigation", () => {
    it("does not close on Escape when closeOnEscape is false", () => {
      const handleOpenChange = vi.fn();
      render(
        <Drawer
          defaultOpen
          onOpenChange={handleOpenChange}
          closeOnEscape={false}
        >
          <Drawer.Content title="Settings">
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleOpenChange).not.toHaveBeenCalled();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("ignores unrelated key presses while open", () => {
      const handleOpenChange = vi.fn();
      render(
        <Drawer defaultOpen onOpenChange={handleOpenChange}>
          <Drawer.Content title="Settings">
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      fireEvent.keyDown(document, { key: "a" });
      fireEvent.keyDown(document, { key: "Tab" });
      fireEvent.keyDown(document, { key: "Enter" });
      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("close button has an accessible name when shown", () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings" showCloseButton>
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      expect(
        screen.getByRole("button", { name: /close drawer/i }),
      ).toBeInTheDocument();
    });

    it("close button activates onClick from the keyboard", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <Drawer defaultOpen onOpenChange={handleOpenChange}>
          <Drawer.Content title="Settings" showCloseButton>
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      const closeButton = screen.getByRole("button", { name: /close drawer/i });
      closeButton.focus();
      expect(closeButton).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  /**
   * Modal focus contract — the WCAG 2.4.3 / WAI-ARIA modal-dialog
   * obligations that the Drawer's `role="dialog" aria-modal="true"`
   * declares. Before Phase 3 PR 2 the Drawer carried the declaration
   * without honouring any of the obligations; these tests pin the
   * contract end-to-end against the actual rendered component, on top
   * of the per-hook unit tests in `src/ui/hooks/useFocus*.test.tsx`.
   *
   * jsdom prerequisite: the file-scope `beforeEach` prototype-mocks
   * `offsetParent` so every HTMLElement looks "visible" to the focus
   * hooks. Without that, the hooks' visibility filter would reject
   * every rendered element and the auto-focus fallback would steal
   * focus to the dialog container.
   */
  describe("Modal focus contract (trap, auto-focus, restore)", () => {
    it("auto-focuses the first focusable inside the drawer on open", async () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings" showCloseButton>
            <button type="button">First</button>
            <button type="button">Second</button>
          </Drawer.Content>
        </Drawer>,
      );

      // Auto-focus is deferred via setTimeout(0); waitFor polls until
      // the timer fires and the hook has moved focus.
      await waitFor(() => {
        // Close button renders before content children in DOM order
        // (header is the first row of the dialog). It's the first
        // focusable; auto-focus should land on it.
        const closeBtn = screen.getByRole("button", { name: /close drawer/i });
        expect(document.activeElement).toBe(closeBtn);
      });
    });

    it("Tab on the last focusable cycles back to the first (trap engaged)", async () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings">
            <button type="button">First</button>
            <button type="button">Last</button>
          </Drawer.Content>
        </Drawer>,
      );

      const first = screen.getByRole("button", { name: "First" });
      const last = screen.getByRole("button", { name: "Last" });

      // Manually park focus on Last (defeating the auto-focus that
      // would otherwise land on First, the natural first focusable
      // since there's no close button here).
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

    it("Shift+Tab on the first focusable cycles back to the last (trap engaged)", async () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings">
            <button type="button">First</button>
            <button type="button">Last</button>
          </Drawer.Content>
        </Drawer>,
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

    it("restores focus to the opening element on Escape close", async () => {
      vi.useFakeTimers();
      try {
        // Place a "trigger" outside the drawer; focus it before render.
        // It plays the role of "whatever had focus before the drawer
        // opened" — useFocusRestore snapshots document.activeElement
        // at that moment and restores to it when isOpen → false.
        const trigger = document.createElement("button");
        trigger.textContent = "Trigger";
        document.body.appendChild(trigger);
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        const { rerender } = render(
          <Drawer open={false}>
            <Drawer.Content title="Settings">
              <button type="button">Inside</button>
            </Drawer.Content>
          </Drawer>,
        );

        // Open the drawer.
        rerender(
          <Drawer open={true}>
            <Drawer.Content title="Settings">
              <button type="button">Inside</button>
            </Drawer.Content>
          </Drawer>,
        );

        // Flush the auto-focus timer so focus moves into the drawer.
        act(() => {
          vi.runAllTimers();
        });
        const inside = screen.getByRole("button", { name: "Inside" });
        expect(document.activeElement).toBe(inside);

        // Close (simulating Escape route).
        rerender(
          <Drawer open={false}>
            <Drawer.Content title="Settings">
              <button type="button">Inside</button>
            </Drawer.Content>
          </Drawer>,
        );

        // Flush the restore timer.
        act(() => {
          vi.runAllTimers();
        });

        expect(document.activeElement).toBe(trigger);
      } finally {
        vi.useRealTimers();
      }
    });

    it("trap unmounts cleanly when the drawer closes (no zombie listener)", async () => {
      const { rerender } = render(
        <Drawer open={true}>
          <Drawer.Content title="Settings">
            <button type="button">Inside</button>
          </Drawer.Content>
        </Drawer>,
      );

      // Close the drawer — DrawerContent returns null when !isOpen,
      // so the effect cleanups run.
      rerender(
        <Drawer open={false}>
          <Drawer.Content title="Settings">
            <button type="button">Inside</button>
          </Drawer.Content>
        </Drawer>,
      );

      // Park focus on an outside button. If the trap is still alive,
      // Tab would preventDefault here.
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

      // No trap is active — the listener was removed when the effect
      // cleanup ran on close. defaultPrevented stays false.
      expect(event.defaultPrevented).toBe(false);
      // Cleanup the outside element to keep the suite hermetic.
      outside.remove();
    });
  });

  describe("Screen Reader Support", () => {
    it("overlay is aria-hidden so AT does not announce it", () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings">
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      // The overlay is the bg-scrim sibling of the dialog. It must be
      // marked aria-hidden so screen readers walk straight to the dialog
      // instead of announcing the veil. Drawer renders into a portal, so
      // query from document, not the local container.
      const overlay = document.querySelector(".bg-scrim");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    });

    it("close button icon is decorative (button name is the only AT-readable label)", () => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content title="Settings" showCloseButton>
            <p>Content</p>
          </Drawer.Content>
        </Drawer>,
      );

      const closeButton = screen.getByRole("button", { name: /close drawer/i });
      // The aria-label is the carrier; the SVG glyph does NOT become the
      // accessible name. If a future refactor breaks this (e.g. drops
      // aria-label and the icon's title bleeds in) AT users hear nothing
      // useful.
      expect(closeButton).toHaveAttribute("aria-label", "Close drawer");
    });
  });
});
