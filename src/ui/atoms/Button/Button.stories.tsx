import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { Play, X, Save, Download, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'outline', 'ghost', 'iconOnly'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'iconOnly',
    leftIcon: <X className="h-5 w-5" />,
    'aria-label': 'Close',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={<Play className="h-4 w-4" />}>Play</Button>
        <Button rightIcon={<Download className="h-4 w-4" />}>Download</Button>
        <Button leftIcon={<Save className="h-4 w-4" />} rightIcon={<X className="h-4 w-4" />}>
          Save and Close
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" leftIcon={<Play className="h-4 w-4" />}>Play</Button>
        <Button variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />}>Delete</Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading Button',
  },
};

export const LoadingWithText: Story = {
  args: {
    isLoading: true,
    loadingText: 'Saving...',
    children: 'Save',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="error">Error</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="iconOnly" leftIcon={<X className="h-5 w-5" />} aria-label="Close" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary" isLoading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />}>With Icon</Button>
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Buttons with proper ARIA labels:</p>
        <div className="flex gap-2">
          <Button aria-label="Save document">Save</Button>
          <Button variant="iconOnly" leftIcon={<X className="h-5 w-5" />} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
          <Button variant="iconOnly" leftIcon={<Save className="h-5 w-5" />} aria-label="Save changes">
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading state with aria-busy:</p>
        <Button isLoading aria-busy="true">
          Processing...
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Disabled state with aria-disabled:</p>
        <Button disabled aria-disabled="true">
          Disabled Action
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples demonstrating accessibility features: ARIA labels, aria-busy for loading, and aria-disabled for disabled states.',
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Try navigating with Tab key and activating buttons with Enter or Space:
      </p>
      <div className="flex flex-col gap-2">
        <Button>First Button (Tab here)</Button>
        <Button variant="secondary">Second Button</Button>
        <Button variant="outline">Third Button</Button>
        <Button variant="ghost">Fourth Button</Button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        All buttons support keyboard navigation: Tab to focus, Enter or Space to activate.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation support. Use Tab to navigate between buttons and Enter/Space to activate.',
      },
    },
  },
};
