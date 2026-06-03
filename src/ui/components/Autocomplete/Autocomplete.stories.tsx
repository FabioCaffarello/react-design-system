import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import Autocomplete from "./Autocomplete";
import { Mail, User, Settings } from "lucide-react";

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  parameters: {
    docs: {
      description: {
        component: `
## Autocomplete

An autocomplete/combobox component that provides searchable dropdown functionality with keyboard navigation.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Valor do input mudou | \`(value: string) => void\` | Quando o usuário digita no input |
| \`onSelect\` | Opção selecionada | \`(option: AutocompleteOption) => void\` | Quando uma opção é selecionada (clique ou Enter) |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Dropdown fechado | Estado inicial ou após seleção | Input sem dropdown visível |
| \`open\` | Dropdown aberto | Ao focar ou digitar | Dropdown com opções visíveis |
| \`loading\` | Carregando opções | \`loading={true}\` | Spinner ou indicador de loading |
| \`empty\` | Sem resultados | Quando filtro não encontra opções | Mensagem de "no results" |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Input desabilitado |
| \`focused\` | Input focado | Ao focar no input | Input com borda destacada |
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: false,
      description: "Array of options to search from",
    },
    value: {
      control: "text",
      description: "Input value (controlled)",
    },
    defaultValue: {
      control: "text",
      description: "Default input value (uncontrolled)",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the input",
    },
    loading: {
      control: "boolean",
      description: "Show loading state",
    },
    disabled: {
      control: "boolean",
      description: "Disable the autocomplete",
    },
    emptyMessage: {
      control: "text",
      description: "Message to show when no options match",
    },
    onChange: {
      action: "changed",
      description: "Callback when input value changes",
      category: "Events",
    },
    onSelect: {
      action: "selected",
      description: "Callback when an option is selected",
      category: "Events",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const basicOptions = [
  { value: "1", label: "Apple" },
  { value: "2", label: "Banana" },
  { value: "3", label: "Cherry" },
  { value: "4", label: "Date" },
  { value: "5", label: "Elderberry" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={basicOptions}
          value={value}
          onChange={setValue}
          onSelect={(option) => {
            setSelected(option.value);
            setValue(option.label);
          }}
          placeholder="Search fruits..."
        />
        <div className="text-sm text-fg-secondary space-y-1">
          {selected && (
            <p>
              <strong>Selected:</strong>{" "}
              {basicOptions.find((o) => o.value === selected)?.label}
            </p>
          )}
          <p>
            <strong>Current value:</strong> {value || "(empty)"}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive autocomplete with real state. Type to search and select an option.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { value: "1", label: "Profile", icon: <User className="h-4 w-4" /> },
      { value: "2", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      { value: "3", label: "Messages", icon: <Mail className="h-4 w-4" /> },
    ],
    placeholder: "Search...",
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(basicOptions);

    const handleSearch = (searchValue: string) => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = basicOptions.filter((opt) =>
          opt.label.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setOptions(filtered);
        setLoading(false);
      }, 1000);
    };

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={options}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            if (newValue.length > 0) {
              handleSearch(newValue);
            } else {
              setOptions(basicOptions);
            }
          }}
          loading={loading}
          placeholder="Search with loading..."
        />
        <div className="text-sm text-fg-secondary">
          {loading ? (
            <p>⏳ Searching...</p>
          ) : (
            <p>Found {options.length} result(s)</p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Autocomplete with real loading state. Type to trigger a simulated API call with loading indicator.",
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [options, setOptions] = React.useState(basicOptions);

    const handleSearch = (searchValue: string) => {
      const filtered = basicOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setOptions(filtered);
    };

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={options}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handleSearch(newValue);
          }}
          emptyMessage="No fruits found. Try searching for Apple, Banana, Cherry, Date, or Elderberry."
          placeholder="Search fruits..."
        />
        <div className="text-sm text-fg-secondary space-y-1">
          {options.length === 0 && value && (
            <p className="text-fg-warning">⚠ No results found for "{value}"</p>
          )}
          {options.length > 0 && <p>Found {options.length} result(s)</p>}
          {!value && <p>Type to search. Try "Apple" or "Banana"</p>}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Autocomplete with empty state. Type something that doesn't match to see the empty state message.",
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: "1", label: "Enabled Option 1" },
      { value: "2", label: "Disabled Option", disabled: true },
      { value: "3", label: "Enabled Option 2" },
    ],
    placeholder: "Search...",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [selectedOption, setSelectedOption] = React.useState<
      (typeof basicOptions)[0] | null
    >(null);

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={basicOptions}
          value={value}
          onChange={setValue}
          onSelect={(option) => {
            setSelectedOption(option);
            setValue(option.label);
          }}
          placeholder="Controlled autocomplete"
        />
        <div className="text-sm text-fg-secondary space-y-1">
          <p>
            <strong>Input value:</strong> {value || "(empty)"}
          </p>
          {selectedOption && (
            <p>
              <strong>Selected option:</strong> {selectedOption.label} (value:{" "}
              {selectedOption.value})
            </p>
          )}
          <button
            onClick={() => {
              setValue("");
              setSelectedOption(null);
            }}
            className="mt-2 px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
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
        story:
          "Controlled autocomplete with external state management. Use the Clear button to reset.",
      },
    },
  },
};

export const CustomFilter: Story = {
  args: {
    options: basicOptions,
    filterOptions: (options, searchValue) => {
      // Custom filter: only show options that start with search value
      return options.filter((option) =>
        option.label.toLowerCase().startsWith(searchValue.toLowerCase()),
      );
    },
    placeholder: "Search (starts with)...",
  },
};

export const LargeDataset: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [selected, setSelected] = React.useState<string | null>(null);

    const largeOptions = Array.from({ length: 100 }, (_, i) => ({
      value: String(i + 1),
      label: `Option ${i + 1}`,
    }));

    const filteredCount = value
      ? largeOptions.filter((opt) =>
          opt.label.toLowerCase().includes(value.toLowerCase()),
        ).length
      : largeOptions.length;

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={largeOptions}
          value={value}
          onChange={setValue}
          onSelect={(option) => {
            setSelected(option.value);
            setValue(option.label);
          }}
          placeholder="Search from 100 options..."
        />
        <div className="text-sm text-fg-secondary space-y-1">
          <p>
            <strong>Total options:</strong> 100
          </p>
          <p>
            <strong>Filtered results:</strong> {filteredCount}
          </p>
          {selected && (
            <p>
              <strong>Selected:</strong> Option {selected}
            </p>
          )}
          <p className="text-xs text-fg-tertiary mt-2">
            Demonstrates performance with large datasets. Type to filter
            options.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Autocomplete with large dataset (100 options). Demonstrates performance and filtering with many items.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
      <div className="space-y-4 w-full max-w-md">
        <Autocomplete
          options={basicOptions}
          value={value}
          onChange={setValue}
          onSelect={(option) => {
            setSelected(option.value);
            setValue(option.label);
          }}
          placeholder="Try keyboard navigation..."
        />
        <div className="text-sm text-fg-secondary space-y-2 p-4 bg-surface-subtle rounded">
          <p>
            <strong>Keyboard Navigation:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Type to search/filter options</li>
            <li>Arrow Up/Down to navigate options</li>
            <li>Enter to select highlighted option</li>
            <li>Escape to close dropdown</li>
            <li>Tab to move focus</li>
          </ul>
          {selected && (
            <p className="mt-2">
              <strong>Selected:</strong>{" "}
              {basicOptions.find((o) => o.value === selected)?.label}
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Autocomplete demonstrating keyboard navigation. Try using only keyboard to search and select.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const handleChange = fn((newValue: string) => {
      setValue(newValue);
    });
    const handleSelect = fn((option: (typeof basicOptions)[0]) => {
      setValue(option.label);
    });

    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-fg-secondary">
          Type in the autocomplete and select an option. Check the Actions panel
          to see events being fired.
        </p>
        <Autocomplete
          label="Fruit"
          options={basicOptions}
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          placeholder="Search fruits..."
        />
        <p className="text-sm text-fg-tertiary">
          Current value: {value || "(empty)"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByPlaceholderText("Search fruits...");

    // Type in the input
    await userEvent.type(input, "app", { delay: 100 });
    await waitFor(() => {
      expect(input).toHaveValue("app");
    });

    // Wait for dropdown to appear and select option
    // Autocomplete list renders in a portal (document.body), so search there
    await waitFor(
      () => {
        const option = within(document.body).getByText("Apple");
        expect(option).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    const option = within(document.body).getByText("Apple");
    await userEvent.click(option);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates autocomplete events. Type and select an option, then check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    options: basicOptions,
    placeholder: "Click to open...",
  },
  parameters: {
    docs: {
      description: {
        story: "Closed state - dropdown is not visible.",
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-full max-w-md">
        <Autocomplete
          label="Fruit"
          options={basicOptions}
          value={value}
          onChange={setValue}
          placeholder="Type to open dropdown..."
        />
        <p className="text-xs text-fg-tertiary mt-2">
          Focus the input to see the open state
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type to open dropdown...");
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - dropdown is visible with options.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    options: basicOptions,
    loading: true,
    placeholder: "Loading...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state - shows loading indicator while fetching options.",
      },
    },
  },
};

export const NoResults: Story = {
  render: () => {
    const [value, setValue] = React.useState("xyz");
    return (
      <div className="w-full max-w-md">
        <Autocomplete
          options={[]}
          value={value}
          onChange={setValue}
          emptyMessage="No results found"
          placeholder="Search..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "No results state - shows when no options match the search query.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    options: basicOptions,
    disabled: true,
    placeholder: "Disabled autocomplete",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - autocomplete is disabled and cannot be interacted with.",
      },
    },
  },
};
