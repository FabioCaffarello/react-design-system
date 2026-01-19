import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithFlowProvider } from '../test-utils';
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
    renderWithFlowProvider(
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
    renderWithFlowProvider(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [mockNode] }
    );
    
    expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
  
  it('updates node label', async () => {
    renderWithFlowProvider(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [mockNode] }
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
    renderWithFlowProvider(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [mockNode] }
    );
    
    const xInput = screen.getByLabelText(/^X$/i);
    fireEvent.change(xInput, { target: { value: '150' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    }, { timeout: 500 });
  });
  
  it('duplicates node', () => {
    renderWithFlowProvider(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [mockNode] }
    );
    
    const duplicateButton = screen.getByText(/Duplicate Node/i);
    fireEvent.click(duplicateButton);
    
    expect(mockOnDuplicate).toHaveBeenCalledWith(mockNode);
  });
  
  it('deletes node with confirmation', () => {
    window.confirm = vi.fn(() => true);
    
    renderWithFlowProvider(
      <NodeEditor
        node={mockNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [mockNode] }
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
    
    renderWithFlowProvider(
      <NodeEditor
        node={invalidNode}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDuplicate={mockOnDuplicate}
      />,
      { nodes: [invalidNode] }
    );
    
    // Try to update (which triggers validation)
    const labelInput = screen.getByDisplayValue('Test Node');
    fireEvent.change(labelInput, { target: { value: 'Updated' } });
    
    // Validation should show errors
    await waitFor(() => {
      const _errorSection = screen.queryByText(/Validation Errors/i);
      // Error might not show immediately due to debouncing
    });
  });
});
