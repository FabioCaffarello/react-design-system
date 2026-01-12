import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'This option is disabled',
    disabled: true,
    checked: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
  },
};
