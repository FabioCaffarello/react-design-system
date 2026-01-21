/**
 * PageHeader Tests
 * 
 * Unit tests for the PageHeader component.
 * Following TDD approach: tests first, then implementation.
 * 
 * @see EPIC-004: PageHeader Component (Molecule)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { Button } from '../../atoms/Button/Button';
import type { BreadcrumbItem } from '../Breadcrumb/Breadcrumb';

describe('PageHeader', () => {
  describe('Rendering', () => {
    it('should render with title', () => {
      // TDD: Test basic rendering with title
      render(<PageHeader title="Page Title" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('should render with title and description', () => {
      // TDD: Test rendering with description
      render(<PageHeader title="Page Title" description="Page description" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Page description')).toBeInTheDocument();
    });

    it('should render with actions', () => {
      // TDD: Test rendering with actions
      render(
        <PageHeader
          title="Page Title"
          actions={<Button>Action</Button>}
        />
      );
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  describe('Breadcrumb', () => {
    it('should render breadcrumb when provided', () => {
      // TDD: Test breadcrumb rendering
      const breadcrumb: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Page', href: '/page' },
      ];

      render(<PageHeader title="Page Title" breadcrumb={breadcrumb} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Page')).toBeInTheDocument();
    });

    it('should not render breadcrumb when not provided', () => {
      // TDD: Test breadcrumb optional
      render(<PageHeader title="Page Title" />);
      const breadcrumb = screen.queryByRole('navigation', { name: /breadcrumb/i });
      expect(breadcrumb).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant', () => {
      // TDD: Test default variant
      render(<PageHeader title="Page Title" variant="default" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('should apply compact variant', () => {
      // TDD: Test compact variant
      render(<PageHeader title="Page Title" variant="compact" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have correct layout structure', () => {
      // TDD: Test layout structure
      render(
        <PageHeader
          title="Page Title"
          description="Description"
          actions={<Button>Action</Button>}
        />
      );

      // Should have title
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      // Should have description
      expect(screen.getByText('Description')).toBeInTheDocument();
      // Should have actions
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should handle missing description gracefully', () => {
      // TDD: Test optional description
      render(<PageHeader title="Page Title" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      // Description should not be in document
      const description = screen.queryByText(/description/i);
      expect(description).not.toBeInTheDocument();
    });

    it('should handle missing actions gracefully', () => {
      // TDD: Test optional actions
      render(<PageHeader title="Page Title" />);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      // Actions should not be in document
      const actions = screen.queryByRole('button');
      expect(actions).not.toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      // TDD: Test custom className
      const { container } = render(<PageHeader title="Page Title" className="custom-header" />);
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      // TDD: Test semantic HTML
      render(<PageHeader title="Page Title" />);
      const heading = screen.getByRole('heading', { name: 'Page Title' });
      expect(heading).toBeInTheDocument();
    });

    it('should have proper heading level', () => {
      // TDD: Test heading level
      render(<PageHeader title="Page Title" />);
      const heading = screen.getByRole('heading', { name: 'Page Title' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName.toLowerCase()).toBe('h1');
    });
  });
});
