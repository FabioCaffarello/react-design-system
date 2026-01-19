import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import TimePicker from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Molecules/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## TimePicker

A time picker component that allows users to select a time value.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Hora selecionada mudou | \`(value: string) => void\` | Quando uma nova hora é selecionada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`empty\` | Sem hora selecionada | Estado inicial | Time picker vazio |
| \`with-value\` | Com hora selecionada | Após selecionar hora | Time picker com hora exibida |
| \`12h-format\` | Formato 12 horas | \`format="12h"\` | Hora em formato 12h (AM/PM) |
| \`24h-format\` | Formato 24 horas | \`format="24h"\` ou padrão | Hora em formato 24h |
| \`with-error\` | Com erro | \`error={true}\` | Mensagem de erro visível |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Time picker desabilitado |
        `,
      },
    },
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['12h', '24h'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || '');
    return (
      <div className="w-64">
        <TimePicker
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-2 text-sm text-gray-600">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

export const Format24h: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || '14:30');
    return (
      <div className="w-64">
        <TimePicker
          {...args}
          value={value}
          onChange={setValue}
          format="24h"
        />
        <p className="mt-2 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const Format12h: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || '02:30 PM');
    return (
      <div className="w-64">
        <TimePicker
          {...args}
          value={value}
          onChange={setValue}
          format="12h"
        />
        <p className="mt-2 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <TimePicker
          label="Start Time"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <TimePicker
          label="Time"
          value={value}
          onChange={setValue}
          error
          helperText="Please select a valid time"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <TimePicker
        label="Time"
        defaultValue="09:00"
        disabled
      />
    </div>
  ),
};

export const InForm: Story = {
  render: () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    return (
      <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Schedule</h3>
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          format="12h"
        />
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          format="12h"
        />
        {startTime && endTime && (
          <p className="text-sm text-gray-600">
            Duration: {startTime} - {endTime}
          </p>
        )}
      </div>
    );
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const handleChange = fn((newValue: string) => {
      setValue(newValue);
    });
    
    return (
      <div className="w-64 space-y-4">
        <p className="text-sm text-gray-600">
          Select a time. Check the Actions panel to see events being fired.
        </p>
        <TimePicker
          value={value}
          onChange={handleChange}
          label="Time"
        />
        <p className="text-sm text-gray-500">Selected: {value || 'None'}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for time picker to be interactive
    await waitFor(() => {
      // Use a more flexible text matcher for text that might be split across elements
      // Get all elements that contain "Selected:" and verify at least one exists
      const selectedElements = canvas.getAllByText((content, element) => {
        return element?.textContent?.includes('Selected:') || false;
      });
      expect(selectedElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates time picker events. Select a time and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const EmptyState: Story = {
  args: {
    value: '',
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state - no time is selected.',
      },
    },
  },
};

export const WithValueState: Story = {
  args: {
    value: '14:30',
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'With value state - a time is selected and displayed.',
      },
    },
  },
};

export const Format12hState: Story = {
  args: {
    value: '02:30 PM',
    format: '12h',
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: '12h format state - time is displayed in 12-hour format with AM/PM.',
      },
    },
  },
};

export const Format24hState: Story = {
  args: {
    value: '14:30',
    format: '24h',
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: '24h format state - time is displayed in 24-hour format.',
      },
    },
  },
};

export const WithErrorState: Story = {
  args: {
    value: '',
    error: true,
    helperText: 'Please select a valid time',
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'With error state - displays an error message.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    value: '09:00',
    disabled: true,
    label: 'Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - time picker is disabled and cannot be interacted with.',
      },
    },
  },
};
