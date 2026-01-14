import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layouts/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Container

A container component for constraining content width and providing consistent padding. 
Focused on structure and spacing without business logic.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Container é um componente de layout | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default container | Default props | Centered with default padding |
| \`full-width\` | Full width container | \`maxWidth="full"\` | No max-width constraint |
| \`no-center\` | Not centered | \`center={false}\` | Aligned to left |
| \`sm\` | Small max width | \`maxWidth="sm"\` | Container com largura máxima pequena |
| \`md\` | Medium max width | \`maxWidth="md"\` | Container com largura máxima média |
| \`lg\` | Large max width | \`maxWidth="lg"\` | Container com largura máxima grande |
| \`xl\` | Extra large max width | \`maxWidth="xl"\` | Container com largura máxima extra grande |
| \`2xl\` | 2X large max width | \`maxWidth="2xl"\` | Container com largura máxima 2X grande |
        `,
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Maximum width of the container',
    },
    paddingX: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'base', 'lg', 'xl'],
      description: 'Horizontal padding',
    },
    paddingY: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'base', 'lg', 'xl'],
      description: 'Vertical padding',
    },
    center: {
      control: 'boolean',
      description: 'Center the container content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Default container with max-width lg and base padding</p>
      </div>
    ),
  },
};

export const MaxWidths: Story = {
  render: () => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((width) => (
        <Container key={width} maxWidth={width} className="bg-gray-100 p-4 rounded">
          <p>Max width: {width}</p>
        </Container>
      ))}
    </div>
  ),
};

export const PaddingVariations: Story = {
  render: () => (
    <div className="space-y-4">
      {(['xs', 'sm', 'md', 'base', 'lg', 'xl'] as const).map((padding) => (
        <Container
          key={padding}
          paddingX={padding}
          paddingY="base"
          className="bg-gray-100 rounded"
        >
          <p>Padding X: {padding}</p>
        </Container>
      ))}
    </div>
  ),
};

export const NotCentered: Story = {
  args: {
    center: false,
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Container not centered (aligned to left)</p>
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    maxWidth: 'full',
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Full width container (no max-width constraint)</p>
      </div>
    ),
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Default container with max-width lg and base padding</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - container with standard max-width and padding.',
      },
    },
  },
};

export const FullWidthState: Story = {
  args: {
    maxWidth: 'full',
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Full width container (no max-width constraint)</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Full width state - container without max-width constraint.',
      },
    },
  },
};

export const NotCenteredState: Story = {
  args: {
    center: false,
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Container not centered (aligned to left)</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Not centered state - container aligned to left.',
      },
    },
  },
};

export const SmallMaxWidthState: Story = {
  args: {
    maxWidth: 'sm',
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Small max width container</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small max width state - container with small max-width.',
      },
    },
  },
};

export const LargeMaxWidthState: Story = {
  args: {
    maxWidth: 'lg',
    children: (
      <div className="bg-gray-100 p-4 rounded">
        <p>Large max width container</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large max width state - container with large max-width.',
      },
    },
  },
};
