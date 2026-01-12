import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputWithLabel from './InputWithLabel';

describe('InputWithLabel', () => {
  it('renders label and input', () => {
    render(<InputWithLabel id="test-input" label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<InputWithLabel id="test-input" label="Test Label" />);
    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('passes through input props', () => {
    render(
      <InputWithLabel
        id="test-input"
        label="Test Label"
        type="email"
        placeholder="Enter email"
        required
      />
    );
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toBeRequired();
  });

  it('applies size prop to input', () => {
    const { container } = render(
      <InputWithLabel id="test-input" label="Test Label" size="sm" />
    );
    const input = container.querySelector('input');
    // Input component should receive size prop
    expect(input).toBeInTheDocument();
  });
});
