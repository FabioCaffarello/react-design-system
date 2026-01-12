import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Slider from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'range'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
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
