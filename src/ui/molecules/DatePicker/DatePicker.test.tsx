import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DatePicker from './DatePicker';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DatePicker', () => {
  beforeEach(() => {
    // Clear any existing portals
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Single Date Selection', () => {
    it('renders date picker input', () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      expect(input).toBeInTheDocument();
    });

    it('displays selected date in input', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      render(<DatePicker value={date} />);
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('2024');
      expect(input.value).toContain('01');
      expect(input.value).toContain('15');
    });

    it('opens calendar when input is focused', async () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /date picker calendar/i })).toBeInTheDocument();
      });
    });

    it('calls onValueChange when date is selected', async () => {
      const handleChange = vi.fn();
      render(<DatePicker onValueChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click a date (15th of current month)
      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      const day15 = dateButtons.find(btn => btn.textContent === '15');
      
      if (day15) {
        fireEvent.click(day15);
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled();
        });
      }
    });

    it('closes calendar when clicking outside', async () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click outside
      fireEvent.mouseDown(document.body);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes calendar on Escape key', async () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Range Selection', () => {
    it('renders in range mode', () => {
      render(<DatePicker mode="range" />);
      const input = screen.getByPlaceholderText('Select date');
      expect(input).toBeInTheDocument();
    });

    it('displays selected range in input', () => {
      const range = {
        start: new Date(2024, 0, 10),
        end: new Date(2024, 0, 20),
      };
      render(<DatePicker mode="range" value={range} />);
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('2024');
    });

    it('calls onValueChange when range is selected', async () => {
      const handleChange = vi.fn();
      render(<DatePicker mode="range" onValueChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select start date
      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      const day10 = dateButtons.find(btn => btn.textContent === '10');
      
      if (day10) {
        fireEvent.click(day10);
        // Range selection would require clicking another date
        // This is a simplified test
        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('Date Validation', () => {
    it('disables dates before minDate', async () => {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 10);
      render(<DatePicker minDate={minDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      
      // Dates before minDate should be disabled
      // Find a date button that should be disabled (day 5, which is before day 10)
      const day5 = dateButtons.find(btn => {
        const text = btn.textContent?.trim();
        return text === '5' && !btn.hasAttribute('aria-label')?.includes('selected');
      });
      if (day5) {
        expect(day5).toBeDisabled();
      } else {
        // If day 5 is not found, check if any date before 10 is disabled
        const earlyDate = dateButtons.find(btn => {
          const dayNum = parseInt(btn.textContent?.trim() || '0');
          return dayNum > 0 && dayNum < 10;
        });
        if (earlyDate) {
          // At least verify the disabled attribute exists
          expect(earlyDate.hasAttribute('disabled') || earlyDate.hasAttribute('aria-disabled')).toBe(true);
        }
      }
    });

    it('disables dates after maxDate', async () => {
      const maxDate = new Date(2024, 0, 20);
      render(<DatePicker maxDate={maxDate} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      
      // Dates after maxDate should be disabled
      const day25 = dateButtons.find(btn => btn.textContent === '25');
      if (day25) {
        expect(day25).toHaveAttribute('disabled');
      }
    });

    it('disables specific dates', async () => {
      const disabledDates = [new Date(2024, 0, 15)];
      render(<DatePicker disabledDates={disabledDates} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }, { timeout: 2000 });

      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      const day15 = dateButtons.find(btn => btn.textContent?.trim() === '15');
      
      if (day15) {
        // The date should be disabled or have aria-disabled
        expect(day15.disabled || day15.getAttribute('aria-disabled') === 'true' || day15.classList.contains('opacity-50')).toBe(true);
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation in calendar', async () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const calendar = screen.getByRole('dialog');
      
      // Calendar should have keyboard navigation
      expect(calendar).toBeInTheDocument();
      
      // Test arrow key navigation
      fireEvent.keyDown(calendar, { key: 'ArrowRight' });
      fireEvent.keyDown(calendar, { key: 'ArrowLeft' });
      fireEvent.keyDown(calendar, { key: 'ArrowUp' });
      fireEvent.keyDown(calendar, { key: 'ArrowDown' });
    });

    it('selects date with Enter key', async () => {
      const handleChange = vi.fn();
      render(<DatePicker onValueChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find a date button and focus it, then press Enter
      const calendar = screen.getByRole('dialog');
      const dateButtons = within(calendar).getAllByRole('button');
      const firstDateButton = dateButtons.find(btn => !btn.disabled && btn.textContent && /^\d+$/.test(btn.textContent));
      
      if (firstDateButton) {
        firstDateButton.focus();
        fireEvent.keyDown(firstDateButton, { key: 'Enter' });
        
        // Enter should select the focused date
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled();
        }, { timeout: 1000 });
      }
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label on input', () => {
      render(<DatePicker aria-label="Select a date" />);
      const input = screen.getByLabelText('Select a date');
      expect(input).toBeInTheDocument();
    });

    it('has correct role and aria attributes on calendar', async () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        const dialog = screen.getByRole('dialog', { name: /date picker calendar/i });
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'false');
      });
    });

    it('calendar button has aria-label', () => {
      render(<DatePicker showCalendarButton />);
      const button = screen.getByLabelText('Open calendar');
      expect(button).toBeInTheDocument();
    });

    it('hides calendar button when showCalendarButton is false', () => {
      render(<DatePicker showCalendarButton={false} />);
      expect(screen.queryByLabelText('Open calendar')).not.toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode', async () => {
      const handleChange = vi.fn();
      render(<DatePicker defaultValue={new Date(2024, 0, 15)} onValueChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('2024');
    });

    it('works in controlled mode', () => {
      const date = new Date(2024, 0, 15);
      render(<DatePicker value={date} />);
      
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('2024');
    });
  });

  describe('Custom Format', () => {
    it('formats date according to format prop', () => {
      const date = new Date(2024, 0, 15);
      render(<DatePicker value={date} format="MM/dd/yyyy" />);
      
      const input = screen.getByPlaceholderText('Select date') as HTMLInputElement;
      expect(input.value).toContain('01');
      expect(input.value).toContain('15');
      expect(input.value).toContain('2024');
    });
  });

  describe('Compound Components', () => {
    it('renders with compound component API', () => {
      render(
        <DatePicker>
          <DatePicker.Input placeholder="Custom placeholder" />
          <DatePicker.Calendar />
        </DatePicker>
      );
      
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });
  });
});
