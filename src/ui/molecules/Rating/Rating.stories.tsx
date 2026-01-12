import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Rating from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Molecules/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    max: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 0);
    return (
      <Rating
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: {
    max: 5,
    defaultValue: 0,
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 3);
    return (
      <Rating
        {...args}
        value={value}
        onChange={setValue}
        showValue
      />
    );
  },
  args: {
    max: 5,
    defaultValue: 3,
  },
};

export const ReadOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Read-only rating (3 stars)</p>
        <Rating value={3} readOnly showValue />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Read-only rating (4.5 stars)</p>
        <Rating value={4.5} readOnly showValue allowHalf />
      </div>
    </div>
  ),
};

export const HalfRatings: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.defaultValue || 2.5);
    return (
      <div className="space-y-4">
        <Rating
          {...args}
          value={value}
          onChange={setValue}
          allowHalf
          showValue
        />
        <p className="text-sm text-gray-600">Current value: {value}</p>
      </div>
    );
  },
  args: {
    max: 5,
    defaultValue: 2.5,
  },
};

export const Sizes: Story = {
  render: () => {
    const [smValue, setSmValue] = useState(3);
    const [mdValue, setMdValue] = useState(3);
    const [lgValue, setLgValue] = useState(3);
    
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Small</p>
          <Rating size="sm" value={smValue} onChange={setSmValue} showValue />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Medium</p>
          <Rating size="md" value={mdValue} onChange={setMdValue} showValue />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Large</p>
          <Rating size="lg" value={lgValue} onChange={setLgValue} showValue />
        </div>
      </div>
    );
  },
};

export const CustomMax: Story = {
  render: () => {
    const [value, setValue] = useState(7);
    return (
      <div className="space-y-4">
        <Rating
          max={10}
          value={value}
          onChange={setValue}
          showValue
        />
        <p className="text-sm text-gray-600">Rating out of 10</p>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [filledValue, setFilledValue] = useState(3);
    const [outlinedValue, setOutlinedValue] = useState(3);
    
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Filled</p>
          <Rating variant="filled" value={filledValue} onChange={setFilledValue} showValue />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Outlined</p>
          <Rating variant="outlined" value={outlinedValue} onChange={setOutlinedValue} showValue />
        </div>
      </div>
    );
  },
};

export const InContext: Story = {
  render: () => {
    const [productRating, setProductRating] = useState(4.5);
    const [serviceRating, setServiceRating] = useState(5);
    
    return (
      <div className="w-96 space-y-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Rate Your Experience</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Product Quality</span>
            <Rating
              value={productRating}
              onChange={setProductRating}
              allowHalf
              showValue
              size="sm"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Customer Service</span>
            <Rating
              value={serviceRating}
              onChange={setServiceRating}
              showValue
              size="sm"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Average: {((productRating + serviceRating) / 2).toFixed(1)}/5
          </p>
        </div>
      </div>
    );
  },
};
