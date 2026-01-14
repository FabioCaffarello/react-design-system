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

  describe('Accessibility', () => {
    it('uses explicit aria-label when provided', () => {
      render(<Badge aria-label="Custom label">Status</Badge>);
      const badge = screen.getByLabelText('Custom label');
      expect(badge).toBeInTheDocument();
    });

    it('prefers explicit aria-label over children', () => {
      render(<Badge aria-label="Custom">Status</Badge>);
      const badge = screen.getByLabelText('Custom');
      expect(badge).toBeInTheDocument();
      // Should not be found by children text when aria-label is provided
      expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
    });

    it('extracts text from nested ReactNode', () => {
      render(
        <Badge>
          <span>Nested Text</span>
        </Badge>
      );
      // When children is not a string, aria-label should be undefined
      // But the badge should still render
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Nested Text');
    });

    it('handles empty children gracefully', () => {
      render(<Badge aria-label="Empty badge"></Badge>);
      const badge = screen.getByLabelText('Empty badge');
      expect(badge).toBeInTheDocument();
    });

    it('handles number children', () => {
      render(<Badge>{42}</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('42');
    });
  });

  describe('Variants', () => {
    it('renders all variants correctly', () => {
      const variants: Array<'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary'> = [
        'success',
        'warning',
        'error',
        'info',
        'neutral',
        'primary',
        'secondary',
      ];

      variants.forEach((variant) => {
        const { container } = render(<Badge variant={variant}>{variant}</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toBeInTheDocument();
      });
    });

    it('renders both solid and outline styles', () => {
      const { container: solidContainer } = render(<Badge style="solid">Solid</Badge>);
      const { container: outlineContainer } = render(<Badge style="outline">Outline</Badge>);

      const solidBadge = solidContainer.querySelector('span');
      const outlineBadge = outlineContainer.querySelector('span');

      expect(solidBadge).toBeInTheDocument();
      expect(outlineBadge).toBeInTheDocument();
      expect(outlineBadge).toHaveClass('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('renders all sizes correctly', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        const { container } = render(<Badge size={size}>{size}</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Badge className="custom-class">Custom</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-class');
    });

    it('passes through HTML attributes', () => {
      render(<Badge data-testid="badge-test" id="badge-id">Test</Badge>);
      const badge = screen.getByTestId('badge-test');
      expect(badge).toHaveAttribute('id', 'badge-id');
    });

    it('handles multiple children', () => {
      render(
        <Badge>
          <span>Part 1</span>
          <span>Part 2</span>
        </Badge>
      );
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Part 1Part 2');
    });
  });
});
