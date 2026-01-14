import type { Meta, StoryObj } from '@storybook/react';
import { AppBuilderPlayground } from './AppBuilderPlayground';
import { AppProvider } from '../providers/AppProvider';

const meta: Meta<typeof AppBuilderPlayground> = {
  title: 'Playgrounds/App Builder',
  component: AppBuilderPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# App Builder Playground

Interactive playground for building complete applications using the design system.

## Features

- **Visual App Builder**: Drag and compose features and components visually
- **Live Preview**: See your application rendered in real-time with actual components
- **Code Generation**: Export complete React code for your application
- **Templates**: Quick-start templates for common app types (Dashboard, Form, Landing Page)
- **Save & Load**: Persist your work to localStorage and continue later
- **Component Palette**: Access all design system components organized by category

## How to Use

1. **Create a New App**: Click "New App" to start with a blank canvas
2. **Use Templates**: Select a quick-start template to begin with a pre-built structure
3. **Add Features**: Features represent pages, modules, or flows in your app
4. **Add Components**: Use the Component Palette to add design system components
5. **Configure Props**: Edit component properties in the Properties panel
6. **Preview**: Switch to Preview mode to see your app rendered
7. **Export**: Export your app as JSON configuration or complete React code

## View Modes

- **Design**: Configure features, components, and layouts
- **Preview**: See live rendering of your components (with Live Preview or Structure view)
- **Code**: View the generated React code

## Saved Apps

Your apps are automatically saved to localStorage. You can:
- Load previous projects from the sidebar
- Delete projects you no longer need
- Search through your saved apps

## Templates

Quick-start templates help you begin with common patterns:
- **Dashboard App**: Cards and metrics layout
- **Form App**: Input fields and form structure
- **Landing Page**: Hero section with CTAs

## Tips

- Use the "Live Preview" button in Preview mode to see actual component rendering
- Hover over components in preview to see their names and select them
- The code view shows the generated React code - click "View Code" to copy it
- Use the sidebar toggle to maximize your workspace
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
type Story = StoryObj<typeof AppBuilderPlayground>;

/**
 * Default App Builder Playground
 *
 * Full-featured interactive playground with sidebar, templates, and saved apps.
 */
export const Default: Story = {
  name: 'Interactive Playground',
  parameters: {
    docs: {
      description: {
        story: 'Full-featured App Builder playground. Create new apps, use templates, or load saved projects. Build your application visually and export the generated code.',
      },
    },
  },
};

/**
 * With Dashboard Template
 *
 * Playground pre-loaded with a dashboard template.
 */
export const DashboardTemplate: Story = {
  name: 'Dashboard Template',
  parameters: {
    docs: {
      description: {
        story: 'Playground initialized with a dashboard app template. Shows cards and metrics layout structure.',
      },
    },
  },
};

/**
 * With Form Template
 *
 * Playground pre-loaded with a form template.
 */
export const FormTemplate: Story = {
  name: 'Form Template',
  parameters: {
    docs: {
      description: {
        story: 'Playground initialized with a form app template. Shows input fields and form structure.',
      },
    },
  },
};

/**
 * Compact Mode
 *
 * Playground with sidebar hidden for maximum workspace.
 */
export const CompactMode: Story = {
  name: 'Compact Mode',
  parameters: {
    docs: {
      description: {
        story: 'Playground with sidebar hidden to maximize the builder workspace. Click the toggle button to show/hide the sidebar.',
      },
    },
  },
};
