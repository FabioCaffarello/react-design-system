import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import Tooltip from "./Tooltip";
import Button from "../Button/Button";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Tooltip

A tooltip component that displays additional information on hover or focus. Supports keyboard navigation and includes proper ARIA attributes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o tooltip abre/fecha |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Tooltip fechado | Estado inicial | Tooltip oculto |
| \`open\` | Tooltip aberto | Hover ou focus | Tooltip visível |
| \`top\` | Posição superior | \`position="top"\` | Tooltip acima do elemento |
| \`bottom\` | Posição inferior | \`position="bottom"\` | Tooltip abaixo do elemento |
| \`left\` | Posição esquerda | \`position="left"\` | Tooltip à esquerda do elemento |
| \`right\` | Posição direita | \`position="right"\` | Tooltip à direita do elemento |
        `,
      },
    },
  },
  argTypes: {
    content: {
      control: "text",
      description: "Tooltip content text",
    },
    children: {
      control: false,
      description: "Trigger element (ReactNode)",
    },
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip relative to the trigger element",
    },
    delay: {
      control: "number",
      description:
        "Delay in milliseconds before showing tooltip on hover (not applied on focus)",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for screen readers",
    },
    onOpenChange: {
      description: "Callback fired when the tooltip open state changes",
      action: "onOpenChange",
      table: {
        type: { summary: "(open: boolean) => void" },
        category: "Events",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <Button>Hover me</Button>,
  },
};

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    children: <Button>Hover me</Button>,
    position: "top",
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    children: <Button>Hover me</Button>,
    position: "bottom",
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    children: <Button>Hover me</Button>,
    position: "left",
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    children: <Button>Hover me</Button>,
    position: "right",
  },
};

export const WithCustomDelay: Story = {
  args: {
    content: "This tooltip has a 500ms delay",
    children: <Button>Hover me (wait 500ms)</Button>,
    delay: 500,
  },
};

export const KeyboardAccessible: Story = {
  args: {
    content: "Press Tab to focus and see tooltip immediately",
    children: <Button>Focus me with Tab</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tab to focus the button. The tooltip appears immediately without delay for keyboard users.",
      },
    },
  },
};

export const WithAriaLabel: Story = {
  args: {
    content: "Additional information",
    children: <Button>Button with tooltip</Button>,
    "aria-label": "Button that shows additional information on hover",
  },
};

export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <Tooltip content="Tooltip on top" position="top">
        <Button>Top</Button>
      </Tooltip>
      <div className="flex gap-8">
        <Tooltip content="Tooltip on left" position="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip content="Tooltip on right" position="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
      <Tooltip content="Tooltip on bottom" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates all tooltip positions in a single view.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Try navigating with Tab key. Tooltips appear immediately on focus (no
        delay):
      </p>
      <div className="flex flex-col gap-2">
        <Tooltip content="First tooltip - appears immediately on focus">
          <Button>First Button (Tab here)</Button>
        </Tooltip>
        <Tooltip content="Second tooltip - appears immediately on focus">
          <Button>Second Button</Button>
        </Tooltip>
        <Tooltip content="Third tooltip - appears immediately on focus">
          <Button>Third Button</Button>
        </Tooltip>
      </div>
      <p className="text-xs text-gray-500">
        Tooltips support keyboard navigation: Tab to focus, tooltip appears
        immediately. Press Escape to close.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation. Tooltips appear immediately on focus (no delay) for better accessibility.",
      },
    },
  },
};

export const WithDifferentDelays: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Tooltip content="No delay (default 200ms)" delay={200}>
          <Button>Default delay (200ms)</Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip content="Fast delay" delay={100}>
          <Button>Fast delay (100ms)</Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip content="Slow delay" delay={500}>
          <Button>Slow delay (500ms)</Button>
        </Tooltip>
      </div>
      <p className="text-sm text-gray-600">
        Note: Delay only applies to hover. On focus, tooltip appears
        immediately.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates different delay options. Delay only applies to hover, not focus.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const handleOpenChange = fn((open: boolean) => {
      console.log("Tooltip open state changed:", open);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Hover or focus the button below. Check the Actions panel to see events
          being fired.
        </p>
        <Tooltip content="Interactive tooltip" onOpenChange={handleOpenChange}>
          <Button>Hover or Focus me</Button>
        </Tooltip>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test focus (tooltip should appear)
    await userEvent.tab();
    await waitFor(() => {
      expect(button).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates tooltip events. Hover or focus the button and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    content: "This tooltip is closed",
    children: <Button>Hover me</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Closed state - tooltip is hidden, ready to be shown on hover or focus.",
      },
    },
  },
};

export const OpenState: Story = {
  args: {
    content: "This tooltip is open",
    children: <Button>Hover me</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.hover(button);
    // Tooltip should be visible (visual state)
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - tooltip is visible on hover or focus.",
      },
    },
  },
};

export const TopPosition: Story = {
  args: {
    content: "Tooltip on top",
    children: <Button>Hover me</Button>,
    position: "top",
  },
  parameters: {
    docs: {
      description: {
        story: "Top position - tooltip appears above the trigger element.",
      },
    },
  },
};

export const BottomPosition: Story = {
  args: {
    content: "Tooltip on bottom",
    children: <Button>Hover me</Button>,
    position: "bottom",
  },
  parameters: {
    docs: {
      description: {
        story: "Bottom position - tooltip appears below the trigger element.",
      },
    },
  },
};
