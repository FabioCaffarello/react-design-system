/**
 * CSS Code Generator Component
 * 
 * Component for generating CSS code from configuration.
 */

import { useState, useMemo } from 'react';
import { Card } from '../../../../molecules';
import { Button, Select } from '../../../../atoms';
import { CodePreview } from './CodePreview';
import { ExportOptions } from './ExportOptions';
import type { ConfiguratorState, ExportFormat } from '../../types';
import { exportState } from '../../utils/configSerializer';

export interface CSSCodeGeneratorProps {
  state: ConfiguratorState;
}

export function CSSCodeGenerator({ state }: CSSCodeGeneratorProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [code, setCode] = useState('');

  const generatedCode = useMemo(() => {
    try {
      return exportState(state, format);
    } catch (error) {
      return `Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, [state, format]);

  const handleExport = () => {
    const blob = new Blob([generatedCode], {
      type: format === 'json' ? 'application/json' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-system-config.${format === 'typescript' ? 'ts' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">CSS Code Generator</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              options={[
                { value: 'css', label: 'CSS' },
                { value: 'tailwind', label: 'Tailwind Config' },
                { value: 'scss', label: 'SCSS' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'json', label: 'JSON' },
              ]}
            />
          </div>

          <CodePreview code={generatedCode} format={format} />

          <div className="flex gap-2">
            <Button onClick={handleExport}>Export Code</Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                alert('Code copied to clipboard!');
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
