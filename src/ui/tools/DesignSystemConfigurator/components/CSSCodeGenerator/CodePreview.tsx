/**
 * Code Preview Component
 * 
 * Component for previewing generated code.
 */

import { useTheme } from '../../../../providers/ThemeProvider';

export interface CodePreviewProps {
  code: string;
  format: string;
}

export function CodePreview({ code, format }: CodePreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative">
      <div className="text-sm font-medium mb-2">Preview</div>
      <pre
        className={`p-4 rounded border overflow-auto max-h-96 ${
          isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}
        style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.5',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
