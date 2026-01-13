import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Autocomplete from './Autocomplete';
import { User, Settings } from 'lucide-react';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Autocomplete', () => {
  it('renders input', () => {
    render(<Autocomplete options={mockOptions} />);
    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
  });

  it('shows options when typing', async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.change(input, { target: { value: 'Option' } });
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  it('filters options based on input', async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.change(input, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });
  });

  it('calls onSelect when option is clicked', async () => {
    const handleSelect = vi.fn();
    render(<Autocomplete options={mockOptions} onSelect={handleSelect} />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.change(input, { target: { value: 'Option' } });
    
    await waitFor(() => {
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  it('shows loading state', async () => {
    render(<Autocomplete options={mockOptions} loading />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('shows empty message when no options', async () => {
    render(<Autocomplete options={[]} emptyMessage="No results" />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.change(input, { target: { value: 'Option' } });
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(input).toHaveValue('Option 1');
    });
  });

  it('closes list on Escape', async () => {
    render(<Autocomplete options={mockOptions} />);
    const input = screen.getByPlaceholderText('Type to search...');
    
    fireEvent.change(input, { target: { value: 'Option' } });
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });
});
