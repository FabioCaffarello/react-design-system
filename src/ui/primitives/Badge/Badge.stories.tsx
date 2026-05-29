import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `
## Badge

A badge component for displaying status indicators, labels, or counts.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Badge é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`solid\` | Estilo sólido | \`style="solid"\` | Badge com fundo preenchido |
| \`outline\` | Estilo outline | \`style="outline"\` | Badge com borda apenas |
| \`small\` | Tamanho pequeno | \`size="sm"\` | Badge pequeno |
| \`medium\` | Tamanho médio | \`size="md"\` | Badge médio |
| \`large\` | Tamanho grande | \`size="lg"\` | Badge grande |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "success",
        "warning",
        "error",
        "info",
        "neutral",
        "primary",
        "secondary",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    style: {
      control: "select",
      options: ["solid", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const Styles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" style="solid">
        Solid
      </Badge>
      <Badge variant="success" style="outline">
        Outline
      </Badge>
      <Badge variant="error" style="solid">
        Solid
      </Badge>
      <Badge variant="error" style="outline">
        Outline
      </Badge>
      <Badge variant="info" style="solid">
        Solid
      </Badge>
      <Badge variant="info" style="outline">
        Outline
      </Badge>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Solid Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" size="sm">
            Success
          </Badge>
          <Badge variant="warning" size="md">
            Warning
          </Badge>
          <Badge variant="error" size="lg">
            Error
          </Badge>
          <Badge variant="info" size="md">
            Info
          </Badge>
          <Badge variant="primary" size="md">
            Primary
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" style="outline" size="sm">
            Success
          </Badge>
          <Badge variant="warning" style="outline" size="md">
            Warning
          </Badge>
          <Badge variant="error" style="outline" size="lg">
            Error
          </Badge>
          <Badge variant="info" style="outline" size="md">
            Info
          </Badge>
          <Badge variant="primary" style="outline" size="md">
            Primary
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Badges with proper ARIA labels:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" aria-label="Status: Active">
            Active
          </Badge>
          <Badge variant="error" aria-label="Status: Critical">
            Critical
          </Badge>
          <Badge variant="warning" aria-label="Status: Pending">
            Pending
          </Badge>
          <Badge variant="info" aria-label="Status: New">
            New
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Badges with non-string children and explicit aria-label:
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" aria-label="Status: 5 items">
            <span>5</span>
          </Badge>
          <Badge variant="error" aria-label="Status: 3 errors">
            <span>3</span>
          </Badge>
          <Badge variant="info" aria-label="Status: New notifications">
            <span>New</span>
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Badges with role="status" for screen readers:
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Task completed</Badge>
          <Badge variant="error">Task failed</Badge>
          <Badge variant="warning">Task in progress</Badge>
        </div>
        <p className="text-xs text-gray-500">
          Screen readers will announce these badges as status updates.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Examples demonstrating accessibility features: ARIA labels for non-string children, role="status" for screen readers, and proper labeling.',
      },
    },
  },
};

export const WithNonStringChildren: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Badges with ReactNode children:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" aria-label="5 items">
            <span>5</span>
          </Badge>
          <Badge variant="error" aria-label="3 errors">
            <span>3</span>
          </Badge>
          <Badge variant="info" aria-label="New notifications">
            <span>New</span>
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Badges with number children:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{42}</Badge>
          <Badge variant="secondary">{100}</Badge>
          <Badge variant="success">{0}</Badge>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        When children is not a string, provide an explicit aria-label for
        accessibility.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how to use badges with non-string children and the importance of providing aria-label for accessibility.",
      },
    },
  },
};

// State Stories
export const SolidState: Story = {
  args: {
    children: "Solid Badge",
    variant: "primary",
    style: "solid",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Solid state - badge with filled background.",
      },
    },
  },
};

export const OutlineState: Story = {
  args: {
    children: "Outline Badge",
    variant: "primary",
    style: "outline",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Outline state - badge with border only, no fill.",
      },
    },
  },
};

export const SmallState: Story = {
  args: {
    children: "Small Badge",
    variant: "primary",
    size: "sm",
  },
  parameters: {
    docs: {
      description: {
        story: "Small state - badge with small size.",
      },
    },
  },
};

export const MediumState: Story = {
  args: {
    children: "Medium Badge",
    variant: "primary",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Medium state - badge with medium size (default).",
      },
    },
  },
};

export const LargeState: Story = {
  args: {
    children: "Large Badge",
    variant: "primary",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Large state - badge with large size.",
      },
    },
  },
};
