import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';

describe('Progress', () => {
  it('renders progress bar with value', () => {
    render(<Progress value={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with label when provided', () => {
    render(<Progress value={50} label="Loading..." showLabel />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    const { container } = render(<Progress value={25} max={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    expect(progressBar).toHaveAttribute('aria-valuemax', '50');
    
    const fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('renders indeterminate progress', () => {
    render(<Progress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
    expect(progressBar).not.toHaveAttribute('aria-valuemin');
    expect(progressBar).not.toHaveAttribute('aria-valuemax');
    
    const { container } = render(<Progress />);
    const fill = container.querySelector('div[style*="animation"]');
    expect(fill).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { container, rerender } = render(<Progress value={50} variant="primary" />);
    let fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-indigo-500');

    rerender(<Progress value={50} variant="secondary" />);
    fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-violet-500');

    rerender(<Progress value={50} variant="success" />);
    fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-green-500');

    rerender(<Progress value={50} variant="error" />);
    fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-red-500');

    rerender(<Progress value={50} variant="warning" />);
    fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-yellow-500');

    rerender(<Progress value={50} variant="info" />);
    fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveClass('bg-blue-500');
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(<Progress value={50} size="sm" />);
    let progressBar = container.querySelector('div[role="progressbar"]');
    expect(progressBar).toHaveClass('h-1');

    rerender(<Progress value={50} size="md" />);
    progressBar = container.querySelector('div[role="progressbar"]');
    expect(progressBar).toHaveClass('h-2');

    rerender(<Progress value={50} size="lg" />);
    progressBar = container.querySelector('div[role="progressbar"]');
    expect(progressBar).toHaveClass('h-3');
  });

  it('clamps value to 0-100 range', () => {
    const { container } = render(<Progress value={-10} />);
    const fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveStyle({ width: '0%' });

    const { container: container2 } = render(<Progress value={150} />);
    const fill2 = container2.querySelector('div[aria-hidden="true"]');
    expect(fill2).toHaveStyle({ width: '100%' });
  });

  it('handles zero value', () => {
    render(<Progress value={0} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100% value', () => {
    const { container } = render(<Progress value={100} />);
    const fill = container.querySelector('div[aria-hidden="true"]');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('applies custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(<Progress value={50} aria-label="Loading progress" />);
    const progressBar = screen.getByLabelText('Loading progress');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('role', 'progressbar');
  });

  it('displays percentage when showLabel is true', () => {
    render(<Progress value={75} showLabel />);
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it('displays both label and percentage when showLabel is true', () => {
    render(<Progress value={75} label="Uploading" showLabel />);
    expect(screen.getByText('Uploading')).toBeInTheDocument();
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it('renders without label', () => {
    const { container } = render(<Progress value={50} />);
    const label = container.querySelector('label, span, p');
    // Should not have a visible label element
    expect(label).not.toBeInTheDocument();
  });
});
