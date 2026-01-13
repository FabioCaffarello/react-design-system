import type { Meta, StoryObj } from '@storybook/react';
import Chip from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Tag',
  },
};

export const Removable: Story = {
  args: {
    children: 'Removable Tag',
    onRemove: () => console.log('Removed'),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip variant="default">Default</Chip>
      <Chip variant="outlined">Outlined</Chip>
      <Chip variant="filled">Filled</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

export const Selected: Story = {
  args: {
    children: 'Selected Tag',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Tag',
    disabled: true,
  },
};
