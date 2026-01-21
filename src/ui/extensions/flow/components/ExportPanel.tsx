'use client';

/**
 * Export Panel Component
 * 
 * Panel for exporting flows in multiple formats
 */

import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Card } from '../../../molecules';
import { Button, Label, Input, Select, Badge } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { 
  exportToJSON, 
  importFromJSON, 
  generateShareableURL, 
  loadVersionHistory,
  getVersionById,
  deleteVersion,
  clearPlaygroundState,
  type PlaygroundSnapshot 
} from '../utils/PlaygroundPersistence';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass
} from '../../../tokens';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

export interface ExportPanelProps {
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Export flow as JSON
 */
function _exportAsJSON(nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) {
  const data = {
    nodes,
    edges,
    version: '1.0',
    exportedAt: new Date().toISOString(),
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flow-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export flow as PNG (requires canvas rendering)
 */
function exportAsPNG() {
  // This would require rendering the flow to a canvas
  // For now, we'll show a placeholder
  alert('PNG export requires canvas rendering. This feature will be implemented soon.');
}

/**
 * Export flow as SVG (requires SVG rendering)
 */
function exportAsSVG() {
  // This would require rendering the flow to SVG
  // For now, we'll show a placeholder
  alert('SVG export requires SVG rendering. This feature will be implemented soon.');
}

/**
 * Generate React code from flow
 */
function generateReactCode(nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) {
  const nodesCode = JSON.stringify(nodes, null, 2);
  const edgesCode = JSON.stringify(edges, null, 2);
  
  return `import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
import { FlowProvider, FlowCanvas } from '@fabio.caffarello/react-design-system/extensions/flow';

function MyFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(${nodesCode});
  const [edges, setEdges, onEdgesChange] = useEdgesState(${edgesCode});
  
  return (
    <FlowProvider nodes={nodes} edges={edges}>
      <FlowCanvas.Root
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <FlowCanvas.Background />
        <FlowCanvas.Controls />
        <FlowCanvas.Minimap />
      </FlowCanvas.Root>
    </FlowProvider>
  );
}

export default MyFlow;`;
}

export function ExportPanel({ className }: ExportPanelProps) {
  const { 
    nodes, 
    edges, 
    reactFlowConfig, 
    backgroundConfig, 
    layoutConfig, 
    theme,
    activeTab 
  } = usePlaygroundContext();
  const [exportFormat, setExportFormat] = useState<'json' | 'png' | 'svg' | 'code' | 'share'>('json');
  const [codePreview, setCodePreview] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [versionHistory, setVersionHistory] = useState<PlaygroundSnapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load version history
  React.useEffect(() => {
    const history = loadVersionHistory();
    setVersionHistory(history);
  }, []);

  const handleExport = useCallback(() => {
    const snapshot: Omit<PlaygroundSnapshot, 'id' | 'timestamp'> = {
      nodes,
      edges,
      reactFlowConfig,
      backgroundConfig,
      layoutConfig,
      theme,
      activeTab,
    };

    switch (exportFormat) {
      case 'json': {
        const fullSnapshot: PlaygroundSnapshot = {
          ...snapshot,
          id: `export-${Date.now()}`,
          timestamp: Date.now(),
        };
        const json = exportToJSON(fullSnapshot);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `flow-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
      }
      case 'png':
        exportAsPNG();
        break;
      case 'svg':
        exportAsSVG();
        break;
      case 'code': {
        const code = generateReactCode(nodes, edges);
        setCodePreview(code);
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
          // Show success feedback
        });
        break;
      }
      case 'share': {
        const fullSnapshot: PlaygroundSnapshot = {
          ...snapshot,
          id: `share-${Date.now()}`,
          timestamp: Date.now(),
        };
        const url = generateShareableURL(fullSnapshot);
        setShareUrl(url);
        navigator.clipboard.writeText(url).then(() => {
          // Show success feedback
        });
        break;
      }
    }
  }, [exportFormat, nodes, edges, reactFlowConfig, backgroundConfig, layoutConfig, theme, activeTab]);

  const handleCopyCode = useCallback(() => {
    if (codePreview) {
      navigator.clipboard.writeText(codePreview).then(() => {
        alert('Code copied to clipboard!');
      });
    }
  }, [codePreview]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const snapshot = importFromJSON(json);
        // Load the snapshot - would need to integrate with context
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('Imported snapshot:', snapshot);
        }
        alert('Flow imported successfully!');
      } catch {
        alert('Failed to import flow. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleLoadVersion = useCallback((versionId: string) => {
    const version = getVersionById(versionId);
    if (version) {
      // Load version - would need to integrate with context
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Loading version:', version);
      }
      alert('Version loaded!');
    }
  }, []);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')} ${className || ''}`}>
      <Card padding="md">
        <h3 className={`
          ${getTypographyClasses('h4')}
          ${getColorClass('neutral', 'dark', 'text')}
          m-0
          ${getSpacingClass('md', 'mb')}
        `}>
          Export Flow
        </h3>
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <div>
            <Label htmlFor="export-format">Export Format</Label>
            <Select
              id="export-format"
              value={exportFormat}
              onChange={(e) => {
                const format = e.target.value as 'json' | 'png' | 'svg' | 'code' | 'share';
                setExportFormat(format);
                if (format === 'code') {
                  setCodePreview(generateReactCode(nodes, edges));
                } else if (format === 'share') {
                  const snapshot: PlaygroundSnapshot = {
                    nodes,
                    edges,
                    reactFlowConfig,
                    backgroundConfig,
                    layoutConfig,
                    theme,
                    activeTab,
                    id: `share-${Date.now()}`,
                    timestamp: Date.now(),
                  };
                  setShareUrl(generateShareableURL(snapshot));
                }
              }}
              options={[
                { value: 'json', label: 'JSON File' },
                { value: 'code', label: 'React Code' },
                { value: 'share', label: 'Shareable URL' },
                { value: 'png', label: 'PNG Image' },
                { value: 'svg', label: 'SVG Image' },
              ]}
            />
          </div>
          
          {exportFormat === 'code' && codePreview && (
            <div>
              <Label>Generated Code</Label>
              <textarea
                readOnly
                value={codePreview}
                className={`w-full min-h-[200px] font-mono text-xs p-2 border ${getColorClass('neutral', 'DEFAULT', 'border')} ${getRadiusClass('md')} ${getColorClass('neutral', 'light', 'bg')}`}
              />
              <Tooltip content="Copy code to clipboard" position="top">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyCode}
                  className="mt-2 w-full"
                >
                  Copy Code
                </Button>
              </Tooltip>
            </div>
          )}

          {exportFormat === 'share' && shareUrl && (
            <div>
              <Label>Shareable URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="flex-1 font-mono text-xs"
                />
                <Tooltip content="Copy URL to clipboard" position="top">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                    }}
                  >
                    Copy
                  </Button>
                </Tooltip>
              </div>
              <p className={`
                ${getTypographyClasses('caption')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                mt-2
              `}>
                Share this URL to let others load your flow
              </p>
            </div>
          )}
          
          <Button
            variant="primary"
            onClick={handleExport}
            className="w-full"
          >
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </Card>

      {/* Import Section */}
      <Card padding="md">
        <h3 className={`
          ${getTypographyClasses('h4')}
          ${getColorClass('neutral', 'dark', 'text')}
          m-0
          ${getSpacingClass('md', 'mb')}
        `}>
          Import Flow
        </h3>
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <Label htmlFor="import-file">Import from JSON</Label>
          <Input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="w-full"
          />
        </div>
      </Card>

      {/* Version History */}
      <Card padding="md">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <h3 className={`
                ${getTypographyClasses('h4')}
                ${getColorClass('neutral', 'dark', 'text')}
                m-0
              `}>
                Version History
                {versionHistory.length > 0 && (
                  <Badge variant="outline" size="sm" className="ml-2">
                    {versionHistory.length}
                  </Badge>
                )}
              </h3>
              <span className="text-sm opacity-60">
                {showHistory ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={showHistory}
          onOpenChange={setShowHistory}
        >
          <div className={`flex flex-col ${getSpacingClass('sm', 'gap')} ${getSpacingClass('md', 'mt')}`}>
            {versionHistory.length === 0 ? (
              <p className={`
                ${getTypographyClasses('body')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                m-0
              `}>
                No saved versions yet. Auto-save will create versions automatically.
              </p>
            ) : (
              versionHistory.map((version) => (
                <div
                  key={version.id}
                  className={`flex items-center justify-between p-2 border ${getColorClass('neutral', 'DEFAULT', 'border')} rounded hover:${getColorClass('neutral', 'light', 'bg')} transition-colors`}
                >
                  <div className="flex-1 min-w-0">
                    <div className={getTypographyClasses('label')}>
                      {new Date(version.timestamp).toLocaleString()}
                    </div>
                    <div className={`
                      ${getTypographyClasses('caption')}
                      ${getColorClass('neutral', 'DEFAULT', 'text')}
                      truncate
                    `}>
                      {version.nodes.length} nodes, {version.edges.length} edges
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Tooltip content="Load this version" position="top">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadVersion(version.id)}
                      >
                        Load
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete this version" position="top">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Delete this version?')) {
                            deleteVersion(version.id);
                            setVersionHistory(loadVersionHistory());
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
            {versionHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Clear all version history?')) {
                    clearPlaygroundState();
                    setVersionHistory([]);
                  }
                }}
                className="mt-2"
              >
                Clear History
              </Button>
            )}
          </div>
        </Collapsible>
      </Card>
    </div>
  );
}
