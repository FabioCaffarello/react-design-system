import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./Skeleton";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A skeleton loader component for displaying loading states. Includes proper ARIA attributes (role='status', aria-busy='true') to indicate loading state to screen readers.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "card", "list", "circle"],
      description: "Visual variant of the skeleton",
    },
    width: {
      control: "text",
      description: "Custom width (e.g., '200px', '50%')",
    },
    height: {
      control: "text",
      description: "Custom height (e.g., '20px', '100px')",
    },
    lines: {
      control: "number",
      description: "Number of lines for text variant",
    },
    'aria-label': {
      control: "text",
      description: "Accessible label describing what is loading",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const TextMultipleLines: Story = {
  args: {
    variant: "text",
    lines: 3,
  },
};

export const Card: Story = {
  args: {
    variant: "card",
  },
};

export const List: Story = {
  args: {
    variant: "list",
  },
};

export const Circle: Story = {
  args: {
    variant: "circle",
    width: "48px",
    height: "48px",
  },
};

export const CustomSize: Story = {
  args: {
    variant: "text",
    width: "200px",
    height: "20px",
  },
};

export const WithAriaLabel: Story = {
  args: {
    variant: "card",
    'aria-label': "Loading user profile card",
  },
  parameters: {
    docs: {
      description: {
        story: "Skeleton with custom aria-label for better screen reader experience.",
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Loading User List</h3>
        <Skeleton variant="list" aria-label="Loading user list" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading Content</h3>
        <Skeleton variant="text" lines={3} aria-label="Loading article content" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading Avatar</h3>
        <Skeleton variant="circle" width="48px" height="48px" aria-label="Loading user avatar" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example of using multiple skeleton loaders together to show a loading state.",
      },
    },
  },
};
