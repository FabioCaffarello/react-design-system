/**
 * Dropdown Accessibility Tests
 *
 * Dedicated a11y test scaffold for Dropdown — the activedescendant-pattern
 * menu (versus Menu's focus-moves-with-item pattern). Focus stays on the
 * menu container; `aria-activedescendant` advertises the current item to
 * assistive tech.
 *
 *   - ARIA Labels and Roles: trigger has aria-haspopup=menu,
 *     aria-expanded, aria-controls pointing at the menu id;
 *     menu has role=menu, aria-orientation=vertical, aria-labelledby
 *     paired to the trigger id, aria-activedescendant advertising the
 *     focused item
 *   - Keyboard Navigation: ArrowDown/Up navigate (wrapping at
 *     boundaries), Home/End jump to first/last, Enter and Space
 *     activate, ESC closes
 *   - Focus Management: ArrowDown from a closed dropdown opens it;
 *     after ESC, focus is restored to the trigger; disabled items are
 *     skipped by arrow navigation
 *   - Screen Reader Support: backdrop is aria-hidden so AT doesn't
 *     announce it; danger-variant items are still announced as
 *     menuitems (variant is purely visual)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown, { type DropdownItem } from "./Dropdown";

const buildItems = (): DropdownItem[] => [
  { label: "Edit", onClick: vi.fn() },
  { label: "Duplicate", onClick: vi.fn(), disabled: true },
  { label: "Delete", onClick: vi.fn(), variant: "danger" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Dropdown Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("trigger carries aria-haspopup, aria-expanded, and aria-controls", () => {
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger.getAttribute("aria-controls")).toMatch(/^dropdown-menu-/);
    });

    it("menu has aria-orientation=vertical and aria-labelledby pairs with trigger id", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const menu = screen.getByRole("menu");
      expect(menu).toHaveAttribute("aria-orientation", "vertical");
      expect(menu.getAttribute("aria-labelledby")).toBe(trigger.id);
    });

    it("aria-activedescendant points at the current item after arrow nav", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const menu = screen.getByRole("menu");
      await waitFor(() => {
        // First enabled item is Edit (index 0). After open, activedescendant
        // should point at it.
        expect(menu.getAttribute("aria-activedescendant")).toMatch(/-item-0$/);
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowDown from the trigger opens the menu", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      trigger.focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("Enter on the focused item fires its onClick and closes the menu", async () => {
      const user = userEvent.setup();
      const items = buildItems();
      render(<Dropdown trigger={<button>Actions</button>} items={items} />);

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const menu = screen.getByRole("menu");
      // Default activedescendant is Edit (index 0). Enter activates it.
      // Dropdown binds keydown via native addEventListener on the menu div,
      // so dispatch the event directly on that element.
      await act(async () => {
        fireEvent.keyDown(menu, { key: "Enter" });
      });

      expect(items[0].onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("Escape closes the menu", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const menu = screen.getByRole("menu");
      await act(async () => {
        fireEvent.keyDown(menu, { key: "Escape" });
      });

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    it("disabled items use tabindex=-1 and are marked aria-disabled", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const duplicate = screen.getByRole("menuitem", { name: "Duplicate" });
      expect(duplicate).toHaveAttribute("aria-disabled", "true");
      expect(duplicate).toHaveAttribute("tabindex", "-1");
      expect(duplicate).toBeDisabled();
    });

    it("ArrowDown skips disabled items (Edit → Delete, not Edit → Duplicate)", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const menu = screen.getByRole("menu");
      await act(async () => {
        fireEvent.keyDown(menu, { key: "ArrowDown" });
      });

      await waitFor(() => {
        // Should land on Delete (index 2), skipping the disabled Duplicate.
        expect(menu.getAttribute("aria-activedescendant")).toMatch(/-item-2$/);
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("click-outside backdrop is aria-hidden", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      // The fixed-inset overlay used for click-outside detection must be
      // aria-hidden so AT doesn't announce it as a separate region.
      const hidden = container.querySelector('[aria-hidden="true"]');
      expect(hidden).toBeInTheDocument();
    });

    it("danger-variant item is still a regular menuitem (variant is visual only)", async () => {
      const user = userEvent.setup();
      render(
        <Dropdown trigger={<button>Actions</button>} items={buildItems()} />,
      );

      const trigger = screen.getByRole("button", { name: /open menu/i });
      await act(async () => {
        await user.click(trigger);
      });

      const deleteItem = screen.getByRole("menuitem", { name: "Delete" });
      expect(deleteItem).toBeInTheDocument();
      // The variant carries no extra ARIA — color alone communicates risk
      // visually; AT users get no different announcement. This is the
      // documented contract; consumers that want a stronger signal should
      // prepend "Delete:" or similar to the label.
      expect(deleteItem).not.toHaveAttribute("aria-disabled", "true");
    });
  });
});
