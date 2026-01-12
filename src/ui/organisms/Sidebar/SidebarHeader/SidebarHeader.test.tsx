import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarHeader from './SidebarHeader';

describe('SidebarHeader', () => {
  it('renders title', () => {
    render(<SidebarHeader title="Navigation" />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders close button when showCloseButton is true and onClose is provided', () => {
    const handleClose = vi.fn();
    render(
      <SidebarHeader
        title="Navigation"
        showCloseButton
        onClose={handleClose}
      />
    );
    const closeButton = screen.getByLabelText('Close sidebar');
    expect(closeButton).toBeInTheDocument();
  });

  it('does not render close button when showCloseButton is false', () => {
    const handleClose = vi.fn();
    render(
      <SidebarHeader
        title="Navigation"
        showCloseButton={false}
        onClose={handleClose}
      />
    );
    expect(screen.queryByLabelText('Close sidebar')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <SidebarHeader
        title="Navigation"
        showCloseButton
        onClose={handleClose}
      />
    );
    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders children', () => {
    render(
      <SidebarHeader title="Navigation">
        <button>Custom Action</button>
      </SidebarHeader>
    );
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SidebarHeader title="Navigation" className="custom-class" />
    );
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom-class');
  });
});
