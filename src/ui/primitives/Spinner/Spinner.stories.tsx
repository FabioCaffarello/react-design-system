import type { Meta, StoryObj } from "@storybook/react";
import Spinner from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: `
## Spinner

A loading spinner component for indicating loading states.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Spinner é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`loading\` | Carregando | Estado padrão | Spinner animado |
| \`small\` | Tamanho pequeno | \`size="sm"\` | Spinner pequeno |
| \`medium\` | Tamanho médio | \`size="md"\` | Spinner médio |
| \`large\` | Tamanho grande | \`size="lg"\` | Spinner grande |
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Spinner size",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
      description: "Spinner color variant",
    },
    label: {
      control: "text",
      description: "Accessible label for screen readers",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: "md",
    variant: "primary",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="neutral" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    size: "md",
    variant: "primary",
    label: "Loading content...",
  },
};

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Small</p>
        <div className="flex items-center gap-4">
          <Spinner size="sm" variant="primary" />
          <Spinner size="sm" variant="secondary" />
          <Spinner size="sm" variant="neutral" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Medium</p>
        <div className="flex items-center gap-4">
          <Spinner size="md" variant="primary" />
          <Spinner size="md" variant="secondary" />
          <Spinner size="md" variant="neutral" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Large</p>
        <div className="flex items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <Spinner size="lg" variant="secondary" />
          <Spinner size="lg" variant="neutral" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All combinations of sizes and variants.",
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Spinner with accessible label:
        </p>
        <Spinner label="Loading user data..." />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Spinner without label (uses default):
        </p>
        <Spinner />
      </div>
      <p className="text-xs text-gray-500">
        Spinners have role="status" and aria-live="polite" for screen readers.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features: role="status", aria-live="polite", and aria-label.',
      },
    },
  },
};

// State Stories
export const LoadingState: Story = {
  args: {
    size: "md",
    variant: "primary",
    label: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state - spinner is animating, indicating a loading process.",
      },
    },
  },
};

export const SmallState: Story = {
  args: {
    size: "sm",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Small state - spinner with small size.",
      },
    },
  },
};

export const MediumState: Story = {
  args: {
    size: "md",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Medium state - spinner with medium size (default).",
      },
    },
  },
};

export const LargeState: Story = {
  args: {
    size: "lg",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Large state - spinner with large size.",
      },
    },
  },
};
