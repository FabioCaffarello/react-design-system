import type { Meta, StoryObj } from "@storybook/react";
import ErrorMessage from "./ErrorMessage";
import { Label, Input } from "../";

const meta: Meta<typeof ErrorMessage> = {
  title: "Atoms/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## ErrorMessage

A component for displaying validation error messages. Accessible with role='alert' and aria-live='polite'.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | ErrorMessage é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`visible\` | Mensagem visível | Quando há mensagem de erro | Mensagem de erro exibida |
| \`hidden\` | Mensagem oculta | Quando não há mensagem | Mensagem não exibida |
        `,
      },
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "Error message to display",
    },
    id: {
      control: "text",
      description:
        "ID for accessibility (should match aria-describedby on input)",
    },
  },
};

export const Default: StoryObj<typeof ErrorMessage> = {
  args: {
    message: "This field is required",
  },
};

export const WithInput: StoryObj<typeof ErrorMessage> = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <Label htmlFor="email" variant="required">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter email..."
        aria-invalid="true"
        aria-describedby="email-error"
      />
      <ErrorMessage
        message="Please enter a valid email address"
        id="email-error"
      />
    </div>
  ),
};

export const MultipleErrors: StoryObj<typeof ErrorMessage> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" aria-invalid="true" aria-describedby="name-error" />
        <ErrorMessage
          message="Name must be at least 3 characters"
          id="name-error"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" variant="required">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          aria-invalid="true"
          aria-describedby="password-error"
        />
        <ErrorMessage
          message="Password must be at least 8 characters"
          id="password-error"
        />
      </div>
    </div>
  ),
};

// State Stories
export const VisibleState: StoryObj<typeof ErrorMessage> = {
  args: {
    message: "This field is required",
    id: "error-message",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Visible state - error message is displayed when there is an error.",
      },
    },
  },
};

export const HiddenState: StoryObj<typeof ErrorMessage> = {
  args: {
    message: "",
    id: "error-message",
  },
  render: (args) => (
    <div className="space-y-2 max-w-md">
      <Label htmlFor="input" variant="required">
        Input Field
      </Label>
      <Input id="input" />
      {args.message && <ErrorMessage {...args} />}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hidden state - error message is not displayed when there is no error.",
      },
    },
  },
};

export default meta;
