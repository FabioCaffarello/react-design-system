import type { Meta, StoryObj } from '@storybook/react';
import { TypographyPlayground } from './TypographyPlayground';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof TypographyPlayground> = {
  title: 'Playgrounds/Typography Playground',
  component: TypographyPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Typography Playground

Interactive playground for experimenting with typography tokens.

## Features

- **Font Sizes**: Preview all available font sizes (xs to 6xl)
- **Line Heights**: Test different line height values (none, tight, snug, normal, relaxed, loose)
- **Font Weights**: Explore font weight variations (light, normal, medium, semibold, bold)
- **Font Families**: Switch between sans, serif, and mono
- **Custom Text**: Enter your own text to preview
- **Token Information**: See Tailwind classes and values
- **Export/Import**: Save and load configurations
- **Code Generation**: Generate TypeScript, CSS, or Tailwind code
- **State Persistence**: Configuration saved to localStorage

## Usage

Use this playground to:
- Understand typography scale
- Test readability with different combinations
- Find the right typography for your use case
- See Tailwind class names for tokens
- Generate code for typography configurations

## Advanced Features

- **State Persistence**: Your configuration is automatically saved to localStorage
- **URL Parameters**: Share your configuration via URL
- **Export/Import**: Save configurations as JSON files
- **Real-time Preview**: See changes instantly
- **All Sizes View**: Compare all font sizes side by side
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
type Story = StoryObj<typeof TypographyPlayground>;

/**
 * Default Typography Playground
 * 
 * Full-featured interactive playground with all typography controls enabled.
 */
export const Default: Story = {
  name: 'Interactive Playground',
  parameters: {
    docs: {
      description: {
        story: 'Full-featured typography playground with all controls and features enabled. Adjust font size, line height, weight, and family to see real-time previews.',
      },
    },
  },
};

/**
 * Typography Comparison
 * 
 * Compare different typography settings side by side.
 */
export const Comparison: Story = {
  name: 'Typography Comparison',
  parameters: {
    docs: {
      description: {
        story: 'Use this view to compare different typography configurations. Adjust settings and see the preview update in real-time. The "All Font Sizes" section shows all sizes side by side.',
      },
    },
  },
};

/**
 * Readability Testing
 * 
 * Focus on testing typography readability with custom text.
 */
export const ReadabilityTesting: Story = {
  name: 'Readability Testing',
  parameters: {
    docs: {
      description: {
        story: 'Use this view to test typography readability. Enter your own text and adjust font size, line height, and weight to find the optimal combination.',
      },
    },
  },
};
