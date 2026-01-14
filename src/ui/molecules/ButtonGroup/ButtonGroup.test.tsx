import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ButtonGroup from './ButtonGroup';
import Button from '../../atoms/Button/Button';

describe('ButtonGroup', () => {
  it('renders button group', () => {
    render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });

  it('has correct role', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>Button 1</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('[role="group"]');
    expect(group).toBeInTheDocument();
  });

  it('renders horizontal by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>Button 1</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('[role="group"]');
    expect(group).toHaveClass('flex-row');
  });

  it('renders vertical when orientation is vertical', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>Button 1</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('[role="group"]');
    expect(group).toHaveClass('flex-col');
  });
});
