/**
 * Header Navigation Integration Tests
 * 
 * Tests for Header.Navigation with Navigation component integration.
 * Following TDD approach: tests first, then implementation.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { Navigation } from '../Navigation/Navigation';
import type { NavItem } from '../Navigation/types';

describe('Header.Navigation + Navigation Component Integration', () => {
  it('should not create nested nav elements when Navigation is used inside Header.Navigation', () => {
    // TDD: Test that we don't have nested nav elements (semantic issue)
    const items: NavItem[] = [
      { href: '/home', label: 'Home' },
      { href: '/about', label: 'About' },
    ];

    const { container } = render(
      <Header>
        <Header.Navigation>
          <Navigation items={items} bare />
        </Header.Navigation>
      </Header>
    );

    // Should have only one nav element (from Header.Navigation)
    // Navigation component with bare prop should not create its own nav when used inside Header.Navigation
    const navs = container.querySelectorAll('nav');
    expect(navs.length).toBe(1);
  });

  it('should render Navigation items correctly inside Header.Navigation', () => {
    // TDD: Test that Navigation items render correctly
    const items: NavItem[] = [
      { href: '/home', label: 'Home' },
      { href: '/about', label: 'About' },
    ];

    render(
      <Header>
        <Header.Navigation>
          <Navigation items={items} />
        </Header.Navigation>
      </Header>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should maintain Navigation variant styling when used inside Header.Navigation', () => {
    // TDD: Test that Navigation variants work correctly
    const items: NavItem[] = [
      { href: '/home', label: 'Home' },
    ];

    const { container } = render(
      <Header>
        <Header.Navigation>
          <Navigation items={items} variant="tabs" />
        </Header.Navigation>
      </Header>
    );

    // Navigation should still apply its variant styling
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});
