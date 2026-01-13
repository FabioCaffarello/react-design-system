import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chip from './Chip';

describe('Chip', () => {
  it('renders chip with text', () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<Chip onRemove={handleRemove}>Removable</Chip>);
    const removeButton = screen.getByLabelText('Remove');
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not show remove button when onRemove is not provided', () => {
    render(<Chip>Tag</Chip>);
    expect(screen.queryByLabelText('Remove')).not.toBeInTheDocument();
  });

  it('has correct aria attributes when selected', () => {
    render(<Chip selected>Selected</Chip>);
    const chip = screen.getByRole('option');
    expect(chip).toHaveAttribute('aria-selected', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Chip disabled>Disabled</Chip>);
    const chip = screen.getByText('Disabled');
    expect(chip).toHaveAttribute('aria-disabled', 'true');
  });
});
