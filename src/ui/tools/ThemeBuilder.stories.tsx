import type { Meta, StoryObj } from '@storybook/react';
import { ThemeBuilderComponent } from './ThemeBuilder';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof ThemeBuilderComponent> = {
  title: 'Tools/Theme Builder',
  component: ThemeBuilderComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Theme Builder

Interactive tool for building custom themes with real-time preview.

## Features

- **Theme Configuration**: Set theme name and base theme (light/dark)
- **Color Customization**: Adjust primary color with color picker
- **Real-time Preview**: See changes instantly in component preview
- **Export Options**: Export themes as JSON, CSS variables, or TypeScript
- **CSS Variables**: View generated CSS variables

## Usage

Use this tool to:
- Create custom themes for your application
- Test color combinations
- Generate CSS variables for your styles
- Export themes for use in production

## Export Formats

- **JSON**: Complete theme configuration
- **CSS Variables**: CSS custom properties
- **TypeScript**: Type-safe theme definition
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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeBuilderComponent>;

/**
 * Default Theme Builder
 * 
 * Interactive theme builder with all controls enabled.
 */
export const Default: Story = {
  name: 'Interactive Builder',
};
