import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Slider from './Slider';

describe('Slider', () => {
  it('renders correctly', () => {
    render(<Slider defaultValue={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('handles single value', () => {
    const handleChange = vi.fn();
    render(<Slider value={50} onChange={handleChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles range value', () => {
    render(<Slider variant="range" value={[20, 80]} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('displays label when provided', () => {
    render(<Slider label="Volume" defaultValue={50} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Slider defaultValue={50} disabled />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Slider size="sm" defaultValue={50} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();

    rerender(<Slider size="md" defaultValue={50} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();

    rerender(<Slider size="lg" defaultValue={50} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('shows value when showValue is true', () => {
    render(<Slider label="Volume" value={50} showValue />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
