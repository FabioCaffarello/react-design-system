/**
 * Edge Editor Component
 * 
 * Editor for editing selected edge properties
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MarkerType } from '@xyflow/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../../molecules';
import { Label, Input, Select, Button } from '../../../atoms';
import { CustomEdge } from '../molecules/CustomEdge';
import type { CustomEdgeData } from '../molecules/CustomEdge';
import type { Edge } from '@xyflow/react';
import type { FlowEdgeData } from '../organisms/FlowTypes';

export interface EdgeEditorProps {
  edge: Edge<FlowEdgeData> | null;
  nodes: Array<{ id: string; data?: { label?: string } }>;
  onUpdate: (edgeId: string, updates: Partial<Edge<FlowEdgeData>>) => void;
  onDelete: (edgeId: string) => void;
}

/**
 * Edge Editor Component
 */
export const EdgeEditor = React.memo(function EdgeEditor({ edge, nodes, onUpdate, onDelete }: EdgeEditorProps) {
  const [localEdge, setLocalEdge] = useState<Edge<FlowEdgeData> | null>(edge);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setLocalEdge(edge);
    setValidationErrors({});
  }, [edge]);

  // Show feedback when update happens
  const showFeedback = useCallback((message: string) => {
    setUpdateFeedback(message);
    setTimeout(() => setUpdateFeedback(null), 2000);
  }, []);

  // Validate edge data
  const validateEdge = useCallback((edgeToValidate: Edge<FlowEdgeData>) => {
    const errors: Record<string, string> = {};
    
    // Validate source and target
    if (!edgeToValidate.source || !edgeToValidate.target) {
      errors.source = 'Source and target are required';
    }
    
    if (edgeToValidate.source === edgeToValidate.target) {
      errors.source = 'Source and target cannot be the same';
    }
    
    // Validate nodes exist
    const sourceExists = nodes.some(n => n.id === edgeToValidate.source);
    const targetExists = nodes.some(n => n.id === edgeToValidate.target);
    
    if (!sourceExists) {
      errors.source = 'Source node does not exist';
    }
    if (!targetExists) {
      errors.target = 'Target node does not exist';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [nodes]);

  // Preview edge for visual feedback
  const previewEdge = useMemo(() => {
    if (!localEdge || !showPreview) return null;
    
    // Create mock positions for preview
    const sourceNode = nodes.find(n => n.id === localEdge.source);
    const targetNode = nodes.find(n => n.id === localEdge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    return (
      <div style={{ 
        padding: '16px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80px',
      }}>
        <svg width="200" height="60" style={{ overflow: 'visible' }}>
          <CustomEdge
            id={localEdge.id}
            sourceX={20}
            sourceY={30}
            targetX={180}
            targetY={30}
            sourcePosition="right"
            targetPosition="left"
            data={localEdge.data as CustomEdgeData}
            selected={localEdge.selected}
            style={localEdge.style}
          />
        </svg>
      </div>
    );
  }, [localEdge, showPreview, nodes]);

  if (!localEdge) {
    return (
      <Card padding="md">
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
          Select an edge to edit its properties
        </p>
      </Card>
    );
  }

  const handleChange = (field: keyof Edge<FlowEdgeData>, value: unknown) => {
    if (!localEdge) return;
    
    // Validate source/target changes
    if (field === 'source' || field === 'target') {
      const otherField = field === 'source' ? 'target' : 'source';
      if (value === localEdge[otherField]) {
        showFeedback('Source and target cannot be the same');
        return;
      }
    }
    
    const updated = {
      ...localEdge,
      [field]: value,
    };
    setLocalEdge(updated);
    
    // Validate before updating
    if (validateEdge(updated)) {
      onUpdate(localEdge.id, { [field]: value });
      showFeedback(`${field} updated`);
    }
  };

  const handleDataChange = (field: keyof FlowEdgeData, value: unknown) => {
    if (!localEdge) return;
    
    const updated = {
      ...localEdge,
      data: {
        ...localEdge.data,
        [field]: value,
      },
    };
    setLocalEdge(updated);
    onUpdate(localEdge.id, { data: updated.data });
    showFeedback(`${field} updated`);
  };

  const handleStyleChange = (field: string, value: string) => {
    if (!localEdge) return;
    
    // Validate strokeWidth
    if (field === 'strokeWidth') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 10) {
        showFeedback('Stroke width must be between 1 and 10');
        return;
      }
    }
    
    const updated = {
      ...localEdge,
      style: {
        ...(localEdge.style || {}),
        [field]: value,
      },
    };
    setLocalEdge(updated);
    onUpdate(localEdge.id, { style: updated.style });
    showFeedback(`${field} updated`);
  };

  const nodeOptions = nodes.map((node) => ({
    value: node.id,
    label: node.data?.label || node.id,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Update Feedback */}
      {updateFeedback && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: updateFeedback.includes('cannot') || updateFeedback.includes('must') ? '#ef4444' : '#10b981',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center',
            animation: 'fadeIn 0.2s',
          }}
        >
          <span className="flex items-center gap-1.5">
            {updateFeedback.includes('cannot') || updateFeedback.includes('must') ? (
              <XCircle className="h-3 w-3" />
            ) : (
              <CheckCircle2 className="h-3 w-3" />
            )}
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
            <Label htmlFor="edge-id">ID</Label>
            <Input
              id="edge-id"
              value={localEdge.id}
              readOnly
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <Label htmlFor="edge-source">Source Node</Label>
            <Select
              id="edge-source"
              value={localEdge.source}
              onChange={(e) => handleChange('source', e.target.value)}
              options={nodeOptions}
            />
          </div>
          <div>
            <Label htmlFor="edge-target">Target Node</Label>
            <Select
              id="edge-target"
              value={localEdge.target}
              onChange={(e) => handleChange('target', e.target.value)}
              options={nodeOptions}
            />
          </div>
          <div>
            <Label htmlFor="edge-type">Type</Label>
            <Select
              id="edge-type"
              value={localEdge.type || 'default'}
              onChange={(e) => handleChange('type', e.target.value)}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'smoothstep', label: 'Smoothstep' },
                { value: 'bezier', label: 'Bezier' },
                { value: 'simplebezier', label: 'Simple Bezier' },
                { value: 'straight', label: 'Straight' },
                { value: 'step', label: 'Step' },
              ]}
            />
          </div>
          {validationErrors.source && (
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
              {validationErrors.source}
            </div>
          )}
          {validationErrors.target && (
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
              {validationErrors.target}
            </div>
          )}
        </div>
      </Card>

      {/* Label */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Label
        </h3>
        <div>
          <Label htmlFor="edge-label">Label Text</Label>
          <Input
            id="edge-label"
            value={localEdge.data?.label || ''}
            onChange={(e) => handleDataChange('label', e.target.value)}
            placeholder="Edge label"
          />
        </div>
      </Card>

      {/* Style */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Style
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Label htmlFor="edge-animated">Animated</Label>
            <Select
              id="edge-animated"
              value={localEdge.animated ? 'true' : 'false'}
              onChange={(e) => handleChange('animated', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
          </div>
          <div>
            <Label htmlFor="edge-stroke">Stroke Color</Label>
            <Input
              id="edge-stroke"
              type="color"
              value={(localEdge.style && typeof localEdge.style === 'object' && 'stroke' in localEdge.style ? String(localEdge.style.stroke) : '#b1b1b7')}
              onChange={(e) => handleStyleChange('stroke', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edge-stroke-width">Stroke Width</Label>
            <Input
              id="edge-stroke-width"
              type="number"
              value={(localEdge.style && typeof localEdge.style === 'object' && 'strokeWidth' in localEdge.style ? Number(localEdge.style.strokeWidth) : 1)}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  handleStyleChange('strokeWidth', String(value));
                }
              }}
              min="1"
              max="10"
              step="1"
            />
          </div>
        </div>
      </Card>

      {/* Markers Editor */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Markers
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Label htmlFor="edge-marker-start">Start Marker</Label>
            <Select
              id="edge-marker-start"
              value={(localEdge.data as CustomEdgeData)?.customMarkerStart?.type || 'none'}
              onChange={(e) => {
                const markerType = e.target.value;
                if (markerType === 'none') {
                  handleDataChange('customMarkerStart', undefined);
                } else {
                  handleDataChange('customMarkerStart', {
                    type: markerType as MarkerType,
                    width: 20,
                    height: 20,
                  });
                }
              }}
              options={[
                { value: 'none', label: 'None' },
                { value: MarkerType.Arrow, label: 'Arrow' },
                { value: MarkerType.ArrowClosed, label: 'Arrow Closed' },
              ]}
            />
          </div>
          <div>
            <Label htmlFor="edge-marker-end">End Marker</Label>
            <Select
              id="edge-marker-end"
              value={(localEdge.data as CustomEdgeData)?.customMarkerEnd?.type || 'none'}
              onChange={(e) => {
                const markerType = e.target.value;
                if (markerType === 'none') {
                  handleDataChange('customMarkerEnd', undefined);
                } else {
                  handleDataChange('customMarkerEnd', {
                    type: markerType as MarkerType,
                    width: 20,
                    height: 20,
                  });
                }
              }}
              options={[
                { value: 'none', label: 'None' },
                { value: MarkerType.Arrow, label: 'Arrow' },
                { value: MarkerType.ArrowClosed, label: 'Arrow Closed' },
              ]}
            />
          </div>
        </div>
      </Card>

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
        {previewEdge}
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

      {/* Actions */}
      <Card padding="md">
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Actions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              if (localEdge) {
                // Reverse both source and target simultaneously
                const newSource = localEdge.target;
                const newTarget = localEdge.source;
                
                // Validate before updating
                if (newSource === newTarget) {
                  showFeedback('Source and target cannot be the same');
                  return;
                }
                
                const updated = {
                  ...localEdge,
                  source: newSource,
                  target: newTarget,
                };
                
                setLocalEdge(updated);
                
                // Validate and update
                if (validateEdge(updated)) {
                  onUpdate(localEdge.id, { source: newSource, target: newTarget });
                  showFeedback('Edge reversed');
                }
              }
            }}
            style={{ width: '100%' }}
          >
            Reverse Edge
          </Button>
          <Button
            variant="error"
            onClick={() => {
              if (confirm(`Are you sure you want to delete this edge?`)) {
                onDelete(localEdge.id);
              }
            }}
            style={{ width: '100%' }}
          >
            Delete Edge
          </Button>
        </div>
      </Card>
    </div>
  );
});
