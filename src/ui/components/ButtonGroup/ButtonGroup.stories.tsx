import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ButtonGroup from "./ButtonGroup";
import Button from "../../primitives/Button/Button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## ButtonGroup

A container component for grouping related buttons together.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | ButtonGroup é um container | - | Eventos são dos botões filhos |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`horizontal\` | Orientação horizontal | \`orientation="horizontal"\` ou padrão | Botões dispostos horizontalmente |
| \`vertical\` | Orientação vertical | \`orientation="vertical"\` | Botões dispostos verticalmente |
| \`attached\` | Botões anexados | \`attached={true}\` | Botões sem espaçamento entre eles |
| \`detached\` | Botões separados | \`attached={false}\` ou padrão | Botões com espaçamento normal |
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    return (
      <div className="space-y-4">
        <ButtonGroup>
          <Button
            variant={activeButton === "left" ? "primary" : "secondary"}
            onClick={() => setActiveButton("left")}
          >
            Left
          </Button>
          <Button
            variant={activeButton === "middle" ? "primary" : "secondary"}
            onClick={() => setActiveButton("middle")}
          >
            Middle
          </Button>
          <Button
            variant={activeButton === "right" ? "primary" : "secondary"}
            onClick={() => setActiveButton("right")}
          >
            Right
          </Button>
        </ButtonGroup>
        {activeButton && (
          <p className="text-sm text-gray-600">
            Active button: <strong>{activeButton}</strong>
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Button group with real state. Click buttons to see them activate.",
      },
    },
  },
};

export const Attached: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
};

export const WithVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button group with different button variants.",
      },
    },
  },
};

export const WithActions: Story = {
  render: () => {
    const [actionHistory, setActionHistory] = useState<string[]>([]);

    const handleAction = (action: string) => {
      setActionHistory((prev) => [action, ...prev].slice(0, 5));
    };

    return (
      <div className="space-y-4">
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => handleAction("Save clicked")}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAction("Cancel clicked")}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("Delete clicked")}
          >
            Delete
          </Button>
        </ButtonGroup>
        {actionHistory.length > 0 && (
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-700">Action History:</p>
            <ul className="list-disc list-inside text-gray-600">
              {actionHistory.map((action, i) => (
                <li key={i}>{action}</li>
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
        story:
          "Button group with real actions. Click buttons to see them logged.",
      },
    },
  },
};

// State Stories
export const HorizontalState: Story = {
  render: () => (
    <ButtonGroup orientation="horizontal">
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal state - buttons are arranged horizontally (default).",
      },
    },
  },
};

export const VerticalState: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vertical state - buttons are arranged vertically.",
      },
    },
  },
};

export const AttachedState: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Attached state - buttons are attached together without spacing.",
      },
    },
  },
};

export const DetachedState: Story = {
  render: () => (
    <ButtonGroup attached={false}>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Detached state - buttons have normal spacing between them.",
      },
    },
  },
};
