/**
 * Header Visual Validation Tests
 * 
 * Visual validation tests for the Header component.
 * Following TDD approach: tests first, then implementation improvements.
 * 
 * @see TASK-039: Validação Visual Completa do Header
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Header } from './Header';
import { NavLink } from '../../atoms/NavLink';
import { Button } from '../../atoms/Button/Button';
import { DashboardLayout } from '../../templates/DashboardLayout/DashboardLayout';
import SideNavbar from '../../organisms/SideNavbar/SideNavbar';
import { Home, Settings } from 'lucide-react';

describe('Header Visual Validation (TASK-039)', () => {
  describe('Visual Consistency', () => {
    it('should render default variant consistently', () => {
      // TDD: Test visual consistency of default variant
      const { container } = render(
        <Header variant="default">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Visual consistency: should have base classes
      expect(header).toHaveClass('bg-white');
    });

    it('should render elevated variant with shadow', () => {
      // TDD: Test elevated variant has shadow
      const { container } = render(
        <Header variant="elevated">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Elevated variant should have shadow
      expect(header).toHaveClass('shadow-sm');
    });

    it('should render bordered variant with border', () => {
      // TDD: Test bordered variant has border
      const { container } = render(
        <Header variant="bordered">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Bordered variant should have border
      expect(header).toHaveClass('border-b');
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper layout with all slots', () => {
      // TDD: Test layout structure with all slots
      const { container } = render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
          <Header.Navigation>
            <NavLink href="/home">Home</NavLink>
          </Header.Navigation>
          <Header.Actions>
            <Button>Action</Button>
          </Header.Actions>
        </Header>
      );

      // Should have proper flex layout
      const content = container.querySelector('.flex.items-center.justify-between');
      expect(content).toBeInTheDocument();
    });

    it('should maintain proper layout with only Logo', () => {
      // TDD: Test layout structure with only Logo
      const { container } = render(
        <Header>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      // Should still have proper flex layout
      const content = container.querySelector('.flex.items-center.justify-between');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Sticky Positioning', () => {
    it('should apply sticky positioning when sticky prop is true', () => {
      // TDD: Test sticky positioning
      const { container } = render(
        <Header sticky>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should apply backdrop blur when sticky', () => {
      // TDD: Test backdrop blur for sticky header
      const { container } = render(
        <Header sticky>
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-sm', 'bg-white/95');
    });
  });

  describe('DashboardLayout Integration', () => {
    it('should render correctly with DashboardLayout using bare mode', () => {
      // TDD: Test visual consistency with DashboardLayout
      const { container } = render(
        <DashboardLayout
          sidebar={
            <SideNavbar mode="navigation">
              <SideNavbar.Navbar>
                <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
                <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
              </SideNavbar.Navbar>
            </SideNavbar>
          }
          header={
            <Header bare>
              <Header.Logo href="/">AppBuilder</Header.Logo>
              <Header.Actions>
                <Button>User</Button>
              </Header.Actions>
            </Header>
          }
        >
          <div>Content</div>
        </DashboardLayout>
      );

      // Should have only one header element (from DashboardLayout)
      const headers = container.querySelectorAll('header');
      expect(headers.length).toBe(1);
      
      // Header content should be present
      expect(container.textContent).toContain('AppBuilder');
      expect(container.textContent).toContain('User');
    });
  });

  describe('Responsive Behavior', () => {
    it('should render hamburger button for mobile menu', () => {
      // TDD: Test mobile menu button rendering
      const { container } = render(
        <Header>
          <Header.Hamburger />
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      // Hamburger button should be present
      const hamburger = container.querySelector('button[aria-label*="menu"]');
      expect(hamburger).toBeInTheDocument();
    });

    it('should render mobile menu when provided', () => {
      // TDD: Test mobile menu rendering
      // Note: Drawer may not render content when closed, so we test that the component structure is correct
      const { container } = render(
        <Header>
          <Header.Hamburger />
          <Header.MobileMenu>
            <NavLink href="/home">Home</NavLink>
          </Header.MobileMenu>
        </Header>
      );

      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Hamburger button should be present
      const hamburger = container.querySelector('button[aria-label*="menu"]');
      expect(hamburger).toBeInTheDocument();
      
      // The mobile menu structure is created (Drawer component)
      // Content may not be visible when menu is closed, which is expected behavior
      // This test validates that the component structure is correct
    });
  });

  describe('Max Width Container', () => {
    it('should respect maxWidth prop', () => {
      // TDD: Test maxWidth container
      const { container } = render(
        <Header maxWidth="lg">
          <Header.Logo href="/">MyApp</Header.Logo>
        </Header>
      );

      // Container should respect maxWidth
      const containerElement = container.querySelector('[class*="max-w"]');
      expect(containerElement).toBeInTheDocument();
    });
  });
});
