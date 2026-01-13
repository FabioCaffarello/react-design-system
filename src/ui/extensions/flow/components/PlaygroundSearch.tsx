/**
 * Enhanced Playground Search Component
 * 
 * Advanced search functionality with filters, preview, and navigation.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { X, Package, Link } from 'lucide-react';
import { Input, Button, Badge } from '../../../atoms';
import { Card } from '../../../molecules';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass
} from '../../../tokens';

export interface PlaygroundSearchProps {
  onResultSelect?: (result: { type: 'node' | 'edge'; id: string; label?: string }) => void;
  className?: string;
}

export function PlaygroundSearch({ onResultSelect, className }: PlaygroundSearchProps) {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults,
    nodes,
    edges,
  } = usePlaygroundContext();
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filterType, setFilterType] = useState<'all' | 'node' | 'edge'>('all');
  
  // Filter results by type
  const filteredResults = useMemo(() => {
    let results = searchResults;
    if (filterType !== 'all') {
      results = results.filter(r => r.type === filterType);
    }
    return results;
  }, [searchResults, filterType]);
  
  // Navigate results with keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const result = filteredResults[selectedIndex];
      if (result && onResultSelect) {
        onResultSelect(result);
      }
    }
  }, [filteredResults, selectedIndex, onResultSelect]);
  
  const handleResultClick = useCallback((result: { type: 'node' | 'edge'; id: string }) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setSearchQuery('');
  }, [onResultSelect, setSearchQuery]);
  
  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search nodes/edges..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedIndex(-1);
            }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {searchQuery && (
        <Card
          padding="sm"
          className={`
            absolute top-full left-0 right-0 mt-1
            max-h-[400px] overflow-y-auto
            z-50
            shadow-lg
          `}
        >
          {/* Filters */}
          <div 
            className={`flex items-center gap-2 ${getSpacingClass('sm', 'mb')} pb-2 border-b`}
            role="group"
            aria-label="Search filters"
          >
            <span className={getTypographyClasses('caption')} id="search-help">
              Filter:
            </span>
            {(['all', 'node', 'edge'] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize"
                aria-pressed={filterType === type}
                aria-label={`Filter by ${type}`}
              >
                {type}
              </Button>
            ))}
          </div>
          
          {/* Results */}
          {filteredResults.length > 0 ? (
            <>
              <div 
                className={getTypographyClasses('caption') + ' ' + getSpacingClass('sm', 'mb')}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </div>
              <div 
                className={`flex flex-col ${getSpacingClass('xs', 'gap')}`}
                role="listbox"
                aria-label="Search results"
              >
                {filteredResults.map((result, index) => {
                  const isSelected = index === selectedIndex;
                  const fullResult = result.type === 'node'
                    ? nodes.find(n => n.id === result.id)
                    : edges.find(e => e.id === result.id);
                  
                  return (
                    <div
                      key={result.id}
                      className={`
                        px-3 py-2 ${getRadiusClass('md')} cursor-pointer
                        transition-all duration-150
                        ${isSelected 
                          ? `${getColorClass('primary', 'light', 'bg')} border ${getColorClass('primary', 'DEFAULT', 'border')}` 
                          : `hover:${getColorClass('neutral', 'light', 'bg')} border border-transparent`
                        }
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      `}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      aria-label={`${result.type} ${result.label || result.id}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5">
                          {result.type === 'node' ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <Link className="h-4 w-4" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium ${getTypographyClasses('body')}`}>
                              {highlightText(result.label || result.id, searchQuery)}
                            </span>
                            <Badge variant="outline" size="sm" className="capitalize">
                              {result.type}
                            </Badge>
                            {result.metadata?.variant && (
                              <Badge variant="ghost" size="sm" className="capitalize">
                                {result.metadata.variant}
                              </Badge>
                            )}
                            {result.metadata?.nodeType && result.metadata.nodeType !== 'default' && (
                              <Badge variant="ghost" size="sm">
                                {result.metadata.nodeType}
                              </Badge>
                            )}
                            {result.metadata?.edgeType && result.metadata.edgeType !== 'default' && (
                              <Badge variant="ghost" size="sm">
                                {result.metadata.edgeType}
                              </Badge>
                            )}
                          </div>
                          {fullResult && (
                            <div className={`${getTypographyClasses('caption')} ${getColorClass('neutral', 'DEFAULT', 'text')} mt-1 truncate`}>
                              ID: {result.id}
                              {result.metadata?.source && result.metadata?.target && (
                                <span className="ml-2">
                                  → {result.metadata.source} → {result.metadata.target}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={`${getTypographyClasses('body')} ${getColorClass('neutral', 'DEFAULT', 'text')} text-center py-4`}>
              No results found for "{searchQuery}"
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
