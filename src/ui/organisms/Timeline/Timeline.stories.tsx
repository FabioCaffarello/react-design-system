import type { Meta, StoryObj } from '@storybook/react';
import Timeline from './Timeline';
import { CheckCircle2, XCircle, Package, Truck, CheckCircle } from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Organisms/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const basicItems = [
  {
    id: '1',
    title: 'Order Placed',
    description: 'Your order has been placed successfully',
    timestamp: '2024-01-15 10:30 AM',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Processing',
    description: 'Your order is being processed',
    timestamp: '2024-01-15 11:00 AM',
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Shipped',
    description: 'Your order has been shipped',
    timestamp: '2024-01-16',
    status: 'default' as const,
  },
  {
    id: '4',
    title: 'Delivered',
    description: 'Your order has been delivered',
    timestamp: '2024-01-18',
    status: 'default' as const,
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const Horizontal: Story = {
  args: {
    items: basicItems,
    orientation: 'horizontal',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Order Placed',
        description: 'Your order has been placed',
        timestamp: '2024-01-15',
        icon: <CheckCircle2 className="h-5 w-5" />,
        status: 'completed',
      },
      {
        id: '2',
        title: 'Processing',
        description: 'Your order is being processed',
        timestamp: '2024-01-16',
        icon: <Package className="h-5 w-5" />,
        status: 'active',
      },
      {
        id: '3',
        title: 'Shipped',
        description: 'Your order has been shipped',
        timestamp: '2024-01-17',
        icon: <Truck className="h-5 w-5" />,
        status: 'default',
      },
      {
        id: '4',
        title: 'Delivered',
        description: 'Your order has been delivered',
        timestamp: '2024-01-18',
        icon: <CheckCircle className="h-5 w-5" />,
        status: 'default',
      },
    ],
  },
};

export const WithContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Project Started',
        description: 'Initial project setup completed',
        timestamp: '2024-01-01',
        status: 'completed',
        content: (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              Repository created, initial dependencies installed, and project structure established.
            </p>
          </div>
        ),
      },
      {
        id: '2',
        title: 'Design Phase',
        description: 'UI/UX design completed',
        timestamp: '2024-01-15',
        status: 'active',
        content: (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Design mockups approved, component library created, and style guide finalized.
            </p>
          </div>
        ),
      },
      {
        id: '3',
        title: 'Development',
        description: 'Core features in development',
        timestamp: '2024-02-01',
        status: 'default',
      },
    ],
  },
};

export const WithErrors: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Step 1',
        description: 'Completed successfully',
        timestamp: '2024-01-01',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Step 2',
        description: 'Failed with error',
        timestamp: '2024-01-02',
        status: 'error',
        icon: <XCircle className="h-5 w-5" />,
      },
      {
        id: '3',
        title: 'Step 3',
        description: 'Pending',
        timestamp: '2024-01-03',
        status: 'default',
      },
    ],
  },
};

export const Simple: Story = {
  args: {
    items: [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' },
      { id: '3', title: 'Event 3' },
    ],
  },
};

export const LongContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Milestone 1',
        description: 'First major milestone achieved',
        timestamp: 'Q1 2024',
        status: 'completed',
        content: (
          <div className="mt-3 space-y-2">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Feature A implemented</li>
              <li>Feature B implemented</li>
              <li>Testing completed</li>
            </ul>
          </div>
        ),
      },
      {
        id: '2',
        title: 'Milestone 2',
        description: 'Second major milestone in progress',
        timestamp: 'Q2 2024',
        status: 'active',
        content: (
          <div className="mt-3 space-y-2">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Feature C in development</li>
              <li>Feature D planned</li>
            </ul>
          </div>
        ),
      },
      {
        id: '3',
        title: 'Milestone 3',
        description: 'Third major milestone planned',
        timestamp: 'Q3 2024',
        status: 'default',
      },
    ],
  },
};
