/**
 * Node Editor Component
 * 
 * Editor for editing selected node properties
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Position } from '@xyflow/react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../../../molecules';
import { Label, Input, Select, Button } from '../../../atoms';
import { CustomNode } from '../molecules/CustomNode';
import type { CustomNodeData } from '../molecules/CustomNode';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';

export interface NodeEditorProps {
  node: Node<FlowNodeData> | null;
  onUpdate: (nodeId: string, updates: Partial<Node<FlowNodeData>>) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (node: Node<FlowNodeData>) => void;
}

/**
 * Node Editor Component
 */
export const NodeEditor = React.memo(function NodeEditor({ node, onUpdate, onDelete, onDuplicate }: NodeEditorProps) {
  const [localNode, setLocalNode] = useState<Node<FlowNodeData> | null>(node);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);
  const positionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalNode(node);
    // Reset validation errors when node changes
    setValidationErrors({});
  }, [node]);

  // Show feedback when update happens
  const showFeedback = useCallback((message: string) => {
    setUpdateFeedback(message);
    setTimeout(() => setUpdateFeedback(null), 2000);
  }, []);

  // Validate node data
  const validateNode = useCallback((nodeToValidate: Node<FlowNodeData>) => {
    const errors: Record<string, string> = {};
    
    // Validate ID
    if (!nodeToValidate.id || nodeToValidate.id.trim() === '') {
      errors.id = 'ID is required';
    }
    
    // Validate position
    if (isNaN(nodeToValidate.position.x) || isNaN(nodeToValidate.position.y)) {
      errors.position = 'Position must be valid numbers';
    }
    
    // Validate label if required
    if (nodeToValidate.data?.label !== undefined && nodeToValidate.data.label.trim() === '') {
      errors.label = 'Label cannot be empty';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Preview node for visual feedback
  const previewNode = useMemo(() => {
    if (!localNode || !showPreview) return null;
    
    return (
      <div style={{ 
        padding: '16px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '120px',
      }}>
        <div style={{ transform: 'scale(0.8)', pointerEvents: 'none' }}>
          <CustomNode
            id={localNode.id}
            data={localNode.data as CustomNodeData}
            selected={localNode.selected}
            position={{ x: 0, y: 0 }}
          />
        </div>
      </div>
    );
  }, [localNode, showPreview]);

  // Cleanup timeout on unmount - must be before any early returns
  useEffect(() => {
    return () => {
      if (positionTimeoutRef.current) {
        clearTimeout(positionTimeoutRef.current);
      }
    };
  }, []);

  // Early return after all hooks
  if (!localNode) {
    return (
      <Card padding="md">
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
          Select a node to edit its properties
        </p>
      </Card>
    );
  }

  const handleChange = (field: keyof Node<FlowNodeData>, value: unknown) => {
    if (!localNode) return;
    
    const updated = {
      ...localNode,
      [field]: value,
    };
    setLocalNode(updated);
    
    // Validate before updating
    if (validateNode(updated)) {
      onUpdate(localNode.id, { [field]: value });
      showFeedback(`${field} updated`);
    }
  };

  const handleDataChange = (field: keyof FlowNodeData, value: unknown) => {
    if (!localNode) return;
    
    const updated = {
      ...localNode,
      data: {
        ...localNode.data,
        [field]: value,
      },
    };
    setLocalNode(updated);
    onUpdate(localNode.id, { data: updated.data });
    showFeedback(`${field} updated`);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!localNode) return;
    
    // Validate value
    const numValue = isNaN(value) ? 0 : value;
    
    const updated = {
      ...localNode,
      position: {
        ...localNode.position,
        [axis]: numValue,
      },
    };
    setLocalNode(updated);
    
    // Debounce position updates for better performance
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
    }
    positionTimeoutRef.current = setTimeout(() => {
      onUpdate(localNode.id, { position: updated.position });
      showFeedback(`Position updated: ${axis.toUpperCase()} = ${numValue}`);
    }, 300);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Update Feedback */}
      {updateFeedback && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center',
            animation: 'fadeIn 0.2s',
          }}
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            {updateFeedback}
          </span>
        </div>
      )}
      
      {/* Basic Properties */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Basic Properties
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Label htmlFor="node-id">ID</Label>
            <Input
              id="node-id"
              value={localNode.id}
              readOnly
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <Label htmlFor="node-type">Type</Label>
            <Input
              id="node-type"
              value={localNode.type || 'default'}
              onChange={(e) => handleChange('type', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="node-label">Label</Label>
            <Input
              id="node-label"
              value={localNode.data?.label || ''}
              onChange={(e) => handleDataChange('label', e.target.value)}
              placeholder="Node label"
            />
          </div>
          <div>
            <Label htmlFor="node-variant">Variant</Label>
            <Select
              id="node-variant"
              value={localNode.data?.variant || 'default'}
              onChange={(e) => handleDataChange('variant', e.target.value)}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'primary', label: 'Primary' },
                { value: 'success', label: 'Success' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' },
              ]}
            />
            {validationErrors.variant && (
              <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                {validationErrors.variant}
              </div>
            )}
          </div>
          {localNode.data?.description !== undefined && (
            <div>
              <Label htmlFor="node-description">Description</Label>
              <Input
                id="node-description"
                value={localNode.data.description || ''}
                onChange={(e) => handleDataChange('description', e.target.value)}
                placeholder="Node description"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Position */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Position
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <Label htmlFor="node-x">X</Label>
            <Input
              id="node-x"
              type="number"
              value={localNode.position.x}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  handlePositionChange('x', value);
                }
              }}
              step="1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label htmlFor="node-y">Y</Label>
            <Input
              id="node-y"
              type="number"
              value={localNode.position.y}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  handlePositionChange('y', value);
                }
              }}
              step="1"
            />
          </div>
        </div>
      </Card>

      {/* Node Properties */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Node Properties
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Label htmlFor="node-draggable">Draggable</Label>
            <Select
              id="node-draggable"
              value={localNode.draggable !== false ? 'true' : 'false'}
              onChange={(e) => handleChange('draggable', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </div>
          <div>
            <Label htmlFor="node-selectable">Selectable</Label>
            <Select
              id="node-selectable"
              value={localNode.selectable !== false ? 'true' : 'false'}
              onChange={(e) => handleChange('selectable', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </div>
          <div>
            <Label htmlFor="node-connectable">Connectable</Label>
            <Select
              id="node-connectable"
              value={localNode.connectable !== false ? 'true' : 'false'}
              onChange={(e) => handleChange('connectable', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Handles Editor */}
      {localNode.data && 'sourceHandles' in localNode.data && (
        <Card padding="md">
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Handles Configuration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <Label>Source Handles</Label>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                {(localNode.data as CustomNodeData).sourceHandles?.length || 0} handles
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentHandles = (localNode.data as CustomNodeData).sourceHandles || [];
                  const newHandle = {
                    id: `source-${Date.now()}`,
                    position: Position.Bottom,
                    variant: localNode.data?.variant || 'default',
                  };
                  handleDataChange('sourceHandles', [...currentHandles, newHandle]);
                }}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                + Add Source Handle
              </Button>
            </div>
            <div>
              <Label>Target Handles</Label>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                {(localNode.data as CustomNodeData).targetHandles?.length || 0} handles
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentHandles = (localNode.data as CustomNodeData).targetHandles || [];
                  const newHandle = {
                    id: `target-${Date.now()}`,
                    position: Position.Top,
                    variant: localNode.data?.variant || 'default',
                  };
                  handleDataChange('targetHandles', [...currentHandles, newHandle]);
                }}
                style={{ width: '100%' }}
              >
                + Add Target Handle
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Preview */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: '14px', fontWeight: '600' }}>
            Preview
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide' : 'Show'}
          </Button>
        </div>
        {previewNode}
      </Card>

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <Card padding="md" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
            Validation Errors
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#dc2626', fontSize: '12px' }}>
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{field}: {error}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Custom Properties */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Custom Properties
        </h3>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Add custom properties to node data
        </div>
        <Input
          placeholder="Property name"
          style={{ marginBottom: '8px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              const propName = e.currentTarget.value;
              const _updated = {
                ...localNode.data,
                [propName]: '',
              };
              handleDataChange(propName as keyof FlowNodeData, '');
              e.currentTarget.value = '';
            }
          }}
        />
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
          Press Enter to add property
        </div>
      </Card>

      {/* Actions */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Actions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            variant="secondary"
            onClick={() => onDuplicate(localNode)}
            style={{ width: '100%' }}
          >
            Duplicate Node
          </Button>
          <Button
            variant="error"
            onClick={() => {
              if (confirm(`Are you sure you want to delete node "${localNode.data?.label || localNode.id}"?`)) {
                onDelete(localNode.id);
              }
            }}
            style={{ width: '100%' }}
          >
            Delete Node
          </Button>
        </div>
      </Card>
    </div>
  );
});
