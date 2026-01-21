import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Switch

A toggle switch component for binary choices.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Switch toggled | \`(event: ChangeEvent<HTMLInputElement>) => void\` | Quando o switch é alternado |
| \`onFocus\` | Switch recebe foco | \`(event: FocusEvent) => void\` | Quando o switch recebe foco |
| \`onBlur\` | Switch perde foco | \`(event: FocusEvent) => void\` | Quando o switch perde foco |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`unchecked\` | Desligado | Estado inicial ou \`checked={false}\` | Switch na posição esquerda |
| \`checked\` | Ligado | \`checked={true}\` ou clicar | Switch na posição direita |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Switch com opacidade reduzida |
| \`focus\` | Com foco | Tab ou clique | Switch com outline de foco |
| \`error\` | Com erro | \`error={true}\` | Switch com indicador de erro |
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text',
    },
    description: {
      control: 'text',
      description: 'Description text below label',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Switch size',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state (for controlled)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (for uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    onChange: {
      description: 'Callback fired when the switch is toggled',
      action: 'onChange',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
        category: 'Events',
      },
    },
    onFocus: {
      description: 'Callback fired when the switch receives focus',
      action: 'onFocus',
      table: {
        type: { summary: '(event: FocusEvent) => void' },
        category: 'Events',
      },
    },
    onBlur: {
      description: 'Callback fired when the switch loses focus',
      action: 'onBlur',
      table: {
        type: { summary: '(event: FocusEvent) => void' },
        category: 'Events',
      },
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

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch
        label="Uncontrolled switch"
        defaultChecked={false}
      />
      <Switch
        label="Uncontrolled checked"
        defaultChecked={true}
      />
      <p className="text-sm text-gray-600">Uses defaultChecked for initial state without state management.</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates uncontrolled switch using defaultChecked.',
      },
    },
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

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    
    const handleChange = fn((e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      console.log('Switch toggled:', e.target.checked);
    });
    
    const handleFocus = fn((_e: React.FocusEvent<HTMLInputElement>) => {
      console.log('Switch focused');
    });
    
    const handleBlur = fn((_e: React.FocusEvent<HTMLInputElement>) => {
      console.log('Switch blurred');
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the switch below. Check the Actions panel to see events being fired.
        </p>
        <Switch
          label="Interactive Switch"
          checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <p className="text-sm text-gray-500">State: {checked ? 'ON' : 'OFF'}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchElement = canvas.getByRole('switch');
    
    // Test focus
    await userEvent.tab();
    await waitFor(() => {
      expect(switchElement).toHaveFocus();
    });
    
    // Test toggle
    await userEvent.click(switchElement);
    await waitFor(() => {
      expect(switchElement).toBeChecked();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all switch events. Interact with the switch and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const UncheckedState: Story = {
  args: {
    label: 'Unchecked Switch',
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Unchecked state - switch is off, ready to be toggled.',
      },
    },
  },
};

export const CheckedState: Story = {
  args: {
    label: 'Checked Switch',
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checked state - switch is on.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Disabled Switch',
    disabled: true,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - switch is not interactive, shows reduced opacity.',
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    label: 'Focus me (Tab)',
    checked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchElement = canvas.getByRole('switch');
    await userEvent.tab();
    await waitFor(() => {
      expect(switchElement).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus state - activated via Tab key or click. Shows focus outline for accessibility.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Switch with Error',
    error: true,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state - shows error indicator. Used for validation feedback.',
      },
    },
  },
};
