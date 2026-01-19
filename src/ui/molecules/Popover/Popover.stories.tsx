import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import Popover from './Popover';
import { Button } from '../../atoms';

const meta: Meta<typeof Popover> = {
  title: 'Molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Popover

A popover component that displays content in a floating panel, triggered by a button or element.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura mudou | \`(open: boolean) => void\` | Quando o popover é aberto ou fechado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Popover fechado | Estado inicial | Popover não visível |
| \`open\` | Popover aberto | Ao clicar no trigger | Popover visível com conteúdo |
| \`with-title\` | Com título | \`title\` prop definida | Popover com cabeçalho e título |
| \`without-close\` | Sem botão fechar | \`showCloseButton={false}\` | Popover sem botão X |
        `,
      },
    },
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

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const handleOpenChange = fn((newOpen: boolean) => {
      setOpen(newOpen);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the button to open/close the popover. Check the Actions panel to see events being fired.
        </p>
        <Popover
          trigger={<Button>Toggle Popover</Button>}
          open={open}
          onOpenChange={handleOpenChange}
          title="Event Demo"
          showCloseButton
        >
          <p>This popover fires events when opened/closed.</p>
          <p className="mt-2 text-sm text-gray-600">Open: {open ? 'Yes' : 'No'}</p>
        </Popover>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: /Toggle Popover/i });
    
    // Click to open
    await userEvent.click(button);
    await waitFor(async () => {
      const content = await canvas.findByText('This popover fires events when opened/closed.');
      expect(content).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click close button
    const closeButton = await canvas.findByRole('button', { name: /close/i });
    if (closeButton) {
      await userEvent.click(closeButton);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates popover events. Open and close the popover, then check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  render: () => (
    <Popover trigger={<Button>Open Popover</Button>}>
      <p>This popover is closed by default.</p>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Closed state - popover is not visible.',
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Popover
        trigger={<Button>Toggle</Button>}
        open={open}
        onOpenChange={setOpen}
        title="Open State"
        showCloseButton
      >
        <p>This popover is open by default.</p>
      </Popover>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - popover is visible.',
      },
    },
  },
};

export const WithTitleState: Story = {
  render: () => (
    <Popover
      trigger={<Button>Open</Button>}
      title="Popover Title"
      showCloseButton
    >
      <p>This popover has a title and close button.</p>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'With title state - popover includes a title header.',
      },
    },
  },
};

export const WithoutCloseButtonState: Story = {
  render: () => (
    <Popover
      trigger={<Button>Open</Button>}
      title="No Close Button"
      showCloseButton={false}
      closeOnClickOutside
    >
      <p>This popover has no close button. Click outside to close.</p>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Without close button state - popover has no X button, must close by clicking outside.',
      },
    },
  },
};
