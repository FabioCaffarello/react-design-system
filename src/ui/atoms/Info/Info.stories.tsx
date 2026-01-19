import type { Meta, StoryObj } from "@storybook/react";
import Info from "./Info";

const meta: Meta<typeof Info> = {
  title: "Atoms/Info",
  component: Info,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Info

An alert component for displaying informational messages, warnings, or errors. Uses role='alert' for accessibility.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Info é um componente de exibição | - | Não possui eventos de interação |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`info\` | Variante informativa | \`variant="info"\` | Mensagem com estilo informativo |
| \`warning\` | Variante aviso | \`variant="warning"\` | Mensagem com estilo de aviso |
| \`error\` | Variante erro | \`variant="error"\` | Mensagem com estilo de erro |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error"],
      description: "Visual variant of the info message",
    },
    children: {
      control: "text",
      description: "Message content (ReactNode)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Info>;

export const Default: Story = {
  args: {
    variant: "info",
    children: "This is an informational message.",
  },
};

export const InfoVariant: Story = {
  args: {
    variant: "info",
    children: "This is an informational message. Use this variant for general information.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "This is a warning message. Use this variant to alert users about potential issues.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "This is an error message. Use this variant to display critical errors or validation failures.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Info variant="info">
        Your changes have been saved successfully.
      </Info>
      <Info variant="warning">
        Please review your changes before submitting.
      </Info>
      <Info variant="error">
        There was an error processing your request.
      </Info>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Info variant="info">
        <strong>Tip:</strong> You can use keyboard shortcuts to navigate faster.
      </Info>
      <Info variant="warning">
        <strong>Warning:</strong> This action cannot be undone.
      </Info>
      <Info variant="error">
        <strong>Error:</strong> Unable to connect to the server. Please check your internet connection.
      </Info>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    variant: "info",
    children: "This is a longer informational message that demonstrates how the Info component handles extended content. It should wrap properly and maintain good readability.",
  },
};

// State Stories
export const InfoState: Story = {
  args: {
    variant: "info",
    children: "This is an informational message.",
  },
  parameters: {
    docs: {
      description: {
        story: 'Info state - informational message with info variant styling.',
      },
    },
  },
};

export const WarningState: Story = {
  args: {
    variant: "warning",
    children: "This is a warning message.",
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning state - warning message with warning variant styling.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    children: "This is an error message.",
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state - error message with error variant styling.',
      },
    },
  },
};
