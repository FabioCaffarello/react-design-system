import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Autocomplete from './Autocomplete';
import { User, Settings, Mail, Search } from 'lucide-react';

const meta: Meta<typeof Autocomplete> = {
  title: 'Molecules/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

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
    placeholder: 'Search fruits...',
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { value: '1', label: 'Profile', icon: <User className="h-4 w-4" /> },
      { value: '2', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
      { value: '3', label: 'Messages', icon: <Mail className="h-4 w-4" /> },
    ],
    placeholder: 'Search...',
  },
};

export const Loading: Story = {
  args: {
    options: basicOptions,
    loading: true,
    placeholder: 'Search...',
  },
};

export const EmptyState: Story = {
  args: {
    options: [],
    emptyMessage: 'No results found. Try a different search.',
    placeholder: 'Search...',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: '1', label: 'Enabled Option 1' },
      { value: '2', label: 'Disabled Option', disabled: true },
      { value: '3', label: 'Enabled Option 2' },
    ],
    placeholder: 'Search...',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div className="space-y-4">
        <Autocomplete
          options={basicOptions}
          value={value}
          onChange={setValue}
          onSelect={(option) => {
            setValue(option.value);
            console.log('Selected:', option);
          }}
          placeholder="Controlled autocomplete"
        />
        <p className="text-sm text-gray-600">Selected value: {value || 'None'}</p>
      </div>
    );
  },
};

export const CustomFilter: Story = {
  args: {
    options: basicOptions,
    filterOptions: (options, searchValue) => {
      // Custom filter: only show options that start with search value
      return options.filter((option) =>
        option.label.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    },
    placeholder: 'Search (starts with)...',
  },
};

export const LargeDataset: Story = {
  args: {
    options: Array.from({ length: 100 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${i + 1}`,
    })),
    placeholder: 'Search from 100 options...',
  },
};
