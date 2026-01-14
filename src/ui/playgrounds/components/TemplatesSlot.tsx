'use client';

import { Badge } from '../../atoms';
import { Card } from '../../molecules';
import type { AppConfig } from '../../tools/AppBuilder/types';

export interface Template {
  key: string;
  config: AppConfig;
}

export interface TemplatesSlotProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export function TemplatesSlot({ templates, onTemplateSelect }: TemplatesSlotProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Templates
          </h3>
          <Badge variant="secondary" size="sm">
            {templates.length}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Quick-start templates to get you started
        </p>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4">
        {templates.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
            No templates available
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <Card
                key={template.key}
                className="cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                onClick={() => onTemplateSelect(template)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {template.config.name}
                    </span>
                    <Badge variant="outline" size="sm">
                      {template.config.features.length} feature
                      {template.config.features.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {template.config.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
