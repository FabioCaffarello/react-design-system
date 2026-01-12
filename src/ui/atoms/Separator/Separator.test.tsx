import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Separator from './Separator';

describe('Separator', () => {
  it('renders correctly', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });

  it('renders horizontal separator by default', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical separator', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('handles different variants', () => {
    const { rerender } = render(<Separator variant="solid" />);
    expect(screen.getByRole('separator')).toBeInTheDocument();

    rerender(<Separator variant="dashed" />);
    expect(screen.getByRole('separator')).toBeInTheDocument();

    rerender(<Separator variant="dotted" />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
