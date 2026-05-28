import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { fn } from "@storybook/test";
import Stepper from "./Stepper";
import Input from "../../primitives/Input/Input";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## Stepper

A stepper component for multi-step workflows. Supports validation, navigation control, and different statuses for each step.

### State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> Step0: Initialize
    Step0 --> Step1: handleNext() / onStepChange(1)
    Step1 --> Step2: handleNext() / onStepChange(2)
    Step2 --> StepN: handleNext() / onStepChange(n)
    StepN --> Completed: handleNext() on last step / onComplete()
    Step1 --> Step0: handlePrevious() / allowNavigation
    Step2 --> Step1: handlePrevious() / allowNavigation
    StepN --> StepNMinus1: handlePrevious() / allowNavigation
    Step0 --> Step0: handleStepClick(0) / allowNavigation
    Step1 --> Step1: handleStepClick(1) / allowNavigation
    Completed --> [*]
\`\`\`

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onStepChange\` | Passo mudou | \`(stepIndex: number) => void\` | Quando um novo passo é selecionado |
| \`onComplete\` | Stepper completado | \`() => void\` | Quando o último passo é completado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`horizontal\` | Orientação horizontal | \`orientation="horizontal"\` ou padrão | Passos dispostos horizontalmente |
| \`vertical\` | Orientação vertical | \`orientation="vertical"\` | Passos dispostos verticalmente |
| \`with-numbers\` | Com números | \`showStepNumbers={true}\` ou padrão | Números dos passos visíveis |
| \`without-numbers\` | Sem números | \`showStepNumbers={false}\` | Números dos passos ocultos |
| \`with-navigation\` | Com navegação | \`allowNavigation={true}\` ou padrão | Permite clicar em passos anteriores |
| \`without-navigation\` | Sem navegação | \`allowNavigation={false}\` | Não permite clicar em passos anteriores |
| \`with-status\` | Com status | Passos com \`status\` prop | Passos exibem status (completed, active, error, pending) |
        `,
      },
    },
  },
  argTypes: {
    steps: {
      description: "Array of step definitions",
      control: false,
    },
    currentStep: {
      description: "Index of the current active step",
      control: { type: "number", min: 0 },
      table: {
        type: { summary: "number" },
      },
    },
    onStepChange: {
      description: "Callback fired when the step changes",
      action: "onStepChange",
      category: "Events",
      table: {
        type: { summary: "(stepIndex: number) => void" },
      },
    },
    onComplete: {
      description: "Callback fired when the stepper is completed",
      action: "onComplete",
      category: "Events",
      table: {
        type: { summary: "() => void" },
      },
    },
    orientation: {
      description: "Orientation of the stepper",
      control: "select",
      options: ["horizontal", "vertical"],
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    showStepNumbers: {
      description: "Whether to show step numbers",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    allowNavigation: {
      description: "Whether to allow clicking on previous steps",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const basicSteps = [
  {
    id: "1",
    title: "Account",
    description: "Create your account",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Create Account</h3>
        <Input label="Email" type="email" placeholder="your@email.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
      </div>
    ),
  },
  {
    id: "2",
    title: "Profile",
    description: "Complete your profile",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        <Input label="First Name" placeholder="John" />
        <Input label="Last Name" placeholder="Doe" />
      </div>
    ),
  },
  {
    id: "3",
    title: "Review",
    description: "Review and submit",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        <p className="text-sm text-gray-600">
          Please review all the information you've entered and click Complete to
          finish.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(0);
    const handleStepChange = fn((stepIndex: number) => {
      setCurrentStep(stepIndex);
    });
    const handleComplete = fn(() => {
      alert("Completed!");
    });

    return (
      <Stepper
        {...args}
        steps={basicSteps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that first step is visible
    expect(canvas.getByText(/create your account/i)).toBeInTheDocument();

    // Find and click next button
    const nextButton = canvas.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    // Wait for second step to appear
    await waitFor(() => {
      expect(canvas.getByText(/complete your profile/i)).toBeInTheDocument();
    });
  },
};

export const Vertical: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return (
      <Stepper
        steps={basicSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        orientation="vertical"
        onComplete={() => alert("Completed!")}
      />
    );
  },
};

export const WithoutStepNumbers: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return (
      <Stepper
        steps={basicSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        showStepNumbers={false}
        onComplete={() => alert("Completed!")}
      />
    );
  },
};

export const WithStatus: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithStatus = [
      { ...basicSteps[0], status: "completed" as const },
      { ...basicSteps[1], status: "active" as const },
      { ...basicSteps[2], status: "pending" as const },
    ];

    return (
      <Stepper
        steps={stepsWithStatus}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert("Completed!")}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithError = [
      { ...basicSteps[0], status: "completed" as const },
      { ...basicSteps[1], status: "error" as const },
      { ...basicSteps[2], status: "pending" as const },
    ];

    return (
      <Stepper
        steps={stepsWithError}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert("Completed!")}
      />
    );
  },
};

export const WithoutNavigation: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return (
      <Stepper
        steps={basicSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        allowNavigation={false}
        onComplete={() => alert("Completed!")}
      />
    );
  },
};

export const ComplexWorkflow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
    const handleComplete = fn(() => {
      alert("Registration Complete!");
      console.log("Form Data:", formData);
    });

    const complexSteps = [
      {
        id: "1",
        title: "Sign Up",
        description: "Create your account",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create Your Account</h3>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        ),
      },
      {
        id: "2",
        title: "Personal Info",
        description: "Tell us about yourself",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
        ),
      },
      {
        id: "3",
        title: "Review",
        description: "Review your information",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">
                  {formData.email || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return (
      <Stepper
        steps={complexSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in first step
    const emailInput = await canvas.findByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");

    // There might be multiple password inputs, get the first one
    const passwordInputs = canvas.getAllByLabelText((content, element) => {
      return element?.getAttribute("type") === "password" || false;
    });
    const passwordInput = passwordInputs[0];
    if (passwordInput) {
      await userEvent.type(passwordInput, "password123");
    }

    // Go to next step
    const nextButtons = canvas.getAllByRole("button", { name: /next/i });
    const nextButton = nextButtons[0];
    if (nextButton) {
      await userEvent.click(nextButton);
    }

    // Wait for second step
    await waitFor(
      async () => {
        const personalInfo = await canvas.findByText(/personal information/i);
        expect(personalInfo).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Fill in second step
    const firstNameInput = await canvas.findByLabelText(/first name/i);
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = await canvas.findByLabelText(/last name/i);
    await userEvent.type(lastNameInput, "Doe");

    // Go to review step
    const nextButtons2 = canvas.getAllByRole("button", { name: /next/i });
    const nextButton2 = nextButtons2[0];
    if (nextButton2) {
      await userEvent.click(nextButton2);
    }

    // Wait for review step - there might be multiple "review your information" elements
    await waitFor(() => {
      const reviewElements = canvas.getAllByText((content, element) => {
        return (
          element?.textContent
            ?.toLowerCase()
            .includes("review your information") || false
        );
      });
      expect(reviewElements.length).toBeGreaterThan(0);
      expect(canvas.getByText(/test@example.com/i)).toBeInTheDocument();
      expect(canvas.getByText(/john doe/i)).toBeInTheDocument();
    });
  },
};

export const WithValidation: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = () => {
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email");
        return false;
      }
      setError("");
      return true;
    };

    const stepsWithValidation = [
      {
        id: "1",
        title: "Email",
        description: "Enter your email",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email Address</h3>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
            />
          </div>
        ),
      },
      {
        id: "2",
        title: "Complete",
        description: "All done!",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Email Verified</h3>
            <p className="text-sm text-gray-600">Your email: {email}</p>
          </div>
        ),
      },
    ];

    const handleNext = () => {
      if (currentStep === 0 && !validateEmail()) {
        return;
      }
      setCurrentStep(currentStep + 1);
    };

    return (
      <div>
        <Stepper
          steps={stepsWithValidation}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={() => alert("Completed!")}
        />
        <div className="mt-4 flex justify-end gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm border rounded"
            >
              Back
            </button>
          )}
          {currentStep < stepsWithValidation.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => alert("Completed!")}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    );
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const handleStepChange = fn((stepIndex: number) => {
      setCurrentStep(stepIndex);
    });
    const handleComplete = fn(() => {
      console.log("Stepper completed!");
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Navigate through steps or complete the stepper. Check the Actions
          panel to see events being fired.
        </p>
        <Stepper
          steps={basicSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onComplete={handleComplete}
        />
        <p className="text-sm text-gray-500">Current step: {currentStep + 1}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = canvas.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);
    await waitFor(() => {
      expect(canvas.getByText(/complete your profile/i)).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates stepper events. Navigate through steps and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const HorizontalState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 0,
    orientation: "horizontal",
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Horizontal state - steps are arranged horizontally (default).",
      },
    },
  },
};

export const VerticalState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 0,
    orientation: "vertical",
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Vertical state - steps are arranged vertically.",
      },
    },
  },
};

export const WithStepNumbersState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 0,
    showStepNumbers: true,
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "With step numbers state - step numbers are displayed.",
      },
    },
  },
};

export const WithoutStepNumbersState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 0,
    showStepNumbers: false,
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Without step numbers state - step numbers are hidden.",
      },
    },
  },
};

export const WithNavigationState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 1,
    allowNavigation: true,
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "With navigation state - allows clicking on previous steps.",
      },
    },
  },
};

export const WithoutNavigationState: Story = {
  args: {
    steps: basicSteps,
    currentStep: 1,
    allowNavigation: false,
    onStepChange: () => {},
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without navigation state - does not allow clicking on previous steps.",
      },
    },
  },
};
