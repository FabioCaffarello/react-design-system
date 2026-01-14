/**
 * Export Options Component
 * 
 * Component for configuring export options.
 */

import { Card } from '../../../../molecules';
import { Checkbox, Label } from '../../../../atoms';
import type { CSSGenerationOptions } from '../../types';

export interface ExportOptionsProps {
  options: CSSGenerationOptions;
  onOptionsChange: (options: CSSGenerationOptions) => void;
}

export function ExportOptions({ options, onOptionsChange }: ExportOptionsProps) {
  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Export Options</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <Checkbox
          checked={options.includeVariables ?? true}
          onChange={(checked) =>
            onOptionsChange({
              ...options,
              includeVariables: checked,
            })
          }
        >
          Include CSS Variables
        </Checkbox>

        <Checkbox
          checked={options.includeUtilities ?? true}
          onChange={(checked) =>
            onOptionsChange({
              ...options,
              includeUtilities: checked,
            })
          }
        >
          Include Utility Classes
        </Checkbox>

        <Checkbox
          checked={options.minify ?? false}
          onChange={(checked) =>
            onOptionsChange({
              ...options,
              minify: checked,
            })
          }
        >
          Minify Output
        </Checkbox>
      </div>
    </Card>
  );
}
