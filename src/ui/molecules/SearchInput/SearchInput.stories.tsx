import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    loading: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={(val) => console.log('Search:', val)}
        />
        <p className="mt-2 text-sm text-gray-600">Value: {value}</p>
      </div>
    );
  },
  args: {
    placeholder: 'Search...',
  },
};

export const WithLoading: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    
    const handleSearch = (_val: string) => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    
    return (
      <div className="w-64">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>
    );
  },
  args: {
    placeholder: 'Search with loading...',
  },
};

export const WithoutClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState('test');
    return (
      <div className="w-64">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showClearButton={false}
        />
      </div>
    );
  },
  args: {
    placeholder: 'Search without clear...',
  },
};

export const WithDebounce: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    
    const handleSearch = (val: string) => {
      setSearchResults([`Result 1 for "${val}"`, `Result 2 for "${val}"`]);
    };
    
    return (
      <div className="w-64 space-y-4">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          debounceMs={500}
        />
        {searchResults.length > 0 && (
          <div className="border border-gray-200 rounded-md p-2">
            <p className="text-sm font-medium mb-2">Results:</p>
            <ul className="text-sm space-y-1">
              {searchResults.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  args: {
    placeholder: 'Search with 500ms debounce...',
  },
};

export const InForm: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    
    return (
      <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Search Form</h3>
        <SearchInput
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(val) => console.log('Searching for:', val)}
        />
        <p className="text-sm text-gray-600">
          Press Enter or wait for debounce to trigger search
        </p>
      </div>
    );
  },
};
