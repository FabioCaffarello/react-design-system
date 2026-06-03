import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Menu, {
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "./Menu";
import Button from "../../primitives/Button/Button";
import { Settings, User, LogOut } from "lucide-react";

describe("Menu", () => {
  describe("MenuTrigger", () => {
    it("renders trigger content", () => {
      render(
        <Menu>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );
      expect(screen.getByText("Open Menu")).toBeInTheDocument();
    });

    it("opens menu when clicked", async () => {
      render(
        <Menu>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      const trigger = screen.getByText("Open Menu");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });
    });

    it("has correct ARIA attributes", () => {
      render(
        <Menu>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      // MenuTrigger now merges trigger semantics onto the single child by
      // default (asChild inferred). The trigger IS the Button — not a
      // wrapping div + an inner button. Exactly one role="button" with the
      // accessible name. Do not "fix" this by re-adding a wrapper: that
      // would reintroduce nested-interactive.
      const trigger = screen.getByRole("button", { name: "Open Menu" });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("wraps in a div when asChild={false} is explicit (legacy opt-out)", () => {
      render(
        <Menu>
          <MenuTrigger asChild={false}>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      // Explicit opt-out preserves the legacy wrapper. Two role="button"
      // nodes exist (the div wrapper carrying trigger semantics + the
      // Button inside). This path is intentionally kept for any consumer
      // that needs the wrapping div as a layout/styling hook.
      const buttons = screen.getAllByRole("button", { name: "Open Menu" });
      expect(buttons).toHaveLength(2);
      const wrapper = buttons[0].closest('[aria-haspopup="menu"]');
      expect(wrapper?.tagName).toBe("DIV");
    });

    it("wraps in a div when there are multiple children (no single child to clone)", () => {
      render(
        <Menu>
          <MenuTrigger>
            <Button>Open Menu</Button>
            <span data-testid="badge">3</span>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      // Multi-child path falls back to wrap. Trigger semantics live on
      // the wrapper div; the children render as-is inside. This guards
      // the wrap-path against accidental removal — without this test,
      // the legacy branch is uncovered.
      const wrapper = screen
        .getByText("Open Menu")
        .closest('[aria-haspopup="menu"]');
      expect(wrapper?.tagName).toBe("DIV");
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });

    it("clones onto a single non-interactive child (span gets role='button')", () => {
      render(
        <Menu>
          <MenuTrigger>
            <span>Open</span>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      // Edge case: structural detection is single-element, not "is
      // interactive". A single <span> child gets role="button" +
      // tabIndex=0 + aria-haspopup merged — semantically valid trigger,
      // just unstyled. Consumers who want a button-styled wrapper can
      // pass asChild={false} explicitly. Documenting this so the
      // behavior isn't read as a bug.
      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger.tagName).toBe("SPAN");
      expect(trigger).toHaveAttribute("tabIndex", "0");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("toggles the menu on click (no stale asChild gate)", async () => {
      render(
        <Menu>
          <MenuTrigger asChild>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      // Regression test for the prior `if (!asChild) setIsOpen(...)`
      // gate: with asChild={true}, the menu must still toggle. The gate
      // is gone; this test guards against its return.
      const trigger = screen.getByRole("button", { name: "Open Menu" });
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });
    });
  });

  describe("MenuItem", () => {
    it("renders menu item", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });
    });

    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleClick}>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByText("Item 1");
        fireEvent.click(item);
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it("closes menu when clicked (unless hasSubmenu)", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(async () => {
        const item = screen.getByText("Item 1");
        fireEvent.click(item);

        await waitFor(() => {
          expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        });
      });
    });

    it("renders with icon", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem icon={<Settings data-testid="icon" />}>Settings</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("icon")).toBeInTheDocument();
      });
    });

    it("is disabled when disabled prop is true", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem disabled>Disabled Item</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByRole("menuitem", { name: "Disabled Item" });
        expect(item).toHaveAttribute("aria-disabled", "true");
        expect(item).toHaveAttribute("tabIndex", "-1");
      });
    });

    it("does not close menu when disabled item is clicked", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem disabled>Disabled Item</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByText("Disabled Item");
        fireEvent.click(item);
        expect(screen.getByText("Disabled Item")).toBeInTheDocument();
      });
    });

    it("shows submenu indicator when hasSubmenu is true", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem hasSubmenu>Submenu Item</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByRole("menuitem", { name: "Submenu Item" });
        // Should have chevron icon
        const chevron = item.querySelector("svg");
        expect(chevron).toBeInTheDocument();
      });
    });
  });

  describe("MenuSeparator", () => {
    it("renders separator", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuSeparator />
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const separator = screen.getByRole("separator");
        expect(separator).toBeInTheDocument();
      });
    });
  });

  describe("MenuContent", () => {
    it("renders menu content when open", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
      });
    });

    it("does not render when closed", () => {
      render(
        <Menu>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("closes menu on Escape key", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("activates menu item on Enter key", async () => {
      const handleClick = vi.fn();
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleClick}>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByText("Item 1");
        item.focus();
        fireEvent.keyDown(item, { key: "Enter" });
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it("activates menu item on Space key", async () => {
      const handleClick = vi.fn();
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={handleClick}>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        const item = screen.getByText("Item 1");
        item.focus();
        fireEvent.keyDown(item, { key: " " });
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled open state", async () => {
      const { rerender } = render(
        <Menu open={false}>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      rerender(
        <Menu open={true}>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("calls onOpenChange when state changes", async () => {
      const handleOpenChange = vi.fn();
      render(
        <Menu onOpenChange={handleOpenChange}>
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      const trigger = screen.getByText("Open Menu");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe("Placement", () => {
    it("renders with different placements", async () => {
      const { rerender } = render(
        <Menu defaultOpen placement="bottom">
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      rerender(
        <Menu defaultOpen placement="top">
          <MenuTrigger>
            <Button>Open Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });
  });

  describe("Complex Example", () => {
    it("renders complex menu with icons and separators", async () => {
      render(
        <Menu defaultOpen>
          <MenuTrigger>
            <Button>Account</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem icon={<User />}>Profile</MenuItem>
            <MenuItem icon={<Settings />}>Settings</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<LogOut />}>Logout</MenuItem>
          </MenuContent>
        </Menu>,
      );

      await waitFor(() => {
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
        expect(screen.getByRole("separator")).toBeInTheDocument();
      });
    });
  });
});
