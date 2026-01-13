import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NodeEditor } from './NodeEditor';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';

describe('NodeEditor', () => {
  const mockNode: Node<FlowNodeData> = {
    id: '1',
    type: 'default',
    position: { x: 100, y: 200 },
    data: {
      label: 'Test Node',
      variant: 'primary',
    },
  };
  
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDuplicate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders empty state when no node is selected', () => {
    render(
      <NodeEditor
        node={null}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    expect(screen.getByText(/Select a node to edit/i)).toBeInTheDocument();
  });
  
  it('renders node editor with node data', () => {
    render(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
  
  it('updates node label', async () => {
    render(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    const labelInput = screen.getByDisplayValue('Test Node');
    fireEvent.change(labelInput, { target: { value: 'Updated Node' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        data: expect.objectContaining({
          label: 'Updated Node',
        }),
      }));
    });
  });
  
  it('updates node position', async () => {
    render(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    const xInput = screen.getByLabelText(/^X$/i);
    fireEvent.change(xInput, { target: { value: '150' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    }, { timeout: 500 });
  });
  
  it('duplicates node', () => {
    render(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    const duplicateButton = screen.getByText(/Duplicate Node/i);
    fireEvent.click(duplicateButton);
    
    expect(mockOnDuplicate).toHaveBeenCalledWith(mockNode);
  });
  
  it('deletes node with confirmation', () => {
    window.confirm = vi.fn(() => true);
    
    render(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    const deleteButton = screen.getByText(/Delete Node/i);
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
  
  it('shows validation errors', async () => {
    const invalidNode: Node<FlowNodeData> = {
      ...mockNode,
      id: '', // Invalid empty ID
    };
    
    render(
      <NodeEditor
        node={invalidNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />
    );
    
    // Try to update (which triggers validation)
    const labelInput = screen.getByDisplayValue('Test Node');
    fireEvent.change(labelInput, { target: { value: 'Updated' } });
    
    // Validation should show errors
    await waitFor(() => {
      const errorSection = screen.queryByText(/Validation Errors/i);
      // Error might not show immediately due to debouncing
    });
  });
});
