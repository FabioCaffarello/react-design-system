import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Drawer, { DrawerContent, DrawerHeader, DrawerFooter } from './Drawer';
import Button from '../Button/Button';
import { X } from 'lucide-react';

const meta: Meta<typeof Drawer> = {
  title: 'Atoms/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
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
