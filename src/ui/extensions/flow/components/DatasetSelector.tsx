'use client';

/**
 * Dataset Selector Component
 * 
 * Component for selecting and loading flow templates/datasets.
 */

import React, { useCallback, useState, memo } from 'react';
import { Card } from '../../../molecules';
import { Label, Select, Button, Tooltip, Input, Badge } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import { 
  flowTemplates, 
  getTemplatesByCategory,
  searchTemplates,
  type FlowTemplate 
} from '../utils/playgroundTemplates';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { generateNodeId } from '../utils/playgroundHelpers';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

/**
 * Memoized Template Button Component
 */
const TemplateButton = memo(function TemplateButton({
  template,
  isSelected,
  onSelect,
}: {
  template: FlowTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Tooltip
      content={template.description}
      position="right"
    >
      <Button
        variant={isSelected ? 'primary' : 'outline'}
        onClick={onSelect}
        className="w-full justify-start text-left h-auto py-2 px-3 transition-all duration-200"
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <div className={getTypographyClasses('label')}>
              {template.name}
            </div>
            {template.tags && template.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="ghost" size="sm" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Badge variant="outline" size="sm" className="capitalize ml-2">
            {template.category}
          </Badge>
        </div>
      </Button>
    </Tooltip>
  );
}, (prev, next) => {
  return prev.template.id === next.template.id && 
         prev.isSelected === next.isSelected;
});

export function DatasetSelector() {
  const { setNodes, setEdges, setHasPendingChanges } = usePlaygroundContext();
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('tree');
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FlowTemplate['category'] | 'all'>('all');
  
  const filteredTemplates = React.useMemo(() => {
    let templates = flowTemplates;
    
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);
  
  const categories = React.useMemo(() => {
    const cats = new Set(flowTemplates.map(t => t.category));
    return Array.from(cats);
  }, []);

  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      const template = flowTemplates.find((t) => t.id === templateId);
      if (template) {
        // Generate new IDs for nodes to avoid conflicts
        const newNodes = template.nodes.map((node) => ({
          ...node,
          id: generateNodeId(),
        }));

        // Create mapping from old IDs to new IDs
        const nodeIdMap = new Map(
          template.nodes.map((n, i) => [n.id, newNodes[i].id])
        );

        // Ensure all nodes have dimensions (width and height) for stable positioning
        const nodesWithDimensions = newNodes.map((node) => ({
          ...node,
          width: node.width || 200, // Default width if not specified
          height: node.height || 60, // Default height if not specified
        }));

        // Update edge source/target with new node IDs
        // Preserve sourceHandle and targetHandle for proper connection
        const newEdges = template.edges.map((edge) => ({
          ...edge,
          id: `edge-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          type: edge.type || 'default', // Ensure type is set
          source: nodeIdMap.get(edge.source) || edge.source,
          target: nodeIdMap.get(edge.target) || edge.target,
          // Preserve handle IDs for proper connection
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        }));

        setNodes(nodesWithDimensions);
        setEdges(newEdges);
        setHasPendingChanges(true);
        setSelectedTemplateId(templateId);
      }
    },
    [setNodes, setEdges, setHasPendingChanges]
  );

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      <Card padding="md">
        <Label 
          htmlFor="dataset-select" 
          className={`${getSpacingClass('sm', 'mb')} block`}
        >
          Dataset
        </Label>
        <Select
          id="dataset-select"
          value={selectedTemplateId}
          onChange={(e) => {
            const templateId = e.target.value;
            setSelectedTemplateId(templateId);
            handleLoadTemplate(templateId);
          }}
          options={flowTemplates.map((template) => ({
            value: template.id,
            label: template.name,
          }))}
        />
        {flowTemplates.find((t) => t.id === selectedTemplateId) && (
          <Tooltip
            content={flowTemplates.find((t) => t.id === selectedTemplateId)?.description || ''}
            position="bottom"
          >
            <p
              className={`
                ${getTypographyClasses('caption')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                ${getSpacingClass('sm', 'mt')}
                m-0
                cursor-help
                truncate
              `}
              title={flowTemplates.find((t) => t.id === selectedTemplateId)?.description}
            >
              {flowTemplates.find((t) => t.id === selectedTemplateId)?.description}
            </p>
          </Tooltip>
        )}
      </Card>

      <Card padding="md">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <h3
                className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}
              >
                Available Templates
                {filteredTemplates.length !== flowTemplates.length && (
                  <Badge variant="outline" size="sm" className="ml-2">
                    {filteredTemplates.length}
                  </Badge>
                )}
              </h3>
              <span className="text-sm opacity-60">
                {templatesOpen ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={templatesOpen}
          onOpenChange={setTemplatesOpen}
        >
          <div className={`flex flex-col ${getSpacingClass('md', 'gap')} ${getSpacingClass('md', 'mt')}`}>
            {/* Search */}
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat.replace('-', ' ')}
                </Button>
              ))}
            </div>
            
            {/* Templates List - Memoized for performance */}
            <div className={`grid grid-cols-1 ${getSpacingClass('xs', 'gap')}`}>
              {filteredTemplates.length === 0 ? (
                <p className={`
                  ${getTypographyClasses('body')}
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                  text-center py-4
                `}>
                  No templates found
                </p>
              ) : (
                filteredTemplates.map((template) => (
                  <TemplateButton
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplateId === template.id}
                    onSelect={() => handleLoadTemplate(template.id)}
                  />
                ))
              )}
            </div>
          </div>
        </Collapsible>
      </Card>
    </div>
  );
}
