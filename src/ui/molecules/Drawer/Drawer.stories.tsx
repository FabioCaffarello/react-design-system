import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from './index';
import { Button } from '../../atoms';
import { X } from 'lucide-react';

const meta: Meta<typeof Drawer> = {
  title: 'Molecules/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Drawer

A drawer component that slides in from the edges of the screen. Supports multiple positions and sizes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o drawer abre/fecha |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Drawer fechado | Estado inicial | Drawer oculto |
| \`open\` | Drawer aberto | \`open={true}\` | Drawer visível |
| \`left\` | Posição esquerda | \`position="left"\` | Drawer desliza da esquerda |
| \`right\` | Posição direita | \`position="right"\` | Drawer desliza da direita |
| \`top\` | Posição superior | \`position="top"\` | Drawer desliza de cima |
| \`bottom\` | Posição inferior | \`position="bottom"\` | Drawer desliza de baixo |
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    onOpenChange: {
      description: 'Callback fired when the drawer open state changes',
      action: 'onOpenChange',
      table: {
        type: { summary: '(open: boolean) => void' },
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Drawer Title</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This is the drawer content. You can put any content here.</p>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const WithCloseButton: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent showCloseButton>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Drawer with Close Button</h2>
              <p>This drawer has a close button in the header.</p>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const [position, setPosition] = React.useState<'left' | 'right' | 'top' | 'bottom'>('right');
    const [open, setOpen] = React.useState(false);
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => { setPosition('left'); setOpen(true); }}>Left</Button>
          <Button onClick={() => { setPosition('right'); setOpen(true); }}>Right</Button>
          <Button onClick={() => { setPosition('top'); setOpen(true); }}>Top</Button>
          <Button onClick={() => { setPosition('bottom'); setOpen(true); }}>Bottom</Button>
        </div>
        <Drawer open={open} onOpenChange={setOpen} position={position}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">{position.charAt(0).toUpperCase() + position.slice(1)} Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This drawer opens from the {position}.</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
    const [open, setOpen] = React.useState(false);
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => { setSize('sm'); setOpen(true); }}>Small</Button>
          <Button onClick={() => { setSize('md'); setOpen(true); }}>Medium</Button>
          <Button onClick={() => { setSize('lg'); setOpen(true); }}>Large</Button>
          <Button onClick={() => { setSize('xl'); setOpen(true); }}>Extra Large</Button>
          <Button onClick={() => { setSize('full'); setOpen(true); }}>Full</Button>
        </div>
        <Drawer open={open} onOpenChange={setOpen} size={size}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">{size.toUpperCase()} Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This drawer has a {size} size.</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const WithoutOverlayClose: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} closeOnOverlayClick={false}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This drawer does not close when clicking the overlay.</p>
              <p className="mt-2">You must use the close button or Escape key.</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const ComplexContent: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Complex Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} size="lg">
          <DrawerContent showCloseButton>
            <DrawerHeader>
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your preferences</p>
            </DrawerHeader>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <h3 className="font-medium mb-2">General</h3>
                <p className="text-sm text-gray-600">General settings content...</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Notification settings content...</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Privacy</h3>
                <p className="text-sm text-gray-600">Privacy settings content...</p>
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save Changes</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    
    const handleOpenChange = fn((newOpen: boolean) => {
      setOpen(newOpen);
      console.log('Drawer open state changed:', newOpen);
    });
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Interactive Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>Interact with the drawer. Check the Actions panel to see events being fired.</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Open Drawer/i });
    
    // Test opening drawer
    await userEvent.click(button);
    await waitFor(() => {
      const drawer = canvas.queryByRole('dialog');
      expect(drawer).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates drawer events. Open and close the drawer and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Closed Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This drawer is closed.</p>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Closed state - drawer is hidden, ready to be opened.',
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(false)}>Close Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Open Drawer</h2>
            </DrawerHeader>
            <div className="p-6">
              <p>This drawer is open.</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - drawer is visible.',
      },
    },
  },
};
