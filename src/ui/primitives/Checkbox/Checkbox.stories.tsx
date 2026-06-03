import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
## Checkbox

A checkbox component with support for checked, unchecked, and indeterminate states.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Estado do checkbox muda | \`(checked: boolean) => void\` | Quando o checkbox é marcado/desmarcado |
| \`onFocus\` | Checkbox recebe foco | \`(event: FocusEvent) => void\` | Quando o checkbox recebe foco |
| \`onBlur\` | Checkbox perde foco | \`(event: FocusEvent) => void\` | Quando o checkbox perde foco |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`unchecked\` | Não marcado | Estado inicial | Checkbox vazio |
| \`checked\` | Marcado | \`checked={true}\` ou clicar | Checkbox com check |
| \`indeterminate\` | Indeterminado | \`indeterminate={true}\` | Checkbox com linha horizontal |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Checkbox com opacidade reduzida |
| \`focus\` | Com foco | Tab ou clique | Checkbox com outline de foco |
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
      description: "Helper text displayed below checkbox",
    },
    disabled: {
      control: "boolean",
      description: "Disable the checkbox",
    },
    checked: {
      control: "boolean",
      description: "Checked state (for controlled)",
    },
    defaultChecked: {
      control: "boolean",
      description: "Default checked state (for uncontrolled)",
    },
    indeterminate: {
      control: "boolean",
      description: "Show indeterminate state",
    },
    onChange: {
      description: "Callback fired when the checkbox state changes",
      action: "onChange",
      table: {
        type: { summary: "(checked: boolean) => void" },
        category: "Events",
      },
    },
    onFocus: {
      description: "Callback fired when the checkbox receives focus",
      action: "onFocus",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onBlur: {
      description: "Callback fired when the checkbox loses focus",
      action: "onBlur",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-4">
        <Checkbox
          label="I agree to the terms and conditions"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-fg-secondary">
          Status: <strong>{checked ? "Checked" : "Unchecked"}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive checkbox with real state. Click to toggle and see the state change.",
      },
    },
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div className="space-y-4">
        <Checkbox
          label="Subscribe to newsletter"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-fg-secondary">
          Status: <strong>{checked ? "Subscribed" : "Not subscribed"}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Checkbox starting in checked state. Click to toggle.",
      },
    },
  },
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (!checked) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
        alert("Form submitted!");
      }
    };

    return (
      <div className="space-y-4">
        <Checkbox
          label="Accept terms"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            if (submitted && e.target.checked) {
              setSubmitted(false);
            }
          }}
          error={submitted && !checked}
          helperText={
            submitted && !checked
              ? "You must accept the terms to continue"
              : undefined
          }
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-surface-brand-strong text-fg-inverse rounded hover:opacity-90"
        >
          Submit
        </button>
        {checked && !submitted && (
          <p className="text-sm text-fg-success">✓ Terms accepted</p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Checkbox with validation error. Try submitting without checking to see the error state.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="This option is disabled" disabled checked={false} />
      <Checkbox
        label="This disabled option is checked"
        disabled
        checked={true}
      />
      <p className="text-sm text-fg-secondary">
        Disabled checkboxes cannot be interacted with. Try clicking them -
        nothing happens.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled checkboxes in both checked and unchecked states. They cannot be interacted with.",
      },
    },
  },
};

export const WithoutLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            aria-label="Toggle option"
          />
          <span className="text-sm text-fg-secondary">
            Checkbox without visible label (uses aria-label)
          </span>
        </div>
        <p className="text-sm text-fg-secondary">
          Status: <strong>{checked ? "Checked" : "Unchecked"}</strong>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Checkbox without visible label. Uses aria-label for accessibility.",
      },
    },
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = useState({
      item1: false,
      item2: true,
      item3: false,
    });

    const allChecked = Object.values(checkedItems).every(Boolean);
    const someChecked = Object.values(checkedItems).some(Boolean);
    const indeterminate = someChecked && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setCheckedItems({
        item1: checked,
        item2: checked,
        item3: checked,
      });
    };

    return (
      <div className="space-y-4">
        <Checkbox
          label="Select all items"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div className="ml-6 space-y-2">
          <Checkbox
            label="Item 1"
            checked={checkedItems.item1}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item1: e.target.checked })
            }
          />
          <Checkbox
            label="Item 2"
            checked={checkedItems.item2}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item2: e.target.checked })
            }
          />
          <Checkbox
            label="Item 3"
            checked={checkedItems.item3}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item3: e.target.checked })
            }
          />
        </div>
        <div className="text-sm text-fg-secondary space-y-1">
          <p>
            <strong>Select All State:</strong>{" "}
            {allChecked
              ? "All checked"
              : indeterminate
                ? "Indeterminate (some checked)"
                : "All unchecked"}
          </p>
          <p>
            <strong>Selected Items:</strong>{" "}
            {Object.entries(checkedItems)
              .filter(([_, checked]) => checked)
              .map(([key]) => key)
              .join(", ") || "None"}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Indeterminate state in a "select all" scenario. The "Select all" checkbox shows indeterminate when some (but not all) items are selected.',
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [changeCount, setChangeCount] = useState(0);

    return (
      <div className="space-y-4">
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            setChangeCount((prev) => prev + 1);
          }}
        />
        <div className="text-sm text-fg-secondary space-y-1">
          <p>
            <strong>Checked:</strong> {checked ? "Yes" : "No"}
          </p>
          <p>
            <strong>Change count:</strong> {changeCount}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChecked(true)}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Check
          </button>
          <button
            onClick={() => setChecked(false)}
            className="px-3 py-1 text-sm bg-surface-emphasis rounded hover:bg-surface-strong"
          >
            Uncheck
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled checkbox with external state management. Use buttons to control state externally.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => {
    const [states, setStates] = useState({
      default: false,
      checked: true,
      indeterminate: false,
      disabled: false,
      disabledChecked: true,
      error: false,
      helper: false,
    });

    return (
      <div className="space-y-4">
        <Checkbox
          label="Default unchecked"
          checked={states.default}
          onChange={(e) => setStates({ ...states, default: e.target.checked })}
        />
        <Checkbox
          label="Checked"
          checked={states.checked}
          onChange={(e) => setStates({ ...states, checked: e.target.checked })}
        />
        <Checkbox
          label="Indeterminate"
          indeterminate={states.indeterminate}
          checked={false}
          onChange={() =>
            setStates({ ...states, indeterminate: !states.indeterminate })
          }
        />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled checked />
        <Checkbox
          label="With error"
          checked={states.error}
          onChange={(e) => setStates({ ...states, error: e.target.checked })}
          error={!states.error}
          helperText={!states.error ? "This field is required" : undefined}
        />
        <Checkbox
          label="With helper text"
          checked={states.helper}
          onChange={(e) => setStates({ ...states, helper: e.target.checked })}
          helperText="This is helpful information"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All visual states of the checkbox component. Some are interactive, others are disabled.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Uncontrolled checkbox" defaultChecked={false} />
      <Checkbox label="Uncontrolled checked" defaultChecked={true} />
      <p className="text-sm text-fg-secondary">
        Uses defaultChecked for initial state without state management.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates uncontrolled checkbox using defaultChecked.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-fg-secondary">
        Try navigating with Tab key and toggling with Space:
      </p>
      <div className="space-y-2">
        <Checkbox label="First checkbox (Tab here)" />
        <Checkbox label="Second checkbox" />
        <Checkbox label="Third checkbox" />
        <Checkbox label="Disabled checkbox" disabled />
        <Checkbox label="Fourth checkbox" />
      </div>
      <p className="text-xs text-fg-tertiary">
        All checkboxes support keyboard navigation: Tab to focus, Space to
        toggle.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation support. Use Tab to navigate and Space to toggle.",
      },
    },
  },
};

export const IndeterminateState: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = useState({
      item1: false,
      item2: false,
      item3: false,
    });

    const allChecked = Object.values(checkedItems).every(Boolean);
    const someChecked = Object.values(checkedItems).some(Boolean);
    const indeterminate = someChecked && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setCheckedItems({
        item1: checked,
        item2: checked,
        item3: checked,
      });
    };

    return (
      <div className="space-y-4">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div className="ml-6 space-y-2">
          <Checkbox
            label="Item 1"
            checked={checkedItems.item1}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item1: e.target.checked })
            }
          />
          <Checkbox
            label="Item 2"
            checked={checkedItems.item2}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item2: e.target.checked })
            }
          />
          <Checkbox
            label="Item 3"
            checked={checkedItems.item3}
            onChange={(e) =>
              setCheckedItems({ ...checkedItems, item3: e.target.checked })
            }
          />
        </div>
        <div className="text-sm text-fg-secondary space-y-1">
          <p>
            <strong>Select All State:</strong>{" "}
            {allChecked
              ? "✓ All checked"
              : indeterminate
                ? "⊟ Indeterminate (some checked)"
                : "☐ All unchecked"}
          </p>
          <p>
            <strong>Selected Items:</strong>{" "}
            {Object.entries(checkedItems)
              .filter(([_, checked]) => checked)
              .map(([key]) => key)
              .join(", ") || "None"}
          </p>
          <p className="text-xs text-fg-tertiary mt-2">
            The "Select all" checkbox shows indeterminate state (⊟) when some
            items are selected.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates indeterminate state in a "select all" scenario. Select some items to see the indeterminate state appear.',
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    const handleChange = fn((event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      console.log("Checkbox changed:", event.target.checked);
    });

    const handleFocus = fn((_event: React.FocusEvent<HTMLInputElement>) => {
      console.log("Checkbox focused");
    });

    const handleBlur = fn((_event: React.FocusEvent<HTMLInputElement>) => {
      console.log("Checkbox blurred");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Interact with the checkbox below. Check the Actions panel to see
          events being fired.
        </p>
        <Checkbox
          label="Interactive Checkbox"
          checked={checked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <p className="text-sm text-fg-tertiary">
          Current state: {checked ? "Checked" : "Unchecked"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Test focus
    await userEvent.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toHaveFocus();
    });

    // Test toggle
    await userEvent.click(checkbox);

    // Test blur
    await userEvent.tab();
    await waitFor(() => {
      expect(checkbox).not.toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all checkbox events. Interact with the checkbox and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const UncheckedState: Story = {
  args: {
    label: "Unchecked Checkbox",
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Unchecked state - default state of the checkbox, ready for interaction.",
      },
    },
  },
};

export const CheckedState: Story = {
  args: {
    label: "Checked Checkbox",
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Checked state - checkbox is selected, shows checkmark.",
      },
    },
  },
};

export const IndeterminateStateStory: Story = {
  args: {
    label: "Indeterminate Checkbox",
    indeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indeterminate state - shows horizontal line, used when some but not all items are selected.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: "Disabled Checkbox",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - checkbox is not interactive, shows reduced opacity.",
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    label: "Focus me (Tab or click)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    await userEvent.tab();
    await waitFor(() => {
      expect(checkbox).toHaveFocus();
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
