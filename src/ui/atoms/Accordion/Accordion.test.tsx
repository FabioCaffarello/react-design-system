import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

const mockItems = [
  { id: '1', title: 'Item 1', content: 'Content 1' },
  { id: '2', title: 'Item 2', content: 'Content 2' },
  { id: '3', title: 'Item 3', content: 'Content 3', disabled: true },
];

describe('Accordion', () => {
  it('renders correctly', () => {
    render(<Accordion items={mockItems} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('expands item on click (single mode)', () => {
    render(<Accordion items={mockItems} type="single" />);
    const button = screen.getByText('Item 1').closest('button');
    fireEvent.click(button!);
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('collapses item when clicked again (single mode)', () => {
    render(<Accordion items={mockItems} type="single" />);
    const button = screen.getByText('Item 1').closest('button');
    fireEvent.click(button!);
    expect(screen.getByText('Content 1')).toBeVisible();
    fireEvent.click(button!);
    const content = screen.queryByText('Content 1');
    if (content) {
      expect(content).toHaveAttribute('aria-hidden', 'true');
    } else {
      expect(content).not.toBeInTheDocument();
    }
  });

  it('allows multiple items open (multiple mode)', () => {
    render(<Accordion items={mockItems} type="multiple" />);
    const button1 = screen.getByText('Item 1').closest('button');
    const button2 = screen.getByText('Item 2').closest('button');
    
    fireEvent.click(button1!);
    fireEvent.click(button2!);
    
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('calls onValueChange when item is toggled', () => {
    const handleChange = vi.fn();
    render(<Accordion items={mockItems} onValueChange={handleChange} />);
    const button = screen.getByText('Item 1').closest('button');
    fireEvent.click(button!);
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('handles disabled items', () => {
    render(<Accordion items={mockItems} />);
    const disabledButton = screen.getByText('Item 3').closest('button');
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(disabledButton!);
    const content = screen.queryByText('Content 3');
    if (content) {
      expect(content).toHaveAttribute('aria-hidden', 'true');
    } else {
      expect(content).not.toBeInTheDocument();
    }
  });

  it('opens default items', () => {
    render(<Accordion items={mockItems} defaultOpen="1" />);
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('opens multiple default items', () => {
    render(<Accordion items={mockItems} type="multiple" defaultOpen={['1', '2']} />);
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
  });
});
