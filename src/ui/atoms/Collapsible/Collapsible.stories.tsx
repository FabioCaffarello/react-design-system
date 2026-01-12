import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Collapsible from "./Collapsible";
import { Button, Text } from "../../atoms";

const meta: Meta<typeof Collapsible> = {
  title: "Atoms/Collapsible",
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component: "A generic, reusable collapsible component for any content. Supports both controlled and uncontrolled modes.",
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Initial open state (uncontrolled mode)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the collapsible is disabled",
    },
    duration: {
      control: "number",
      description: "Animation duration in milliseconds",
    },
  },
};

export const Default: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: true,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Click to toggle</Text>
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
        <Text as="span" className="font-medium">Click to expand</Text>
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
              <Text as="span" className="font-medium">Controlled Collapsible</Text>
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
        <Text as="span" className="font-medium">State persists in localStorage</Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>Toggle this and refresh the page - the state will be preserved!</Text>
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
        <Text as="span" className="font-medium">Disabled (cannot toggle)</Text>
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
        <Text as="span" className="font-medium">Accessible Collapsible</Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>This collapsible has proper ARIA attributes: aria-expanded, aria-controls, and keyboard support (Enter/Space).</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features: aria-expanded indicates state, aria-controls links trigger to content, and keyboard support (Enter/Space to toggle).',
      },
    },
  },
};

export const KeyboardNavigation: StoryObj<typeof Collapsible> = {
  args: {
    defaultOpen: false,
    trigger: (
      <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Try Keyboard Navigation</Text>
      </div>
    ),
    children: (
      <div className="px-4 py-2">
        <Text>Tab to focus, then press Enter or Space to toggle. The aria-expanded attribute updates automatically.</Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use Tab to focus the trigger, then Enter or Space to toggle. Screen readers will announce the state change.',
      },
    },
  },
};

export default meta;
