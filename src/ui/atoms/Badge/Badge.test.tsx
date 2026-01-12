import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renders badge with text', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-green-300');
  });

  it('applies size classes', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-1.5', 'py-0.5', 'text-xs');
  });

  it('applies outline style', () => {
    const { container } = render(<Badge variant="success" style="outline">Outline</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-transparent');
  });

  it('has correct aria-label when children is string', () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByLabelText('Status');
    expect(badge).toBeInTheDocument();
  });

  it('has role="status"', () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
  });
});
