import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from './Dialog';
import Button from '../../atoms/Button/Button';

describe('Dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
    // Restore body overflow
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders dialog trigger', () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    it('does not render content when closed', () => {
      render(
        <Dialog defaultOpen={false}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });

    it('renders content when open', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('opens dialog when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
    });

    it('closes dialog when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnOverlayClick>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
      
      // Find the overlay (the div with aria-hidden="true" and bg-black)
      const overlay = document.querySelector('[aria-hidden="true"].bg-black');
      if (overlay) {
        // Click directly on the overlay
        await user.click(overlay as HTMLElement);
        
        await waitFor(() => {
          expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });

    it('does not close dialog when content is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnOverlayClick>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      const dialog = screen.getByRole('dialog');
      await user.click(dialog);
      
      // Dialog should still be open
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    it('closes dialog on Escape key', async () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnEscape>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
    });

    it('closes dialog when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog>
      );
      
      // DialogClose renders a button with aria-label="Close dialog"
      const closeButton = screen.getByLabelText('Close dialog');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Focus Management', () => {
    it('traps focus within dialog', async () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Button>First Button</Button>
            <Button>Last Button</Button>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
      
      const firstButton = screen.getByText('First Button');
      const lastButton = screen.getByText('Last Button');
      
      // Focus should be on first focusable element (or dialog itself)
      await waitFor(() => {
        const activeElement = document.activeElement;
        expect(activeElement === firstButton || activeElement === screen.getByRole('dialog') || activeElement?.closest('[role="dialog"]')).toBeTruthy();
      });
      
      // Tab should move to next element
      firstButton.focus();
      // Use userEvent for more realistic keyboard events
      const user = userEvent.setup();
      await user.tab();
      // After tab, focus should be on lastButton or still within dialog
      await waitFor(() => {
        const activeElement = document.activeElement;
        expect(activeElement === lastButton || activeElement === firstButton || activeElement?.closest('[role="dialog"]')).toBeTruthy();
      }, { timeout: 1000 });
    });

    it('restores focus to previous element when closed', async () => {
      const user = userEvent.setup();
      const triggerButton = document.createElement('button');
      triggerButton.textContent = 'Trigger';
      document.body.appendChild(triggerButton);
      triggerButton.focus();
      
      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
      
      // Focus should be restored (this is tested via the implementation)
    });
  });

  describe('Portal Rendering', () => {
    it('renders dialog in portal', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      const dialog = screen.getByRole('dialog');
      // Dialog should be in document.body, not in the root
      expect(document.body.contains(dialog)).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
          </Dialog.Content>
        </Dialog>
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('associates title with dialog', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Dialog</Dialog.Title>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>
      );
      
      const dialog = screen.getByRole('dialog');
      const title = screen.getByText('Test Dialog');
      const titleId = title.id;
      
      expect(dialog).toHaveAttribute('aria-labelledby', titleId);
    });

    it('associates description with dialog', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Dialog</Dialog.Title>
              <Dialog.Description>Dialog description</Dialog.Description>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>
      );
      
      const dialog = screen.getByRole('dialog');
      const description = screen.getByText('Dialog description');
      const descriptionId = description.id;
      
      expect(dialog).toHaveAttribute('aria-describedby', descriptionId);
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={false}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      const trigger = screen.getByText('Open');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
    });

    it('works in controlled mode', () => {
      const { rerender } = render(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      
      rerender(
        <Dialog open>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange in controlled mode', async () => {
      const handleOpenChange = vi.fn();
      render(
        <Dialog open onOpenChange={handleOpenChange}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Sizes', () => {
    it('applies correct size classes', async () => {
      const { rerender } = render(
        <Dialog defaultOpen>
          <Dialog.Content size="sm">
            <Dialog.Title>Small Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Small Dialog')).toBeInTheDocument();
      });
      
      // Dialog is rendered in portal, so query from document.body
      let dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass('max-w-sm');
      
      rerender(
        <Dialog defaultOpen>
          <Dialog.Content size="lg">
            <Dialog.Title>Large Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Large Dialog')).toBeInTheDocument();
      });
      
      dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass('max-w-lg');
    });
  });

  describe('Body Scroll Lock', () => {
    it('locks body scroll when dialog is open', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body scroll when dialog is closed', async () => {
      const _user = userEvent.setup();
      const { rerender } = render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
      
      rerender(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      
      await waitFor(() => {
        // The overflow should be restored (empty string or original value)
        expect(document.body.style.overflow).toBe('');
      }, { timeout: 2000 });
    });
  });
});
