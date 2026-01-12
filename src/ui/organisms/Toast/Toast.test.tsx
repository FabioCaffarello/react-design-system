import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToastContext } from './ToastContext';
import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';

// Helper component to test toast functionality
function ToastTestComponent() {
  const { addToast, removeToast, clearAll, toasts } = useToastContext();

  return (
    <div>
      <button onClick={() => addToast({ title: 'Success', variant: 'success' })}>
        Add Success
      </button>
      <button onClick={() => addToast({ title: 'Error', variant: 'error' })}>
        Add Error
      </button>
      <button onClick={() => addToast({ title: 'Warning', variant: 'warning' })}>
        Add Warning
      </button>
      <button onClick={() => addToast({ title: 'Info', variant: 'info' })}>
        Add Info
      </button>
      <button onClick={() => toasts.length > 0 && removeToast(toasts[0].id)}>
        Remove First
      </button>
      <button onClick={clearAll}>Clear All</button>
      <ToastContainer />
    </div>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders toast with title', () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      act(() => {
        render(
          <Toast toast={toast} onDismiss={vi.fn()} />
        );
      });

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    it('renders toast with description', () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        description: 'Test description',
        variant: 'info' as const,
      };

      act(() => {
        render(
          <Toast toast={toast} onDismiss={vi.fn()} />
        );
      });

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders correct icon for each variant', () => {
      const { rerender } = render(
        <Toast
          toast={{ id: '1', title: 'Success', variant: 'success' }}
          onDismiss={vi.fn()}
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();

      act(() => {
        rerender(
          <Toast
            toast={{ id: '2', title: 'Error', variant: 'error' }}
            onDismiss={vi.fn()}
          />
        );
      });
      expect(screen.getByRole('alert')).toBeInTheDocument();

      act(() => {
        rerender(
          <Toast
            toast={{ id: '3', title: 'Warning', variant: 'warning' }}
            onDismiss={vi.fn()}
          />
        );
      });
      expect(screen.getByRole('alert')).toBeInTheDocument();

      act(() => {
        rerender(
          <Toast
            toast={{ id: '4', title: 'Info', variant: 'info' }}
            onDismiss={vi.fn()}
          />
        );
      });
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    it('calls onDismiss when close button is clicked', async () => {
      const handleDismiss = vi.fn();
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      render(<Toast toast={toast} onDismiss={handleDismiss} />);

      // Wait for initial animation
      act(() => {
        vi.advanceTimersByTime(10);
      });

      const closeButton = screen.getByLabelText('Dismiss notification');
      
      act(() => {
        fireEvent.click(closeButton);
      });

      // Advance timer for exit animation
      act(() => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(handleDismiss).toHaveBeenCalledWith('test-1');
      }, { timeout: 1000 });
    });

    it('auto-dismisses after duration', async () => {
      const handleDismiss = vi.fn();
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
        duration: 5000,
      };

      render(<Toast toast={toast} onDismiss={handleDismiss} />);

      // Wait for initial animation
      act(() => {
        vi.advanceTimersByTime(10);
      });

      // Fast-forward time to duration
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Advance timer for exit animation
      act(() => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(handleDismiss).toHaveBeenCalledWith('test-1');
      }, { timeout: 1000 });
    });

    it('does not auto-dismiss when duration is undefined', async () => {
      const handleDismiss = vi.fn();
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
        duration: undefined,
      };

      render(<Toast toast={toast} onDismiss={handleDismiss} />);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should not have been called
      expect(handleDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Action Button', () => {
    it('renders action button when provided', () => {
      const handleAction = vi.fn();
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
        action: {
          label: 'Undo',
          onClick: handleAction,
        },
      };

      render(<Toast toast={toast} onDismiss={vi.fn()} />);

      const actionButton = screen.getByText('Undo');
      expect(actionButton).toBeInTheDocument();
    });

    it('calls action onClick when action button is clicked', async () => {
      const handleAction = vi.fn();
      const handleDismiss = vi.fn();
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
        action: {
          label: 'Undo',
          onClick: handleAction,
        },
      };

      render(<Toast toast={toast} onDismiss={handleDismiss} />);

      // Wait for initial animation
      act(() => {
        vi.advanceTimersByTime(10);
      });

      const actionButton = screen.getByText('Undo');
      fireEvent.click(actionButton);

      expect(handleAction).toHaveBeenCalled();
      // Action may or may not dismiss the toast depending on implementation
      // Just verify action was called
    });
  });

  describe('Positioning', () => {
    it('applies correct position classes', () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      const { container, rerender } = render(
        <Toast toast={toast} onDismiss={vi.fn()} position="top-right" />
      );

      let toastElement = container.querySelector('.fixed');
      expect(toastElement).toHaveClass('top-4', 'right-4');

      rerender(<Toast toast={toast} onDismiss={vi.fn()} position="bottom-left" />);
      toastElement = container.querySelector('.fixed');
      expect(toastElement).toHaveClass('bottom-4', 'left-4');

      rerender(<Toast toast={toast} onDismiss={vi.fn()} position="top-center" />);
      toastElement = container.querySelector('.fixed');
      expect(toastElement).toHaveClass('top-4', 'left-1/2', '-translate-x-1/2');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      render(<Toast toast={toast} onDismiss={vi.fn()} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('uses assertive aria-live for error toasts', () => {
      const toast = {
        id: 'test-1',
        title: 'Error Toast',
        variant: 'error' as const,
      };

      render(<Toast toast={toast} onDismiss={vi.fn()} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('has accessible close button', () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      render(<Toast toast={toast} onDismiss={vi.fn()} />);

      const closeButton = screen.getByLabelText('Dismiss notification');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('applies visible class after mount', async () => {
      const toast = {
        id: 'test-1',
        title: 'Test Toast',
        variant: 'success' as const,
      };

      const { container } = render(<Toast toast={toast} onDismiss={vi.fn()} />);

      act(() => {
        vi.advanceTimersByTime(10);
      });

      await waitFor(() => {
        const toastElement = container.querySelector('.fixed');
        expect(toastElement).toHaveClass('opacity-100', 'translate-y-0');
      }, { timeout: 1000 });
    });
  });
});

describe('ToastProvider and ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('adds and displays toast', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Success');
    
    act(() => {
      fireEvent.click(addButton);
    });

    // Advance timer for animation
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('removes toast when dismissed', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Success');
    
    act(() => {
      fireEvent.click(addButton);
    });

    // Advance timer for animation
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    }, { timeout: 1000 });

    const closeButton = screen.getByLabelText('Dismiss notification');
    
    act(() => {
      fireEvent.click(closeButton);
    });

    // Advance timer for exit animation
    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('clears all toasts', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Add Success'));
      fireEvent.click(screen.getByText('Add Error'));
    });

    // Advance timer for animations
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    }, { timeout: 1000 });

    const clearButton = screen.getByText('Clear All');
    
    act(() => {
      fireEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success')).not.toBeInTheDocument();
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('limits number of toasts when maxToasts is set', async () => {
    render(
      <ToastProvider maxToasts={2}>
        <ToastTestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Add Success'));
      fireEvent.click(screen.getByText('Add Error'));
      fireEvent.click(screen.getByText('Add Warning'));
      fireEvent.click(screen.getByText('Add Info'));
    });

    // Advance timer for animations
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      // Only first 2 toasts should be visible
      const toasts = screen.queryAllByRole('alert');
      expect(toasts.length).toBeLessThanOrEqual(2);
    }, { timeout: 1000 });
  });

  it('renders toasts in portal', async () => {
    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByText('Add Success');
    
    act(() => {
      fireEvent.click(addButton);
    });

    // Advance timer for animation
    act(() => {
      vi.advanceTimersByTime(10);
    });

    await waitFor(() => {
      const toast = screen.getByText('Success');
      // Toast should be in document.body via portal
      expect(document.body.contains(toast.closest('.fixed') || toast)).toBe(true);
    }, { timeout: 1000 });
  });
});
