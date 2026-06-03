import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { fn } from "storybook/test";
import CommandPalette from "./CommandPalette";
import Button from "../../primitives/Button/Button";
import {
  FileText,
  Folder,
  Settings,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
  Bell,
} from "lucide-react";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/CommandPalette",
  component: CommandPalette,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## CommandPalette

A command palette component for quick command search and execution. Supports keyboard navigation, grouping, filtering, and real-time search feedback.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura mudou | \`(open: boolean) => void\` | Quando o command palette é aberto ou fechado |
| \`action\` (item) | Comando executado | \`() => void\` | Quando um comando é selecionado e executado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Command palette fechado | Estado inicial | Command palette não visível |
| \`open\` | Command palette aberto | \`open={true}\` ou Cmd/Ctrl+K | Command palette visível |
| \`with-icons\` | Com ícones | Itens com \`icon\` prop | Comandos exibem ícones |
| \`with-groups\` | Com grupos | Itens com \`group\` prop | Comandos agrupados por categoria |
| \`with-descriptions\` | Com descrições | Itens com \`description\` prop | Comandos exibem descrições |
| \`empty\` | Sem comandos | \`items={[]}\` | Mensagem de "no commands" visível |
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: "Array of command items to display",
      control: false,
    },
    open: {
      description: "Controlled open state",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "undefined" },
      },
    },
    defaultOpen: {
      description: "Default open state (uncontrolled)",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onOpenChange: {
      description: "Callback fired when the open state changes",
      action: "onOpenChange",
      category: "Events",
      table: {
        type: { summary: "(open: boolean) => void" },
      },
    },
    trigger: {
      description: "Custom trigger element",
      control: false,
    },
    placeholder: {
      description: "Placeholder text for the search input",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "'Type a command or search...'" },
      },
    },
    emptyMessage: {
      description: "Message to display when no commands match the search",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "'No commands found'" },
      },
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const basicCommands = [
  { id: "1", label: "New File", action: () => alert("New File") },
  { id: "2", label: "Open File", action: () => alert("Open File") },
  { id: "3", label: "Save", action: () => alert("Save") },
  { id: "4", label: "Save As", action: () => alert("Save As") },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const handleOpenChange = fn((newOpen: boolean) => {
      setOpen(newOpen);
    });

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={basicCommands}
          open={open}
          onOpenChange={handleOpenChange}
        />
        <p className="mt-4 text-sm text-fg-secondary">
          Press Cmd/Ctrl + K to open, or click the button above
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /open command palette/i,
    });

    // Click to open
    await userEvent.click(button);

    // Wait for palette to appear in document.body (portal)
    await waitFor(() => {
      const input = within(document.body).getByPlaceholderText(
        /type a command or search/i,
      );
      expect(input).toBeInTheDocument();
    });

    // Type to search
    const input = within(document.body).getByPlaceholderText(
      /type a command or search/i,
    );
    await userEvent.type(input, "save");

    // Check that filtered results appear (look for button with "Save" text in the command palette)
    await waitFor(() => {
      const buttons = within(document.body).getAllByRole("button");
      const saveButton = buttons.find((btn) =>
        btn.textContent?.toLowerCase().includes("save"),
      );
      expect(saveButton).toBeDefined();
    });
  },
};

export const WithIcons: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithIcons = [
      {
        id: "1",
        label: "New File",
        icon: <FileText className="h-4 w-4" />,
        action: () => alert("New File"),
      },
      {
        id: "2",
        label: "Open Folder",
        icon: <Folder className="h-4 w-4" />,
        action: () => alert("Open Folder"),
      },
      {
        id: "3",
        label: "Search",
        icon: <Search className="h-4 w-4" />,
        action: () => alert("Search"),
      },
      {
        id: "4",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        action: () => alert("Settings"),
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithIcons}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const groupedCommands = [
      {
        id: "1",
        label: "New File",
        group: "File",
        action: () => alert("New File"),
      },
      {
        id: "2",
        label: "Open File",
        group: "File",
        action: () => alert("Open File"),
      },
      { id: "3", label: "Save", group: "File", action: () => alert("Save") },
      {
        id: "4",
        label: "User Settings",
        group: "Settings",
        action: () => alert("User Settings"),
      },
      {
        id: "5",
        label: "Preferences",
        group: "Settings",
        action: () => alert("Preferences"),
      },
      {
        id: "6",
        label: "Search",
        group: "Actions",
        action: () => alert("Search"),
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={groupedCommands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithDescriptions = [
      {
        id: "1",
        label: "New File",
        description: "Create a new file",
        icon: <FileText className="h-4 w-4" />,
        action: () => alert("New File"),
      },
      {
        id: "2",
        label: "Open File",
        description: "Open an existing file",
        icon: <Folder className="h-4 w-4" />,
        action: () => alert("Open File"),
      },
      {
        id: "3",
        label: "User Profile",
        description: "View and edit your profile",
        icon: <User className="h-4 w-4" />,
        action: () => alert("User Profile"),
      },
      {
        id: "4",
        label: "Notifications",
        description: "View your notifications",
        icon: <Bell className="h-4 w-4" />,
        action: () => alert("Notifications"),
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithDescriptions}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithKeywords: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithKeywords = [
      {
        id: "1",
        label: "Toggle Dark Mode",
        description: "Switch between light and dark theme",
        keywords: ["dark", "theme", "mode", "light"],
        icon: <Moon className="h-4 w-4" />,
        action: () => alert("Toggle Dark Mode"),
      },
      {
        id: "2",
        label: "Toggle Light Mode",
        description: "Switch to light theme",
        keywords: ["light", "theme", "mode", "bright"],
        icon: <Sun className="h-4 w-4" />,
        action: () => alert("Toggle Light Mode"),
      },
      {
        id: "3",
        label: "Sign Out",
        description: "Sign out of your account",
        keywords: ["logout", "exit", "signout", "leave"],
        icon: <LogOut className="h-4 w-4" />,
        action: () => alert("Sign Out"),
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithKeywords}
          open={open}
          onOpenChange={setOpen}
        />
        <p className="mt-4 text-sm text-fg-secondary">
          Try searching for "dark", "theme", "logout", etc.
        </p>
      </div>
    );
  },
};

export const ManyCommands: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const manyCommands = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      label: `Command ${i + 1}`,
      description: `Description for command ${i + 1}`,
      group: `Group ${Math.floor(i / 10) + 1}`,
      action: () => alert(`Command ${i + 1}`),
    }));

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={manyCommands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={[]}
          open={open}
          onOpenChange={setOpen}
          emptyMessage="No commands available"
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /open command palette/i,
    });

    await userEvent.click(button);

    // Wait for empty message
    await waitFor(() => {
      expect(
        within(document.body).getByText(/no commands available/i),
      ).toBeInTheDocument();
    });
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

    const commandsWithActions = basicCommands.map((cmd) => ({
      ...cmd,
      action: () => {
        setSelectedCommand(cmd.label);
        setOpen(false);
      },
    }));

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithActions}
          open={open}
          onOpenChange={setOpen}
        />
        {selectedCommand && (
          <p className="mt-4 text-sm text-fg-success">
            Selected: {selectedCommand}
          </p>
        )}
        <p className="mt-2 text-sm text-fg-secondary">
          Use Arrow Up/Down to navigate, Enter to select, Escape to close
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /open command palette/i,
    });

    await userEvent.click(button);

    // Wait for palette to appear in document.body (portal)
    await waitFor(() => {
      const input = within(document.body).getByPlaceholderText(
        /type a command or search/i,
      );
      expect(input).toBeInTheDocument();
    });

    const input = within(document.body).getByPlaceholderText(
      /type a command or search/i,
    );
    await expect(input).toHaveFocus();

    // Navigate with arrow keys
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    // Should close after selection
    await waitFor(() => {
      expect(
        within(document.body).queryByPlaceholderText(
          /type a command or search/i,
        ),
      ).not.toBeInTheDocument();
    });
  },
};

export const SearchWithKeywords: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithKeywords = [
      {
        id: "1",
        label: "Toggle Dark Mode",
        description: "Switch between light and dark theme",
        keywords: ["dark", "theme", "mode", "light"],
        icon: <Moon className="h-4 w-4" />,
        action: () => alert("Toggle Dark Mode"),
      },
      {
        id: "2",
        label: "Toggle Light Mode",
        description: "Switch to light theme",
        keywords: ["light", "theme", "mode", "bright"],
        icon: <Sun className="h-4 w-4" />,
        action: () => alert("Toggle Light Mode"),
      },
      {
        id: "3",
        label: "Sign Out",
        description: "Sign out of your account",
        keywords: ["logout", "exit", "signout", "leave"],
        icon: <LogOut className="h-4 w-4" />,
        action: () => alert("Sign Out"),
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithKeywords}
          open={open}
          onOpenChange={setOpen}
        />
        <p className="mt-4 text-sm text-fg-secondary">
          Try searching for "dark", "theme", "logout", etc. Keywords are also
          searchable.
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /open command palette/i,
    });

    await userEvent.click(button);

    // Wait for palette to appear in document.body (portal)
    await waitFor(() => {
      const input = within(document.body).getByPlaceholderText(
        /type a command or search/i,
      );
      expect(input).toBeInTheDocument();
    });

    const input = within(document.body).getByPlaceholderText(
      /type a command or search/i,
    );

    // Search by keyword
    await userEvent.clear(input);
    await userEvent.type(input, "logout");

    // Should find "Sign Out" via keyword (in document.body portal)
    await waitFor(() => {
      const buttons = within(document.body).getAllByRole("button");
      const signOutButton = buttons.find((btn) =>
        btn.textContent?.toLowerCase().includes("sign out"),
      );
      expect(signOutButton).toBeDefined();
    });
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const handleOpenChange = fn((newOpen: boolean) => {
      setOpen(newOpen);
    });
    const handleCommandAction = fn((command: string) => {
      console.log("Command executed:", command);
    });

    const commandsWithActions = basicCommands.map((cmd) => ({
      ...cmd,
      action: () => {
        handleCommandAction(cmd.label);
        setOpen(false);
      },
    }));

    return (
      <div className="p-8 space-y-4">
        <p className="text-sm text-fg-secondary">
          Open the command palette and select a command. Check the Actions panel
          to see events being fired.
        </p>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithActions}
          open={open}
          onOpenChange={handleOpenChange}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /open command palette/i,
    });

    await userEvent.click(button);
    await waitFor(() => {
      const input = within(document.body).getByPlaceholderText(
        /type a command or search/i,
      );
      expect(input).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates command palette events. Open and select commands, then check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    items: basicCommands,
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Closed state - command palette is not visible.",
      },
    },
  },
};

export const OpenState: Story = {
  args: {
    items: basicCommands,
    open: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - command palette is visible.",
      },
    },
  },
};

export const WithIconsState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithIcons = [
      {
        id: "1",
        label: "New File",
        icon: <FileText className="h-4 w-4" />,
        action: () => {},
      },
      {
        id: "2",
        label: "Open Folder",
        icon: <Folder className="h-4 w-4" />,
        action: () => {},
      },
      {
        id: "3",
        label: "Search",
        icon: <Search className="h-4 w-4" />,
        action: () => {},
      },
      {
        id: "4",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        action: () => {},
      },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithIcons}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With icons state - commands display icons.",
      },
    },
  },
};

export const WithGroupsState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const groupedCommands = [
      { id: "1", label: "New File", group: "File", action: () => {} },
      { id: "2", label: "Open File", group: "File", action: () => {} },
      { id: "3", label: "Save", group: "File", action: () => {} },
      { id: "4", label: "User Settings", group: "Settings", action: () => {} },
      { id: "5", label: "Preferences", group: "Settings", action: () => {} },
    ];

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={groupedCommands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With groups state - commands are organized into groups.",
      },
    },
  },
};

export const NoCommands: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={[]}
          open={open}
          onOpenChange={setOpen}
          emptyMessage="No commands available"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no commands are available.",
      },
    },
  },
};
