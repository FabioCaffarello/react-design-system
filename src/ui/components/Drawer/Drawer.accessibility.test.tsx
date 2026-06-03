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
 *     and is keyboard-activatable
 *   - Screen Reader Support: overlay is aria-hidden so AT never
 *     announces it as a separate region; close button text is the
 *     icon's accessible name, not the icon glyph
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Drawer from "./Drawer";

afterEach(() => {
  document.body.style.overflow = "";
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
