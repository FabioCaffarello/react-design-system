import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Stepper from './Stepper';
import Input from '../../atoms/Input/Input';

const meta: Meta<typeof Stepper> = {
  title: 'Organisms/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const basicSteps = [
  {
    id: '1',
    title: 'Account',
    description: 'Create your account',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Create Account</h3>
        <Input label="Email" type="email" placeholder="your@email.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
      </div>
    ),
  },
  {
    id: '2',
    title: 'Profile',
    description: 'Complete your profile',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        <Input label="First Name" placeholder="John" />
        <Input label="Last Name" placeholder="Doe" />
      </div>
    ),
  },
  {
    id: '3',
    title: 'Review',
    description: 'Review and submit',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        <p className="text-sm text-gray-600">
          Please review all the information you've entered and click Complete to finish.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(0);
    return (
      <Stepper
        {...args}
        steps={basicSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Completed!')}
      />
    );
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
        onComplete={() => alert('Completed!')}
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
        onComplete={() => alert('Completed!')}
      />
    );
  },
};

export const WithStatus: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithStatus = [
      { ...basicSteps[0], status: 'completed' as const },
      { ...basicSteps[1], status: 'active' as const },
      { ...basicSteps[2], status: 'pending' as const },
    ];
    
    return (
      <Stepper
        steps={stepsWithStatus}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Completed!')}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithError = [
      { ...basicSteps[0], status: 'completed' as const },
      { ...basicSteps[1], status: 'error' as const },
      { ...basicSteps[2], status: 'pending' as const },
    ];
    
    return (
      <Stepper
        steps={stepsWithError}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => alert('Completed!')}
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
        onComplete={() => alert('Completed!')}
      />
    );
  },
};

export const ComplexWorkflow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });

    const complexSteps = [
      {
        id: '1',
        title: 'Sign Up',
        description: 'Create your account',
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create Your Account</h3>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        ),
      },
      {
        id: '2',
        title: 'Personal Info',
        description: 'Tell us about yourself',
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        ),
      },
      {
        id: '3',
        title: 'Review',
        description: 'Review your information',
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName || 'Not provided'}
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
        onComplete={() => {
          alert('Registration Complete!');
          console.log('Form Data:', formData);
        }}
      />
    );
  },
};
