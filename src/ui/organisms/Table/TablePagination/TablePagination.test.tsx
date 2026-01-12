import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TablePagination from './TablePagination';

describe('TablePagination', () => {
  it('renders pagination controls', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <TablePagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    // The "Showing" text is inside a Text component that may be split across elements
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    // Check for key parts of the pagination info text - use more specific queries
    const showingText = screen.getByText(/Showing/i);
    const container = showingText.closest('div');
    expect(container?.textContent).toContain('1'); // startItem
    expect(container?.textContent).toContain('10'); // endItem
    expect(container?.textContent).toContain('of');
    expect(container?.textContent).toContain('results');
    expect(container?.textContent).toContain('100'); // total
  });

  it('calls onPageChange when clicking next', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <TablePagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <TablePagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('calls onPageSizeChange when changing page size', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <TablePagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const select = screen.getByDisplayValue('10');
    fireEvent.change(select, { target: { value: '25' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
