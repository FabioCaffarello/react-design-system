import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
  args: {
    checked: false,
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
  args: {
    label: 'Enable notifications',
    checked: false,
  },
};

export const WithDescription: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
  args: {
    label: 'Enable notifications',
    description: 'Receive email notifications about your account activity',
    checked: false,
  },
};

export const Sizes: Story = {
  render: () => {
    const [smChecked, setSmChecked] = useState(false);
    const [mdChecked, setMdChecked] = useState(false);
    const [lgChecked, setLgChecked] = useState(false);
    
    return (
      <div className="flex flex-col gap-4">
        <Switch
          size="sm"
          label="Small"
          checked={smChecked}
          onChange={(e) => setSmChecked(e.target.checked)}
        />
        <Switch
          size="md"
          label="Medium"
          checked={mdChecked}
          onChange={(e) => setMdChecked(e.target.checked)}
        />
        <Switch
          size="lg"
          label="Large"
          checked={lgChecked}
          onChange={(e) => setLgChecked(e.target.checked)}
        />
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    const [unchecked, setUnchecked] = useState(false);
    const [errorChecked, setErrorChecked] = useState(false);
    
    return (
      <div className="flex flex-col gap-4">
        <Switch
          label="Checked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Switch
          label="Unchecked"
          checked={unchecked}
          onChange={(e) => setUnchecked(e.target.checked)}
        />
        <Switch
          label="Error state"
          checked={errorChecked}
          onChange={(e) => setErrorChecked(e.target.checked)}
          error
        />
        <Switch
          label="Disabled (checked)"
          checked={true}
          onChange={() => {}}
          disabled
        />
        <Switch
          label="Disabled (unchecked)"
          checked={false}
          onChange={() => {}}
          disabled
        />
      </div>
    );
  },
};

export const Accessibility: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Switch with proper ARIA attributes and keyboard navigation:
          </p>
          <Switch
            label="Accessible switch"
            description="This switch supports keyboard navigation (Enter/Space)"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </div>
        <div className="text-xs text-gray-500">
          <p>Keyboard shortcuts:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Enter or Space: Toggle switch</li>
            <li>Tab: Navigate to switch</li>
          </ul>
        </div>
      </div>
    );
  },
};
