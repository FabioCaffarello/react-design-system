import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { useState } from "react";
import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## SearchInput

A search input component with debounce, loading state, and clear functionality.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Valor do input mudou | \`(event: ChangeEvent<HTMLInputElement>) => void\` | Quando o usuário digita no input |
| \`onSearch\` | Busca acionada | \`(value: string) => void\` | Quando Enter é pressionado ou após debounce |
| \`onClear\` | Input limpo | \`() => void\` | Quando o botão de limpar é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`empty\` | Sem valor | Estado inicial | Input vazio |
| \`with-value\` | Com valor | Após digitar | Input com texto |
| \`loading\` | Carregando | \`loading={true}\` | Spinner de loading visível |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Input desabilitado |
| \`with-clear\` | Com botão limpar | \`showClearButton={true}\` e valor presente | Botão X visível |
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    value: {
      control: "text",
      description: "Input value (controlled)",
    },
    defaultValue: {
      control: "text",
      description: "Default input value (uncontrolled)",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    showClearButton: {
      control: "boolean",
      description: "Show clear button when input has value",
    },
    debounceMs: {
      control: "number",
      description: "Debounce delay in milliseconds",
    },
    disabled: {
      control: "boolean",
      description: "Disable the search input",
    },
    onChange: {
      action: "changed",
      description: "Callback when input value changes",
      category: "Events",
    },
    onSearch: {
      action: "searched",
      description: "Callback when search is triggered (Enter or debounce)",
      category: "Events",
    },
    onClear: {
      action: "cleared",
      description: "Callback when clear button is clicked",
      category: "Events",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [lastSearch, setLastSearch] = useState<string | null>(null);

    return (
      <div className="w-64 space-y-4">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={(val) => {
            setLastSearch(val);
            console.log("Search:", val);
          }}
          placeholder="Search..."
        />
        <div className="text-sm space-y-2">
          <p className="text-gray-600">
            <strong>Current value:</strong> {value || "(empty)"}
          </p>
          {lastSearch && (
            <p className="text-gray-600">
              <strong>Last search:</strong> "{lastSearch}"
            </p>
          )}
          <p className="text-xs text-gray-500">
            Press Enter or wait for debounce to trigger search
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic search input with real state. Type and see the value update, then press Enter or wait for debounce.",
      },
    },
  },
};

export const WithLoading: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [searchCount, setSearchCount] = useState(0);

    const handleSearch = (val: string) => {
      if (!val.trim()) return;
      setLoading(true);
      setSearchCount((prev) => prev + 1);

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    return (
      <div className="w-64 space-y-4">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          placeholder="Search with loading..."
        />
        <div className="text-sm text-gray-600">
          {loading ? (
            <p>Searching... (simulated 2s delay)</p>
          ) : searchCount > 0 ? (
            <p>Search completed! (Total searches: {searchCount})</p>
          ) : (
            <p>Type and press Enter or wait for debounce</p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search with real loading state. Type and search to see the loading spinner for 2 seconds.",
      },
    },
  },
};

export const WithoutClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState("test");
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
    placeholder: "Search without clear...",
  },
};

export const WithDebounce: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const mockData = [
      "Apple",
      "Banana",
      "Cherry",
      "Date",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
      "Kiwi",
      "Lemon",
      "Mango",
      "Orange",
      "Papaya",
      "Quince",
      "Raspberry",
    ];

    const handleSearch = (val: string) => {
      setIsSearching(true);
      setSearchTerm(val);

      // Simulate API call
      setTimeout(() => {
        if (val.trim()) {
          const results = mockData
            .filter((item) => item.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 5);
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      }, 300);
    };

    return (
      <div className="w-64 space-y-4">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          loading={isSearching}
          debounceMs={500}
          placeholder="Search fruits (500ms debounce)..."
        />
        <div className="text-xs text-gray-500">
          {value
            ? `Typing: "${value}" (wait 500ms after stopping)`
            : "Start typing..."}
        </div>
        {searchTerm && (
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium mb-2">
              Results for "{searchTerm}": {isSearching && "(searching...)"}
            </p>
            {!isSearching &&
              (searchResults.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {searchResults.map((result, i) => (
                    <li
                      key={i}
                      className="p-1 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No results found</p>
              ))}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search with real debounce. Type and wait 500ms after stopping to see search results. Notice the debounce delay.",
      },
    },
  },
};

export const InForm: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const products = [
      "Laptop",
      "Mouse",
      "Keyboard",
      "Monitor",
      "Headphones",
      "Webcam",
      "Speaker",
      "Tablet",
      "Phone",
      "Charger",
    ];

    const handleSearch = (val: string) => {
      setIsSearching(true);
      setTimeout(() => {
        if (val.trim()) {
          const filtered = products
            .filter((p) => p.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 5);
          setResults(filtered);
        } else {
          setResults([]);
        }
        setIsSearching(false);
      }, 500);
    };

    return (
      <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Product Search</h3>
        <SearchInput
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          loading={isSearching}
        />
        {results.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Results:</p>
            <ul className="text-sm space-y-1">
              {results.map((product, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  {product}
                </li>
              ))}
            </ul>
          </div>
        )}
        {searchValue && results.length === 0 && !isSearching && (
          <p className="text-sm text-gray-500">No products found</p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search input integrated in a form with real search results. Type to search products.",
      },
    },
  },
};

export const WithClear: Story = {
  render: () => {
    const [value, setValue] = useState("Initial search term");
    const [cleared, setCleared] = useState(false);

    return (
      <div className="w-64 space-y-4">
        <SearchInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setCleared(false);
          }}
          onClear={() => {
            setCleared(true);
            setTimeout(() => setCleared(false), 2000);
          }}
          onSearch={(val) => console.log("Search:", val)}
          placeholder="Search with clear..."
        />
        <div className="text-sm text-gray-600">
          {cleared && <p className="text-green-600">✓ Search cleared!</p>}
          <p>
            <strong>Value:</strong> {value || "(empty)"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Click the X button to clear
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Search input with clear functionality. Use the X button to clear the search term.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const handleChange = fn((e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    });
    const handleSearch = fn((val: string) => {
      console.log("Search:", val);
    });
    const handleClear = fn(() => {
      setValue("");
    });

    return (
      <div className="w-64 space-y-4">
        <p className="text-sm text-gray-600">
          Type, search, or clear. Check the Actions panel to see events being
          fired.
        </p>
        <SearchInput
          value={value}
          onChange={handleChange}
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Search..."
        />
        <p className="text-sm text-gray-500">
          Current value: {value || "(empty)"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search...");

    await userEvent.type(input, "test", { delay: 100 });
    await waitFor(() => {
      expect(input).toHaveValue("test");
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates search input events. Type, search, or clear and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const EmptyState: Story = {
  args: {
    placeholder: "Search...",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no value entered.",
      },
    },
  },
};

export const WithValueState: Story = {
  render: () => {
    const [value, setValue] = useState("search term");
    return (
      <div className="w-64">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search..."
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With value state - input has a value entered.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    value: "searching...",
    loading: true,
    placeholder: "Search...",
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state - shows loading spinner while searching.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    value: "disabled search",
    disabled: true,
    placeholder: "Search...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - search input is disabled and cannot be interacted with.",
      },
    },
  },
};
