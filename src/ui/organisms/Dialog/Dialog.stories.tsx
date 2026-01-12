import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Dialog from './Dialog';
import AlertDialog from './AlertDialog';
import { Button } from '../../atoms';
import { Input, Label } from '../../atoms';

const meta: Meta<typeof Dialog> = {
  title: 'Organisms/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: 'A flexible dialog component using compound components pattern. Supports both controlled and uncontrolled modes. Includes portal rendering, focus trap, and full accessibility.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.Description>
                This is a dialog description. It provides additional context about the dialog.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Dialog content goes here.</p>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Uncontrolled Dialog</Dialog.Title>
          <Dialog.Description>
            This dialog uses uncontrolled mode with Dialog.Trigger.
          </Dialog.Description>
        </Dialog.Header>
        <div className="p-6 pt-0">
          <p>Click outside or press Escape to close.</p>
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content size="lg">
            <Dialog.Header>
              <Dialog.Title>Create New Item</Dialog.Title>
              <Dialog.Description>
                Fill in the form below to create a new item.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Create</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'>('md');
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <div className="space-x-2 mb-4">
          {(['sm', 'md', 'lg', 'xl', 'fullscreen'] as const).map((s) => (
            <Button key={s} variant={size === s ? 'primary' : 'outline'} onClick={() => { setSize(s); setIsOpen(true); }}>
              {s}
            </Button>
          ))}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>Dialog Size: {size}</Dialog.Title>
              <Dialog.Description>
                This dialog demonstrates the {size} size variant.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Content area for {size} dialog.</p>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};

export const WithoutOverlayClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content closeOnOverlayClick={false}>
            <Dialog.Header>
              <Dialog.Title>Important Dialog</Dialog.Title>
              <Dialog.Description>
                This dialog cannot be closed by clicking the overlay. You must use the close button or Escape key.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Click outside won't close this dialog.</p>
            </div>
            <Dialog.Footer>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};

// AlertDialog Stories
const alertDialogMeta: Meta<typeof AlertDialog> = {
  title: 'Organisms/Dialog/AlertDialog',
  component: AlertDialog,
  parameters: {
    docs: {
      description: {
        component: 'A specialized dialog for confirmations and alerts. Built on top of Dialog with pre-configured layout.',
      },
    },
  },
  tags: ['autodocs'],
};

export const AlertDialogDefault: StoryObj<typeof AlertDialog> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Alert</Button>
        <AlertDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          onConfirm={() => alert('Confirmed!')}
        />
      </>
    );
  },
};

export const AlertDialogDestructive: StoryObj<typeof AlertDialog> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="error" onClick={() => setIsOpen(true)}>Delete Item</Button>
        <AlertDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Delete Item"
          description="Are you sure? This action cannot be undone."
          variant="destructive"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => alert('Deleted!')}
        />
      </>
    );
  },
};
