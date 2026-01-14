/**
 * Component Configurator Component
 * 
 * Component for configuring individual components.
 */

import { useState } from 'react';
import { Card } from '../../../../molecules';
import { Input, Label, Button, Checkbox } from '../../../../atoms';
import { ComponentSelector } from './ComponentSelector';
import { ComponentCustomizer } from './ComponentCustomizer';
import type { ComponentConfig } from '../../types';

export interface ComponentConfiguratorProps {
  components: ComponentConfig[];
  selectedComponent?: string;
  onComponentAdd: (component: ComponentConfig) => void;
  onComponentUpdate: (name: string, updates: Partial<ComponentConfig>) => void;
  onComponentRemove: (name: string) => void;
  onComponentSelect: (name: string | undefined) => void;
}

export function ComponentConfigurator({
  components,
  selectedComponent,
  onComponentAdd,
  onComponentUpdate,
  onComponentRemove,
  onComponentSelect,
}: ComponentConfiguratorProps) {
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentCategory, setNewComponentCategory] = useState<ComponentConfig['category']>('atom');

  const handleCreateComponent = () => {
    if (!newComponentName.trim()) return;

    const newComponent: ComponentConfig = {
      name: newComponentName,
      category: newComponentCategory,
      tokens: {},
    };

    onComponentAdd(newComponent);
    setNewComponentName('');
  };

  const selectedComponentConfig = components.find((c) => c.name === selectedComponent);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Create New Component</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <Label>Component Name</Label>
            <Input
              type="text"
              value={newComponentName}
              onChange={(e) => setNewComponentName(e.target.value)}
              placeholder="Enter component name"
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={newComponentCategory}
              onChange={(e) => setNewComponentCategory(e.target.value as ComponentConfig['category'])}
              className="w-full p-2 border rounded"
            >
              <option value="atom">Atom</option>
              <option value="molecule">Molecule</option>
              <option value="organism">Organism</option>
              <option value="template">Template</option>
              <option value="pattern">Pattern</option>
              <option value="layout">Layout</option>
            </select>
          </div>

          <Button onClick={handleCreateComponent}>Create Component</Button>
        </div>
      </Card>

      <ComponentSelector
        components={components}
        selectedComponent={selectedComponent}
        onSelect={onComponentSelect}
        onRemove={onComponentRemove}
      />

      {selectedComponentConfig && (
        <ComponentCustomizer
          component={selectedComponentConfig}
          onUpdate={(updates) => onComponentUpdate(selectedComponentConfig.name, updates)}
        />
      )}
    </div>
  );
}
