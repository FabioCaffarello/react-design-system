import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./Skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Skeleton

A skeleton loader component for displaying loading states. Includes proper ARIA attributes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Skeleton é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`text\` | Variante texto | \`variant="text"\` | Skeleton para texto |
| \`card\` | Variante card | \`variant="card"\` | Skeleton para card |
| \`list\` | Variante lista | \`variant="list"\` | Skeleton para lista |
| \`circle\` | Variante círculo | \`variant="circle"\` | Skeleton circular |
        `,
      },
    },
  },
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
    "aria-label": {
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
    "aria-label": "Loading user profile card",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton with custom aria-label for better screen reader experience.",
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
        <Skeleton
          variant="text"
          lines={3}
          aria-label="Loading article content"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading Avatar</h3>
        <Skeleton
          variant="circle"
          width="48px"
          height="48px"
          aria-label="Loading user avatar"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example of using multiple skeleton loaders together to show a loading state.",
      },
    },
  },
};

// State Stories
export const TextState: Story = {
  args: {
    variant: "text",
  },
  parameters: {
    docs: {
      description: {
        story: "Text state - skeleton for loading text content.",
      },
    },
  },
};

export const CardState: Story = {
  args: {
    variant: "card",
  },
  parameters: {
    docs: {
      description: {
        story: "Card state - skeleton for loading card content.",
      },
    },
  },
};

export const ListState: Story = {
  args: {
    variant: "list",
  },
  parameters: {
    docs: {
      description: {
        story: "List state - skeleton for loading list content.",
      },
    },
  },
};

export const CircleState: Story = {
  args: {
    variant: "circle",
    width: "48px",
    height: "48px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Circle state - skeleton for loading circular content (e.g., avatars).",
      },
    },
  },
};
