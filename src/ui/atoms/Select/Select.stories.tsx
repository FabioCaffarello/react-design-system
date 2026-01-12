import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `Option ${i + 1}`,
}));

const optionGroups = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'lettuce', label: 'Lettuce' },
      { value: 'tomato', label: 'Tomato' },
    ],
  },
];

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    success: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option',
  },
};

export const WithError: Story = {
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option',
    error: true,
    helperText: 'Please select an option',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option',
    success: true,
    helperText: 'Selection is valid',
    value: '1',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Select label="Small" size="sm" options={options} placeholder="Select..." />
      <Select label="Medium" size="md" options={options} placeholder="Select..." />
      <Select label="Large" size="lg" options={options} placeholder="Select..." />
    </div>
  ),
};

export const WithOptionGroups: Story = {
  args: {
    label: 'Choose category',
    optionGroups,
    placeholder: 'Select a category',
  },
};

export const WithManyOptions: Story = {
  args: {
    label: 'Choose option',
    options: manyOptions,
    placeholder: 'Select an option',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options,
    placeholder: 'This select is disabled',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Select label="Default" options={options} placeholder="Select..." />
      <Select label="Error" error helperText="This field has an error" options={options} />
      <Select label="Success" success helperText="Selection is valid" options={options} value="1" />
      <Select label="Disabled" disabled options={options} />
    </div>
  ),
};
