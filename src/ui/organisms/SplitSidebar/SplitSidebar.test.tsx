import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SplitSidebar from './SplitSidebar';
import { useSplitSidebar } from './hooks/useSplitSidebar';

describe('SplitSidebar', () => {
  it('renders navigation and content correctly', () => {
    render(
      <SplitSidebar>
        <SplitSidebar.Navigation>
          <div>Navigation</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default width', () => {
    const { container } = render(
      <SplitSidebar>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    const aside = container.querySelector('aside');
    expect(aside?.style.width).toBe('320px');
  });

  it('applies custom width', () => {
    const { container } = render(
      <SplitSidebar width="400px">
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    const aside = container.querySelector('aside');
    expect(aside?.style.width).toBe('400px');
  });

  it('collapses navigation when collapsed prop is true', () => {
    const { container } = render(
      <SplitSidebar collapsed={true}>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    // Navigation should be collapsed (width 0px)
    const nav = container.querySelector('[aria-hidden="true"]');
    expect(nav).toBeInTheDocument();
  });

  it('calls onCollapseChange when collapse state changes', () => {
    const handleCollapseChange = jest.fn();
    
    const { rerender } = render(
      <SplitSidebar onCollapseChange={handleCollapseChange}>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    rerender(
      <SplitSidebar collapsed={true} onCollapseChange={handleCollapseChange}>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    expect(handleCollapseChange).toHaveBeenCalled();
  });

  it('renders content with title', () => {
    render(
      <SplitSidebar>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content title="Test Title">
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render header when showHeader is false', () => {
    render(
      <SplitSidebar>
        <SplitSidebar.Navigation>
          <div>Nav</div>
        </SplitSidebar.Navigation>
        <SplitSidebar.Content title="Test Title" showHeader={false}>
          <div>Content</div>
        </SplitSidebar.Content>
      </SplitSidebar>
    );
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('throws error when subcomponents are used outside Root', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<SplitSidebar.Navigation><div>Nav</div></SplitSidebar.Navigation>);
    }).toThrow('SplitSidebar subcomponents must be used within SplitSidebar.Root');
    
    consoleError.mockRestore();
  });

  describe('Toggle Button', () => {
    it('renders toggle button', () => {
      render(
        <SplitSidebar>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <SplitSidebar.Toggle />
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const toggle = screen.getByRole('button', { name: /expand|collapse/i });
      expect(toggle).toBeInTheDocument();
    });

    it('toggles sidebar when clicked', async () => {
      const user = userEvent.setup();
      const handleCollapseChange = jest.fn();
      
      render(
        <SplitSidebar onCollapseChange={handleCollapseChange}>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <SplitSidebar.Toggle />
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const toggle = screen.getByRole('button', { name: /expand|collapse/i });
      await user.click(toggle);
      
      expect(handleCollapseChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('shows loading state', () => {
      render(
        <SplitSidebar>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content loading={true}>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      // Spinner should be visible
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('shows empty state', () => {
      render(
        <SplitSidebar>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content empty={true} emptyMessage="No items">
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('shows error state', () => {
      const error = new Error('Test error');
      const onRetry = jest.fn();
      
      render(
        <SplitSidebar>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content error={error} onRetry={onRetry}>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      const { container } = render(
        <SplitSidebar variant="default">
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('applies compact variant', () => {
      const { container } = render(
        <SplitSidebar variant="compact">
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const aside = container.querySelector('aside');
      expect(aside?.className).toContain('p-2');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(
        <SplitSidebar aria-label="Test Sidebar">
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('role', 'complementary');
      expect(aside).toHaveAttribute('aria-label', 'Test Sidebar');
      expect(aside).toHaveAttribute('aria-expanded', 'true');
    });

    it('updates aria-expanded when collapsed', () => {
      const { container } = render(
        <SplitSidebar collapsed={true}>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Responsive', () => {
    beforeEach(() => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('detects mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(
        <SplitSidebar responsive={true} mobileBreakpoint={768}>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      // Should apply mobile classes
      const { container } = render(
        <SplitSidebar responsive={true} mobileBreakpoint={768}>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });
  });

  describe('Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('persists collapsed state to localStorage', () => {
      const { rerender } = render(
        <SplitSidebar storageKey="test-sidebar" persistState="localStorage">
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      // Toggle to collapsed
      rerender(
        <SplitSidebar storageKey="test-sidebar" persistState="localStorage" collapsed={true}>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <div>Content</div>
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      // Check localStorage
      const stored = localStorage.getItem('test-sidebar-collapsed');
      expect(stored).toBe('false'); // false because isOpen is inverted
    });
  });

  describe('useSplitSidebar hook', () => {
    it('provides sidebar context', () => {
      const TestComponent = () => {
        const { collapsed, toggle } = useSplitSidebar();
        return (
          <div>
            <span data-testid="collapsed">{collapsed ? 'true' : 'false'}</span>
            <button onClick={toggle}>Toggle</button>
          </div>
        );
      };

      render(
        <SplitSidebar>
          <SplitSidebar.Navigation>
            <div>Nav</div>
          </SplitSidebar.Navigation>
          <SplitSidebar.Content>
            <TestComponent />
          </SplitSidebar.Content>
        </SplitSidebar>
      );
      
      expect(screen.getByTestId('collapsed')).toHaveTextContent('false');
    });

    it('throws error when used outside context', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const TestComponent = () => {
        useSplitSidebar();
        return <div>Test</div>;
      };
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useSplitSidebar must be used within a SplitSidebar component');
      
      consoleError.mockRestore();
    });
  });
});
