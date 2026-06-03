/**
 * Popover Accessibility Tests
 *
 * Dedicated a11y test scaffold for Popover — the canonical NON-modal
 * dialog (versus Modal/Dialog/Drawer which are modal). The distinction
 * matters: `aria-modal="false"` advertises that AT users can still
 * interact with content outside the popover, and focus is NOT trapped.
 *
 *   - ARIA Labels and Roles: content is role=dialog with
 *     aria-modal="false" (intentionally — popovers don't trap focus);
 *     aria-labelledby points at the title id when title is provided;
 *     omitted when there's no title
 *   - Keyboard Navigation: ESC closes when closeOnEscape=true;
 *     closeOnEscape=false opt-out works
 *   - Focus Management: close button (when shown) has accessible name
 *     and is keyboard-activatable
 *   - Screen Reader Support: close button name is "Close popover"
 *     (not "Close" — distinguishes from Modal/Drawer close); title
 *     renders as a heading
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Popover from "./Popover";

describe("Popover Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("content has role=dialog with aria-modal='false' (non-modal)", () => {
      render(
        <Popover trigger={<button>Open</button>} defaultOpen title="Help">
          <p>Help text</p>
        </Popover>,
      );

      const dialog = screen.getByRole("dialog");
      // The non-modal distinction: Modal/Drawer use aria-modal=true to tell
      // AT users they're in a focus-trapped surface. Popovers don't trap
      // focus — aria-modal=false is the correct contract.
      expect(dialog).toHaveAttribute("aria-modal", "false");
    });

    it("aria-labelledby links to the title heading id when title is provided", () => {
      render(
        <Popover trigger={<button>Open</button>} defaultOpen title="Help">
          <p>Help text</p>
        </Popover>,
      );

      const dialog = screen.getByRole("dialog");
      const labelledById = dialog.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();

      const heading = document.getElementById(labelledById as string);
      expect(heading).toHaveTextContent("Help");
    });

    it("aria-labelledby is omitted when no title is provided", () => {
      render(
        <Popover trigger={<button>Open</button>} defaultOpen>
          <p>Untitled content</p>
        </Popover>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("Keyboard Navigation", () => {
    it("closes on Escape when closeOnEscape=true (default)", () => {
      const handleOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button>Open</button>}
          defaultOpen
          onOpenChange={handleOpenChange}
          title="Help"
        >
          <p>Help text</p>
        </Popover>,
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not close on Escape when closeOnEscape=false", () => {
      const handleOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button>Open</button>}
          defaultOpen
          closeOnEscape={false}
          onOpenChange={handleOpenChange}
          title="Help"
        >
          <p>Help text</p>
        </Popover>,
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleOpenChange).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("ignores unrelated key presses", () => {
      const handleOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button>Open</button>}
          defaultOpen
          onOpenChange={handleOpenChange}
          title="Help"
        >
          <p>Help text</p>
        </Popover>,
      );

      fireEvent.keyDown(document, { key: "a" });
      fireEvent.keyDown(document, { key: "Tab" });
      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("close button (when shown) has accessible name 'Close popover'", () => {
      render(
        <Popover
          trigger={<button>Open</button>}
          defaultOpen
          showCloseButton
          title="Help"
        >
          <p>Help text</p>
        </Popover>,
      );

      // Name discriminates from Modal ("Close modal") and Drawer
      // ("Close drawer") — same role, different surface.
      expect(
        screen.getByRole("button", { name: "Close popover" }),
      ).toBeInTheDocument();
    });

    it("close button is activatable from the keyboard", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button>Open</button>}
          defaultOpen
          showCloseButton
          onOpenChange={handleOpenChange}
          title="Help"
        >
          <p>Help text</p>
        </Popover>,
      );

      const close = screen.getByRole("button", { name: "Close popover" });
      close.focus();
      await user.keyboard("{Enter}");
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Screen Reader Support", () => {
    it("title renders as a heading (semantic h-level for AT)", () => {
      render(
        <Popover trigger={<button>Open</button>} defaultOpen title="Help">
          <p>Help text</p>
        </Popover>,
      );

      expect(screen.getByRole("heading", { name: "Help" })).toBeInTheDocument();
    });

    it("dialog accessible name comes from the title (not the body content)", () => {
      render(
        <Popover trigger={<button>Open</button>} defaultOpen title="Help">
          <p>Help text content that should NOT become the name</p>
        </Popover>,
      );

      // getByRole computes accessible name. The title (linked via
      // aria-labelledby) is the carrier; the body paragraph is not.
      expect(screen.getByRole("dialog", { name: "Help" })).toBeInTheDocument();
    });
  });
});
