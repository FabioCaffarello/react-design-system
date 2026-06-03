/**
 * Menu Accessibility Tests
 *
 * Dedicated a11y test scaffold for Menu. The main `Menu.test.tsx`
 * covers behavior; this file targets the structural ARIA invariants
 * across the compound (Menu / Trigger / Content / Item):
 *
 *   - ARIA Labels and Roles: trigger has role=button + aria-haspopup
 *     + aria-expanded that flips with state; content is role=menu;
 *     items are role=menuitem
 *   - Keyboard Navigation: Enter and Space on a menuitem activate
 *     onClick; ESC closes the menu
 *   - Focus Management: enabled items have tabIndex=0; disabled have
 *     tabIndex=-1 (skipped by keyboard); disabled items don't fire
 *     onClick even when forcibly invoked
 *   - Screen Reader Support: disabled items convey aria-disabled;
 *     trigger merged-onto-Button avoids nested-interactive
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";

describe("Menu Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("trigger carries aria-haspopup=menu and aria-expanded that tracks state", async () => {
      const user = userEvent.setup();
      render(
        <Menu>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("content has role=menu when open", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("items render with role=menuitem", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
            <Menu.Item>Two</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter on a focused menuitem fires onClick", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onClick={handleSelect}>Pick me</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const item = screen.getByRole("menuitem", { name: "Pick me" });
      item.focus();
      await user.keyboard("{Enter}");
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it("Space on a focused menuitem fires onClick", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onClick={handleSelect}>Pick me</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const item = screen.getByRole("menuitem", { name: "Pick me" });
      item.focus();
      await user.keyboard(" ");
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it("Escape closes the menu and flips aria-expanded on the trigger", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  describe("Focus Management", () => {
    it("enabled items have tabIndex 0; disabled have tabIndex -1", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Enabled</Menu.Item>
            <Menu.Item disabled>Disabled</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const enabled = screen.getByRole("menuitem", { name: "Enabled" });
      const disabled = screen.getByRole("menuitem", { name: "Disabled" });
      expect(enabled).toHaveAttribute("tabindex", "0");
      expect(disabled).toHaveAttribute("tabindex", "-1");
    });

    it("disabled item ignores Enter (no onClick fired)", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item disabled onClick={handleSelect}>
              Disabled
            </Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const disabled = screen.getByRole("menuitem", { name: "Disabled" });
      disabled.focus();
      await user.keyboard("{Enter}");
      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe("Screen Reader Support", () => {
    it("disabled item carries aria-disabled=true", () => {
      render(
        <Menu defaultOpen>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item disabled>Disabled</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      const disabled = screen.getByRole("menuitem", { name: "Disabled" });
      expect(disabled).toHaveAttribute("aria-disabled", "true");
    });

    it("Trigger with a single Button child does NOT nest a wrapper button", () => {
      render(
        <Menu>
          <Menu.Trigger>
            <button>Open</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
          </Menu.Content>
        </Menu>,
      );

      // Should be exactly one button — Trigger's asChild=undefined default
      // clones onto the single child rather than wrapping in <div role="button">.
      // Nested interactives are an axe violation; this asserts the contract.
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("aria-haspopup", "menu");
    });
  });
});
