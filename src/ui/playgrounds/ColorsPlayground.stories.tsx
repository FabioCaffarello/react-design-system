import type { Meta, StoryObj } from '@storybook/react';
import { ColorsPlayground } from './ColorsPlayground';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof ColorsPlayground> = {
  title: 'Playgrounds/Colors Playground',
  component: ColorsPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Colors Playground

Interactive playground for experimenting with color tokens.

## Features

- **Color Palette**: Explore all color roles and their shades (light, default, dark, contrast)
- **Contrast Testing**: Test color contrast for accessibility with WCAG compliance
- **Usage Examples**: See how colors are used in components (buttons, badges, cards, text)
- **Theme Toggle**: Switch between light and dark themes
- **Accessibility**: Check WCAG contrast ratios (AA and AAA levels)
- **Export/Import**: Save and load configurations
- **Code Generation**: Generate TypeScript, CSS, or Tailwind code
- **State Persistence**: Configuration saved to localStorage

## Usage

Use this playground to:
- Understand the color system
- Test color combinations
- Verify accessibility compliance
- See real-world color usage
- Generate code for color configurations

## View Modes

- **Palette**: Explore color palettes and shades
- **Contrast**: Test color contrast ratios for accessibility
- **Usage**: See examples of colors used in components

## Accessibility

The playground calculates WCAG contrast ratios:
- **AAA**: Minimum 7:1 for normal text, 4.5:1 for large text
- **AA**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Fail**: Below AA requirements

## Advanced Features

- **State Persistence**: Your configuration is automatically saved to localStorage
- **URL Parameters**: Share your configuration via URL (e.g., \`?colorRole=primary&viewMode=contrast\`)
- **Export/Import**: Save configurations as JSON files
- **Real-time Contrast**: See contrast ratios update as you change colors
- **WCAG Compliance**: Automatic checking of AA and AAA compliance levels
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
type Story = StoryObj<typeof ColorsPlayground>;

/**
 * Default Colors Playground
 * 
 * Full-featured interactive playground with all color controls enabled.
 */
export const Default: Story = {
  name: 'Interactive Playground',
  parameters: {
    docs: {
      description: {
        story: 'Full-featured colors playground with all controls and view modes enabled. Explore color palettes, test contrast, and see usage examples.',
      },
    },
  },
};

/**
 * Palette View
 * 
 * Focus on exploring color palettes.
 */
export const PaletteView: Story = {
  name: 'Palette View',
  parameters: {
    docs: {
      description: {
        story: 'View focused on exploring color palettes and shades. See all color roles and their variations (light, default, dark, contrast).',
      },
    },
  },
};

/**
 * Contrast Testing View
 * 
 * Focus on testing color contrast for accessibility.
 */
export const ContrastView: Story = {
  name: 'Contrast Testing',
  parameters: {
    docs: {
      description: {
        story: 'View focused on testing color contrast ratios for WCAG compliance. See real-time contrast calculations and accessibility levels.',
      },
    },
  },
};

/**
 * Usage Examples View
 * 
 * Focus on seeing colors used in real components.
 */
export const UsageView: Story = {
  name: 'Usage Examples',
  parameters: {
    docs: {
      description: {
        story: 'View focused on seeing how colors are used in real components like buttons, badges, cards, and text.',
      },
    },
  },
};

/**
 * All Colors Overview
 * 
 * See all color roles at once for quick reference.
 */
export const AllColors: Story = {
  name: 'All Colors Overview',
  parameters: {
    docs: {
      description: {
        story: 'Quick reference view showing all color roles at once. Useful for getting an overview of the complete color system.',
      },
    },
  },
};
