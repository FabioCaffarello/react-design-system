import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ColorPicker from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Molecules/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl'],
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
