import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MultiSelect from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  title: 'Molecules/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const basicOptions = [
  { value: '1', label: 'Apple' },
  { value: '2', label: 'Banana' },
  { value: '3', label: 'Cherry' },
  { value: '4', label: 'Date' },
  { value: '5', label: 'Elderberry' },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select fruits...',
  },
};

export const WithInitialValues: Story = {
  args: {
    options: basicOptions,
    defaultValue: ['1', '2'],
    placeholder: 'Select fruits...',
  },
};

export const WithMaxSelected: Story = {
  args: {
    options: basicOptions,
    maxSelected: 3,
    placeholder: 'Select up to 3 fruits...',
  },
};

export const WithSelectAll: Story = {
  args: {
    options: basicOptions,
    showSelectAll: true,
    placeholder: 'Select fruits...',
  },
};

export const Controlled: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    return (
      <div className="space-y-4">
        <MultiSelect
          options={basicOptions}
          value={values}
          onChange={setValues}
          placeholder="Controlled multi-select"
        />
        <p className="text-sm text-gray-600">
          Selected: {values.length > 0 ? values.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};
