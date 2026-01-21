import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Accordion

An accordion component for displaying collapsible content sections.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onValueChange\` | Valor do accordion mudou | \`(value: string | string[]) => void\` | Quando um item é expandido/colapsado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Item fechado | Estado inicial | Item colapsado |
| \`open\` | Item aberto | Clicar no item | Item expandido |
| \`single\` | Modo único | \`type="single"\` | Apenas um item aberto por vez |
| \`multiple\` | Modo múltiplo | \`type="multiple"\` | Múltiplos itens podem estar abertos |
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    onValueChange: {
      description: 'Callback fired when the accordion value changes',
      action: 'onValueChange',
      table: {
        type: { summary: '(value: string | string[]) => void' },
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const basicItems = [
  {
    id: '1',
    title: 'What is this?',
    content: 'This is a frequently asked question with a detailed answer that explains the concept clearly.',
  },
  {
    id: '2',
    title: 'How does it work?',
    content: 'The system works by processing input data through a series of algorithms and returning the results.',
  },
  {
    id: '3',
    title: 'Is it free?',
    content: 'Yes, the basic version is free. Premium features are available with a subscription.',
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
    type: 'single',
  },
};

export const Multiple: Story = {
  args: {
    items: basicItems,
    type: 'multiple',
  },
};

export const WithDefaultOpen: Story = {
  args: {
    items: basicItems,
    type: 'single',
    defaultOpen: '1',
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      ...basicItems,
      {
        id: '4',
        title: 'Disabled Item',
        content: 'This item is disabled',
        disabled: true,
      },
    ],
    type: 'single',
  },
};

export const RichContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Features',
        content: (
          <div className="space-y-2">
            <h4 className="font-semibold">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Feature 1: Description of feature 1</li>
              <li>Feature 2: Description of feature 2</li>
              <li>Feature 3: Description of feature 3</li>
            </ul>
          </div>
        ),
      },
      {
        id: '2',
        title: 'Pricing',
        content: (
          <div className="space-y-2">
            <p className="text-sm">Our pricing is simple and transparent:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Basic Plan</span>
                <span className="font-semibold">$9/month</span>
              </div>
              <div className="flex justify-between">
                <span>Pro Plan</span>
                <span className="font-semibold">$29/month</span>
              </div>
            </div>
          </div>
        ),
      },
    ],
    type: 'single',
  },
};

export const LongContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Long Content Example',
        content: (
          <div className="space-y-4">
            <p>
              This is a longer content example to demonstrate how the accordion handles
              substantial amounts of text and content. The accordion should expand smoothly
              and provide a good user experience even with lengthy content.
            </p>
            <p>
              You can include multiple paragraphs, lists, images, or any other React components
              within the accordion content area. The component will handle the animation and
              layout automatically.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>First item in a list</li>
              <li>Second item in a list</li>
              <li>Third item in a list</li>
            </ul>
          </div>
        ),
      },
    ],
    type: 'single',
  },
};

// Event Stories
export const WithEvents: Story = {
  args: {
    items: basicItems,
    type: 'single',
  },
  render: (args) => {
    const handleValueChange = fn((value: string | string[]) => {
      console.log('Accordion value changed:', value);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click accordion items below. Check the Actions panel to see events being fired.
        </p>
        <Accordion {...args} onValueChange={handleValueChange} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    
    // Test clicking first item
    await userEvent.click(buttons[0]);
    await waitFor(() => {
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accordion events. Click accordion items and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    items: basicItems,
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'Closed state - all accordion items are collapsed.',
      },
    },
  },
};

export const OpenState: Story = {
  args: {
    items: basicItems,
    type: 'single',
    defaultOpen: '1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - first accordion item is expanded.',
      },
    },
  },
};

export const SingleMode: Story = {
  args: {
    items: basicItems,
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single mode - only one item can be open at a time.',
      },
    },
  },
};

export const MultipleMode: Story = {
  args: {
    items: basicItems,
    type: 'multiple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple mode - multiple items can be open simultaneously.',
      },
    },
  },
};
