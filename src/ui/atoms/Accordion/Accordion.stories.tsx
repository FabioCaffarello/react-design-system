import type { Meta, StoryObj } from '@storybook/react';
import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Atoms/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
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
