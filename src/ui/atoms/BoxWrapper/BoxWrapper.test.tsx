import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BoxWrapper from './BoxWrapper';

describe('BoxWrapper', () => {
  it('renders children', () => {
    render(<BoxWrapper>Test content</BoxWrapper>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<BoxWrapper>Content</BoxWrapper>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('p-large', 'bg-bg', 'rounded', 'shadow-card');
  });

  it('applies custom className', () => {
    const { container } = render(<BoxWrapper className="custom-class">Content</BoxWrapper>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('passes through HTML attributes', () => {
    render(<BoxWrapper data-testid="box">Content</BoxWrapper>);
    expect(screen.getByTestId('box')).toBeInTheDocument();
  });
});
