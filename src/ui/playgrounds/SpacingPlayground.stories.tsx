import type { Meta, StoryObj } from '@storybook/react';
import { SpacingPlayground } from './SpacingPlayground';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof SpacingPlayground> = {
  title: 'Playgrounds/Spacing Playground',
  component: SpacingPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Spacing Playground

Interactive playground for experimenting with spacing tokens.

## Features

- **Visual Scale**: See all spacing values side by side
- **Preview Modes**: Test spacing in different contexts (box, gap, padding, margin)
- **Real-world Examples**: See how spacing is used in components
- **Token Information**: View pixel, rem, and Tailwind values
- **Export/Import**: Save and load configurations
- **Code Generation**: Generate TypeScript, CSS, or Tailwind code
- **State Persistence**: Configuration saved to localStorage

## Usage

Use this playground to:
- Understand the spacing scale
- Visualize spacing values
- Test spacing in different contexts
- Find the right spacing for your layout
- Generate code for spacing configurations

## Preview Modes

- **Box**: Visualize spacing as a square box
- **Gap**: See spacing used as gap between elements
- **Padding**: Preview spacing as padding
- **Margin**: Preview spacing as margin

## Advanced Features

- **State Persistence**: Your configuration is automatically saved to localStorage
- **URL Parameters**: Share your configuration via URL (e.g., \`?spacing=lg&previewMode=padding\`)
- **Export/Import**: Save configurations as JSON files
- **Visual Scale**: See all spacing values in a visual scale for easy comparison
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
  tags: ['autodocs', 'playground'],
};

export default meta;
type Story = StoryObj<typeof SpacingPlayground>;

/**
 * Default Spacing Playground
 * 
 * Full-featured interactive playground with all spacing controls enabled.
 */
export const Default: Story = {
  name: 'Interactive Playground',
  parameters: {
    docs: {
      description: {
        story: 'Full-featured spacing playground with all controls and preview modes enabled. Switch between box, gap, padding, and margin modes to see spacing in different contexts.',
      },
    },
  },
};

/**
 * Spacing Scale View
 * 
 * Focus on visualizing the complete spacing scale.
 */
export const ScaleView: Story = {
  name: 'Spacing Scale View',
  parameters: {
    docs: {
      description: {
        story: 'View focused on the complete spacing scale visualization. See all spacing values from xs to 4xl in a visual comparison.',
      },
    },
  },
};

/**
 * Padding Mode
 * 
 * Focus on testing spacing as padding.
 */
export const PaddingMode: Story = {
  name: 'Padding Mode',
  parameters: {
    docs: {
      description: {
        story: 'View focused on testing spacing as padding. Useful for understanding how spacing tokens work as padding values.',
      },
    },
  },
};

/**
 * Gap Mode
 * 
 * Focus on testing spacing as gap between elements.
 */
export const GapMode: Story = {
  name: 'Gap Mode',
  parameters: {
    docs: {
      description: {
        story: 'View focused on testing spacing as gap between elements. Useful for grid and flex layouts.',
      },
    },
  },
};
