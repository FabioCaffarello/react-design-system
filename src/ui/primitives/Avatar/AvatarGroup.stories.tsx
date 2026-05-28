import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof AvatarGroup> = {
  title: "Primitives/Avatar/AvatarGroup",
  component: AvatarGroup,
  parameters: {
    docs: {
      description: {
        component: `
## AvatarGroup

A container component for displaying multiple avatars with optional overflow indicator.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | AvatarGroup é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Grupo de avatares sem overflow |
| \`with-overflow\` | Com overflow | Quando há mais avatares que \`max\` | Grupo com indicador "+N" |
| \`no-spacing\` | Sem espaçamento | \`spacing="none"\` | Avatares sem espaçamento |
| \`small-spacing\` | Espaçamento pequeno | \`spacing="sm"\` | Avatares com espaçamento pequeno |
| \`medium-spacing\` | Espaçamento médio | \`spacing="md"\` | Avatares com espaçamento médio |
| \`large-spacing\` | Espaçamento grande | \`spacing="lg"\` | Avatares com espaçamento grande |
        `,
      },
    },
  },
  argTypes: {
    max: {
      control: "number",
      description:
        "Maximum number of avatars to display before showing overflow indicator",
    },
    spacing: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Spacing between avatars",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of avatars in the group",
    },
    variant: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Shape variant of avatars",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar fallback="AB" alt="Alice Brown" />
    </AvatarGroup>
  ),
};

export const WithMax: Story = {
  render: () => (
    <AvatarGroup max={2}>
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar fallback="AB" alt="Alice Brown" />
      <Avatar fallback="CD" alt="Charlie Davis" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows only 2 avatars and displays +2 overflow indicator for the remaining avatars.",
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Small</p>
        <AvatarGroup size="sm">
          <Avatar fallback="JD" alt="User 1" size="sm" />
          <Avatar fallback="JS" alt="User 2" size="sm" />
          <Avatar fallback="AB" alt="User 3" size="sm" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Medium (default)</p>
        <AvatarGroup size="md">
          <Avatar fallback="JD" alt="User 1" size="md" />
          <Avatar fallback="JS" alt="User 2" size="md" />
          <Avatar fallback="AB" alt="User 3" size="md" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Large</p>
        <AvatarGroup size="lg">
          <Avatar fallback="JD" alt="User 1" size="lg" />
          <Avatar fallback="JS" alt="User 2" size="lg" />
          <Avatar fallback="AB" alt="User 3" size="lg" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const DifferentSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">No spacing</p>
        <AvatarGroup spacing="none">
          <Avatar fallback="JD" alt="User 1" />
          <Avatar fallback="JS" alt="User 2" />
          <Avatar fallback="AB" alt="User 3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Small spacing</p>
        <AvatarGroup spacing="sm">
          <Avatar fallback="JD" alt="User 1" />
          <Avatar fallback="JS" alt="User 2" />
          <Avatar fallback="AB" alt="User 3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Medium spacing (default)</p>
        <AvatarGroup spacing="md">
          <Avatar fallback="JD" alt="User 1" />
          <Avatar fallback="JS" alt="User 2" />
          <Avatar fallback="AB" alt="User 3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Large spacing</p>
        <AvatarGroup spacing="lg">
          <Avatar fallback="JD" alt="User 1" />
          <Avatar fallback="JS" alt="User 2" />
          <Avatar fallback="AB" alt="User 3" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
    </AvatarGroup>
  ),
};

export const MixedImagesAndFallbacks: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
      <Avatar fallback="AB" alt="Alice Brown" />
    </AvatarGroup>
  ),
};

export const WithOverflow: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar fallback="AB" alt="Alice Brown" />
      <Avatar fallback="CD" alt="Charlie Davis" />
      <Avatar fallback="EF" alt="Eve Foster" />
      <Avatar fallback="GH" alt="Grace Hall" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows 3 avatars and displays +3 overflow indicator for the remaining 3 avatars.",
      },
    },
  },
};

export const DifferentVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Circle (default)</p>
        <AvatarGroup variant="circle">
          <Avatar fallback="JD" alt="User 1" variant="circle" />
          <Avatar fallback="JS" alt="User 2" variant="circle" />
          <Avatar fallback="AB" alt="User 3" variant="circle" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Rounded</p>
        <AvatarGroup variant="rounded">
          <Avatar fallback="JD" alt="User 1" variant="rounded" />
          <Avatar fallback="JS" alt="User 2" variant="rounded" />
          <Avatar fallback="AB" alt="User 3" variant="rounded" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm mb-2">Square</p>
        <AvatarGroup variant="square">
          <Avatar fallback="JD" alt="User 1" variant="square" />
          <Avatar fallback="JS" alt="User 2" variant="square" />
          <Avatar fallback="AB" alt="User 3" variant="square" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

// State Stories
export const DefaultState: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar fallback="AB" alt="Alice Brown" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Default state - group of avatars without overflow indicator.",
      },
    },
  },
};

export const WithOverflowState: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="JS" alt="Jane Smith" />
      <Avatar fallback="AB" alt="Alice Brown" />
      <Avatar fallback="CD" alt="Charlie Davis" />
      <Avatar fallback="EF" alt="Eve Foster" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "With overflow state - group shows overflow indicator when there are more avatars than max.",
      },
    },
  },
};

export const NoSpacingState: Story = {
  render: () => (
    <AvatarGroup spacing="none">
      <Avatar fallback="JD" alt="User 1" />
      <Avatar fallback="JS" alt="User 2" />
      <Avatar fallback="AB" alt="User 3" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "No spacing state - avatars are displayed without spacing between them.",
      },
    },
  },
};

export const MediumSpacingState: Story = {
  render: () => (
    <AvatarGroup spacing="md">
      <Avatar fallback="JD" alt="User 1" />
      <Avatar fallback="JS" alt="User 2" />
      <Avatar fallback="AB" alt="User 3" />
    </AvatarGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: "Medium spacing state - avatars with medium spacing (default).",
      },
    },
  },
};
