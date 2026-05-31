import type { Meta, StoryObj } from "@storybook/react-vite";
import Separator from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Separator

A separator component for dividing content sections.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Separator é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`horizontal\` | Orientação horizontal | \`orientation="horizontal"\` ou padrão | Separador horizontal |
| \`vertical\` | Orientação vertical | \`orientation="vertical"\` | Separador vertical |
| \`solid\` | Estilo sólido | \`variant="solid"\` ou padrão | Linha sólida |
| \`dashed\` | Estilo tracejado | \`variant="dashed"\` | Linha tracejada |
| \`dotted\` | Estilo pontilhado | \`variant="dotted"\` | Linha pontilhada |
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the separator",
    },
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Border style variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p>Content above</p>
      <Separator />
      <p>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-32">
      <p>Left content</p>
      <Separator orientation="vertical" />
      <p>Right content</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="mb-2">Solid</p>
        <Separator variant="solid" />
      </div>
      <div>
        <p className="mb-2">Dashed</p>
        <Separator variant="dashed" />
      </div>
      <div>
        <p className="mb-2">Dotted</p>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Horizontal Separators</p>
        <div className="space-y-4">
          <Separator orientation="horizontal" variant="solid" />
          <Separator orientation="horizontal" variant="dashed" />
          <Separator orientation="horizontal" variant="dotted" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Vertical Separators</p>
        <div className="flex items-center gap-4 h-32">
          <span>Left</span>
          <Separator orientation="vertical" variant="solid" />
          <span>Middle</span>
          <Separator orientation="vertical" variant="dashed" />
          <span>Right</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All combinations of orientation and variant.",
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-4">
      <div>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-fg-secondary">Content for section 1</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-fg-secondary">Content for section 2</p>
      </div>
      <Separator variant="dashed" />
      <div>
        <h3 className="text-lg font-semibold">Section 3</h3>
        <p className="text-sm text-fg-secondary">Content for section 3</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world example showing separators dividing content sections.",
      },
    },
  },
};

// State Stories
export const HorizontalState: Story = {
  args: {
    orientation: "horizontal",
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal state - separator divides content vertically (horizontal line).",
      },
    },
  },
};

export const VerticalState: Story = {
  args: {
    orientation: "vertical",
    variant: "solid",
  },
  render: (args) => (
    <div className="flex items-center gap-4 h-32">
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical state - separator divides content horizontally (vertical line).",
      },
    },
  },
};

export const SolidState: Story = {
  args: {
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story: "Solid state - separator with solid line style.",
      },
    },
  },
};

export const DashedState: Story = {
  args: {
    variant: "dashed",
  },
  parameters: {
    docs: {
      description: {
        story: "Dashed state - separator with dashed line style.",
      },
    },
  },
};

export const DottedState: Story = {
  args: {
    variant: "dotted",
  },
  parameters: {
    docs: {
      description: {
        story: "Dotted state - separator with dotted line style.",
      },
    },
  },
};
