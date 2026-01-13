import type { Meta, StoryObj } from '@storybook/react';
import ButtonGroup from './ButtonGroup';
import Button from '../../atoms/Button/Button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const Attached: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
};

export const WithVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
};
