import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TimePicker from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Molecules/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
