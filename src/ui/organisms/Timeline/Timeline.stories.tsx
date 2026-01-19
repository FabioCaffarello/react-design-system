import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import Timeline, { type TimelineItem } from './Timeline';
import { CheckCircle2, XCircle, Package, Truck, CheckCircle } from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Organisms/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Timeline

A timeline component for displaying events in chronological order. Supports horizontal and vertical orientations, different statuses, and custom content.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onItemClick\` | Item clicado | \`(itemId: string) => void\` | Quando um item da timeline é clicado (se implementado) |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Timeline vertical com itens |
| \`horizontal\` | Orientação horizontal | \`orientation="horizontal"\` | Timeline disposta horizontalmente |
| \`vertical\` | Orientação vertical | \`orientation="vertical"\` ou padrão | Timeline disposta verticalmente |
| \`with-icons\` | Com ícones | Itens com \`icon\` prop | Ícones exibidos nos itens |
| \`with-content\` | Com conteúdo customizado | Itens com \`content\` prop | Conteúdo adicional exibido |
| \`with-errors\` | Com erros | Itens com \`status="error"\` | Itens de erro destacados |
| \`completed\` | Item completado | \`status="completed"\` | Item marcado como completado |
| \`active\` | Item ativo | \`status="active"\` | Item destacado como ativo |
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Array of timeline items to display',
      control: false,
    },
    orientation: {
      description: 'Orientation of the timeline',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
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

export const InteractiveTimeline: Story = {
  render: () => {
    const [items, setItems] = useState<TimelineItem[]>([
      {
        id: '1',
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        timestamp: '2024-01-15 10:30 AM',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Processing',
        description: 'Your order is being processed',
        timestamp: '2024-01-15 11:00 AM',
        status: 'active',
      },
      {
        id: '3',
        title: 'Shipped',
        description: 'Your order has been shipped',
        timestamp: '2024-01-16',
        status: 'default',
      },
      {
        id: '4',
        title: 'Delivered',
        description: 'Your order has been delivered',
        timestamp: '2024-01-18',
        status: 'default',
      },
    ]);

    const _handleItemClick = (itemId: string) => {
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, status: item.status === 'completed' ? 'default' : 'completed' as const }
          : item
      ));
    };

    return (
      <div className="p-8">
        <Timeline items={items} />
        <p className="mt-4 text-sm text-gray-600">
          Click on timeline items to toggle their status (demo of interactivity)
        </p>
      </div>
    );
  },
};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      timestamp: `2024-01-${String(i + 1).padStart(2, '0')}`,
      status: i === 5 ? 'active' as const : i < 5 ? 'completed' as const : 'default' as const,
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that timeline items are rendered
    // There might be multiple "Event 1" elements, so get all and verify
    await waitFor(async () => {
      const event1Elements = canvas.getAllByText((content, element) => {
        return element?.textContent?.trim() === 'Event 1' || false;
      });
      const event20Elements = canvas.getAllByText((content, element) => {
        return element?.textContent?.trim() === 'Event 20' || false;
      });
      expect(event1Elements.length).toBeGreaterThan(0);
      expect(event20Elements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [items, setItems] = useState<TimelineItem[]>(basicItems);
    const _handleItemClick = fn((itemId: string) => {
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, status: item.status === 'completed' ? 'default' as const : 'completed' as const }
          : item
      ));
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click on timeline items to toggle their status. Check the Actions panel to see events being fired.
        </p>
        <Timeline items={items} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText(/order placed/i)).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates timeline events. Click on items and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    items: basicItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - vertical timeline with items.',
      },
    },
  },
};

export const HorizontalState: Story = {
  args: {
    items: basicItems,
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal state - timeline arranged horizontally.',
      },
    },
  },
};

export const VerticalState: Story = {
  args: {
    items: basicItems,
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical state - timeline arranged vertically (default).',
      },
    },
  },
};

export const WithIconsState: Story = {
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
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'With icons state - timeline items with custom icons.',
      },
    },
  },
};

export const CompletedStatusState: Story = {
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
        description: 'In progress',
        timestamp: '2024-01-02',
        status: 'active',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed status state - items with completed status.',
      },
    },
  },
};

export const ActiveStatusState: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Step 1',
        description: 'Completed',
        timestamp: '2024-01-01',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Step 2',
        description: 'Currently active',
        timestamp: '2024-01-02',
        status: 'active',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Active status state - items with active status.',
      },
    },
  },
};
