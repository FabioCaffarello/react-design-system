import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Atoms/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: "A versatile badge component for displaying status, priority, and other labels. Supports multiple variants: success, warning, error, info, and neutral.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warning", "error", "info", "neutral"],
      description: "Visual variant of the badge",
    },
    children: {
      control: "text",
      description: "Content to display inside the badge",
    },
  },
};

export const Success: StoryObj<typeof Badge> = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: StoryObj<typeof Badge> = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Error: StoryObj<typeof Badge> = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const Info: StoryObj<typeof Badge> = {
  args: {
    children: "Info",
    variant: "info",
  },
};

export const Neutral: StoryObj<typeof Badge> = {
  args: {
    children: "Neutral",
    variant: "neutral",
  },
};

export const AllVariants: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};

export const WithCustomContent: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="success">Active</Badge>
      <Badge variant="error">Critical</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="info">New</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
  ),
};

export default meta;
