import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { useState } from "react";
import Radio from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Primitives/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Radio

A radio button component for single selection from a group of options.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Radio selecionado | \`(value: string) => void\` | Quando um radio é selecionado |
| \`onFocus\` | Radio recebe foco | \`(event: FocusEvent) => void\` | Quando o radio recebe foco |
| \`onBlur\` | Radio perde foco | \`(event: FocusEvent) => void\` | Quando o radio perde foco |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`unselected\` | Não selecionado | Estado inicial | Radio vazio |
| \`selected\` | Selecionado | \`checked={true}\` ou clicar | Radio com ponto preenchido |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Radio com opacidade reduzida |
| \`focus\` | Com foco | Tab ou clique | Radio com outline de foco |
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text or ReactNode",
    },
    error: {
      control: "boolean",
      description: "Show error state",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below radio",
    },
    disabled: {
      control: "boolean",
      description: "Disable the radio",
    },
    checked: {
      control: "boolean",
      description: "Checked state (for controlled)",
    },
    defaultChecked: {
      control: "boolean",
      description: "Default checked state (for uncontrolled)",
    },
    name: {
      control: "text",
      description: "Name attribute for grouping radios",
    },
    value: {
      control: "text",
      description: "Value of the radio option",
    },
    onChange: {
      description: "Callback fired when the radio is selected",
      action: "onChange",
      table: {
        type: { summary: "(event: ChangeEvent<HTMLInputElement>) => void" },
        category: "Events",
      },
    },
    onFocus: {
      description: "Callback fired when the radio receives focus",
      action: "onFocus",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onBlur: {
      description: "Callback fired when the radio loses focus",
      action: "onBlur",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="default-group"
            label="Option 1"
            value="1"
            checked={selected === "1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="default-group"
            label="Option 2"
            value="2"
            checked={selected === "2"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="default-group"
            label="Option 3"
            value="3"
            checked={selected === "3"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected || "None"}</strong>
        </p>
        <p className="text-xs text-gray-500">
          Click on any option to select it. Only one option can be selected at a
          time.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive radio group with real state. Click to select and see the state change. Only one option can be selected at a time.",
      },
    },
  },
};

export const Checked: Story = {
  render: () => {
    const [selected, setSelected] = useState("1");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="checked-group"
            label="Selected option (starts checked)"
            value="1"
            checked={selected === "1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="checked-group"
            label="Another option"
            value="2"
            checked={selected === "2"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected}</strong>
        </p>
        <p className="text-xs text-gray-500">
          Note: Radio buttons cannot be unchecked by clicking them again. You
          must select another option in the group.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Radio button starting in checked state. Note: Radio buttons cannot be unchecked by clicking them again - you must select another option.",
      },
    },
  },
};

export const WithError: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (!selected) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
        alert("Form submitted!");
      }
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="error-group"
            label="Option 1"
            value="1"
            checked={selected === "1"}
            onChange={(e) => {
              setSelected(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            error={submitted && !selected}
          />
          <Radio
            name="error-group"
            label="Option 2"
            value="2"
            checked={selected === "2"}
            onChange={(e) => {
              setSelected(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            error={submitted && !selected}
          />
        </div>
        {submitted && !selected && (
          <p className="text-sm text-red-600">⚠ Please select an option</p>
        )}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
        {selected && !submitted && (
          <p className="text-sm text-green-600">
            ✓ Option selected: {selected}
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Radio group with validation error. Try submitting without selecting an option to see the error state.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    const [selected, setSelected] = useState("1");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="disabled-group"
            label="Enabled option"
            value="1"
            checked={selected === "1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="disabled-group"
            label="Disabled option (cannot be selected)"
            value="2"
            disabled
            checked={false}
          />
          <Radio
            name="disabled-group"
            label="Another enabled option"
            value="3"
            checked={selected === "3"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected}</strong>
        </p>
        <p className="text-sm text-gray-600">
          The disabled option cannot be selected. Try clicking it - nothing
          happens. You can only select enabled options.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Radio group with a disabled option. Disabled radios cannot be interacted with and cannot be selected.",
      },
    },
  },
};

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState("2");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="group"
            label="Option 1"
            value="1"
            checked={selected === "1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="group"
            label="Option 2"
            value="2"
            checked={selected === "2"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="group"
            label="Option 3"
            value="3"
            checked={selected === "3"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected ? `Option ${selected}` : "None"}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Radio group with real state. Only one option can be selected at a time.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = useState("option2");
    const [changeCount, setChangeCount] = useState(0);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="controlled"
            label="Option 1"
            value="option1"
            checked={selected === "option1"}
            onChange={(e) => {
              setSelected(e.target.value);
              setChangeCount((prev) => prev + 1);
            }}
          />
          <Radio
            name="controlled"
            label="Option 2"
            value="option2"
            checked={selected === "option2"}
            onChange={(e) => {
              setSelected(e.target.value);
              setChangeCount((prev) => prev + 1);
            }}
          />
          <Radio
            name="controlled"
            label="Option 3"
            value="option3"
            checked={selected === "option3"}
            onChange={(e) => {
              setSelected(e.target.value);
              setChangeCount((prev) => prev + 1);
            }}
          />
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Selected:</strong> {selected}
          </p>
          <p>
            <strong>Change count:</strong> {changeCount}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelected("option1");
              setChangeCount((prev) => prev + 1);
            }}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Select Option 1
          </button>
          <button
            onClick={() => {
              setSelected("option2");
              setChangeCount((prev) => prev + 1);
            }}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Select Option 2
          </button>
          <button
            onClick={() => {
              setSelected("option3");
              setChangeCount((prev) => prev + 1);
            }}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Select Option 3
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates controlled radio group with state management. Use buttons to control state externally.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => {
    // Use ref to track the actual DOM state for demonstration
    const [selectedValue, setSelectedValue] = useState<string>("1");
    const [lastChange, setLastChange] = useState<string>(
      "Initial: Option 1 (defaultChecked)",
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(e.target.value);
      setLastChange(`Changed to: ${e.target.value}`);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="uncontrolled"
            label="Option 1"
            value="1"
            defaultChecked
            onChange={handleChange}
          />
          <Radio
            name="uncontrolled"
            label="Option 2"
            value="2"
            onChange={handleChange}
          />
          <Radio
            name="uncontrolled"
            label="Option 3"
            value="3"
            onChange={handleChange}
          />
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Current selection:</strong> {selectedValue}
          </p>
          <p>
            <strong>Last change:</strong> {lastChange}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          This is an uncontrolled component using <code>defaultChecked</code>.
          The component manages its own state internally via the DOM. We track
          changes here only for demonstration purposes.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates uncontrolled radio group using defaultChecked. The component manages its own state internally via the DOM, not React state.",
      },
    },
  },
};

export const FunctionalGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState("option2");
    return (
      <div className="space-y-4">
        <fieldset className="space-y-2 border border-gray-300 rounded p-4">
          <legend className="text-sm font-medium px-2">Choose an option</legend>
          <Radio
            name="functional"
            label="Option 1"
            value="option1"
            checked={selected === "option1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="functional"
            label="Option 2"
            value="option2"
            checked={selected === "option2"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="functional"
            label="Option 3"
            value="option3"
            checked={selected === "option3"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </fieldset>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected}</strong>
        </p>
        <p className="text-xs text-gray-500">
          This example uses <code>fieldset</code> and <code>legend</code> for
          better accessibility and semantic HTML structure.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Functional radio group with proper fieldset/legend for accessibility. This is the recommended pattern for form groups.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [selected, setSelected] = useState("1");

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Try navigating with Tab key and Arrow keys to change selection:
        </p>
        <div className="space-y-2">
          <Radio
            name="keyboard"
            label="First option (Tab here)"
            value="1"
            checked={selected === "1"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="keyboard"
            label="Second option"
            value="2"
            checked={selected === "2"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="keyboard"
            label="Third option"
            value="3"
            checked={selected === "3"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio
            name="keyboard"
            label="Disabled option"
            value="4"
            disabled
            checked={false}
          />
          <Radio
            name="keyboard"
            label="Fourth option"
            value="5"
            checked={selected === "5"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          Selected: <strong>{selected ? `Option ${selected}` : "None"}</strong>
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Keyboard shortcuts:</strong>
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>
              <strong>Tab</strong>: Move focus to the radio group
            </li>
            <li>
              <strong>Arrow Up/Down</strong>: Navigate between options
            </li>
            <li>
              <strong>Arrow Left/Right</strong>: Navigate between options
            </li>
            <li>
              <strong>Space</strong>: Select the focused option
            </li>
          </ul>
          <p className="mt-2">
            Disabled options are skipped during keyboard navigation.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation support. Use Tab to focus and Arrow keys to change selection. The disabled option is skipped.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>("2");
    const [showError, setShowError] = useState(false);

    // Error should show when showError is true AND Option 5 is not selected
    const shouldShowError = showError && selected !== "5";

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Radio
            name="states"
            label="Default unchecked"
            value="1"
            checked={selected === "1"}
            onChange={(e) => {
              setSelected(e.target.value);
              setShowError(false);
            }}
          />
          <Radio
            name="states"
            label="Checked (default)"
            value="2"
            checked={selected === "2"}
            onChange={(e) => {
              setSelected(e.target.value);
              setShowError(false);
            }}
          />
          <Radio
            name="states"
            label="Disabled"
            value="3"
            disabled
            checked={false}
          />
          <Radio
            name="states"
            label="Disabled checked"
            value="4"
            disabled
            checked={true}
          />
          <Radio
            name="states"
            label="With error (select to clear)"
            value="5"
            checked={selected === "5"}
            onChange={(e) => {
              setSelected(e.target.value);
              setShowError(false);
            }}
            error={shouldShowError}
            helperText={shouldShowError ? "This field is required" : undefined}
          />
          <Radio
            name="states"
            label="With helper text"
            value="6"
            checked={selected === "6"}
            onChange={(e) => {
              setSelected(e.target.value);
              setShowError(false);
            }}
            helperText="This is helpful information"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Selected:{" "}
            <strong>{selected ? `Option ${selected}` : "None"}</strong>
          </p>
          {shouldShowError && (
            <p className="text-sm text-red-600">
              ⚠ Error: Option 5 is required but not selected
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Trigger error by deselecting Option 5 (if it was selected) or keeping it unselected
                if (selected === "5") {
                  setSelected("2"); // Move selection away from Option 5
                } else {
                  setSelected(null); // Or clear selection entirely
                }
                setShowError(true);
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Trigger Error on Option 5
            </button>
            <button
              onClick={() => {
                setShowError(false);
                setSelected("2");
              }}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Click "Trigger Error" to show validation error on Option 5. Select
            Option 5 to clear the error.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All visual states of the radio component. Some are interactive, others are disabled. Use the button to trigger an error state on Option 5, then select it to clear the error.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleChange = fn((e: React.ChangeEvent<HTMLInputElement>) => {
      setSelected(e.target.value);
      console.log("Radio selected:", e.target.value);
    });

    const handleFocus = fn((_e: React.FocusEvent<HTMLInputElement>) => {
      console.log("Radio focused");
    });

    const handleBlur = fn((_e: React.FocusEvent<HTMLInputElement>) => {
      console.log("Radio blurred");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the radio buttons below. Check the Actions panel to see
          events being fired.
        </p>
        <div className="space-y-2">
          <Radio
            name="events-group"
            label="Option 1"
            value="1"
            checked={selected === "1"}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Radio
            name="events-group"
            label="Option 2"
            value="2"
            checked={selected === "2"}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Radio
            name="events-group"
            label="Option 3"
            value="3"
            checked={selected === "3"}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <p className="text-sm text-gray-500">
          Selected: {selected || "(none)"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");

    // Test focus and selection
    await userEvent.click(radios[0]);
    await waitFor(() => {
      expect(radios[0]).toBeChecked();
    });

    // Test changing selection
    await userEvent.click(radios[1]);
    await waitFor(() => {
      expect(radios[1]).toBeChecked();
      expect(radios[0]).not.toBeChecked();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all radio events. Interact with the radio buttons and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const UnselectedState: Story = {
  args: {
    name: "state-group",
    label: "Unselected Radio",
    value: "1",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Unselected state - default state of the radio, ready for interaction.",
      },
    },
  },
};

export const SelectedState: Story = {
  args: {
    name: "state-group",
    label: "Selected Radio",
    value: "1",
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Selected state - radio is selected, shows filled circle.",
      },
    },
  },
};

export const DisabledStateStory: Story = {
  args: {
    name: "state-group",
    label: "Disabled Radio",
    value: "1",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - radio is not interactive, shows reduced opacity.",
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    name: "state-group",
    label: "Focus me (Tab)",
    value: "1",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio");
    await userEvent.tab();
    await waitFor(() => {
      expect(radio).toHaveFocus();
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
