import type { Meta, StoryObj } from '@storybook/react';
import Separator from './Separator';

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p>Content above</p>
      <Separator />
      <p>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-32">
      <p>Left content</p>
      <Separator orientation="vertical" />
      <p>Right content</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="mb-2">Solid</p>
        <Separator variant="solid" />
      </div>
      <div>
        <p className="mb-2">Dashed</p>
        <Separator variant="dashed" />
      </div>
      <div>
        <p className="mb-2">Dotted</p>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-4">
      <div>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-gray-600">Content for section 1</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-gray-600">Content for section 2</p>
      </div>
      <Separator variant="dashed" />
      <div>
        <h3 className="text-lg font-semibold">Section 3</h3>
        <p className="text-sm text-gray-600">Content for section 3</p>
      </div>
    </div>
  ),
};
