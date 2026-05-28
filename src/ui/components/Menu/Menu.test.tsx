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

      const triggers = screen.getAllByRole("button", { name: "Open Menu" });
      const trigger = triggers[0]; // Get the MenuTrigger, not the Button inside
      const wrapper = trigger.closest('[aria-haspopup="menu"]');
      expect(wrapper).toBeInTheDocument();
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
