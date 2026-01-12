import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    style: {
      control: 'select',
      options: ['solid', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const Styles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" style="solid">Solid</Badge>
      <Badge variant="success" style="outline">Outline</Badge>
      <Badge variant="error" style="solid">Solid</Badge>
      <Badge variant="error" style="outline">Outline</Badge>
      <Badge variant="info" style="solid">Solid</Badge>
      <Badge variant="info" style="outline">Outline</Badge>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Solid Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" size="sm">Success</Badge>
          <Badge variant="warning" size="md">Warning</Badge>
          <Badge variant="error" size="lg">Error</Badge>
          <Badge variant="info" size="md">Info</Badge>
          <Badge variant="primary" size="md">Primary</Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" style="outline" size="sm">Success</Badge>
          <Badge variant="warning" style="outline" size="md">Warning</Badge>
          <Badge variant="error" style="outline" size="lg">Error</Badge>
          <Badge variant="info" style="outline" size="md">Info</Badge>
          <Badge variant="primary" style="outline" size="md">Primary</Badge>
        </div>
      </div>
    </div>
  ),
};
