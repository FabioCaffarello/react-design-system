import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Popover from './Popover';
import Button from '../Button/Button';

const meta: Meta<typeof Popover> = {
  title: 'Atoms/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args) => (
    <Popover {...args} trigger={<Button>Open Popover</Button>}>
      <p>This is popover content. It can contain any React elements.</p>
    </Popover>
  ),
};

export const WithTitle: Story = {
  render: (args) => (
    <Popover
      {...args}
      trigger={<Button>Open Popover</Button>}
      title="Popover Title"
    >
      <p>This popover has a title and close button.</p>
    </Popover>
  ),
  args: {
    showCloseButton: true,
  },
};

export const Placements: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center gap-8 p-16">
        <Popover
          trigger={<Button>Top</Button>}
          placement="top"
          title="Top Placement"
        >
          <p>Popover appears above the trigger</p>
        </Popover>
        <div className="flex gap-8">
          <Popover
            trigger={<Button>Left</Button>}
            placement="left"
            title="Left Placement"
          >
            <p>Popover appears to the left</p>
          </Popover>
          <Popover
            trigger={<Button>Right</Button>}
            placement="right"
            title="Right Placement"
          >
            <p>Popover appears to the right</p>
          </Popover>
        </div>
        <Popover
          trigger={<Button>Bottom</Button>}
          placement="bottom"
          title="Bottom Placement"
        >
          <p>Popover appears below the trigger</p>
        </Popover>
      </div>
    );
  },
};

export const RichContent: Story = {
  render: () => (
    <Popover
      trigger={<Button>Open Rich Popover</Button>}
      title="Rich Content Example"
      showCloseButton
    >
      <div className="space-y-2">
        <p className="text-sm">This popover contains rich content:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Lists</li>
          <li>Multiple paragraphs</li>
          <li>Any React components</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button size="sm" variant="primary">
            Action Button
          </Button>
        </div>
      </div>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="space-y-4">
        <Popover
          trigger={<Button>Toggle Popover</Button>}
          open={open}
          onOpenChange={setOpen}
          title="Controlled Popover"
          showCloseButton
        >
          <p>This popover is controlled by external state.</p>
          <p className="mt-2 text-sm text-gray-600">Open: {open ? 'Yes' : 'No'}</p>
        </Popover>
        <Button onClick={() => setOpen(!open)} variant="outline">
          External Toggle
        </Button>
      </div>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Popover
      trigger={<Button>Open</Button>}
      title="No Close Button"
      showCloseButton={false}
      closeOnClickOutside
    >
      <p>Click outside to close this popover.</p>
    </Popover>
  ),
};
