import type { Meta, StoryObj } from "@storybook/react";
import Tooltip from "./Tooltip";
import Button from "../Button/Button";

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A tooltip component that displays additional information on hover or focus. Supports keyboard navigation and includes proper ARIA attributes. Tooltips appear immediately on focus (no delay) for better keyboard accessibility.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip relative to the trigger element",
    },
    delay: {
      control: "number",
      description: "Delay in milliseconds before showing tooltip on hover (not applied on focus)",
    },
    'aria-label': {
      control: "text",
      description: "Accessible label for screen readers",
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
        story: "Tab to focus the button. The tooltip appears immediately without delay for keyboard users.",
      },
    },
  },
};

export const WithAriaLabel: Story = {
  args: {
    content: "Additional information",
    children: <Button>Button with tooltip</Button>,
    'aria-label': "Button that shows additional information on hover",
  },
};
