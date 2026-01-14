import type { Meta, StoryObj } from '@storybook/react';
import { AppBuilder } from '../../tools/AppBuilder/AppBuilder';
import { AppProvider } from '../../providers/AppProvider';

const meta: Meta<typeof AppBuilder> = {
  title: 'App/App Builder',
  component: AppBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# App Builder

Visual builder for creating complete applications using the design system components.

## Features

- **Feature-Based Architecture**: Build applications using modular features (pages, modules, flows, patterns)
- **Component Palette**: Access all design system components with search and filtering
- **Live Preview**: See your components rendered in real-time
- **Drag-and-Drop**: Reorder features with drag-and-drop
- **Code Generation**: Export complete React code for your application
- **Layout Configuration**: Configure grid, flex, stack, or container layouts
- **Context Providers**: Add data providers to your features
- **Validation**: Real-time validation with error feedback

## View Modes

- **Design**: Configure features, components, and layouts
- **Preview**: See live rendering with actual components or structure view
- **Code**: View the generated React code

## Getting Started

1. Create a new feature using the "Add" button or a template
2. Add components from the Component Palette
3. Configure component props in the Properties panel
4. Switch to Preview to see your work
5. Export the generated code

## Keyboard Shortcuts

- Click on features in the sidebar to select them
- Drag features to reorder them
- Click on components in preview to select and edit them

## Architecture

The App Builder uses a clean architecture with:
- \`useAppBuilder\` hook for state management
- Extracted components for maintainability
- Real-time component rendering with error boundaries
- Comprehensive validation system
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
type Story = StoryObj<typeof AppBuilder>;

/**
 * Default App Builder
 *
 * Start with an empty application
 */
export const Default: Story = {
  args: {
    initialAppConfig: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty App Builder ready to start building. Create features and add components to begin.',
      },
    },
  },
};

/**
 * App Builder with Dashboard Example
 *
 * Pre-configured with a dashboard feature showing cards and buttons
 */
export const WithDashboard: Story = {
  args: {
    initialAppConfig: {
      name: 'Dashboard App',
      description: 'A sample dashboard application',
      features: [
        {
          id: 'dashboard-main',
          name: 'Main Dashboard',
          description: 'Overview page with metrics and actions',
          category: 'page',
          components: [
            {
              id: 'welcome-card',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Welcome to the Dashboard',
              },
            },
            {
              id: 'primary-btn',
              type: 'atom',
              name: 'Button',
              props: {
                variant: 'primary',
                children: 'Get Started',
              },
            },
            {
              id: 'secondary-btn',
              type: 'atom',
              name: 'Button',
              props: {
                variant: 'outline',
                children: 'Learn More',
              },
            },
          ],
          layout: {
            type: 'stack',
            config: {
              spacing: 'base',
            },
          },
          metadata: {
            tags: ['dashboard', 'overview'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'App Builder pre-loaded with a dashboard example. Shows a Card and two Button components in a stack layout.',
      },
    },
  },
};

/**
 * App Builder with Form Example
 *
 * Pre-configured with a contact form feature
 */
export const WithForm: Story = {
  args: {
    initialAppConfig: {
      name: 'Contact Form App',
      description: 'A simple contact form application',
      features: [
        {
          id: 'contact-form',
          name: 'Contact Form',
          description: 'Contact form with input fields',
          category: 'module',
          components: [
            {
              id: 'name-input',
              type: 'atom',
              name: 'Input',
              props: {
                type: 'text',
                placeholder: 'Your name',
              },
            },
            {
              id: 'email-input',
              type: 'atom',
              name: 'Input',
              props: {
                type: 'email',
                placeholder: 'Your email',
              },
            },
            {
              id: 'message-input',
              type: 'atom',
              name: 'Textarea',
              props: {
                placeholder: 'Your message',
                rows: 4,
              },
            },
            {
              id: 'submit-btn',
              type: 'atom',
              name: 'Button',
              props: {
                variant: 'primary',
                children: 'Send Message',
              },
            },
          ],
          layout: {
            type: 'stack',
            config: {
              spacing: 'sm',
            },
          },
          metadata: {
            tags: ['form', 'contact'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'App Builder pre-loaded with a contact form example. Shows Input, Textarea, and Button components.',
      },
    },
  },
};

/**
 * App Builder with Multiple Features
 *
 * Shows how to organize an app with multiple features
 */
export const WithMultipleFeatures: Story = {
  args: {
    initialAppConfig: {
      name: 'Multi-Feature App',
      description: 'Application with multiple features',
      features: [
        {
          id: 'header-feature',
          name: 'Header',
          description: 'Application header with navigation',
          category: 'pattern',
          components: [
            {
              id: 'logo-badge',
              type: 'atom',
              name: 'Badge',
              props: {
                variant: 'primary',
                children: 'Logo',
              },
            },
            {
              id: 'nav-btn-1',
              type: 'atom',
              name: 'Button',
              props: {
                variant: 'ghost',
                children: 'Home',
              },
            },
            {
              id: 'nav-btn-2',
              type: 'atom',
              name: 'Button',
              props: {
                variant: 'ghost',
                children: 'About',
              },
            },
          ],
          layout: {
            type: 'flex',
            config: {
              direction: 'row',
              justify: 'space-between',
              align: 'center',
            },
          },
          metadata: {
            tags: ['header', 'navigation'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: 'content-feature',
          name: 'Main Content',
          description: 'Main content area',
          category: 'page',
          components: [
            {
              id: 'content-card',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Main content goes here',
              },
            },
          ],
          layout: {
            type: 'container',
            config: {
              maxWidth: 'lg',
              padding: 'base',
            },
          },
          metadata: {
            tags: ['content'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: 'footer-feature',
          name: 'Footer',
          description: 'Application footer',
          category: 'pattern',
          components: [
            {
              id: 'footer-text',
              type: 'atom',
              name: 'Badge',
              props: {
                variant: 'secondary',
                children: '© 2024 My App',
              },
            },
          ],
          layout: {
            type: 'container',
            config: {
              maxWidth: 'full',
              padding: 'sm',
            },
          },
          metadata: {
            tags: ['footer'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'App Builder with multiple features demonstrating how to organize an app with Header, Content, and Footer sections. Use drag-and-drop to reorder features.',
      },
    },
  },
};

/**
 * App Builder with Grid Layout
 *
 * Shows grid layout configuration
 */
export const WithGridLayout: Story = {
  args: {
    initialAppConfig: {
      name: 'Grid Layout App',
      description: 'Application using grid layout',
      features: [
        {
          id: 'grid-feature',
          name: 'Grid Gallery',
          description: 'Image gallery with grid layout',
          category: 'module',
          components: [
            {
              id: 'card-1',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Item 1',
              },
            },
            {
              id: 'card-2',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Item 2',
              },
            },
            {
              id: 'card-3',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Item 3',
              },
            },
            {
              id: 'card-4',
              type: 'molecule',
              name: 'Card',
              props: {
                children: 'Item 4',
              },
            },
          ],
          layout: {
            type: 'grid',
            config: {
              columns: 2,
              gap: '1rem',
            },
          },
          metadata: {
            tags: ['grid', 'gallery'],
            version: '1.0.0',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'App Builder with a grid layout example. Shows 4 cards in a 2-column grid. Demonstrates the Layout Editor capabilities.',
      },
    },
  },
};
