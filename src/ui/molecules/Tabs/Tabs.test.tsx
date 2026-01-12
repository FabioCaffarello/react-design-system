import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';
import { TabsList } from './TabsList';
import { TabsTrigger } from './TabsTrigger';
import { TabsContent } from './TabsContent';

describe('Tabs', () => {
  describe('Rendering', () => {
    it('renders tabs with triggers and content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('shows only active tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('renders all content when forceMount is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2" forceMount>Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('switches to different tab when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      const tab2 = screen.getByText('Tab 2');
      await user.click(tab2);

      await waitFor(() => {
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        expect(screen.getByText('Content 2')).toBeInTheDocument();
      });
    });

    it('calls onValueChange when tab is switched', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Tabs defaultValue="tab1" onValueChange={handleChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      await user.click(tab2);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('tab2');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with ArrowRight in horizontal mode', async () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      await waitFor(() => {
        const tab2 = screen.getByText('Tab 2');
        expect(document.activeElement).toBe(tab2);
      });
    });

    it('navigates with ArrowLeft in horizontal mode', async () => {
      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      tab2.focus();

      fireEvent.keyDown(tab2, { key: 'ArrowLeft' });

      await waitFor(() => {
        const tab1 = screen.getByText('Tab 1');
        expect(document.activeElement).toBe(tab1);
      });
    });

    it('navigates with ArrowDown in vertical mode', async () => {
      render(
        <Tabs defaultValue="tab1" orientation="vertical">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowDown' });

      await waitFor(() => {
        const tab2 = screen.getByText('Tab 2');
        expect(document.activeElement).toBe(tab2);
      });
    });

    it('navigates with ArrowUp in vertical mode', async () => {
      render(
        <Tabs defaultValue="tab2" orientation="vertical">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      tab2.focus();

      fireEvent.keyDown(tab2, { key: 'ArrowUp' });

      await waitFor(() => {
        const tab1 = screen.getByText('Tab 1');
        expect(document.activeElement).toBe(tab1);
      });
    });

    it('navigates to first tab with Home key', async () => {
      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      tab2.focus();

      fireEvent.keyDown(tab2, { key: 'Home' });

      await waitFor(() => {
        const tab1 = screen.getByText('Tab 1');
        expect(document.activeElement).toBe(tab1);
      });
    });

    it('navigates to last tab with End key', async () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'End' });

      await waitFor(() => {
        const tab3 = screen.getByText('Tab 3');
        expect(document.activeElement).toBe(tab3);
      });
    });
  });

  describe('Activation Modes', () => {
    it('activates tab automatically on focus in automatic mode', async () => {
      render(
        <Tabs defaultValue="tab1" activationMode="automatic">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      
      await act(async () => {
        tab2.focus();
      });

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      });
    });

    it('requires Enter or Space to activate in manual mode', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1" activationMode="manual">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      tab2.focus();

      // Content should not change on focus
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      // Press Enter to activate
      fireEvent.keyDown(tab2, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      await user.click(tab2);

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
      });
    });

    it('works in controlled mode', () => {
      const { rerender } = render(
        <Tabs value="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      rerender(
        <Tabs value="tab2">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Disabled Tabs', () => {
    it('does not switch when disabled tab is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab2 = screen.getByText('Tab 2');
      expect(tab2).toBeDisabled();

      await user.click(tab2);

      // Content should not change
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('skips disabled tabs in keyboard navigation', async () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      await waitFor(() => {
        const tab3 = screen.getByText('Tab 3');
        expect(document.activeElement).toBe(tab3);
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes on tablist', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('has correct ARIA attributes on triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab1).toHaveAttribute('aria-controls', 'tabpanel-tab1');
      expect(tab1).toHaveAttribute('id', 'tab-tab1');

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-controls', 'tabpanel-tab2');
    });

    it('has correct ARIA attributes on content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2" forceMount>Content 2</Tabs.Content>
        </Tabs>
      );

      const content1 = screen.getByRole('tabpanel', { name: 'Tab 1' });
      expect(content1).toHaveAttribute('id', 'tabpanel-tab1');
      expect(content1).toHaveAttribute('aria-labelledby', 'tab-tab1');
      expect(content1).not.toHaveAttribute('hidden');

      // Tab 2 content should be hidden (using forceMount to render it)
      // When hidden, we need to query by text or id since getByRole may not find hidden elements
      const content2 = screen.getByText('Content 2').closest('[role="tabpanel"]');
      expect(content2).toBeInTheDocument();
      expect(content2).toHaveAttribute('hidden');
    });

    it('has correct tabIndex on triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('tabIndex', '0');

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('tabIndex', '-1');
    });
  });
});
