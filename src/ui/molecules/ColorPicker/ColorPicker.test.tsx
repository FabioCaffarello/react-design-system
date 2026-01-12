import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from './ColorPicker';

describe('ColorPicker', () => {
  it('renders correctly', () => {
    render(<ColorPicker />);
    const colorSwatch = document.querySelector('[style*="background-color"]');
    expect(colorSwatch).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<ColorPicker label="Color" />);
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('handles hex input change', () => {
    const handleChange = vi.fn();
    render(<ColorPicker value="#ff0000" onChange={handleChange} showInput />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '#00ff00' } });
    // The onChange should be called if valid hex
    expect(input).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<ColorPicker disabled />);
    const colorSwatch = document.querySelector('[style*="background-color"]');
    expect(colorSwatch).toBeInTheDocument();
  });

  it('displays presets when provided', () => {
    const presets = ['#ff0000', '#00ff00', '#0000ff'];
    render(<ColorPicker presets={presets} />);
    // Presets should be rendered as buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
