import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, within, waitFor } from '@storybook/test';
import { useState } from 'react';
import ColorPicker from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Molecules/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## ColorPicker

A color picker component that allows users to select colors from a palette or input field.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onChange\` | Cor selecionada mudou | \`(color: string) => void\` | Quando uma nova cor é selecionada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Color picker normal |
| \`with-label\` | Com label | \`label\` prop definida | Color picker com label |
| \`with-input\` | Com input | \`showInput={true}\` | Color picker com campo de input |
| \`without-input\` | Sem input | \`showInput={false}\` | Color picker sem campo de input |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Color picker desabilitado |
| \`with-presets\` | Com presets | \`presets\` prop definida | Color picker com cores pré-definidas |
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'color',
      description: 'Selected color value',
    },
    defaultValue: {
      control: 'color',
      description: 'Default color value (uncontrolled)',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl'],
      description: 'Color format',
    },
    showInput: {
      control: 'boolean',
      description: 'Show color input field',
    },
    presets: {
      control: false,
      description: 'Array of preset colors',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the color picker',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when color changes',
      category: 'Events',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || '#3b82f6');
    return (
      <div>
        <ColorPicker
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <div>
        <ColorPicker
          label="Background Color"
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const WithInput: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <div>
        <ColorPicker
          label="Color"
          value={value}
          onChange={setValue}
          showInput
        />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const CustomPresets: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    const customPresets = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    ];
    
    return (
      <div>
        <ColorPicker
          label="Brand Color"
          value={value}
          onChange={setValue}
          presets={customPresets}
        />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const WithoutInput: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <div>
        <ColorPicker
          label="Color"
          value={value}
          onChange={setValue}
          showInput={false}
        />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div>
      <ColorPicker
        label="Color"
        value="#3b82f6"
        disabled
      />
    </div>
  ),
};

export const InForm: Story = {
  render: () => {
    const [primaryColor, setPrimaryColor] = useState('#3b82f6');
    const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
    
    return (
      <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Theme Colors</h3>
        <ColorPicker
          label="Primary Color"
          value={primaryColor}
          onChange={setPrimaryColor}
        />
        <ColorPicker
          label="Secondary Color"
          value={secondaryColor}
          onChange={setSecondaryColor}
        />
        <div className="pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <div
              className="w-16 h-16 rounded-md border border-gray-200"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="w-16 h-16 rounded-md border border-gray-200"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>
    );
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    const handleChange = fn((newColor: string) => {
      setValue(newColor);
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Select a color. Check the Actions panel to see events being fired.
        </p>
        <ColorPicker
          label="Color"
          value={value}
          onChange={handleChange}
          showInput
        />
        <p className="text-sm text-gray-500">Selected: {value}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for color picker to be interactive - use a more flexible text matcher
    await waitFor(async () => {
      // Get all elements that contain "Selected:" and verify at least one exists
      const selectedElements = canvas.getAllByText((content, element) => {
        return element?.textContent?.includes('Selected:') || false;
      });
      expect(selectedElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates color picker events. Select a color and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <ColorPicker
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - color picker without label or input.',
      },
    },
  },
};

export const WithLabelState: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <ColorPicker
        label="Background Color"
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With label state - color picker includes a label.',
      },
    },
  },
};

export const WithInputState: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <ColorPicker
        label="Color"
        value={value}
        onChange={setValue}
        showInput
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With input state - color picker includes an input field for direct color entry.',
      },
    },
  },
};

export const WithoutInputState: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return (
      <ColorPicker
        label="Color"
        value={value}
        onChange={setValue}
        showInput={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Without input state - color picker without input field.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <ColorPicker
      label="Color"
      value="#3b82f6"
      disabled
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - color picker is disabled and cannot be interacted with.',
      },
    },
  },
};

export const WithPresetsState: Story = {
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    const customPresets = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    ];
    
    return (
      <ColorPicker
        label="Brand Color"
        value={value}
        onChange={setValue}
        presets={customPresets}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With presets state - color picker includes preset color options.',
      },
    },
  },
};
