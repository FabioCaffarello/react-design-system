import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: 'A flexible date picker component with single date and range selection. Supports keyboard navigation, date validation, and basic localization.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Selection mode: single date or date range',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    format: {
      control: 'text',
      description: 'Date format string (e.g., yyyy-MM-dd, MM/dd/yyyy)',
    },
    showCalendarButton: {
      control: 'boolean',
      description: 'Whether to show the calendar icon button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Select a date"
        />
        {date && (
          <p className="mt-4 text-sm text-gray-600">
            Selected: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Select a date"
        />
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
      start: null,
      end: null,
    });
    return (
      <div className="p-8">
        <DatePicker
          mode="range"
          value={range}
          onValueChange={(value) => setRange(value as { start: Date | null; end: Date | null })}
          placeholder="Select date range"
        />
        {range.start && range.end && (
          <p className="mt-4 text-sm text-gray-600">
            Range: {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const WithMinMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select date this month"
        />
        <p className="mt-4 text-sm text-gray-500">
          Only dates from this month are selectable
        </p>
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    const disabledDates = [
      new Date(today.getFullYear(), today.getMonth(), 5),
      new Date(today.getFullYear(), today.getMonth(), 10),
      new Date(today.getFullYear(), today.getMonth(), 15),
    ];
    
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          disabledDates={disabledDates}
          placeholder="Select a date"
        />
        <p className="mt-4 text-sm text-gray-500">
          Days 5, 10, and 15 are disabled
        </p>
      </div>
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          format="MM/dd/yyyy"
          placeholder="MM/DD/YYYY"
        />
      </div>
    );
  },
};

export const CompoundComponents: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
        >
          <DatePicker.Input placeholder="Select date" />
          <DatePicker.Popup>
            <DatePicker.Calendar />
          </DatePicker.Popup>
        </DatePicker>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Using compound components API for maximum flexibility.',
      },
    },
  },
};
