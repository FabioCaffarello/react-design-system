import type { Meta, StoryObj } from '@storybook/react';
import SidebarContent from './SidebarContent';
import Card from '../Card/Card';
import { Button } from '../../atoms';

const meta: Meta<typeof SidebarContent> = {
  title: 'Molecules/SidebarContent',
  component: SidebarContent,
  parameters: {
    docs: {
      description: {
        component: 'A scrollable content area for sidebars with optional header. Provides consistent styling and scroll behavior.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title to display in the header',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the header section',
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether the content area should be scrollable',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size for the content area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SidebarContent>;

export const Default: Story = {
  args: {
    title: 'Content Title',
    showHeader: true,
    scrollable: true,
    padding: 'lg',
    children: (
      <div className="space-y-4">
        <Card padding="md">
          <p>This is some content in the sidebar.</p>
        </Card>
        <Card padding="md">
          <p>More content here.</p>
        </Card>
        <Card padding="md">
          <p>Even more content.</p>
        </Card>
      </div>
    ),
  },
};

export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    scrollable: true,
    padding: 'lg',
    children: (
      <div className="space-y-4">
        <Card padding="md">
          <p>Content without header.</p>
        </Card>
      </div>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    title: 'No Padding',
    padding: 'none',
    children: (
      <div className="p-6">
        <p>Content with custom padding.</p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'Scrollable Content',
    scrollable: true,
    padding: 'lg',
    children: (
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <Card key={i} padding="md">
            <p>Item {i + 1}</p>
            <p className="text-sm text-gray-500">This is a long content item to demonstrate scrolling.</p>
          </Card>
        ))}
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Settings',
    padding: 'md',
    children: (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">General</h3>
          <Card padding="sm">
            <p className="text-sm">General settings content</p>
          </Card>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Advanced</h3>
          <Card padding="sm">
            <p className="text-sm">Advanced settings content</p>
          </Card>
        </div>
        <div className="pt-4">
          <Button variant="primary" className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    ),
  },
};
