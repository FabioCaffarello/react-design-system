import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `
## Textarea

A textarea component for longer text input with support for validation states and resize options.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Valor mudou | \`(event: ChangeEvent<HTMLTextAreaElement>) => void\` | Quando o texto é alterado |
| \`onFocus\` | Textarea recebe foco | \`(event: FocusEvent) => void\` | Quando o textarea recebe foco |
| \`onBlur\` | Textarea perde foco | \`(event: FocusEvent) => void\` | Quando o textarea perde foco |
| \`onKeyDown\` | Tecla pressionada | \`(event: KeyboardEvent) => void\` | Quando uma tecla é pressionada |
| \`onKeyUp\` | Tecla liberada | \`(event: KeyboardEvent) => void\` | Quando uma tecla é liberada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Textarea normal |
| \`focus\` | Com foco | Tab ou clique | Textarea com outline de foco |
| \`error\` | Com erro | \`error={true}\` | Textarea com borda vermelha |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Textarea com opacidade reduzida |
        `,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    rows: {
      control: "number",
      description: "Number of visible rows",
    },
    cols: {
      control: "number",
      description: "Number of visible columns",
    },
    error: {
      control: "boolean",
      description: "Show error state",
    },
    label: {
      control: "text",
      description: "Visible label rendered above the textarea",
    },
    helperText: {
      control: "text",
      description:
        "Secondary text rendered beneath the textarea (wired via aria-describedby)",
    },
    disabled: {
      control: "boolean",
      description: "Disable the textarea",
    },
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
      description: "Resize behavior",
    },
    onChange: {
      description: "Callback fired when the textarea value changes",
      action: "onChange",
      table: {
        type: { summary: "(event: ChangeEvent<HTMLTextAreaElement>) => void" },
        category: "Events",
      },
    },
    onFocus: {
      description: "Callback fired when the textarea receives focus",
      action: "onFocus",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onBlur: {
      description: "Callback fired when the textarea loses focus",
      action: "onBlur",
      table: {
        type: { summary: "(event: FocusEvent) => void" },
        category: "Events",
      },
    },
    onKeyDown: {
      description: "Callback fired when a key is pressed",
      action: "onKeyDown",
      table: {
        type: { summary: "(event: KeyboardEvent) => void" },
        category: "Events",
      },
    },
    onKeyUp: {
      description: "Callback fired when a key is released",
      action: "onKeyUp",
      table: {
        type: { summary: "(event: KeyboardEvent) => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Enter description..."
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-fg-secondary">
          Character count: <strong>{value.length}</strong>
        </p>
        <p className="text-sm text-fg-secondary">Value: {value || "(empty)"}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive textarea with real state. Type to see the character count and value update.",
      },
    },
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [value, setValue] = useState("This is a default value");
    return (
      <div className="space-y-4">
        <Textarea
          label="Description"
          defaultValue="This is a default value"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-fg-secondary">
          Character count: <strong>{value.length}</strong>
        </p>
        <p className="text-xs text-fg-tertiary">
          Starts with a default value. You can edit it.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Textarea starting with a default value. You can edit it.",
      },
    },
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    helperText: "Up to 500 characters. Markdown is supported.",
    placeholder: "Tell us about yourself…",
    rows: 4,
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const minLength = 10;

    const handleSubmit = () => {
      if (value.length < minLength) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
        alert("Form submitted!");
      }
    };

    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Enter description (min 10 characters)..."
          rows={4}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (submitted && e.target.value.length >= minLength) {
              setSubmitted(false);
            }
          }}
          error={submitted && value.length < minLength}
        />
        {submitted && value.length < minLength && (
          <p className="text-sm text-fg-error">
            ⚠ Description must be at least {minLength} characters (
            {value.length}/{minLength})
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-surface-brand-strong text-fg-inverse rounded hover:opacity-90"
        >
          Submit
        </button>
        {value.length >= minLength && !submitted && (
          <p className="text-sm text-fg-success">
            ✓ Description is valid ({value.length} characters)
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Textarea with validation error. Try submitting with less than 10 characters to see the error state.",
      },
    },
  },
};

export const ResizeOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Vertical resize (default)
        </label>
        <Textarea
          placeholder="Can resize vertically..."
          rows={4}
          resize="vertical"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Horizontal resize
        </label>
        <Textarea
          placeholder="Can resize horizontally..."
          rows={4}
          resize="horizontal"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Both directions
        </label>
        <Textarea
          placeholder="Can resize both ways..."
          rows={4}
          resize="both"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">No resize</label>
        <Textarea placeholder="Fixed size textarea" rows={4} resize="none" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates different resize options for the textarea.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Small (3 rows)</label>
        <Textarea placeholder="Small textarea..." rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Medium (4 rows)
        </label>
        <Textarea placeholder="Medium textarea..." rows={4} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Large (8 rows)</label>
        <Textarea placeholder="Large textarea..." rows={8} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates textarea with different row sizes.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
          rows={4}
        />
        <p className="text-sm text-fg-secondary">
          Character count: {value.length}
        </p>
        <p className="text-sm text-fg-secondary">
          Current value: {value || "(empty)"}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates controlled textarea with state management.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea
        defaultValue="Initial value"
        placeholder="Type something..."
        rows={4}
      />
      <p className="text-sm text-fg-secondary">
        Uses defaultValue for initial value without state management.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates uncontrolled textarea using defaultValue.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => {
    const [defaultValue, setDefaultValue] = useState("");
    const [errorValue, setErrorValue] = useState("");

    return (
      <div className="space-y-4">
        <Textarea
          label="Default"
          placeholder="Default state"
          rows={4}
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
        <Textarea
          label="Error"
          placeholder="Error state"
          rows={4}
          error
          value={errorValue}
          onChange={(e) => setErrorValue(e.target.value)}
        />
        <Textarea
          label="Disabled"
          placeholder="Disabled state"
          rows={4}
          disabled
        />
        <Textarea
          label="Disabled with value"
          defaultValue="Disabled with value"
          rows={4}
          disabled
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All visual states of the textarea component. Some are interactive, others are disabled.",
      },
    },
  },
};

export const WithCols: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Narrow (cols: 20)
        </label>
        <Textarea placeholder="Narrow textarea..." rows={4} cols={20} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Medium (cols: 40)
        </label>
        <Textarea placeholder="Medium textarea..." rows={4} cols={40} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Wide (cols: 60)
        </label>
        <Textarea placeholder="Wide textarea..." rows={4} cols={60} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates textarea with different column widths.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const handleChange = fn((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      console.log("Value changed:", e.target.value);
    });

    const handleFocus = fn((_e: React.FocusEvent<HTMLTextAreaElement>) => {
      console.log("Textarea focused");
    });

    const handleBlur = fn((_e: React.FocusEvent<HTMLTextAreaElement>) => {
      console.log("Textarea blurred");
    });

    const handleKeyDown = fn((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      console.log("Key pressed:", e.key);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Interact with the textarea below. Check the Actions panel to see
          events being fired.
        </p>
        <Textarea
          placeholder="Type something..."
          rows={4}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <p className="text-sm text-fg-tertiary">
          Character count: {value.length}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    // Test focus
    await userEvent.click(textarea);
    await waitFor(() => {
      expect(textarea).toHaveFocus();
    });

    // Test typing
    await userEvent.type(textarea, "Hello");
    await waitFor(() => {
      expect(textarea).toHaveValue("Hello");
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all textarea events. Interact with the textarea and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    placeholder: "Default state textarea",
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - textarea is ready for input.",
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    placeholder: "Focus me (Tab)",
    rows: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    await userEvent.tab();
    await waitFor(() => {
      expect(textarea).toHaveFocus();
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

export const ErrorState: Story = {
  args: {
    label: "Description",
    placeholder: "Error state textarea",
    rows: 4,
    error: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Error state - shows red border. Used for validation feedback.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    placeholder: "Disabled state textarea",
    rows: 4,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - textarea is not interactive, shows reduced opacity.",
      },
    },
  },
};
