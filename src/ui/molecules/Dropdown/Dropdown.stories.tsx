import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from "./Dropdown";
import { Button } from "../../atoms";

const meta = {
  title: "Molecules/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A dropdown menu component with full keyboard navigation support. Supports Arrow keys, Enter, Space, Escape, Home, and End keys. Includes proper ARIA attributes for accessibility.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
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
  args: {
    trigger: <Button>Actions</Button>,
    items: [
      { label: "Edit", onClick: () => {} },
      { label: "Duplicate", onClick: () => {} },
      { label: "Delete", onClick: () => {}, variant: "danger" },
    ],
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
  args: {
    trigger: <Button>Try Keyboard Navigation</Button>,
    items: [
      { label: "First Item", onClick: () => {} },
      { label: "Second Item", onClick: () => {} },
      { label: "Third Item", onClick: () => {} },
      { label: "Disabled Item", onClick: () => {}, disabled: true },
      { label: "Last Item", onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Open the dropdown and try: Arrow Up/Down to navigate, Enter/Space to select, Escape to close, Home/End to jump to first/last item.",
      },
    },
  },
};
