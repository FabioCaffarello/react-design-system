/**
 * Component Customizer Component
 * 
 * Component for customizing component configurations.
 */

import { Card } from '../../../../molecules';
import { Input, Label, Checkbox } from '../../../../atoms';
import type { ComponentConfig } from '../../types';
import type { ColorRole } from '../../../../tokens/colors';
import type { SpacingScale } from '../../../../tokens/spacing';
import type { FontSize, FontWeight, LineHeight } from '../../../../tokens/typography';

export interface ComponentCustomizerProps {
  component: ComponentConfig;
  onUpdate: (updates: Partial<ComponentConfig>) => void;
}

export function ComponentCustomizer({ component, onUpdate }: ComponentCustomizerProps) {
  const handleVariantsChange = (variants: string) => {
    onUpdate({
      variants: variants.split(',').map((v) => v.trim()).filter(Boolean),
    });
  };

  const handleSizesChange = (sizes: string) => {
    onUpdate({
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Customize: {component.name}</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <Label>Variants (comma-separated)</Label>
          <Input
            type="text"
            value={component.variants?.join(', ') || ''}
            onChange={(e) => handleVariantsChange(e.target.value)}
            placeholder="primary, secondary, outline"
          />
        </div>

        <div>
          <Label>Sizes (comma-separated)</Label>
          <Input
            type="text"
            value={component.sizes?.join(', ') || ''}
            onChange={(e) => handleSizesChange(e.target.value)}
            placeholder="sm, md, lg"
          />
        </div>

        <div>
          <Label>Accessibility</Label>
          <div className="space-y-2 mt-2">
            <Checkbox
              checked={component.accessibility?.ariaLabel || false}
              onChange={(checked) =>
                onUpdate({
                  accessibility: {
                    ...component.accessibility,
                    ariaLabel: checked,
                  },
                })
              }
            >
              ARIA Label
            </Checkbox>
            <Checkbox
              checked={component.accessibility?.keyboardNavigation || false}
              onChange={(checked) =>
                onUpdate({
                  accessibility: {
                    ...component.accessibility,
                    keyboardNavigation: checked,
                  },
                })
              }
            >
              Keyboard Navigation
            </Checkbox>
            <Checkbox
              checked={component.accessibility?.focusManagement || false}
              onChange={(checked) =>
                onUpdate({
                  accessibility: {
                    ...component.accessibility,
                    focusManagement: checked,
                  },
                })
              }
            >
              Focus Management
            </Checkbox>
          </div>
        </div>
      </div>
    </Card>
  );
}
