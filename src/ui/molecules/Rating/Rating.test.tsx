import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Rating from './Rating';

describe('Rating', () => {
  it('renders correctly', () => {
    render(<Rating value={3} max={5} />);
    const stars = screen.getAllByRole('button');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('displays correct number of stars', () => {
    render(<Rating value={0} max={5} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  it('calls onChange when star is clicked', () => {
    const handleChange = vi.fn();
    render(<Rating value={0} onChange={handleChange} />);
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('handles read-only mode', () => {
    render(<Rating value={4} readOnly />);
    const container = screen.getByRole('img');
    expect(container).toBeInTheDocument();
    const stars = screen.queryAllByRole('button');
    expect(stars).toHaveLength(0);
  });

  it('displays value when showValue is true', () => {
    render(<Rating value={3.5} max={5} showValue />);
    expect(screen.getByText('3.5/5')).toBeInTheDocument();
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Rating value={3} size="sm" />);
    expect(screen.getByRole('img') || screen.getAllByRole('button')[0]).toBeInTheDocument();

    rerender(<Rating value={3} size="md" />);
    expect(screen.getByRole('img') || screen.getAllByRole('button')[0]).toBeInTheDocument();

    rerender(<Rating value={3} size="lg" />);
    expect(screen.getByRole('img') || screen.getAllByRole('button')[0]).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    const handleChange = vi.fn();
    render(<Rating value={0} onChange={handleChange} />);
    const stars = screen.getAllByRole('button');
    fireEvent.keyDown(stars[2], { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith(3);
  });
});
