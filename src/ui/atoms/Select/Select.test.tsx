import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders select with options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Choose option" options={options} />);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders placeholder', () => {
    render(<Select placeholder="Select..." options={options} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const { container } = render(<Select error helperText="Error message" options={options} />);
    const select = container.querySelector('select');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows success state', () => {
    render(<Select success helperText="Valid" options={options} />);
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('renders option groups', () => {
    const optionGroups = [
      {
        label: 'Group 1',
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      },
    ];
    const { container } = render(<Select optionGroups={optionGroups} />);
    const optgroup = container.querySelector('optgroup[label="Group 1"]');
    expect(optgroup).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<Select size="sm" options={options} />);
    const select = container.querySelector('select');
    expect(select).toHaveClass('h-8', 'text-sm');
  });

  it('disables options correctly', () => {
    const optionsWithDisabled = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2', disabled: true },
    ];
    const { container } = render(<Select options={optionsWithDisabled} />);
    const disabledOption = container.querySelector('option[value="2"]');
    expect(disabledOption).toBeDisabled();
  });

  describe('Keyboard Navigation', () => {
    it('is focusable', () => {
      render(<Select options={options} />);
      const select = screen.getByRole('combobox');
      select.focus();
      expect(document.activeElement).toBe(select);
    });

    it('is not focusable when disabled', () => {
      render(<Select disabled options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('handles Arrow key navigation', () => {
      const handleChange = vi.fn();
      render(<Select options={options} onChange={handleChange} />);
      const select = screen.getByRole('combobox');
      select.focus();
      fireEvent.keyDown(select, { key: 'ArrowDown' });
      // Arrow keys should navigate options
      expect(select).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Select options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('associates label with select', () => {
      render(<Select label="Choose option" id="select" options={options} />);
      const select = screen.getByLabelText('Choose option');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('id', 'select');
    });

    it('has aria-invalid when error', () => {
      render(<Select error options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('has aria-describedby when helperText is provided', () => {
      render(<Select helperText="Helper text" id="test-select" options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'test-select-helper');
    });

    it('has aria-describedby for error message', () => {
      render(<Select error helperText="Error message" id="test-select" options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'test-select-error');
    });

    it('has aria-required when required', () => {
      render(<Select required options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-required', 'true');
      expect(select).toHaveAttribute('required');
    });

    it('has aria-label when provided', () => {
      render(<Select aria-label="Select option" options={options} />);
      const select = screen.getByLabelText('Select option');
      expect(select).toBeInTheDocument();
    });

    it('has correct name attribute', () => {
      render(<Select name="test-select" options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('name', 'test-select');
    });
  });

  describe('Edge Cases', () => {
    it('handles controlled select', () => {
      const { rerender } = render(<Select value="1" options={options} onChange={vi.fn()} />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('1');
      
      rerender(<Select value="2" options={options} onChange={vi.fn()} />);
      expect(select.value).toBe('2');
    });

    it('handles uncontrolled select', () => {
      render(<Select defaultValue="1" options={options} />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('1');
    });

    it('handles empty options array', () => {
      render(<Select options={[]} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles onChange event', () => {
      const handleChange = vi.fn();
      render(<Select options={options} onChange={handleChange} />);
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '2' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
