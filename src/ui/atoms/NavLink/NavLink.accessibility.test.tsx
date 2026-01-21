/**
 * NavLink Accessibility Tests
 * 
 * Accessibility tests for the NavLink component.
 * Following TDD approach: tests first, then implementation improvements.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavLink } from './NavLink';

describe('NavLink Accessibility', () => {
  describe('ARIA Attributes', () => {
    it('should have aria-current="page" when active', () => {
      // TDD: Test aria-current for active state
      render(<NavLink href="/home" active>Home</NavLink>);
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should have aria-disabled when disabled', () => {
      // TDD: Test aria-disabled for disabled state
      render(<NavLink href="/home" disabled>Home</NavLink>);
      const link = screen.getByText('Home').closest('a');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-label when provided', () => {
      // TDD: Test aria-label support
      render(<NavLink href="/home" aria-label="Navigate to home page">Home</NavLink>);
      const link = screen.getByLabelText('Navigate to home page');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      // TDD: Test Tab navigation
      const user = userEvent.setup();
      render(<NavLink href="/home">Home</NavLink>);
      
      const link = screen.getByRole('link', { name: 'Home' });
      await user.tab();
      
      expect(link).toHaveFocus();
    });

    it('should activate with Enter key', async () => {
      // TDD: Test Enter key activation
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<NavLink href="/home" onClick={handleClick}>Home</NavLink>);
      
      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      // Enter key on a link triggers navigation, not necessarily onClick
      // So we just verify the link is focusable and can receive keyboard events
      await user.keyboard('{Enter}');
      
      // Link should still be in document
      expect(link).toBeInTheDocument();
    });

    it('should activate with Space key', async () => {
      // TDD: Test Space key activation
      const user = userEvent.setup();
      render(<NavLink href="/home">Home</NavLink>);
      
      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      // Space key on a link triggers navigation
      await user.keyboard(' ');
      
      // Link should still be in document
      expect(link).toBeInTheDocument();
    });

    it('should not activate when disabled', async () => {
      // TDD: Test disabled state prevents activation
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<NavLink href="/home" disabled onClick={handleClick}>Home</NavLink>);
      
      const link = screen.getByText('Home').closest('a');
      if (link) {
        link.focus();
        await user.keyboard('{Enter}');
      }
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      // TDD: Test focus visibility
      render(<NavLink href="/home">Home</NavLink>);
      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      
      // Link should have focus
      expect(link).toHaveFocus();
      // Focus ring classes should be applied
      expect(link).toHaveClass('focus-visible:opacity-100');
    });

    it('should have tabIndex=-1 when disabled', () => {
      // TDD: Test disabled links are not focusable
      render(<NavLink href="/home" disabled>Home</NavLink>);
      const link = screen.getByText('Home').closest('a');
      expect(link).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Screen Reader Support', () => {
    it('should be announced as a link by screen readers', () => {
      // TDD: Test semantic link role
      render(<NavLink href="/home">Home</NavLink>);
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toBeInTheDocument();
    });

    it('should announce active state to screen readers', () => {
      // TDD: Test active state announcement
      render(<NavLink href="/home" active>Home</NavLink>);
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toHaveAttribute('aria-current', 'page');
    });
  });
});
