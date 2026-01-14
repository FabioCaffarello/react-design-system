import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import React from 'react';
import Input from './Input';
import { Mail, Search, Lock, User } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Input

A versatile input component with multiple variants, sizes, and states. Supports icons, validation, and clear functionality.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Valor do input muda | \`(event: ChangeEvent<HTMLInputElement>) => void\` | Quando o valor do input é alterado |
| \`onFocus\` | Input recebe foco | \`(event: FocusEvent) => void\` | Quando o input recebe foco |
| \`onBlur\` | Input perde foco | \`(event: FocusEvent) => void\` | Quando o input perde foco |
| \`onKeyDown\` | Tecla pressionada | \`(event: KeyboardEvent) => void\` | Quando uma tecla é pressionada no input |
| \`onKeyUp\` | Tecla liberada | \`(event: KeyboardEvent) => void\` | Quando uma tecla é liberada no input |
| \`onClear\` | Botão de limpar clicado | \`() => void\` | Quando o botão de limpar é clicado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Input com borda padrão |
| \`focus\` | Input com foco | Clicar no input ou Tab | Input com borda destacada e outline |
| \`error\` | Input com erro | \`error={true}\` ou \`errorMessage\` definido | Input com borda vermelha e mensagem de erro |
| \`success\` | Input com sucesso | \`success={true}\` | Input com borda verde e indicador de sucesso |
| \`disabled\` | Input desabilitado | \`disabled={true}\` | Input com opacidade reduzida, não editável |
| \`readonly\` | Input somente leitura | \`readOnly={true}\` | Input sem borda destacada, não editável |
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text or ReactNode',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    success: {
      control: 'boolean',
      description: 'Show success state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
      description: 'Input variant style',
    },
    leftIcon: {
      control: false,
      description: 'Icon to display on the left (ReactNode)',
    },
    rightIcon: {
      control: false,
      description: 'Icon to display on the right (ReactNode)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button when input has value',
    },
    onClear: {
      action: 'cleared',
      description: 'Callback when clear button is clicked',
      table: {
        type: { summary: '() => void' },
        category: 'Events',
      },
    },
    onChange: {
      description: 'Callback fired when the input value changes',
      action: 'onChange',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
        category: 'Events',
      },
    },
    onFocus: {
      description: 'Callback fired when the input receives focus',
      action: 'onFocus',
      table: {
        type: { summary: '(event: FocusEvent) => void' },
        category: 'Events',
      },
    },
    onBlur: {
      description: 'Callback fired when the input loses focus',
      action: 'onBlur',
      table: {
        type: { summary: '(event: FocusEvent) => void' },
        category: 'Events',
      },
    },
    onKeyDown: {
      description: 'Callback fired when a key is pressed',
      action: 'onKeyDown',
      table: {
        type: { summary: '(event: KeyboardEvent) => void' },
        category: 'Events',
      },
    },
    onKeyUp: {
      description: 'Callback fired when a key is released',
      action: 'onKeyUp',
      table: {
        type: { summary: '(event: KeyboardEvent) => void' },
        category: 'Events',
      },
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

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div className="space-y-4">
        <Input
          label="Controlled Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
        />
        <p className="text-sm text-gray-600">Current value: {value || '(empty)'}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates controlled input with state management.',
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        label="Uncontrolled Input"
        defaultValue="Initial value"
        placeholder="Type something..."
      />
      <p className="text-sm text-gray-600">Uses defaultValue for initial value without state management.</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates uncontrolled input using defaultValue.',
      },
    },
  },
};

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = React.useState('Search term');
    return (
      <div className="space-y-4">
        <Input
          label="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showClearButton
          onClear={() => setValue('')}
          placeholder="Type to search..."
        />
        <p className="text-sm text-gray-600">Click the X button to clear the input.</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates clear button functionality with controlled input.',
      },
    },
  },
};

export const Integration: Story = {
  render: () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState({ email: false, password: false });
    
    const validate = () => {
      const newErrors = {
        email: !email.includes('@'),
        password: password.length < 6,
      };
      setErrors(newErrors);
    };
    
    return (
      <div className="space-y-4 max-w-md">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: false });
          }}
          error={errors.email}
          helperText={errors.email ? 'Please enter a valid email' : undefined}
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: false });
          }}
          error={errors.password}
          helperText={errors.password ? 'Password must be at least 6 characters' : undefined}
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="Enter your password"
        />
        <button
          onClick={validate}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Validate
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example form integration showing validation and error states.',
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    const handleChange = fn((event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      console.log('Value changed:', event.target.value);
    });
    
    const handleFocus = fn((event: React.FocusEvent<HTMLInputElement>) => {
      console.log('Input focused');
    });
    
    const handleBlur = fn((event: React.FocusEvent<HTMLInputElement>) => {
      console.log('Input blurred');
    });
    
    const handleKeyDown = fn((event: React.KeyboardEvent<HTMLInputElement>) => {
      console.log('Key pressed:', event.key);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the input below. Check the Actions panel to see events being fired.
        </p>
        <Input
          label="Interactive Input"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Type something..."
        />
        <p className="text-sm text-gray-500">Current value: {value || '(empty)'}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    
    // Test focus
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
    
    // Test typing
    await userEvent.type(input, 'Hello');
    
    // Test blur
    await userEvent.tab();
    await waitFor(() => {
      expect(input).not.toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all input events. Interact with the input and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the input - normal appearance, ready for interaction.',
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    label: 'Focus me (Tab or click)',
    placeholder: 'Click here or press Tab',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus state - activated when input receives focus. Shows focus outline for accessibility.',
      },
    },
  },
};

export const ErrorStateStory: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    placeholder: 'Enter email',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state - shows red border and error message. Used for validation feedback.',
      },
    },
  },
};

export const SuccessStateStory: Story = {
  args: {
    label: 'Email',
    type: 'email',
    success: true,
    helperText: 'Email is valid',
    value: 'user@example.com',
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Success state - shows green border and success indicator. Used for positive validation feedback.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    placeholder: 'This input is disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - input is not interactive, shows reduced opacity and is not editable.',
      },
    },
  },
};

export const ReadonlyState: Story = {
  args: {
    label: 'Read-only Input',
    readOnly: true,
    value: 'This value cannot be edited',
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only state - input displays value but cannot be edited. No focus outline.',
      },
    },
  },
};
