import type { Meta, StoryObj } from '@storybook/react';
import { ComponentAssistant } from '../../tools/DeveloperJourney/ComponentAssistant';
import { AppProvider } from '../../providers/AppProvider';

const meta: Meta<typeof ComponentAssistant> = {
  title: 'App/Component Builder',
  component: ComponentAssistant,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Component Builder

Create components directly in Storybook using the Component Builder.

## Features

- **Visual Builder**: Build components with a visual interface
- **Component Registry**: Components are automatically registered
- **Code Generation**: Generate component code, types, stories, and tests
- **Design Patterns**: Support for Factory, Builder, Strategy patterns

## Usage

1. Select component category (atom, molecule, organism, etc.)
2. Configure component properties
3. Add variants, sizes, and states
4. Generate code and stories
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
type Story = StoryObj<typeof ComponentAssistant>;

/**
 * Default Component Builder
 */
export const Default: Story = {};
