import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { useState } from "react";
import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Primitives/Chip",
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: `
## Chip

A chip component for displaying tags, labels, or filters with optional remove functionality.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Chip clicado | \`(event: MouseEvent) => void\` | Quando o chip é clicado |
| \`onRemove\` | Chip removido | \`(event: MouseEvent) => void\` | Quando o botão de remover é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Chip normal |
| \`selected\` | Selecionado | \`selected={true}\` | Chip destacado |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Chip com opacidade reduzida |
| \`removable\` | Com botão remover | \`onRemove\` prop | Chip com botão X |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "filled"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    onClick: {
      description: "Callback fired when the chip is clicked",
      action: "onClick",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
    onRemove: {
      description: "Callback fired when the remove button is clicked",
      action: "onRemove",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Chip>Tag</Chip>
        <Chip>Another Tag</Chip>
        <Chip>Third Tag</Chip>
      </div>
      <p className="text-sm text-gray-600">
        Default chips for displaying tags or labels.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Default chips for displaying tags or labels.",
      },
    },
  },
};

export const Removable: Story = {
  render: () => {
    const [chips, setChips] = useState([
      "Removable Tag 1",
      "Removable Tag 2",
      "Removable Tag 3",
    ]);
    const [removedChip, setRemovedChip] = useState<string | null>(null);

    const handleRemove = (chip: string) => {
      setChips(chips.filter((c) => c !== chip));
      setRemovedChip(chip);
      setTimeout(() => setRemovedChip(null), 2000);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip key={chip} onRemove={() => handleRemove(chip)}>
              {chip}
            </Chip>
          ))}
        </div>
        {removedChip && (
          <p className="text-sm text-green-600">
            ✓ Removed: <strong>{removedChip}</strong>
          </p>
        )}
        {chips.length === 0 && (
          <p className="text-sm text-gray-500">
            All chips removed. Refresh to see them again.
          </p>
        )}
        <p className="text-sm text-gray-600">
          Click the X button to remove chips. Removed: {3 - chips.length} of 3
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chips with remove functionality. Click the X button to remove chips and see them disappear.",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip variant="default">Default</Chip>
      <Chip variant="outlined">Outlined</Chip>
      <Chip variant="filled">Filled</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

export const Selected: Story = {
  render: () => {
    const [selectedChips, setSelectedChips] = useState<Set<string>>(
      new Set(["Tag 1"]),
    );

    const toggleChip = (chip: string) => {
      const newSelected = new Set(selectedChips);
      if (newSelected.has(chip)) {
        newSelected.delete(chip);
      } else {
        newSelected.add(chip);
      }
      setSelectedChips(newSelected);
    };

    const chips = ["Tag 1", "Tag 2", "Tag 3"];

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip}
              selected={selectedChips.has(chip)}
              onClick={() => toggleChip(chip)}
            >
              {chip}
            </Chip>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Selected:{" "}
          <strong>{Array.from(selectedChips).join(", ") || "None"}</strong>
        </p>
        <p className="text-xs text-gray-500">
          Click chips to toggle their selected state.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chips with selectable state. Click chips to toggle their selected state.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Chip disabled>Disabled Tag</Chip>
        <Chip disabled selected>
          Disabled Selected
        </Chip>
        <Chip disabled onRemove={() => {}}>
          Disabled Removable
        </Chip>
      </div>
      <p className="text-sm text-gray-600">
        Disabled chips cannot be interacted with. Try clicking them - nothing
        happens.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled chips in various states. They cannot be clicked, selected, or removed.",
      },
    },
  },
};

export const Clickable: Story = {
  render: () => {
    const [clickedChip, setClickedChip] = useState<string | null>(null);
    const [clickCount, setClickCount] = useState(0);

    const handleClick = (chip: string) => {
      setClickedChip(chip);
      setClickCount((prev) => prev + 1);
      setTimeout(() => setClickedChip(null), 2000);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Chip onClick={() => handleClick("Filter 1")}>Filter 1</Chip>
          <Chip onClick={() => handleClick("Filter 2")}>Filter 2</Chip>
          <Chip onClick={() => handleClick("Filter 3")}>Filter 3</Chip>
        </div>
        {clickedChip && (
          <p className="text-sm text-green-600">
            ✓ Clicked: <strong>{clickedChip}</strong>
          </p>
        )}
        <p className="text-sm text-gray-600">
          Total clicks: <strong>{clickCount}</strong>
        </p>
        <p className="text-xs text-gray-500">
          Click chips to see them activate. Use Tab to focus, then Enter or
          Space to activate.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clickable chips with real click handling. Click chips to see feedback and click count.",
      },
    },
  },
};

export const ClickableAndRemovable: Story = {
  render: () => {
    const [chips, setChips] = useState(["Filter 1", "Filter 2", "Filter 3"]);
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleClick = (chip: string) => {
      setLastAction(`Clicked: ${chip}`);
      setTimeout(() => setLastAction(null), 2000);
    };

    const handleRemove = (chip: string) => {
      setChips(chips.filter((c) => c !== chip));
      setLastAction(`Removed: ${chip}`);
      setTimeout(() => setLastAction(null), 2000);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip}
              onClick={() => handleClick(chip)}
              onRemove={() => handleRemove(chip)}
            >
              {chip}
            </Chip>
          ))}
        </div>
        {lastAction && <p className="text-sm text-green-600">✓ {lastAction}</p>}
        {chips.length === 0 && (
          <p className="text-sm text-gray-500">All chips removed.</p>
        )}
        <p className="text-sm text-gray-600">
          Chips can be both clicked and removed. Click to activate, X button to
          remove.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chips that are both clickable and removable. Click to activate, use X button to remove.",
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Chips with proper ARIA labels:</p>
        <div className="flex gap-2">
          <Chip onClick={() => {}} aria-label="Filter by category: Technology">
            Technology
          </Chip>
          <Chip onClick={() => {}} aria-label="Filter by category: Design">
            Design
          </Chip>
          <Chip onClick={() => {}} aria-label="Filter by category: Marketing">
            Marketing
          </Chip>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Selected state with aria-selected:
        </p>
        <div className="flex gap-2">
          <Chip selected aria-label="Selected filter: Active">
            Active
          </Chip>
          <Chip selected={false} aria-label="Unselected filter: Inactive">
            Inactive
          </Chip>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Keyboard navigation: Use Tab to focus, Enter or Space to activate:
        </p>
        <div className="flex gap-2">
          <Chip onClick={() => alert("Filter 1 activated")}>Filter 1</Chip>
          <Chip onClick={() => alert("Filter 2 activated")}>Filter 2</Chip>
          <Chip onClick={() => alert("Filter 3 activated")}>Filter 3</Chip>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Removable chips with descriptive aria-label:
        </p>
        <div className="flex gap-2">
          <Chip onRemove={() => {}} aria-label="Applied filter: Technology">
            Technology
          </Chip>
          <Chip onRemove={() => {}} aria-label="Applied filter: Design">
            Design
          </Chip>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples demonstrating accessibility features: ARIA labels, keyboard navigation (Tab, Enter, Space), and proper role attributes.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [activatedChip, setActivatedChip] = useState<string | null>(null);

    const handleActivate = (chip: string) => {
      setActivatedChip(chip);
      setTimeout(() => setActivatedChip(null), 2000);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Try navigating with Tab key and activating chips with Enter or Space:
        </p>
        <div className="flex flex-col gap-2">
          <Chip onClick={() => handleActivate("First Chip")}>
            First Chip (Tab here)
          </Chip>
          <Chip onClick={() => handleActivate("Second Chip")}>Second Chip</Chip>
          <Chip onClick={() => handleActivate("Third Chip")}>Third Chip</Chip>
          <Chip onClick={() => handleActivate("Fourth Chip")}>Fourth Chip</Chip>
        </div>
        {activatedChip && (
          <p className="text-sm text-green-600">
            ✓ Activated: <strong>{activatedChip}</strong>
          </p>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Keyboard shortcuts:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              <strong>Tab</strong>: Navigate to next chip
            </li>
            <li>
              <strong>Shift + Tab</strong>: Navigate to previous chip
            </li>
            <li>
              <strong>Enter</strong>: Activate focused chip
            </li>
            <li>
              <strong>Space</strong>: Activate focused chip
            </li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation support. Use Tab to navigate between chips and Enter/Space to activate. See feedback when chips are activated.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [chips, setChips] = useState(["Chip 1", "Chip 2", "Chip 3"]);

    const handleClick = fn((chip: string) => {
      console.log("Chip clicked:", chip);
    });

    const handleRemove = fn((chip: string) => {
      setChips(chips.filter((c) => c !== chip));
      console.log("Chip removed:", chip);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the chips below. Check the Actions panel to see events
          being fired.
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip}
              onClick={() => handleClick(chip)}
              onRemove={() => handleRemove(chip)}
            >
              {chip}
            </Chip>
          ))}
        </div>
        <p className="text-sm text-gray-500">Chips remaining: {chips.length}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chips = canvas.getAllByRole("button");

    // Test click
    await userEvent.click(chips[0]);
    await waitFor(() => {
      expect(chips[0]).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all chip events. Interact with the chips and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    children: "Default Chip",
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - chip is ready for interaction.",
      },
    },
  },
};

export const SelectedState: Story = {
  args: {
    children: "Selected Chip",
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Selected state - chip is selected and highlighted.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    children: "Disabled Chip",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - chip is not interactive, shows reduced opacity.",
      },
    },
  },
};

export const RemovableState: Story = {
  args: {
    children: "Removable Chip",
    onRemove: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Removable state - chip has a remove button (X).",
      },
    },
  },
};
