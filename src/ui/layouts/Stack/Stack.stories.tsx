import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./Stack";

const meta: Meta<typeof Stack> = {
  title: "Layouts/Stack",
  component: Stack,
  parameters: {
    docs: {
      description: {
        component: `
## Stack

A layout component for vertical or horizontal stacking with consistent spacing.
Focused on structure and spacing without business logic.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Stack é um componente de layout | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default stack | Default props | Vertical column with base spacing |
| \`horizontal\` | Horizontal stack | \`direction="row"\` | Horizontal row layout |
| \`vertical\` | Vertical stack | \`direction="column"\` ou padrão | Vertical column layout |
| \`centered\` | Centered alignment | \`align="center"\` | Items centered vertically |
| \`start-aligned\` | Start alignment | \`align="start"\` ou padrão | Items aligned to start |
| \`end-aligned\` | End alignment | \`align="end"\` | Items aligned to end |
| \`stretch\` | Stretch alignment | \`align="stretch"\` | Items stretched to fill space |
| \`xs-spacing\` | Extra small spacing | \`spacing="xs"\` | Minimal spacing between items |
| \`sm-spacing\` | Small spacing | \`spacing="sm"\` | Small spacing between items |
| \`md-spacing\` | Medium spacing | \`spacing="md"\` | Medium spacing between items |
| \`lg-spacing\` | Large spacing | \`spacing="lg"\` | Large spacing between items |
| \`xl-spacing\` | Extra large spacing | \`spacing="xl"\` | Extra large spacing between items |
        `,
      },
    },
  },
  argTypes: {
    spacing: {
      control: "select",
      options: ["xs", "sm", "md", "base", "lg", "xl", "2xl"],
      description: "Spacing between children",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
      description: "Alignment of children",
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Justification of children",
    },
    direction: {
      control: "select",
      options: ["row", "column"],
      description: "Direction of stack",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="bg-blue-100 p-4 rounded">Item 1</div>
        <div className="bg-blue-100 p-4 rounded">Item 2</div>
        <div className="bg-blue-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
};

export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-8">
      {(["xs", "sm", "md", "base", "lg", "xl"] as const).map((spacing) => (
        <div key={spacing}>
          <p className="text-sm text-gray-600 mb-2">Spacing: {spacing}</p>
          <Stack spacing={spacing}>
            <div className="bg-blue-100 p-4 rounded">Item 1</div>
            <div className="bg-blue-100 p-4 rounded">Item 2</div>
            <div className="bg-blue-100 p-4 rounded">Item 3</div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: "row",
    children: (
      <>
        <div className="bg-green-100 p-4 rounded">Item 1</div>
        <div className="bg-green-100 p-4 rounded">Item 2</div>
        <div className="bg-green-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
};

export const Alignments: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "stretch"] as const).map((align) => (
        <div key={align}>
          <p className="text-sm text-gray-600 mb-2">Align: {align}</p>
          <Stack align={align} className="h-32">
            <div className="bg-purple-100 p-4 rounded w-24">Item 1</div>
            <div className="bg-purple-100 p-4 rounded w-24">Item 2</div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

// State Stories
export const DefaultState: Story = {
  args: {
    children: (
      <>
        <div className="bg-blue-100 p-4 rounded">Item 1</div>
        <div className="bg-blue-100 p-4 rounded">Item 2</div>
        <div className="bg-blue-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - vertical stack with base spacing.",
      },
    },
  },
};

export const HorizontalState: Story = {
  args: {
    direction: "row",
    children: (
      <>
        <div className="bg-green-100 p-4 rounded">Item 1</div>
        <div className="bg-green-100 p-4 rounded">Item 2</div>
        <div className="bg-green-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Horizontal state - items arranged horizontally.",
      },
    },
  },
};

export const VerticalState: Story = {
  args: {
    direction: "column",
    children: (
      <>
        <div className="bg-blue-100 p-4 rounded">Item 1</div>
        <div className="bg-blue-100 p-4 rounded">Item 2</div>
        <div className="bg-blue-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Vertical state - items arranged vertically (default).",
      },
    },
  },
};

export const CenteredAlignmentState: Story = {
  args: {
    align: "center",
    className: "h-32",
    children: (
      <>
        <div className="bg-purple-100 p-4 rounded w-24">Item 1</div>
        <div className="bg-purple-100 p-4 rounded w-24">Item 2</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Centered alignment state - items centered.",
      },
    },
  },
};

export const SmallSpacingState: Story = {
  args: {
    spacing: "sm",
    children: (
      <>
        <div className="bg-blue-100 p-4 rounded">Item 1</div>
        <div className="bg-blue-100 p-4 rounded">Item 2</div>
        <div className="bg-blue-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Small spacing state - minimal spacing between items.",
      },
    },
  },
};

export const LargeSpacingState: Story = {
  args: {
    spacing: "lg",
    children: (
      <>
        <div className="bg-blue-100 p-4 rounded">Item 1</div>
        <div className="bg-blue-100 p-4 rounded">Item 2</div>
        <div className="bg-blue-100 p-4 rounded">Item 3</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Large spacing state - large spacing between items.",
      },
    },
  },
};
