import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ThemePlayground } from './ThemePlayground';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof ThemePlayground> = {
  title: 'Playgrounds/Theme Playground',
  component: ThemePlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Theme Playground

Interactive playground for experimenting with theme tokens in real-time.

## Features

- **Color Exploration**: Browse and preview all color roles (primary, secondary, success, warning, error, info, neutral)
- **Spacing Scale**: Visualize and test different spacing values from the design system
- **Typography**: Preview font sizes, line heights, and weights
- **Component Preview**: See how components look with selected tokens
- **Theme Toggle**: Switch between light and dark themes
- **Export/Import**: Save and load configurations as JSON
- **URL Sharing**: Share configurations via URL parameters
- **Code Generation**: Generate TypeScript, CSS, or Tailwind code
- **State Persistence**: Configuration saved to localStorage

## Usage

Use this playground to:
- Understand the design system tokens
- Test color combinations
- Experiment with spacing values
- Preview typography scales
- See real-time component previews
- Generate code for your projects

## Advanced Features

- **State Persistence**: Your configuration is automatically saved to localStorage
- **URL Parameters**: Share your configuration via URL (e.g., \`?colorRole=primary&spacing=lg&fontSize=xl\`)
- **Export/Import**: Save configurations as JSON files and import them later
- **Code Generation**: Copy generated code in TypeScript, CSS, or Tailwind format
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
type Story = StoryObj<typeof ThemePlayground>;

/**
 * Default Theme Playground
 * 
 * Full-featured interactive playground with all controls and features enabled.
 * Includes export/import, URL sharing, and code generation.
 */
export const Default: Story = {
  name: 'Interactive Playground',
  parameters: {
    docs: {
      description: {
        story: 'Full-featured theme playground with all controls and features enabled. Try adjusting colors, spacing, and typography to see real-time previews.',
      },
    },
  },
};

/**
 * Basic Theme Playground
 * 
 * Simplified view focusing on core functionality without advanced features.
 */
export const Basic: Story = {
  name: 'Basic View',
  parameters: {
    docs: {
      description: {
        story: 'Simplified playground view for quick token exploration without export/import features.',
      },
    },
  },
};

/**
 * Theme Playground with Preset
 * 
 * Playground initialized with a specific configuration via URL parameters.
 */
export const WithPreset: Story = {
  name: 'With Preset Configuration',
  parameters: {
    docs: {
      description: {
        story: 'Playground initialized with a preset configuration. You can modify the URL parameters to load different presets. Try: `?colorRole=primary&spacing=lg&fontSize=xl`',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simulate loading a preset by modifying URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('colorRole', 'primary');
      url.searchParams.set('spacing', 'lg');
      url.searchParams.set('fontSize', 'xl');
      window.history.replaceState({}, '', url.toString());
      // Trigger a page reload simulation
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  },
};

/**
 * Dark Theme Focus
 * 
 * Playground optimized for dark theme exploration.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme Focus',
  parameters: {
    docs: {
      description: {
        story: 'Playground view optimized for exploring dark theme configurations.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
