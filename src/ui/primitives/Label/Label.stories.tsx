import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import Label from "./Label";
import { Input } from "../../primitives";

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `
## Label

A styled label component for form inputs with support for required and optional variants.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Label clicado | \`(event: MouseEvent) => void\` | Quando o label é clicado (foca o input associado) |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | \`variant="default"\` ou sem variant | Label normal |
| \`required\` | Campo obrigatório | \`variant="required"\` | Label com asterisco (*) |
| \`optional\` | Campo opcional | \`variant="optional"\` | Label com texto "(optional)" |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "required", "optional"],
      description: "Visual variant of the label",
    },
    htmlFor: {
      control: "text",
      description: "ID of the associated input element",
    },
    children: {
      control: "text",
      description: "Label text",
    },
    onClick: {
      description: "Callback fired when the label is clicked",
      action: "onClick",
      table: {
        type: { summary: "(event: MouseEvent) => void" },
        category: "Events",
      },
    },
  },
};

export const Default: StoryObj<typeof Label> = {
  args: {
    children: "Email Address",
    htmlFor: "email",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="email" placeholder="Enter email..." />
    </div>
  ),
};

export const Required: StoryObj<typeof Label> = {
  args: {
    children: "Email Address",
    htmlFor: "email-required",
    variant: "required",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="email-required" placeholder="Enter email..." required />
    </div>
  ),
};

export const Optional: StoryObj<typeof Label> = {
  args: {
    children: "Middle Name",
    htmlFor: "middle-name",
    variant: "optional",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="middle-name" placeholder="Enter middle name..." />
    </div>
  ),
};

export const WithInput: StoryObj<typeof Label> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Full Name
        </Label>
        <Input id="name" placeholder="Enter your name..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" type="email" placeholder="Enter your email..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" variant="optional">
          Phone Number
        </Label>
        <Input id="phone" type="tel" placeholder="Enter your phone..." />
      </div>
    </div>
  ),
};

export const AllVariants: StoryObj<typeof Label> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="default" variant="default">
          Default Label
        </Label>
        <Input id="default" placeholder="Default variant..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="required" variant="required">
          Required Label
        </Label>
        <Input id="required" placeholder="Required variant..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="optional" variant="optional">
          Optional Label
        </Label>
        <Input id="optional" placeholder="Optional variant..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all label variants: default, required (with asterisk), and optional (with '(optional)' text).",
      },
    },
  },
};

export const WithDifferentInputs: StoryObj<typeof Label> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="text-input" variant="required">
          Text Input
        </Label>
        <Input id="text-input" type="text" placeholder="Text input..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-input" variant="required">
          Email Input
        </Label>
        <Input id="email-input" type="email" placeholder="Email input..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-input" variant="required">
          Password Input
        </Label>
        <Input
          id="password-input"
          type="password"
          placeholder="Password input..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-input" variant="optional">
          Textarea
        </Label>
        <textarea
          id="textarea-input"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Textarea..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="select-input" variant="required">
          Select
        </Label>
        <select
          id="select-input"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates Label component with different types of form inputs.",
      },
    },
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Label> = {
  render: () => {
    const handleClick = fn((_e: React.MouseEvent<HTMLLabelElement>) => {
      console.log("Label clicked");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the label below. It will focus the associated input and fire the
          onClick event.
        </p>
        <div className="space-y-2">
          <Label htmlFor="events-input" onClick={handleClick}>
            Click me to focus input
          </Label>
          <Input id="events-input" placeholder="Click the label above..." />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Click me to focus input");
    const input = canvas.getByRole("textbox");

    // Click label should focus input
    await userEvent.click(label);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates label click event. Clicking the label focuses the associated input.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof Label> = {
  args: {
    children: "Default Label",
    htmlFor: "default-input",
    variant: "default",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="default-input" placeholder="Default variant..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Default state - standard label without special indicators.",
      },
    },
  },
};

export const RequiredState: StoryObj<typeof Label> = {
  args: {
    children: "Required Label",
    htmlFor: "required-input",
    variant: "required",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="required-input" placeholder="Required variant..." required />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Required state - shows asterisk (*) to indicate the field is required.",
      },
    },
  },
};

export const OptionalState: StoryObj<typeof Label> = {
  args: {
    children: "Optional Label",
    htmlFor: "optional-input",
    variant: "optional",
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="optional-input" placeholder="Optional variant..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Optional state - shows "(optional)" text to indicate the field is optional.',
      },
    },
  },
};

export default meta;
