'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import type { ComponentPaletteProps } from './types';
import type { ComponentMetadata } from '../../builders/ComponentRegistry';
import type { ComponentCategory } from '../../builders/types';
import {
  getAvailableComponents,
  getComponentsByCategory,
  searchComponents,
  filterComponentsByTags,
} from './utils/RegistryIntegration';
import { Badge, Button, Input } from '../../atoms';
import { Card } from '../../molecules';

/**
 * Component Palette
 * 
 * Displays available components from the design system with search and filtering
 */
export function ComponentPalette({
  onComponentSelect,
  selectedComponentId,
  filter,
}: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get filtered components
  const filteredComponents = useMemo(() => {
    let components = getAvailableComponents();

    // Apply category filter first
    if (selectedCategory !== 'all') {
      components = components.filter((c) => c.config.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      components = components.filter((c) => {
        const nameMatch = c.config.name.toLowerCase().includes(query);
        const descriptionMatch = c.description?.toLowerCase().includes(query);
        const tagsMatch = c.tags?.some((tag) => tag.toLowerCase().includes(query));
        return nameMatch || descriptionMatch || tagsMatch;
      });
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      components = components.filter((c) => {
        if (!c.tags || c.tags.length === 0) return false;
        return selectedTags.some((tag) => c.tags!.includes(tag));
      });
    }

    // Apply external filter if provided
    if (filter) {
      if (filter.category && filter.category.length > 0) {
        components = components.filter((c) => filter.category!.includes(c.config.category));
      }
      if (filter.search) {
        const query = filter.search.toLowerCase();
        components = components.filter((c) => {
          const nameMatch = c.config.name.toLowerCase().includes(query);
          const descriptionMatch = c.description?.toLowerCase().includes(query);
          const tagsMatch = c.tags?.some((tag) => tag.toLowerCase().includes(query));
          return nameMatch || descriptionMatch || tagsMatch;
        });
      }
      if (filter.tags && filter.tags.length > 0) {
        components = components.filter((c) => {
          if (!c.tags || c.tags.length === 0) return false;
          return filter.tags!.some((tag) => c.tags!.includes(tag));
        });
      }
    }

    return components;
  }, [searchQuery, selectedCategory, selectedTags, filter]);

  // Get all available categories
  const categories: Array<ComponentCategory | 'all'> = [
    'all',
    'atom',
    'molecule',
    'organism',
    'template',
    'pattern',
    'layout',
  ];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    getAvailableComponents().forEach((component) => {
      component.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const handleComponentClick = useCallback((component: ComponentMetadata) => {
    onComponentSelect(component);
  }, [onComponentSelect]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Component Palette</h3>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium mb-2">Tags</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'primary' : 'secondary'}
                onClick={() => handleTagToggle(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No components found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredComponents.map((component) => {
              const isSelected = selectedComponentId === component.config.name;
              return (
                <Card
                  key={component.config.name}
                  onClick={() => handleComponentClick(component)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {component.config.name}
                      </h4>
                      <Badge variant="secondary" size="sm">
                        {component.config.category}
                      </Badge>
                    </div>
                    {component.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {component.description}
                      </p>
                    )}
                    {component.tags && component.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {component.tags.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
