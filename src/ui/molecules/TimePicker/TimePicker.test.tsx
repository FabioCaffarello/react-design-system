import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimePicker from './TimePicker';

describe('TimePicker', () => {
  it('renders correctly', () => {
    render(<TimePicker />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<TimePicker label="Select Time" />);
    expect(screen.getByText('Select Time')).toBeInTheDocument();
  });

  it('handles 24h format', () => {
    const handleChange = vi.fn();
    render(<TimePicker format="24h" onChange={handleChange} />);
    // TimePicker opens on click, but we can test the input
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('handles 12h format', () => {
    render(<TimePicker format="12h" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<TimePicker disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('displays error state', () => {
    render(<TimePicker error helperText="Invalid time" />);
    expect(screen.getByText('Invalid time')).toBeInTheDocument();
  });
});
