import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import MultiSelect from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  title: 'Molecules/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## MultiSelect

A multi-select component that allows users to select multiple options from a dropdown list.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Seleção mudou | \`(selected: string[]) => void\` | Quando a seleção de itens muda |
| \`onSelect\` | Itens selecionados | \`(selected: string[]) => void\` | Quando itens são selecionados |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Dropdown fechado | Estado inicial | Multi-select sem dropdown visível |
| \`open\` | Dropdown aberto | Ao focar ou clicar | Dropdown com opções visíveis |
| \`empty\` | Sem seleção | Nenhum item selecionado | Multi-select sem itens selecionados |
| \`with-selection\` | Com seleção | Itens selecionados | Multi-select com tags dos itens selecionados |
| \`loading\` | Carregando | \`loading={true}\` | Indicador de loading visível |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Multi-select desabilitado |
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: false,
      description: 'Array of options to select from',
    },
    value: {
      control: false,
      description: 'Selected values (controlled)',
    },
    defaultValue: {
      control: false,
      description: 'Default selected values (uncontrolled)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the multi-select',
    },
    maxSelected: {
      control: 'number',
      description: 'Maximum number of items that can be selected',
    },
    showSelectAll: {
      control: 'boolean',
      description: 'Show "Select All" option',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to show when no options match search',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
      category: 'Events',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when items are selected',
      category: 'Events',
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
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Select fruits..."
        />
        {selected.length > 0 && (
          <div className="text-sm text-gray-600">
            <p><strong>Selected ({selected.length}):</strong></p>
            <p>{selected.map(v => basicOptions.find(o => o.value === v)?.label).join(", ")}</p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive multi-select with real state. Select items and see them displayed below.",
      },
    },
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
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const maxSelected = 3;
    const canSelectMore = selected.length < maxSelected;
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          maxSelected={maxSelected}
          placeholder={`Select up to ${maxSelected} fruits...`}
        />
        <div className="text-sm space-y-2">
          <p className="font-medium text-gray-700">
            Selected: {selected.length}/{maxSelected}
          </p>
          {selected.length > 0 && (
            <p className="text-gray-600">
              {selected.map(v => basicOptions.find(o => o.value === v)?.label).join(", ")}
            </p>
          )}
          {!canSelectMore && (
            <p className="text-yellow-600">
              Maximum selection reached. Remove items to select more.
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select with maximum selection limit. Try selecting more than 3 items to see the limit in action.",
      },
    },
  },
};

export const WithSelectAll: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const allSelected = selected.length === basicOptions.length;
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          showSelectAll={true}
          placeholder="Select fruits..."
        />
        <div className="text-sm space-y-2">
          <p className="font-medium text-gray-700">
            Status: {allSelected ? "All selected" : `${selected.length}/${basicOptions.length} selected`}
          </p>
          {selected.length > 0 && (
            <p className="text-gray-600">
              Selected: {selected.map(v => basicOptions.find(o => o.value === v)?.label).join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select with Select All functionality. Use the 'Select All' option to select/deselect all items at once.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={values}
          onChange={setValues}
          placeholder="Controlled multi-select"
        />
        <div className="text-sm space-y-2">
          <p className="font-medium text-gray-700">
            Selected Values: {values.length > 0 ? values.join(', ') : 'None'}
          </p>
          {values.length > 0 && (
            <p className="text-gray-600">
              Selected Labels: {values.map(v => basicOptions.find(o => o.value === v)?.label).join(", ")}
            </p>
          )}
          <button
            onClick={() => setValues([])}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Selection
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Controlled multi-select with external state management. Use the Clear button to reset selection.",
      },
    },
  },
};

export const WithSearch: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Type to search fruits..."
        />
        <div className="text-sm text-gray-600">
          <p><strong>Tip:</strong> Type in the input to filter options. Selected: {selected.length}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select with search functionality. Type in the input field to filter the available options.",
      },
    },
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    
    const manyOptions = Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    }));
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={manyOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Search from 50 options..."
          showSelectAll
        />
        <div className="text-sm text-gray-600">
          <p><strong>Selected:</strong> {selected.length} of {manyOptions.length} options</p>
          {selected.length > 0 && (
            <p className="mt-1">
              {selected.slice(0, 5).map(v => manyOptions.find(o => o.value === v)?.label).join(", ")}
              {selected.length > 5 && ` ... and ${selected.length - 5} more`}
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select with many options (50). Demonstrates performance and search functionality with large lists.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Try keyboard navigation..."
        />
        <div className="text-sm text-gray-600 space-y-2 p-4 bg-gray-50 rounded">
          <p><strong>Keyboard Navigation:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click or Tab to focus the input</li>
            <li>Type to search/filter options</li>
            <li>Arrow Up/Down to navigate options</li>
            <li>Enter/Space to select highlighted option</li>
            <li>Escape to close the dropdown</li>
            <li>Backspace when input is empty removes last selected item</li>
          </ul>
          <p className="mt-2"><strong>Selected:</strong> {selected.length} items</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select demonstrating keyboard navigation. Try using keyboard only to select items.",
      },
    },
  },
};

export const RealTimeSearch: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [searchTerm, _setSearchTerm] = React.useState('');
    
    const allOptions = [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Apricot' },
      { value: '3', label: 'Avocado' },
      { value: '4', label: 'Banana' },
      { value: '5', label: 'Blueberry' },
      { value: '6', label: 'Cherry' },
      { value: '7', label: 'Coconut' },
      { value: '8', label: 'Date' },
      { value: '9', label: 'Dragonfruit' },
      { value: '10', label: 'Elderberry' },
      { value: '11', label: 'Fig' },
      { value: '12', label: 'Grape' },
      { value: '13', label: 'Guava' },
      { value: '14', label: 'Kiwi' },
      { value: '15', label: 'Lemon' },
    ];
    
    const filteredOptions = allOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={filteredOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Type to search fruits..."
        />
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Search Results:</strong> {filteredOptions.length} of {allOptions.length} options match</p>
          <p><strong>Selected:</strong> {selected.length} items</p>
          {selected.length > 0 && (
            <p>
              {selected.map(v => allOptions.find(o => o.value === v)?.label).join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select with real-time search filtering. Type in the input to see options filter in real-time.',
      },
    },
  },
};

export const EdgeCases: Story = {
  render: () => {
    const [selected1, setSelected1] = React.useState<string[]>([]);
    const [selected2, setSelected2] = React.useState<string[]>(['1']);
    const [selected3, setSelected3] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-6 w-full max-w-md">
        <div>
          <h3 className="text-sm font-medium mb-2">Empty Options</h3>
          <MultiSelect
            options={[]}
            value={selected1}
            onChange={setSelected1}
            placeholder="No options available"
            emptyMessage="No options to select"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Single Option</h3>
          <MultiSelect
            options={[{ value: '1', label: 'Only Option' }]}
            value={selected2}
            onChange={setSelected2}
            placeholder="Select option..."
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Disabled State</h3>
          <MultiSelect
            options={basicOptions}
            value={selected3}
            onChange={setSelected3}
            placeholder="Disabled multi-select"
            disabled
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Loading State</h3>
          <MultiSelect
            options={basicOptions}
            value={selected3}
            onChange={setSelected3}
            placeholder="Loading options..."
            loading
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge cases: empty options, single option, disabled state, and loading state.',
      },
    },
  },
};

export const SelectAllAndDeselectAll: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const allSelected = selected.length === basicOptions.length;
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          showSelectAll
          placeholder="Select fruits..."
        />
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(basicOptions.map(o => o.value))}
              className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Select All (External)
            </button>
            <button
              onClick={() => setSelected([])}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Deselect All
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Status:</strong> {allSelected ? 'All selected' : `${selected.length}/${basicOptions.length} selected`}</p>
            {selected.length > 0 && (
              <p className="mt-1">
                Selected: {selected.map(v => basicOptions.find(o => o.value === v)?.label).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates Select All functionality both from the dropdown and external buttons.',
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const handleChange = fn((newSelected: string[]) => {
      setSelected(newSelected);
    });
    
    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-gray-600">
          Select items. Check the Actions panel to see events being fired.
        </p>
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={handleChange}
          placeholder="Select fruits..."
        />
        {selected.length > 0 && (
          <div className="text-sm text-gray-500">
            Selected: {selected.length} item(s)
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Select fruits...');
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates multi-select events. Select items and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const EmptyState: Story = {
  args: {
    options: basicOptions,
    value: [],
    placeholder: 'Select items...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state - no items are selected.',
      },
    },
  },
};

export const WithSelectionState: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['1', '2']);
    return (
      <div className="w-full max-w-md">
        <MultiSelect
          options={basicOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Select fruits..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With selection state - items are selected and displayed as tags.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    options: basicOptions,
    value: ['1'],
    disabled: true,
    placeholder: 'Disabled multi-select',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - multi-select is disabled and cannot be interacted with.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    options: basicOptions,
    value: [],
    loading: true,
    placeholder: 'Loading options...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state - shows loading indicator while fetching options.',
      },
    },
  },
};
