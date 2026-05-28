import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "./index";
import { Button } from "../../primitives";
import {
  Settings,
  User,
  LogOut,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
} from "lucide-react";

const meta: Meta<typeof Menu> = {
  title: "Molecules/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Menu

A menu component with support for icons, separators, submenus, and keyboard navigation.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o menu abre/fecha |
| \`onSelect\` | Item do menu selecionado | \`(value: string) => void\` | Quando um item do menu é selecionado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Menu fechado | Estado inicial | Menu oculto |
| \`open\` | Menu aberto | Clicar no trigger | Menu visível com itens |
| \`hover\` | Item com hover | Passar mouse sobre item | Item destacado |
        `,
      },
    },
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    onOpenChange: {
      description: "Callback fired when the menu open state changes",
      action: "onOpenChange",
      table: {
        type: { summary: "(open: boolean) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Open Menu</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Account</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<User className="h-4 w-4" />}>Profile</MenuItem>
        <MenuItem icon={<Settings className="h-4 w-4" />}>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<LogOut className="h-4 w-4" />}>Logout</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSeparators: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Edit className="h-4 w-4" />}>Edit</MenuItem>
        <MenuItem icon={<Copy className="h-4 w-4" />}>Copy</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 className="h-4 w-4" />}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Enabled Item</MenuItem>
        <MenuItem disabled>Disabled Item</MenuItem>
        <MenuItem>Another Enabled Item</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>More Options</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <MenuItem hasSubmenu>Item with Submenu</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-center">
        <Menu placement="top">
          <MenuTrigger>
            <Button>Top Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="flex justify-center">
        <Menu placement="bottom">
          <MenuTrigger>
            <Button>Bottom Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="flex justify-center gap-4">
        <Menu placement="left">
          <MenuTrigger>
            <Button>Left Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
        <Menu placement="right">
          <MenuTrigger>
            <Button>Right Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </div>
  ),
};

export const TableActions: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Edit className="h-4 w-4" />}>Edit</MenuItem>
        <MenuItem icon={<Copy className="h-4 w-4" />}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 className="h-4 w-4" />}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="space-y-4">
        <Button onClick={() => setOpen(!open)}>
          {open ? "Close Menu" : "Open Menu"}
        </Button>
        <Menu open={open} onOpenChange={setOpen}>
          <MenuTrigger>
            <Button>Controlled Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={() => setOpen(false)}>Close on Click</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    );
  },
};

export const WithOnClick: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          onClick={() => {
            alert("Edit clicked!");
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            alert("Delete clicked!");
          }}
        >
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = fn((newOpen: boolean) => {
      setOpen(newOpen);
      console.log("Menu open state changed:", newOpen);
    });

    const handleSelect = fn((value: string) => {
      console.log("Menu item selected:", value);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the menu below. Check the Actions panel to see events
          being fired.
        </p>
        <Menu open={open} onOpenChange={handleOpenChange}>
          <MenuTrigger>
            <Button>Interactive Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={() => handleSelect("profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleSelect("settings")}>
              Settings
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={() => handleSelect("logout")}>Logout</MenuItem>
          </MenuContent>
        </Menu>
        <p className="text-sm text-gray-500">
          Menu is {open ? "open" : "closed"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Get the first button with "Interactive Menu" text (there might be multiple)
    const triggers = canvas.getAllByRole("button", {
      name: /Interactive Menu/i,
    });
    const trigger = triggers[0]; // Use the first one

    // Test opening menu
    await userEvent.click(trigger);
    await waitFor(
      async () => {
        // Menu might be in a portal, check document.body
        const menu =
          within(document.body).queryByRole("menu") ||
          (await canvas.findByRole("menu").catch(() => null));
        expect(menu).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Test selecting item - menu might be in portal
    const menuContainer = within(document.body);
    const profileItem = await menuContainer.findByRole("menuitem", {
      name: /Profile/i,
    });
    await userEvent.click(profileItem);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all menu events. Interact with the menu and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Closed Menu</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
      </MenuContent>
    </Menu>
  ),
  parameters: {
    docs: {
      description: {
        story: "Closed state - menu is closed, trigger button is visible.",
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger>
          <Button>Open Menu</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuContent>
      </Menu>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - menu is open, shows list of items.",
      },
    },
  },
};
