/**
 * Component Selector Component
 * 
 * Component for selecting and managing components.
 */

import { Card } from '../../../../molecules';
import { Button } from '../../../../atoms';
import type { ComponentConfig } from '../../types';

export interface ComponentSelectorProps {
  components: ComponentConfig[];
  selectedComponent?: string;
  onSelect: (name: string | undefined) => void;
  onRemove: (name: string) => void;
}

export function ComponentSelector({
  components,
  selectedComponent,
  onSelect,
  onRemove,
}: ComponentSelectorProps) {
  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Components</h3>
      </div>
      
      <div className="p-4 space-y-2">
        {components.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No components created yet
          </div>
        ) : (
          components.map((component) => (
            <div
              key={component.name}
              className={`p-3 rounded flex items-center justify-between ${
                selectedComponent === component.name ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelect(component.name)}
              >
                <div className="font-medium">{component.name}</div>
                <div className="text-sm text-gray-500 capitalize">{component.category}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedComponent === component.name) {
                    onSelect(undefined);
                  }
                  onRemove(component.name);
                }}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
