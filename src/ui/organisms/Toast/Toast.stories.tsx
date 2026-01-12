import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, ToastContainer, useToast } from './index';
import { Button } from '../../atoms';

// Wrapper component for stories
function ToastDemo({ position = 'top-right' as const }: { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' }) {
  const toast = useToast();

  return (
    <div className="space-y-4 p-8">
      <div className="space-x-2">
        <Button onClick={() => toast.success('Success!', 'Operation completed successfully')}>
          Show Success
        </Button>
        <Button variant="error" onClick={() => toast.error('Error!', 'Something went wrong')}>
          Show Error
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('Warning!', 'Please be careful')}>
          Show Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('Info', 'Here is some information')}>
          Show Info
        </Button>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          onClick={() => toast.success('With Action', 'Click the action button', {
            action: {
              label: 'View Details',
              onClick: () => alert('Action clicked!'),
            },
          })}
        >
          Toast with Action
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info('Persistent', 'This toast will not auto-dismiss', {
            duration: undefined,
          })}
        >
          Persistent Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.clearAll()}
        >
          Clear All
        </Button>
      </div>
      <ToastContainer position={position} />
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: 'Organisms/Toast',
  component: ToastProvider,
  parameters: {
    docs: {
      description: {
        component: 'A toast notification system with provider, hook, and container. Supports multiple variants, auto-dismiss, actions, and customizable positioning.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const TopLeft: Story = {
  render: () => <ToastDemo position="top-left" />,
};

export const BottomRight: Story = {
  render: () => <ToastDemo position="bottom-right" />,
};

export const BottomLeft: Story = {
  render: () => <ToastDemo position="bottom-left" />,
};

export const TopCenter: Story = {
  render: () => <ToastDemo position="top-center" />,
};

export const BottomCenter: Story = {
  render: () => <ToastDemo position="bottom-center" />,
};

export const MultipleToasts: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() => {
            toast.success('First Toast', 'This is the first notification');
            setTimeout(() => toast.info('Second Toast', 'This is the second notification'), 200);
            setTimeout(() => toast.warning('Third Toast', 'This is the third notification'), 400);
            setTimeout(() => toast.error('Fourth Toast', 'This is the fourth notification'), 600);
          }}
        >
          Show Multiple Toasts
        </Button>
        <ToastContainer />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() => toast.success('File Uploaded', 'Your file has been uploaded successfully', {
            action: {
              label: 'View File',
              onClick: () => alert('Opening file...'),
            },
          })}
        >
          Toast with Action
        </Button>
        <ToastContainer />
      </div>
    );
  },
};

export const CustomDuration: Story = {
  render: () => {
    const toast = useToast();
    return (
      <div className="space-y-4 p-8">
        <Button
          onClick={() => toast.info('Quick Toast', 'This will disappear in 2 seconds', {
            duration: 2000,
          })}
        >
          Short Duration (2s)
        </Button>
        <Button
          onClick={() => toast.info('Long Toast', 'This will disappear in 10 seconds', {
            duration: 10000,
          })}
        >
          Long Duration (10s)
        </Button>
        <ToastContainer />
      </div>
    );
  },
};
