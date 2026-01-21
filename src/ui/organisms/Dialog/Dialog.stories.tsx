import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
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
        component: `
## Dialog

A flexible dialog component using compound components pattern. Supports both controlled and uncontrolled modes.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o dialog abre/fecha |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Dialog fechado | Estado inicial | Dialog oculto |
| \`open\` | Dialog aberto | \`open={true}\` | Dialog visível |
        `,
      },
    },
  },
  argTypes: {
    onOpenChange: {
      description: 'Callback fired when the dialog open state changes',
      action: 'onOpenChange',
      table: {
        type: { summary: '(open: boolean) => void' },
        category: 'Events',
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
const _alertDialogMeta: Meta<typeof AlertDialog> = {
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

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpenChange = fn((newOpen: boolean) => {
      setIsOpen(newOpen);
      console.log('Dialog open state changed:', newOpen);
    });
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Interactive Dialog</Dialog.Title>
              <Dialog.Description>
                Interact with the dialog. Check the Actions panel to see events being fired.
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Open Dialog/i });
    
    // Test opening dialog
    await userEvent.click(button);
    // Wait for dialog to appear - it might be in a portal outside canvasElement
    await waitFor(async () => {
      const dialog = within(document.body).queryByRole('dialog');
      expect(dialog).toBeInTheDocument();
    }, { timeout: 3000 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates dialog events. Open and close the dialog and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Closed Dialog</Dialog.Title>
              <Dialog.Description>
                This dialog is closed.
              </Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Closed state - dialog is hidden, ready to be opened.',
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(false)}>Close Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Open Dialog</Dialog.Title>
              <Dialog.Description>
                This dialog is open.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state - dialog is visible.',
      },
    },
  },
};
