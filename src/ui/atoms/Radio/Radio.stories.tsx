import type { Meta, StoryObj } from '@storybook/react';
import Radio from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    name: 'option',
    label: 'Option 1',
    value: '1',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    name: 'option',
    label: 'Selected option',
    value: '1',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    name: 'option',
    label: 'Option with error',
    value: '1',
    error: true,
    helperText: 'Please select an option',
  },
};

export const Disabled: Story = {
  args: {
    name: 'option',
    label: 'Disabled option',
    value: '1',
    disabled: true,
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Radio name="group" label="Option 1" value="1" />
      <Radio name="group" label="Option 2" value="2" checked />
      <Radio name="group" label="Option 3" value="3" />
    </div>
  ),
};
