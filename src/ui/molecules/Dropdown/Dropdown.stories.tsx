import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from "react";
import Dropdown from "./Dropdown";
import { Button } from "../../atoms";

const meta = {
  title: "Molecules/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Dropdown

A dropdown menu component with full keyboard navigation support. Supports Arrow keys, Enter, Space, Escape, Home, and End keys. Includes proper ARIA attributes for accessibility.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` (item) | Item do dropdown clicado | \`(event: MouseEvent) => void\` | Quando um item do dropdown é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Dropdown fechado | Estado inicial | Dropdown não visível |
| \`open\` | Dropdown aberto | Ao clicar no trigger | Dropdown visível com itens |
| \`left-aligned\` | Alinhado à esquerda | \`align="left"\` | Menu alinhado à esquerda do trigger |
| \`right-aligned\` | Alinhado à direita | \`align="right"\` ou padrão | Menu alinhado à direita do trigger |
| \`default-variant\` | Variante padrão | \`variant="default"\` ou padrão | Estilo padrão do dropdown |
| \`minimal-variant\` | Variante minimal | \`variant="minimal"\` | Estilo minimal do dropdown |
| \`with-disabled-items\` | Com itens desabilitados | Itens com \`disabled={true}\` | Dropdown com itens desabilitados |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      control: false,
      description: "Trigger element (ReactNode)",
    },
    items: {
      control: false,
      description: "Array of dropdown items",
    },
    align: {
      control: "select",
      options: ["left", "right"],
      description: "Alignment of the dropdown menu relative to the trigger",
    },
    variant: {
      control: "select",
      options: ["default", "minimal"],
      description: "Visual variant of the dropdown",
    },
    'aria-label': {
      control: "text",
      description: "Accessible label for the dropdown trigger",
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string | null>(null);
    
    return (
      <div className="space-y-4">
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[
            { 
              label: "Edit", 
              onClick: () => {
                setLastAction("Edit clicked");
                console.log("Edit action");
              }
            },
            { 
              label: "Duplicate", 
              onClick: () => {
                setLastAction("Duplicate clicked");
                console.log("Duplicate action");
              }
            },
            { 
              label: "Delete", 
              onClick: () => {
                setLastAction("Delete clicked");
                console.log("Delete action");
              }, 
              variant: "danger" 
            },
          ]}
        />
        {lastAction && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Last action: <strong>{lastAction}</strong>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive dropdown with real callbacks. Click items to see the action logged below.",
      },
    },
  },
};

export const WithDisabledItem: Story = {
  args: {
    trigger: <Button>Actions</Button>,
    items: [
      { label: "Edit", onClick: () => {} },
      { label: "Archive", onClick: () => {}, disabled: true },
      { label: "Delete", onClick: () => {}, variant: "danger" },
    ],
  },
};

export const AlignedLeft: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
    align: "left",
  },
};

export const WithAriaLabel: Story = {
  args: {
    trigger: <Button>Actions</Button>,
    items: [
      { label: "Edit", onClick: () => {} },
      { label: "Delete", onClick: () => {}, variant: "danger" },
    ],
    'aria-label': "User actions menu",
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    
    const items = [
      { label: "First Item", onClick: () => setSelectedItem("First Item") },
      { label: "Second Item", onClick: () => setSelectedItem("Second Item") },
      { label: "Third Item", onClick: () => setSelectedItem("Third Item") },
      { label: "Disabled Item", onClick: () => {}, disabled: true },
      { label: "Last Item", onClick: () => setSelectedItem("Last Item") },
    ];
    
    return (
      <div className="space-y-4">
        <Dropdown
          trigger={<Button>Try Keyboard Navigation</Button>}
          items={items}
        />
        {selectedItem && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Selected via keyboard: <strong>{selectedItem}</strong>
          </div>
        )}
        <div className="text-sm text-gray-600 space-y-2 p-4 bg-gray-50 rounded">
          <p><strong>Keyboard Shortcuts:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click or Tab + Enter to open</li>
            <li>Arrow Up/Down to navigate</li>
            <li>Enter/Space to select</li>
            <li>Escape to close</li>
            <li>Home/End to jump to first/last</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Open the dropdown and try: Arrow Up/Down to navigate, Enter/Space to select, Escape to close, Home/End to jump to first/last item.",
      },
    },
  },
};

export const WithManyItems: Story = {
  render: () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    
    const manyItems = Array.from({ length: 20 }, (_, i) => ({
      label: `Option ${i + 1}`,
      onClick: () => setSelectedItem(`Option ${i + 1}`),
    }));
    
    return (
      <div className="space-y-4">
        <Dropdown
          trigger={<Button>Many Options</Button>}
          items={manyItems}
        />
        {selectedItem && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Selected: <strong>{selectedItem}</strong>
          </div>
        )}
        <div className="text-sm text-gray-600">
          <p>Dropdown with 20 items. Use keyboard navigation to quickly find items.</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Dropdown with many items demonstrating keyboard navigation performance.",
      },
    },
  },
};

export const WithActionFeedback: Story = {
  render: () => {
    const [actionHistory, setActionHistory] = useState<string[]>([]);
    
    const addToHistory = (action: string) => {
      setActionHistory(prev => [action, ...prev].slice(0, 5));
    };
    
    return (
      <div className="space-y-4">
        <Dropdown
          trigger={<Button>Actions with Feedback</Button>}
          items={[
            { 
              label: "Edit", 
              onClick: () => addToHistory("Edit action executed")
            },
            { 
              label: "Copy", 
              onClick: () => addToHistory("Copy action executed")
            },
            { 
              label: "Share", 
              onClick: () => addToHistory("Share action executed")
            },
            { 
              label: "Archive", 
              onClick: () => addToHistory("Archive action executed"),
              disabled: true
            },
            { 
              label: "Delete", 
              onClick: () => addToHistory("Delete action executed"), 
              variant: "danger" 
            },
          ]}
        />
        {actionHistory.length > 0 && (
          <div className="text-sm space-y-2">
            <p className="font-medium text-gray-700">Action History:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {actionHistory.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Dropdown with action feedback. Click items to see them logged in the action history.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    
    const items = [
      { label: "Option 1", onClick: () => setSelected("Option 1") },
      { label: "Option 2", onClick: () => setSelected("Option 2") },
      { label: "Danger Option", onClick: () => setSelected("Danger Option"), variant: "danger" as const },
    ];
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Default Variant</h3>
          <Dropdown
            trigger={<Button>Default Dropdown</Button>}
            items={items}
            variant="default"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Minimal Variant</h3>
          <Dropdown
            trigger={<Button variant="ghost">Minimal Dropdown</Button>}
            items={items}
            variant="minimal"
          />
        </div>
        {selected && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Last selected: <strong>{selected}</strong>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All visual variants of the dropdown component.',
      },
    },
  },
};

export const States: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Normal Items</h3>
          <Dropdown
            trigger={<Button>Normal Items</Button>}
            items={[
              { label: "Enabled Item 1", onClick: () => alert("Item 1") },
              { label: "Enabled Item 2", onClick: () => alert("Item 2") },
            ]}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">With Disabled Items</h3>
          <Dropdown
            trigger={<Button>With Disabled</Button>}
            items={[
              { label: "Enabled Item", onClick: () => alert("Enabled") },
              { label: "Disabled Item", onClick: () => {}, disabled: true },
              { label: "Another Enabled", onClick: () => alert("Enabled 2") },
            ]}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">With Danger Items</h3>
          <Dropdown
            trigger={<Button>With Danger</Button>}
            items={[
              { label: "Normal Item", onClick: () => alert("Normal") },
              { label: "Danger Item", onClick: () => alert("Danger!"), variant: "danger" },
            ]}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Different states: normal items, disabled items, and danger variant items.',
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string | null>(null);
    const handleItemClick = fn((action: string) => {
      setLastAction(action);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the button to open the dropdown, then click an item. Check the Actions panel to see events being fired.
        </p>
        <Dropdown
          trigger={<Button>Actions</Button>}
          items={[
            { 
              label: "Edit", 
              onClick: () => handleItemClick("Edit clicked")
            },
            { 
              label: "Duplicate", 
              onClick: () => handleItemClick("Duplicate clicked")
            },
            { 
              label: "Delete", 
              onClick: () => handleItemClick("Delete clicked"), 
              variant: "danger" 
            },
          ]}
        />
        {lastAction && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Last action: <strong>{lastAction}</strong>
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Actions');
    
    // Click to open dropdown
    await userEvent.click(button);
    await waitFor(async () => {
      const editItem = canvas.getByText('Edit');
      await userEvent.click(editItem);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates dropdown events. Open the dropdown and click items, then check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    trigger: <Button>Open Dropdown</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Closed state - dropdown is not visible.',
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="space-y-4">
        <Dropdown
          trigger={<Button onClick={() => setOpen(!open)}>Toggle Dropdown</Button>}
          items={[
            { label: "Option 1", onClick: () => setOpen(false) },
            { label: "Option 2", onClick: () => setOpen(false) },
          ]}
        />
        <p className="text-xs text-gray-500">Click the button to see the open state</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - dropdown is visible with items.',
      },
    },
  },
};

export const LeftAlignedState: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
    align: "left",
  },
  parameters: {
    docs: {
      description: {
        story: 'Left aligned state - dropdown menu is aligned to the left of the trigger.',
      },
    },
  },
};

export const RightAlignedState: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
    align: "right",
  },
  parameters: {
    docs: {
      description: {
        story: 'Right aligned state - dropdown menu is aligned to the right of the trigger (default).',
      },
    },
  },
};

export const DefaultVariantState: Story = {
  args: {
    trigger: <Button>Default Dropdown</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story: 'Default variant state - dropdown with default styling.',
      },
    },
  },
};

export const MinimalVariantState: Story = {
  args: {
    trigger: <Button variant="ghost">Minimal Dropdown</Button>,
    items: [
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} },
    ],
    variant: "minimal",
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal variant state - dropdown with minimal styling.',
      },
    },
  },
};

export const WithDisabledItemsState: Story = {
  args: {
    trigger: <Button>With Disabled</Button>,
    items: [
      { label: "Enabled Item", onClick: () => {} },
      { label: "Disabled Item", onClick: () => {}, disabled: true },
      { label: "Another Enabled", onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'With disabled items state - dropdown includes disabled items that cannot be clicked.',
      },
    },
  },
};
