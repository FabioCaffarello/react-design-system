'use client';

import React, { type ReactNode } from 'react';
import type { FeatureComponent } from '../types';

// Import all design system components for dynamic rendering
import { Button, Input, Label, Badge, Textarea, Select, Chip } from '../../../atoms';
import { Card, Form, Menu, Autocomplete, Drawer, Popover, Pagination, MultiSelect } from '../../../molecules';
import { Container, Stack } from '../../../layouts';

// Component map for dynamic rendering
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Atoms
  Button,
  Input,
  Label,
  Badge,
  Textarea,
  Select,
  Chip,

  // Molecules
  Card,
  Form,
  Menu,
  Autocomplete,
  Drawer,
  Popover,
  Pagination,
  MultiSelect,

  // Layouts
  Container,
  Stack,
};

export interface ComponentRendererProps {
  component: FeatureComponent;
  onSelect?: (componentId: string) => void;
  isSelected?: boolean;
  depth?: number;
}

/**
 * MissingComponent
 *
 * Fallback component when a component is not found in the map.
 */
function MissingComponent({ name }: { name: string }) {
  return (
    <div className="p-4 border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 rounded-md">
      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
        <span className="text-lg">⚠</span>
        <span className="text-sm font-medium">Component not found: {name}</span>
      </div>
      <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
        This component is not available for live preview.
      </p>
    </div>
  );
}

/**
 * ComponentWrapper
 *
 * Wrapper that adds selection behavior and visual feedback.
 */
function ComponentWrapper({
  componentId,
  componentName,
  componentType,
  onSelect,
  isSelected,
  children,
}: {
  componentId: string;
  componentName: string;
  componentType: string;
  onSelect?: (componentId: string) => void;
  isSelected?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`
        relative group
        ${onSelect ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-md' : ''}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(componentId);
      }}
    >
      {/* Component Label (shown on hover) */}
      <div
        className={`
          absolute -top-6 left-0 z-10
          px-2 py-0.5 rounded text-xs font-medium
          bg-gray-800 text-white dark:bg-gray-700
          opacity-0 group-hover:opacity-100
          transition-opacity pointer-events-none
        `}
      >
        {componentName}
        <span className="text-gray-400 ml-1">({componentType})</span>
      </div>

      {/* Actual Component */}
      <div
        className={`
          ${onSelect ? 'group-hover:outline group-hover:outline-2 group-hover:outline-blue-300 group-hover:outline-offset-2 rounded' : ''}
        `}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * ComponentRenderer
 *
 * Dynamically renders design system components with their configured props.
 * Supports nested children and provides selection feedback for editing.
 */
export function ComponentRenderer({
  component,
  onSelect,
  isSelected,
  depth = 0,
}: ComponentRendererProps) {
  const Component = COMPONENT_MAP[component.name];

  // If component is not found, show fallback
  if (!Component) {
    return (
      <ComponentWrapper
        componentId={component.id}
        componentName={component.name}
        componentType={component.type}
        onSelect={onSelect}
        isSelected={isSelected}
      >
        <MissingComponent name={component.name} />
      </ComponentWrapper>
    );
  }

  // Prepare props, filtering out internal/reserved props
  const { children: childrenProp, ...componentProps } = component.props || {};

  // Render children if any
  const renderedChildren = component.children?.map((child) => (
    <ComponentRenderer
      key={child.id}
      component={child}
      onSelect={onSelect}
      isSelected={false}
      depth={depth + 1}
    />
  ));

  // Handle text content as children
  const childContent = childrenProp
    ? typeof childrenProp === 'string'
      ? childrenProp
      : JSON.stringify(childrenProp)
    : renderedChildren;

  return (
    <ComponentWrapper
      componentId={component.id}
      componentName={component.name}
      componentType={component.type}
      onSelect={onSelect}
      isSelected={isSelected}
    >
      <ErrorBoundaryWrapper componentName={component.name}>
        <Component {...componentProps}>{childContent}</Component>
      </ErrorBoundaryWrapper>
    </ComponentWrapper>
  );
}

/**
 * ErrorBoundaryWrapper
 *
 * Catches rendering errors for individual components.
 */
class ErrorBoundaryWrapper extends React.Component<
  { children: ReactNode; componentName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-dashed border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-md">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="text-lg">✗</span>
            <span className="text-sm font-medium">
              Error rendering: {this.props.componentName}
            </span>
          </div>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {this.state.error?.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ComponentList
 *
 * Renders a list of components with proper spacing.
 */
export function ComponentList({
  components,
  onSelect,
  selectedId,
}: {
  components: FeatureComponent[];
  onSelect?: (componentId: string) => void;
  selectedId?: string;
}) {
  if (components.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="mb-2">No components in this feature</p>
        <p className="text-sm">Add components from the Component Palette</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          onSelect={onSelect}
          isSelected={selectedId === component.id}
        />
      ))}
    </div>
  );
}
