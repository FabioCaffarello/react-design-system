import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import Slider from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Slider

A slider component for selecting a value or range of values.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Valor mudou | \`(value: number \| [number, number]) => void\` | Quando o valor do slider muda |
| \`onValueChange\` | Valor mudou (alternativo) | \`(value: number \| [number, number]) => void\` | Quando o valor do slider muda |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Slider com valor padrão |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Slider com opacidade reduzida |
| \`focus\` | Com foco | Tab ou clique | Slider com outline de foco |
| \`single\` | Modo único | \`variant="single"\` | Slider com um thumb |
| \`range\` | Modo range | \`variant="range"\` | Slider com dois thumbs |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Slider variant: single thumb or range (dual thumb)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Slider size',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the slider',
    },
    showValue: {
      control: 'boolean',
      description: 'Show current value',
    },
    marks: {
      control: false,
      description: 'Array of mark positions to display',
    },
    onChange: {
      description: 'Callback fired when the slider value changes',
      action: 'onChange',
      table: {
        type: { summary: '(value: number | [number, number]) => void' },
        category: 'Events',
      },
    },
    onValueChange: {
      description: 'Alternative callback fired when the slider value changes',
      action: 'onValueChange',
      table: {
        type: { summary: '(value: number | [number, number]) => void' },
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return (
      <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Value: {value}</p>
      </div>
    );
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return (
      <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
  },
};

export const Range: Story = {
  render: (args) => {
    const [value, setValue] = useState<[number, number]>(args.defaultValue as [number, number] || [20, 80]);
    return (
      <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">
          Range: {value[0]} - {value[1]}
        </p>
      </div>
    );
  },
  args: {
    variant: 'range',
    min: 0,
    max: 100,
    defaultValue: [20, 80],
    showValue: true,
  },
};

export const Sizes: Story = {
  render: () => {
    const [smValue, setSmValue] = useState(50);
    const [mdValue, setMdValue] = useState(50);
    const [lgValue, setLgValue] = useState(50);
    
    return (
      <div className="w-64 space-y-6">
        <div>
          <Slider
            size="sm"
            label="Small"
            value={smValue}
            onChange={setSmValue}
            showValue
          />
        </div>
        <div>
          <Slider
            size="md"
            label="Medium"
            value={mdValue}
            onChange={setMdValue}
            showValue
          />
        </div>
        <div>
          <Slider
            size="lg"
            label="Large"
            value={lgValue}
            onChange={setLgValue}
            showValue
          />
        </div>
      </div>
    );
  },
};

export const WithMarks: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return (
      <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Temperature',
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
    marks: [0, 25, 50, 75, 100],
    showValue: true,
  },
};

export const WithSteps: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 2);
    return (
      <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Value: {value}</p>
      </div>
    );
  },
  args: {
    label: 'Rating',
    min: 0,
    max: 5,
    step: 0.5,
    defaultValue: 2.5,
    showValue: true,
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-64 space-y-4">
        <Slider label="Disabled" defaultValue={50} disabled />
        <Slider label="Disabled Range" variant="range" defaultValue={[20, 80]} disabled />
      </div>
    );
  },
};

export const CustomRange: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([1000, 5000]);
    return (
      <div className="w-64">
        <Slider
          label="Price Range"
          variant="range"
          min={0}
          max={10000}
          step={100}
          value={value}
          onChange={setValue}
          showValue
        />
        <p className="mt-4 text-sm text-gray-600">
          ${value[0].toLocaleString()} - ${value[1].toLocaleString()}
        </p>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      <div>
        <Slider
          label="Uncontrolled Single"
          defaultValue={50}
          min={0}
          max={100}
          showValue
        />
      </div>
      <div>
        <Slider
          label="Uncontrolled Range"
          variant="range"
          defaultValue={[20, 80]}
          min={0}
          max={100}
          showValue
        />
      </div>
      <p className="text-sm text-gray-600">Uses defaultValue for initial value without state management.</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates uncontrolled slider using defaultValue.',
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div className="w-64 space-y-4">
        <p className="text-sm text-gray-600">
          Try navigating with Tab key and Arrow keys to change value:
        </p>
        <Slider
          label="Keyboard Navigation"
          value={value}
          onChange={setValue}
          showValue
        />
        <p className="text-xs text-gray-500">
          Slider supports keyboard navigation: Tab to focus, Arrow keys to change value, Home/End for min/max.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation support. Use Tab to focus and Arrow keys to change value.',
      },
    },
  },
};

export const RangeMode: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div className="w-64 space-y-6">
        <div>
          <Slider
            label="Range Slider"
            variant="range"
            value={value}
            onChange={setValue}
            showValue
          />
          <p className="mt-2 text-sm text-gray-600">
            Range: {value[0]} - {value[1]}
          </p>
        </div>
        <div>
          <Slider
            label="Range with Marks"
            variant="range"
            value={value}
            onChange={setValue}
            marks={[0, 25, 50, 75, 100]}
            showValue
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates range mode with dual thumbs for selecting a range of values.',
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    
    const handleChange = fn((newValue: number) => {
      setValue(newValue);
      console.log('Slider value changed:', newValue);
    });
    
    return (
      <div className="w-64 space-y-4">
        <p className="text-sm text-gray-600">
          Interact with the slider below. Check the Actions panel to see events being fired.
        </p>
        <Slider
          label="Interactive Slider"
          value={value}
          onChange={handleChange}
          showValue
        />
        <p className="text-sm text-gray-500">Value: {value}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    
    // Test focus
    await userEvent.tab();
    await waitFor(() => {
      expect(slider).toHaveFocus();
    });
    
    // Test keyboard navigation
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuenow');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates slider events. Interact with the slider and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    label: 'Default Slider',
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - slider is ready for interaction.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Disabled Slider',
    min: 0,
    max: 100,
    defaultValue: 50,
    disabled: true,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - slider is not interactive, shows reduced opacity.',
      },
    },
  },
};

export const SingleMode: Story = {
  args: {
    label: 'Single Mode',
    variant: 'single',
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single mode - slider with one thumb for selecting a single value.',
      },
    },
  },
};

export const RangeModeState: Story = {
  args: {
    label: 'Range Mode',
    variant: 'range',
    min: 0,
    max: 100,
    defaultValue: [20, 80] as [number, number],
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Range mode - slider with two thumbs for selecting a range of values.',
      },
    },
  },
};
