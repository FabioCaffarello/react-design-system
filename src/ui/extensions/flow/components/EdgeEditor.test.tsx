import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EdgeEditor } from './EdgeEditor';
import type { Edge } from '@xyflow/react';
import type { FlowEdgeData } from '../organisms/FlowTypes';

describe('EdgeEditor', () => {
  const mockNodes = [
    { id: '1', data: { label: 'Node 1' } },
    { id: '2', data: { label: 'Node 2' } },
    { id: '3', data: { label: 'Node 3' } },
  ];
  
  const mockEdge: Edge<FlowEdgeData> = {
    id: 'e1-2',
    source: '1',
    target: '2',
    data: {
      label: 'Test Edge',
    },
  };
  
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders empty state when no edge is selected', () => {
    render(
      <EdgeEditor
        edge={null}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(/Select an edge to edit/i)).toBeInTheDocument();
  });
  
  it('renders edge editor with edge data', () => {
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByDisplayValue('Test Edge')).toBeInTheDocument();
    expect(screen.getByDisplayValue('e1-2')).toBeInTheDocument();
  });
  
  it('updates edge label', async () => {
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const labelInput = screen.getByDisplayValue('Test Edge');
    fireEvent.change(labelInput, { target: { value: 'Updated Edge' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('e1-2', expect.objectContaining({
        data: expect.objectContaining({
          label: 'Updated Edge',
        }),
      }));
    });
  });
  
  it('updates edge source', async () => {
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const sourceSelect = screen.getByLabelText(/Source Node/i);
    fireEvent.change(sourceSelect, { target: { value: '3' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('e1-2', expect.objectContaining({
        source: '3',
      }));
    });
  });
  
  it('validates that source and target cannot be the same', async () => {
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const sourceSelect = screen.getByLabelText(/Source Node/i);
    fireEvent.change(sourceSelect, { target: { value: '2' } }); // Same as target
    
    await waitFor(() => {
      expect(screen.getByText(/cannot be the same/i)).toBeInTheDocument();
    });
  });
  
  it('reverses edge', () => {
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const reverseButton = screen.getByText(/Reverse Edge/i);
    fireEvent.click(reverseButton);
    
    expect(mockOnUpdate).toHaveBeenCalled();
  });
  
  it('deletes edge with confirmation', () => {
    window.confirm = vi.fn(() => true);
    
    render(
      <EdgeEditor
        edge={mockEdge}
        nodes={mockNodes}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByText(/Delete Edge/i);
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith('e1-2');
  });
});
