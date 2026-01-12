import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<Switch checked={true} onChange={() => {}} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('handles unchecked state', () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays label when provided', () => {
    render(<Switch label="Enable feature" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  it('displays description when provided', () => {
    render(
      <Switch
        label="Enable feature"
        description="This will enable the feature"
        checked={false}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('This will enable the feature')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('disabled');
  });

  it('does not call onChange when disabled', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled />);
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole('switch');
    fireEvent.keyDown(switchElement, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Switch size="sm" checked={false} onChange={() => {}} />);
    let switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();

    rerender(<Switch size="md" checked={false} onChange={() => {}} />);
    switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();

    rerender(<Switch size="lg" checked={false} onChange={() => {}} />);
    switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<Switch checked={false} onChange={() => {}} error />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });
});
