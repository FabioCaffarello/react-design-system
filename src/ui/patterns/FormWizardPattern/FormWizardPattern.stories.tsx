import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import { FormWizardPattern } from './FormWizardPattern';
import { Input, Checkbox } from '../../atoms';
import type { FormWizardStep } from './FormWizardPattern';

const meta: Meta<typeof FormWizardPattern> = {
  title: 'Patterns/FormWizardPattern',
  component: FormWizardPattern,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## FormWizardPattern

A complete form wizard pattern that combines Stepper and Form components.
This pattern solves the common UX problem of multi-step forms with validation.

### Composition Diagram

\`\`\`mermaid
graph TB
    FormWizardPattern[FormWizardPattern]
    Stepper[Stepper Component]
    FormContent[Form Content Area]
    Navigation[Navigation Buttons]
    Validation[Validation Logic]
    
    FormWizardPattern --> Stepper
    FormWizardPattern --> FormContent
    FormWizardPattern --> Navigation
    FormWizardPattern --> Validation
    
    FormContent --> Input[Input Fields]
    FormContent --> Checkbox[Checkbox Fields]
    FormContent --> Select[Select Fields]
    
    Navigation --> BackButton[Back Button]
    Navigation --> NextButton[Next Button]
    
    Validation --> StepValidation[Step Validation]
    Validation --> ErrorDisplay[Error Display]
\`\`\`

### Components Used
- Stepper (organism)
- Form (molecule)
- Input, Checkbox, Select (atoms)
- Container, Stack (layouts)
- Button (atom)

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onComplete\` | Wizard completado | \`(data: Record<string, unknown>) => void\` | Quando o último passo é completado |
| \`onStepChange\` | Passo mudou | \`(stepIndex: number) => void\` | Quando um novo passo é selecionado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default state | Initial render | Wizard with first step active |
| \`validating\` | Validating step | Click Next with validation | Shows validation state |
| \`error\` | Validation error | Validation fails | Shows error message |
| \`completed\` | Wizard completed | Complete last step | Calls onComplete callback |
| \`with-back-navigation\` | Com navegação para trás | \`allowBackNavigation={true}\` ou padrão | Permite voltar para passos anteriores |
| \`without-back-navigation\` | Sem navegação para trás | \`allowBackNavigation={false}\` | Não permite voltar para passos anteriores |
        `,
      },
    },
  },
  argTypes: {
    allowBackNavigation: {
      control: 'boolean',
      description: 'Allow navigation to previous steps',
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Show step numbers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormWizardPattern>;

// Example steps
const _createBasicSteps = (): FormWizardStep[] => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [preferences, setPreferences] = useState({
    newsletter: false,
    notifications: false,
  });

  const [_review, _setReview] = useState({});

  return [
    {
      label: 'Personal Information',
      description: 'Enter your personal details',
      fields: (
        <div className="space-y-4">
          <Input
            label="First Name"
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, firstName: e.target.value })
            }
            placeholder="Enter your first name"
          />
          <Input
            label="Last Name"
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, lastName: e.target.value })
            }
            placeholder="Enter your last name"
          />
          <Input
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, email: e.target.value })
            }
            placeholder="Enter your email"
          />
        </div>
      ),
      validate: () => {
        return (
          personalInfo.firstName.length > 0 &&
          personalInfo.lastName.length > 0 &&
          personalInfo.email.includes('@')
        );
      },
    },
    {
      label: 'Preferences',
      description: 'Choose your preferences',
      fields: (
        <div className="space-y-4">
          <Checkbox
            label="Subscribe to newsletter"
            checked={preferences.newsletter}
            onChange={(checked) =>
              setPreferences({ ...preferences, newsletter: checked })
            }
          />
          <Checkbox
            label="Enable email notifications"
            checked={preferences.notifications}
            onChange={(checked) =>
              setPreferences({ ...preferences, notifications: checked })
            }
          />
        </div>
      ),
    },
    {
      label: 'Review',
      description: 'Review your information',
      fields: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Please review your information before submitting.
          </p>
        </div>
      ),
    },
  ];
};

export const Default: Story = {
  render: () => {
    const [personalInfo, setPersonalInfo] = useState({
      firstName: '',
      lastName: '',
      email: '',
    });

    const [preferences, setPreferences] = useState({
      newsletter: false,
      notifications: false,
    });

    const steps: FormWizardStep[] = [
      {
        label: 'Personal Information',
        description: 'Enter your personal details',
        fields: (
          <div className="space-y-4">
            <Input
              label="First Name"
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, firstName: e.target.value })
              }
              placeholder="Enter your first name"
            />
            <Input
              label="Last Name"
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, lastName: e.target.value })
              }
              placeholder="Enter your last name"
            />
            <Input
              label="Email"
              type="email"
              value={personalInfo.email}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>
        ),
        validate: () => {
          return (
            personalInfo.firstName.length > 0 &&
            personalInfo.lastName.length > 0 &&
            personalInfo.email.includes('@')
          );
        },
      },
      {
        label: 'Preferences',
        description: 'Choose your preferences',
        fields: (
          <div className="space-y-4">
            <Checkbox
              label="Subscribe to newsletter"
              checked={preferences.newsletter}
              onChange={(checked) =>
                setPreferences({ ...preferences, newsletter: checked })
              }
            />
            <Checkbox
              label="Enable email notifications"
              checked={preferences.notifications}
              onChange={(checked) =>
                setPreferences({ ...preferences, notifications: checked })
              }
            />
          </div>
        ),
      },
      {
        label: 'Review',
        description: 'Review your information',
        fields: (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {personalInfo.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Newsletter:</strong> {preferences.newsletter ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Notifications:</strong> {preferences.notifications ? 'Yes' : 'No'}
            </p>
          </div>
        ),
      },
    ];

    return (
      <FormWizardPattern
        steps={steps}
        onComplete={(data) => {
          alert('Wizard completed!');
          console.log('Form data:', data);
        }}
      />
    );
  },
};

export const WithoutBackNavigation: Story = {
  render: () => {
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');

    const steps: FormWizardStep[] = [
      {
        label: 'Step 1',
        description: 'First step',
        fields: (
          <Input
            label="Field 1"
            value={step1}
            onChange={(e) => setStep1(e.target.value)}
          />
        ),
      },
      {
        label: 'Step 2',
        description: 'Second step',
        fields: (
          <Input
            label="Field 2"
            value={step2}
            onChange={(e) => setStep2(e.target.value)}
          />
        ),
      },
    ];

    return <FormWizardPattern steps={steps} allowBackNavigation={false} />;
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [personalInfo, setPersonalInfo] = useState({
      firstName: '',
      lastName: '',
      email: '',
    });

    const handleComplete = fn((data: Record<string, unknown>) => {
      console.log('Wizard completed!', data);
    });
    const _handleStepChange = fn((stepIndex: number) => {
      console.log('Step changed:', stepIndex);
    });

    const steps: FormWizardStep[] = [
      {
        label: 'Personal Information',
        description: 'Enter your personal details',
        fields: (
          <div className="space-y-4">
            <Input
              label="First Name"
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, firstName: e.target.value })
              }
              placeholder="Enter your first name"
            />
            <Input
              label="Last Name"
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, lastName: e.target.value })
              }
              placeholder="Enter your last name"
            />
          </div>
        ),
      },
      {
        label: 'Review',
        description: 'Review your information',
        fields: (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Please review your information before submitting.
            </p>
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Navigate through steps or complete the wizard. Check the Actions panel to see events being fired.
        </p>
        <FormWizardPattern
          steps={steps}
          onComplete={handleComplete}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText(/personal information/i)).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates wizard events. Navigate steps or complete the wizard and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  render: () => {
    const [personalInfo, setPersonalInfo] = useState({
      firstName: '',
      lastName: '',
      email: '',
    });

    const steps: FormWizardStep[] = [
      {
        label: 'Personal Information',
        description: 'Enter your personal details',
        fields: (
          <div className="space-y-4">
            <Input
              label="First Name"
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, firstName: e.target.value })
              }
              placeholder="Enter your first name"
            />
            <Input
              label="Last Name"
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, lastName: e.target.value })
              }
              placeholder="Enter your last name"
            />
          </div>
        ),
      },
    ];

    return <FormWizardPattern steps={steps} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - wizard with first step active.',
      },
    },
  },
};

export const WithBackNavigationState: Story = {
  args: {
    allowBackNavigation: true,
  },
  render: (args) => {
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');

    const steps: FormWizardStep[] = [
      {
        label: 'Step 1',
        description: 'First step',
        fields: (
          <Input
            label="Field 1"
            value={step1}
            onChange={(e) => setStep1(e.target.value)}
          />
        ),
      },
      {
        label: 'Step 2',
        description: 'Second step',
        fields: (
          <Input
            label="Field 2"
            value={step2}
            onChange={(e) => setStep2(e.target.value)}
          />
        ),
      },
    ];

    return <FormWizardPattern {...args} steps={steps} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'With back navigation state - allows navigating to previous steps.',
      },
    },
  },
};

export const WithoutBackNavigationState: Story = {
  args: {
    allowBackNavigation: false,
  },
  render: (args) => {
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');

    const steps: FormWizardStep[] = [
      {
        label: 'Step 1',
        description: 'First step',
        fields: (
          <Input
            label="Field 1"
            value={step1}
            onChange={(e) => setStep1(e.target.value)}
          />
        ),
      },
      {
        label: 'Step 2',
        description: 'Second step',
        fields: (
          <Input
            label="Field 2"
            value={step2}
            onChange={(e) => setStep2(e.target.value)}
          />
        ),
      },
    ];

    return <FormWizardPattern {...args} steps={steps} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Without back navigation state - does not allow navigating to previous steps.',
      },
    },
  },
};
