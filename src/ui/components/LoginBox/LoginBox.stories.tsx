import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, within, waitFor } from "@storybook/test";
import { useState } from "react";
import LoginBox from "./LoginBox";

const meta: Meta<typeof LoginBox> = {
  title: "Components/LoginBox",
  component: LoginBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    actions: {
      argTypesRegex: "^on.*",
    },
    docs: {
      description: {
        component: `
## LoginBox

A login box component for user authentication.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSubmit\` | Formulário de login submetido | \`(credentials: { email: string, password: string }) => void\` | Quando o formulário é submetido |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Login box normal |
| \`loading\` | Carregando | Durante autenticação | Indicador de loading visível |
| \`error\` | Com erro | Após falha de autenticação | Mensagem de erro visível |
| \`success\` | Com sucesso | Após autenticação bem-sucedida | Mensagem de sucesso visível |
        `,
      },
    },
  },
  argTypes: {
    onSubmit: {
      action: "submitted",
      description: "Callback when login form is submitted",
      category: "Events",
    },
  },
};

export const Primary: StoryObj<typeof LoginBox> = {
  args: {
    className: "w-[300px]",
    onSubmit: fn().mockName("onSubmit"),
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof LoginBox> = {
  render: () => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = fn(
      (credentials: { email: string; password: string }) => {
        console.log("Login submitted:", credentials);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      },
    );

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Fill in the form and submit. Check the Actions panel to see events
          being fired.
        </p>
        <LoginBox className="w-[300px]" onSubmit={handleSubmit} />
        {submitted && (
          <p className="text-sm text-green-600">✓ Form submitted!</p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for login box to be rendered
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: /login|sign in/i }),
      ).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates login box events. Fill in and submit the form, then check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof LoginBox> = {
  args: {
    className: "w-[300px]",
    onSubmit: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - login box in normal state.",
      },
    },
  },
};

export default meta;
