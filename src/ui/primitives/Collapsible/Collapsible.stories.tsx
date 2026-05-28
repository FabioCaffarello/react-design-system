import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { useState } from "react";
import Collapsible from "./Collapsible";
import { Button, Text } from "../../primitives";

const meta: Meta<typeof Collapsible> = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component: `
## Collapsible

A generic, reusable collapsible component for any content. Supports both controlled and uncontrolled modes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o collapsible abre/fecha |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Collapsible fechado | Estado inicial ou \`open={false}\` | Conteúdo oculto |
| \`open\` | Collapsible aberto | \`open={true}\` ou clicar | Conteúdo visível |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Collapsible não interativo |
        `,
      },
    },
  },
  argTypes: {
    trigger: {
      control: false,
      description: "Content for the toggle button (ReactNode)",
    },
    children: {
      control: false,
      description: "Content to show/hide (ReactNode)",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state (uncontrolled mode)",
    },
    open: {
      control: "boolean",
      description: "Controlled open state",
    },
    onOpenChange: {
      description: "Callback fired when the collapsible open state changes",
      action: "onOpenChange",
      table: {
        type: { summary: "(open: boolean) => void" },
        category: "Events",
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the collapsible",
    },
    duration: {
      control: "number",
      description: "Animation duration in milliseconds",
    },
    storageKey: {
      control: "text",
      description: "localStorage key for persisting state",
    },
  },
};

export const Default: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Click to toggle
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This is collapsible content that can be shown or hidden.</Text>
      </div>
    ),
  },
};

export const DefaultClosed: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Click to expand
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This content starts collapsed.</Text>
      </div>
    ),
  },
};

export const Controlled: StoryObj<typeof Collapsible> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="space-y-4">
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"} (External Control)
        </Button>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <div className="px-4 py-2 bg-gray-100 rounded-md">
              <Text as="span" className="font-medium">
                Controlled Collapsible
              </Text>
            </div>
          }
        >
          <div className="px-4 py-2">
            <Text>This collapsible is controlled by external state.</Text>
          </div>
        </Collapsible>
      </div>
    );
  },
};

export const WithStorage: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    storageKey: "storybook-collapsible-state",
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          State persists in localStorage
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>
          Toggle this and refresh the page - the state will be preserved!
        </Text>
      </div>
    ),
  },
};

export const Disabled: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    disabled: true,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md opacity-50">
        <Text as="span" className="font-medium">
          Disabled (cannot toggle)
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This content cannot be toggled.</Text>
      </div>
    ),
  },
};

export const Accessibility: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Accessible Collapsible
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>
          This collapsible has proper ARIA attributes: aria-expanded,
          aria-controls, and keyboard support (Enter/Space).
        </Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates accessibility features: aria-expanded indicates state, aria-controls links trigger to content, and keyboard support (Enter/Space to toggle).",
      },
    },
  },
};

export const KeyboardNavigation: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Try Keyboard Navigation
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>
          Tab to focus, then press Enter or Space to toggle. The aria-expanded
          attribute updates automatically.
        </Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use Tab to focus the trigger, then Enter or Space to toggle. Screen readers will announce the state change.",
      },
    },
  },
};

export const Uncontrolled: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Uncontrolled Collapsible
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>
          This collapsible uses defaultOpen and manages its own state
          internally.
        </Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates uncontrolled mode using defaultOpen prop.",
      },
    },
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Collapsible> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = fn((open: boolean) => {
      setIsOpen(open);
      console.log("Collapsible open state changed:", open);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the trigger below. Check the Actions panel to see events being
          fired.
        </p>
        <Collapsible
          open={isOpen}
          onOpenChange={handleOpenChange}
          trigger={
            <div className="px-4 py-2 bg-gray-100 rounded-md">
              <Text as="span" className="font-medium">
                Interactive Collapsible
              </Text>
            </div>
          }
        >
          <div className="px-4 py-2">
            <Text>This collapsible demonstrates events.</Text>
          </div>
        </Collapsible>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger =
      canvas.getByText("Interactive Collapsible").closest("button") ||
      canvas.getByRole("button");

    // Test click
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates collapsible events. Click the trigger and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Closed Collapsible
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This collapsible starts closed.</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Closed state - collapsible is collapsed, content is hidden.",
      },
    },
  },
};

export const OpenState: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">
          Open Collapsible
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This collapsible starts open.</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - collapsible is expanded, content is visible.",
      },
    },
  },
};

export const DisabledState: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    disabled: true,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md opacity-50">
        <Text as="span" className="font-medium">
          Disabled Collapsible
        </Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This collapsible is disabled and cannot be toggled.</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - collapsible is not interactive, shows reduced opacity.",
      },
    },
  },
};

export default meta;
