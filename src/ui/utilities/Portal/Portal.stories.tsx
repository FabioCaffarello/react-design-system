import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import { Portal } from './Portal';
import { Button } from '../../atoms';

const meta: Meta<typeof Portal> = {
  title: 'Utilities/Portal',
  component: Portal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Portal

A utility component for rendering content outside the DOM hierarchy.
Useful for modals, tooltips, and dropdowns that need to escape parent overflow/stacking contexts.

### Use Cases
- Modals and dialogs
- Tooltips
- Dropdowns that need to escape overflow
- Popovers

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Portal é um componente utilitário | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Portal active | Component mounted | Content rendered in portal |
| \`unmounted\` | Portal inactive | Component unmounted | No content rendered |
| \`custom-container\` | Container customizado | \`containerId\` prop definida | Portal renderizado em container específico |
| \`append-to-body\` | Anexado ao body | \`appendToBody={true}\` | Portal anexado diretamente ao body |
        `,
      },
    },
  },
  argTypes: {
    containerId: {
      control: 'text',
      description: 'Container element ID',
    },
    appendToBody: {
      control: 'boolean',
      description: 'Whether to append to body directly',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal'}
        </Button>
        {isOpen && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <h2>Content in Portal</h2>
              <p>This content is rendered outside the normal DOM hierarchy.</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

export const CustomContainer: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal (Custom Container)'}
        </Button>
        {isOpen && (
          <Portal containerId="custom-portal">
            <div
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'lightblue',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Custom container portal
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

export const AppendToBody: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open (Append to Body)'}
        </Button>
        {isOpen && (
          <Portal appendToBody>
            <div
              style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                background: 'lightgreen',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Appended directly to body
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

// State Stories
export const DefaultState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal'}
        </Button>
        {isOpen && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <h2>Content in Portal</h2>
              <p>This content is rendered outside the normal DOM hierarchy.</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </Portal>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - portal active and content rendered.',
      },
    },
  },
};

export const UnmountedState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Portal is currently unmounted. Click the button to mount it.
        </p>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal'}
        </Button>
        {isOpen && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <h2>Content in Portal</h2>
              <p>This content is rendered outside the normal DOM hierarchy.</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </Portal>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Unmounted state - portal is not mounted.',
      },
    },
  },
};

export const CustomContainerState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal (Custom Container)'}
        </Button>
        {isOpen && (
          <Portal containerId="custom-portal">
            <div
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'lightblue',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Custom container portal
            </div>
          </Portal>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom container state - portal rendered in specific container.',
      },
    },
  },
};

export const AppendToBodyState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open (Append to Body)'}
        </Button>
        {isOpen && (
          <Portal appendToBody>
            <div
              style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                background: 'lightgreen',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Appended directly to body
            </div>
          </Portal>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Append to body state - portal appended directly to body.',
      },
    },
  },
};
