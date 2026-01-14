import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Popover from './Popover';
import Button from '../../atoms/Button/Button';

describe('Popover', () => {
  it('renders trigger correctly', () => {
    render(
      <Popover trigger={<Button>Open</Button>}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('opens popover on trigger click', async () => {
    render(
      <Popover trigger={<Button>Open</Button>}>
        <p>Popover Content</p>
      </Popover>
    );
    
    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('closes popover when close button is clicked', async () => {
    render(
      <Popover trigger={<Button>Open</Button>} showCloseButton>
        <p>Popover Content</p>
      </Popover>
    );
    
    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByLabelText('Close popover');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });
  });

  it('displays title when provided', async () => {
    render(
      <Popover trigger={<Button>Open</Button>} title="Popover Title">
        <p>Content</p>
      </Popover>
    );
    
    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Popover Title')).toBeInTheDocument();
    });
  });

  it('handles controlled open state', async () => {
    const handleOpenChange = vi.fn();
    render(
      <Popover trigger={<Button>Open</Button>} open={true} onOpenChange={handleOpenChange}>
        <p>Content</p>
      </Popover>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
