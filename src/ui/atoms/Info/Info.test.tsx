import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Info from './Info';

describe('Info', () => {
  it('renders info message', () => {
    render(<Info>This is an info message</Info>);
    expect(screen.getByText('This is an info message')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Info>Info message</Info>);
    const info = screen.getByRole('alert');
    expect(info).toBeInTheDocument();
  });

  it('applies info variant classes by default', () => {
    const { container } = render(<Info>Info message</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-500');
  });

  it('applies warning variant classes', () => {
    const { container } = render(<Info variant="warning">Warning message</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-500');
  });

  it('applies error variant classes', () => {
    const { container } = render(<Info variant="error">Error message</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass('bg-red-100', 'text-red-800', 'border-red-500');
  });

  it('applies custom className', () => {
    const { container } = render(<Info className="custom-class">Info</Info>);
    const info = container.querySelector('div[role="alert"]');
    expect(info).toHaveClass('custom-class');
  });

  it('passes through HTML attributes', () => {
    render(<Info data-testid="info">Info message</Info>);
    expect(screen.getByTestId('info')).toBeInTheDocument();
  });
});
