/**
 * Component Assistant
 * 
 * Interactive assistant for creating components.
 */

import { useState } from 'react';
import { Card } from '../../molecules';
import { Button, Input, Label, Select } from '../../atoms';
import { ComponentBuilder } from '../../builders';
import type { ComponentBuilderConfig } from '../../builders/types';

interface AssistantStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * Component Assistant Component
 * 
 * Wizard-style assistant for creating components step by step.
 * 
 * @example
 * ```tsx
 * <ComponentAssistant />
 * ```
 */
export function ComponentAssistant() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<Partial<ComponentBuilderConfig>>({
    name: '',
    category: 'atom',
  });

  const steps: AssistantStep[] = [
    {
      id: 'name',
      title: 'Component Name',
      description: 'Enter the name of your component',
      completed: !!config.name,
    },
    {
      id: 'category',
      title: 'Category',
      description: 'Select the component category',
      completed: !!config.category,
    },
    {
      id: 'variants',
      title: 'Variants',
      description: 'Define component variants (optional)',
      completed: true,
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Review and create your component',
      completed: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    if (!config.name || !config.category) return;

    const builder = ComponentBuilder[config.category as 'atom'](config.name);
    
    if (config.variants) {
      builder.withVariants(config.variants);
    }
    
    if (config.sizes) {
      builder.withSizes(config.sizes);
    }

    const built = builder.build();
    console.log('Component created:', built);
    alert('Component created! Check console for code.');
  };

  return (
    <div className="p-6">
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Component Assistant</h2>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Component Name</Label>
                  <Input
                    type="text"
                    value={config.name || ''}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    placeholder="Button"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={config.category || 'atom'}
                    onChange={(e) =>
                      setConfig({ ...config, category: e.target.value as ComponentBuilderConfig['category'] })
                    }
                    options={[
                      { value: 'atom', label: 'Atom' },
                      { value: 'molecule', label: 'Molecule' },
                      { value: 'organism', label: 'Organism' },
                      { value: 'template', label: 'Template' },
                      { value: 'pattern', label: 'Pattern' },
                      { value: 'layout', label: 'Layout' },
                    ]}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Variants (comma-separated)</Label>
                  <Input
                    type="text"
                    value={config.variants?.join(', ') || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        variants: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                      })
                    }
                    placeholder="primary, secondary, outline"
                  />
                </div>
                <div>
                  <Label>Sizes (comma-separated)</Label>
                  <Input
                    type="text"
                    value={config.sizes?.join(', ') || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="sm, md, lg"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Review Configuration</h3>
                  <pre className="p-4 bg-gray-100 rounded text-sm">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!steps[currentStep].completed}>
                Next
              </Button>
            ) : (
              <Button onClick={handleCreate}>Create Component</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
