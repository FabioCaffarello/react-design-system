/**
 * Code Preview Component
 * 
 * Live preview of generated React code
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { Card } from '../../../molecules';
import { Button, Select } from '../../../atoms';
import { generateReactCode, formatCode, downloadCode } from '../utils/codeGenerator';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { ReactFlowConfig, BackgroundConfig } from '../types/playgroundTypes';

export interface CodePreviewProps {
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  reactFlowConfig: ReactFlowConfig;
  backgroundConfig: BackgroundConfig;
  theme: 'light' | 'dark';
}

/**
 * Code Preview Component
 */
export const CodePreview = React.memo(function CodePreview({
  nodes,
  edges,
  reactFlowConfig,
  backgroundConfig,
  theme,
}: CodePreviewProps) {
  const [format, setFormat] = React.useState<'tsx' | 'jsx'>('tsx');
  const [copied, setCopied] = React.useState(false);
  const [downloadFeedback, setDownloadFeedback] = React.useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const generatedCode = useMemo(() => {
    const code = generateReactCode(
      nodes,
      edges,
      reactFlowConfig,
      backgroundConfig,
      theme,
      { format }
    );
    return formatCode(code);
  }, [nodes, edges, reactFlowConfig, backgroundConfig, theme, format]);

  // Auto-scroll to top when code changes
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = 0;
    }
  }, [generatedCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleDownload = () => {
    const extension = format;
    try {
      downloadCode(generatedCode, `flow-component.${extension}`);
      setDownloadFeedback(true);
      setTimeout(() => setDownloadFeedback(false), 2000);
    } catch (error) {
      console.error('Failed to download code:', error);
    }
  };

  return (
    <Card padding="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
          Generated Code
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'tsx' | 'jsx')}
            options={[
              { value: 'tsx', label: 'TSX' },
              { value: 'jsx', label: 'JSX' },
            ]}
            style={{ width: '80px' }}
          />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleDownload}
            title={`Download as ${format.toUpperCase()} file`}
          >
            {downloadFeedback ? 'Downloaded!' : 'Download'}
          </Button>
        </div>
      </div>
      <div
        ref={codeRef}
        style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '16px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          overflow: 'auto',
          maxHeight: '400px',
          whiteSpace: 'pre',
          lineHeight: '1.5',
          tabSize: 2,
          position: 'relative',
        }}
      >
        {generatedCode.split('\n').map((line, index) => (
          <div
            key={index}
            style={{
              minHeight: '18px',
              paddingRight: '8px',
            }}
          >
            {line || '\u00A0'}
          </div>
        ))}
      </div>
    </Card>
  );
});
