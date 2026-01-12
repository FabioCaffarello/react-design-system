import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';
import { Mail, Search, Lock, User } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    success: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    disabled: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    error: true,
    helperText: 'Please enter a valid email address',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    success: true,
    helperText: 'Email is valid',
    value: 'user@example.com',
    onChange: () => {},
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Default" variant="default" placeholder="Default variant" />
      <Input label="Outlined" variant="outlined" placeholder="Outlined variant" />
      <Input label="Filled" variant="filled" placeholder="Filled variant" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Input 
        label="Email" 
        leftIcon={<Mail className="h-4 w-4" />}
        placeholder="Enter your email"
      />
      <Input 
        label="Search" 
        rightIcon={<Search className="h-4 w-4" />}
        placeholder="Search..."
      />
      <Input 
        label="Username" 
        leftIcon={<User className="h-4 w-4" />}
        rightIcon={<Search className="h-4 w-4" />}
        placeholder="Enter username"
      />
    </div>
  ),
};

export const WithClearButton: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    showClearButton: true,
    value: 'Search term',
    onChange: () => {},
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const PasswordWithIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    leftIcon: <Lock className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Default" placeholder="Default state" />
      <Input label="Error" error helperText="This field has an error" />
      <Input label="Success" success helperText="This field is valid" value="Valid value" onChange={() => {}} />
      <Input label="Disabled" disabled placeholder="Disabled input" />
    </div>
  ),
};
