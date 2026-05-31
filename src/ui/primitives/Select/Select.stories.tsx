import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import Select from "./Select";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `Option ${i + 1}`,
}));

const optionGroups = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "lettuce", label: "Lettuce" },
      { value: "tomato", label: "Tomato" },
    ],
  },
];

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: `
## Select

A select component with support for single selection, option groups, and validation states.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Opção selecionada | \`(value: string) => void\` | Quando uma opção é selecionada |
| \`onFocus\` | Select recebe foco | \`(event: FocusEvent) => void\` | Quando o select recebe foco |
| \`onBlur\` | Select perde foco | \`(event: FocusEvent) => void\` | Quando o select perde foco |
| \`onOpenChange\` | Estado de abertura muda | \`(open: boolean) => void\` | Quando o dropdown abre/fecha |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Dropdown fechado | Estado inicial | Select com valor selecionado visível |
| \`open\` | Dropdown aberto | Clicar no select | Select com lista de opções visível |
| \`focus\` | Com foco | Tab ou clique | Select com outline de foco |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Select com opacidade reduzida |
| \`error\` | Com erro | \`error={true}\` | Select com borda vermelha |
| \`success\` | Com sucesso | \`success={true}\` | Select com borda verde |
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text or ReactNode",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Select size",
    },
    error: {
      control: "boolean",
      description: "Show error state",
    },
    success: {
      control: "boolean",
      description: "Show success state",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below select",
    },
    disabled: {
      control: "boolean",
      description: "Disable the select",
    },
    options: {
      control: false,
      description: "Array of options",
    },
    optionGroups: {
      control: false,
      description: "Array of option groups",
    },
    onChange: {
      description: "Callback fired when an option is selected",
      action: "onChange",
      table: {
        type: { summary: "(value: string) => void" },
        category: "Events",
      },
    },
    onFocus: {
      description: "Callback fired when the select receives focus",
      action: "onFocus",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onBlur: {
      description: "Callback fired when the select loses focus",
      action: "onBlur",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Select
          label="Choose option"
          options={options}
          placeholder="Select an option"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-fg-secondary">
          Selected:{" "}
          <strong>
            {value ? options.find((o) => o.value === value)?.label : "(none)"}
          </strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive select with real state. Select an option and see the value change.",
      },
    },
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (!value) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
        alert("Form submitted!");
      }
    };

    return (
      <div className="space-y-4">
        <Select
          label="Choose option"
          options={options}
          placeholder="Select an option"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (submitted) setSubmitted(false);
          }}
          error={submitted && !value}
          helperText={
            submitted && !value ? "Please select an option" : undefined
          }
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-surface-brand-strong text-fg-inverse rounded hover:opacity-90"
        >
          Submit
        </button>
        {value && !submitted && (
          <p className="text-sm text-fg-success">
            ✓ Option selected: {options.find((o) => o.value === value)?.label}
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select with validation error. Try submitting without selecting an option to see the error state.",
      },
    },
  },
};

export const WithSuccess: Story = {
  render: () => {
    const [value, setValue] = useState("1");
    return (
      <div className="space-y-4">
        <Select
          label="Choose option"
          options={options}
          placeholder="Select an option"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          success={!!value}
          helperText={value ? "Selection is valid" : undefined}
        />
        <p className="text-sm text-fg-secondary">
          Selected:{" "}
          <strong>{options.find((o) => o.value === value)?.label}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select with success state. Shows success feedback when a valid option is selected.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => {
    const [smValue, setSmValue] = useState("");
    const [mdValue, setMdValue] = useState("");
    const [lgValue, setLgValue] = useState("");

    return (
      <div className="space-y-4">
        <Select
          label="Small"
          size="sm"
          options={options}
          placeholder="Select..."
          value={smValue}
          onChange={(e) => setSmValue(e.target.value)}
        />
        <Select
          label="Medium"
          size="md"
          options={options}
          placeholder="Select..."
          value={mdValue}
          onChange={(e) => setMdValue(e.target.value)}
        />
        <Select
          label="Large"
          size="lg"
          options={options}
          placeholder="Select..."
          value={lgValue}
          onChange={(e) => setLgValue(e.target.value)}
        />
        <div className="text-sm text-fg-secondary space-y-1">
          <p>Small: {smValue || "(none)"}</p>
          <p>Medium: {mdValue || "(none)"}</p>
          <p>Large: {lgValue || "(none)"}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select with different sizes. All are interactive and track their own state.",
      },
    },
  },
};

export const WithOptionGroups: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Select
          label="Choose category"
          options={[]}
          optionGroups={optionGroups}
          placeholder="Select a category"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-fg-secondary">
          Selected: <strong>{value || "(none)"}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select with option groups. Options are organized into categories.",
      },
    },
  },
};

export const WithManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Select
          label="Choose option"
          options={manyOptions}
          placeholder="Select an option"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-fg-secondary">
          Selected: <strong>{value ? `Option ${value}` : "(none)"}</strong>
        </p>
        <p className="text-xs text-fg-tertiary">
          This select has 20 options. Use keyboard navigation (Arrow keys) to
          quickly find options.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select with many options (20). Demonstrates performance and keyboard navigation with large lists.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        label="Disabled Select"
        options={options}
        placeholder="This select is disabled"
        disabled
      />
      <p className="text-sm text-fg-secondary">
        Disabled selects cannot be interacted with. Try clicking or using
        keyboard - nothing happens.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Disabled select. Cannot be interacted with.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => {
    const [defaultValue, setDefaultValue] = useState("");
    const [errorValue, setErrorValue] = useState("");
    const [successValue, setSuccessValue] = useState("1");

    return (
      <div className="space-y-4">
        <Select
          label="Default"
          options={options}
          placeholder="Select..."
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
        <Select
          label="Error"
          error
          helperText="This field has an error"
          options={options}
          value={errorValue}
          onChange={(e) => setErrorValue(e.target.value)}
        />
        <Select
          label="Success"
          success
          helperText="Selection is valid"
          options={options}
          value={successValue}
          onChange={(e) => setSuccessValue(e.target.value)}
        />
        <Select label="Disabled" disabled options={options} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All visual states of the select component. Some are interactive, others are disabled.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Select
          label="Controlled Select"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={options}
          placeholder="Select an option..."
        />
        <p className="text-sm text-fg-secondary">
          Selected: {value || "(none)"}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates controlled select with state management.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        label="Uncontrolled Select"
        defaultValue="2"
        options={options}
        placeholder="Select an option..."
      />
      <p className="text-sm text-fg-secondary">
        Uses defaultValue for initial value without state management.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates uncontrolled select using defaultValue.",
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2 (disabled)", disabled: true },
      { value: "3", label: "Option 3" },
      { value: "4", label: "Option 4 (disabled)", disabled: true },
      { value: "5", label: "Option 5" },
    ];
    return (
      <Select
        label="Select with disabled options"
        options={optionsWithDisabled}
        placeholder="Select an option..."
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates select with some disabled options.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
      setLastAction(
        `Selected: ${options.find((o) => o.value === e.target.value)?.label}`,
      );
      setTimeout(() => setLastAction(null), 2000);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Try navigating with Tab key and Arrow keys to change selection:
        </p>
        <Select
          label="Keyboard Navigation"
          options={options}
          placeholder="Tab here, then use Arrow keys..."
          value={value}
          onChange={handleChange}
        />
        {lastAction && (
          <div className="text-sm text-fg-success p-2 bg-success-bg rounded">
            ✓ {lastAction}
          </div>
        )}
        <div className="text-xs text-fg-tertiary space-y-1">
          <p>
            <strong>Keyboard shortcuts:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              <strong>Tab</strong>: Focus the select
            </li>
            <li>
              <strong>Arrow Up/Down</strong>: Navigate between options
            </li>
            <li>
              <strong>Enter</strong>: Select the highlighted option
            </li>
            <li>
              <strong>Escape</strong>: Close the dropdown (if open)
            </li>
            <li>
              <strong>Type</strong>: Jump to option starting with that letter
            </li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation support. Use Tab to focus and Arrow keys to navigate. Select an option to see feedback.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const handleChange = fn((e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
      console.log("Value changed:", e.target.value);
    });

    const handleFocus = fn((_e: React.FocusEvent<HTMLSelectElement>) => {
      console.log("Select focused");
    });

    const handleBlur = fn((_e: React.FocusEvent<HTMLSelectElement>) => {
      console.log("Select blurred");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Interact with the select below. Check the Actions panel to see events
          being fired.
        </p>
        <Select
          label="Interactive Select"
          options={options}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Select an option..."
        />
        <p className="text-sm text-fg-tertiary">
          Selected: {value || "(none)"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");

    // Test focus
    await userEvent.click(select);
    await waitFor(() => {
      expect(select).toHaveFocus();
    });

    // Test selection (if dropdown opens)
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all select events. Interact with the select and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    label: "Closed Select",
    options,
    placeholder: "Select an option...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Closed state - dropdown is closed, shows selected value or placeholder.",
      },
    },
  },
};

export const OpenState: Story = {
  args: {
    label: "Open Select",
    options,
    placeholder: "Click to open...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    await userEvent.click(select);
    // Dropdown should be open (visual state)
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - dropdown is open, shows list of options.",
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    label: "Focus me (Tab)",
    options,
    placeholder: "Press Tab",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox");
    await userEvent.tab();
    await waitFor(() => {
      expect(select).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus state - activated via Tab key or click. Shows focus outline for accessibility.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: "Disabled Select",
    options,
    disabled: true,
    placeholder: "This select is disabled",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - select is not interactive, shows reduced opacity.",
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: "Select with Error",
    options,
    error: true,
    helperText: "Please select an option",
    placeholder: "Select an option...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state - shows red border and error message. Used for validation feedback.",
      },
    },
  },
};

export const SuccessState: Story = {
  args: {
    label: "Select with Success",
    options,
    success: true,
    helperText: "Option selected",
    value: "1",
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Success state - shows green border and success indicator. Used for positive validation feedback.",
      },
    },
  },
};
