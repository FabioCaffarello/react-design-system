import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentPalette } from './ComponentPalette';
import { ComponentRegistry } from '../../builders/ComponentRegistry';
import type { ComponentBuilderConfig } from '../../builders/types';
import { AppProvider } from '../../providers/AppProvider';

describe('ComponentPalette', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  it('should render component palette', () => {
    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    expect(screen.getByText('Component Palette')).toBeInTheDocument();
  });

  it('should display available components', () => {
    const buttonConfig: ComponentBuilderConfig = {
      name: 'Button',
      category: 'atom',
    };

    ComponentRegistry.register('Button', buttonConfig, {
      description: 'A button component',
    });

    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should filter components by category', () => {
    const buttonConfig: ComponentBuilderConfig = {
      name: 'Button',
      category: 'atom',
    };

    const cardConfig: ComponentBuilderConfig = {
      name: 'Card',
      category: 'molecule',
    };

    ComponentRegistry.register('Button', buttonConfig);
    ComponentRegistry.register('Card', cardConfig);

    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    const atomButton = screen.getByText('atom');
    fireEvent.click(atomButton);

    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.queryByText('Card')).not.toBeInTheDocument();
  });

  it('should search components', () => {
    const buttonConfig: ComponentBuilderConfig = {
      name: 'Button',
      category: 'atom',
    };

    const cardConfig: ComponentBuilderConfig = {
      name: 'Card',
      category: 'molecule',
    };

    ComponentRegistry.register('Button', buttonConfig);
    ComponentRegistry.register('Card', cardConfig);

    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search components...');
    fireEvent.change(searchInput, { target: { value: 'Button' } });

    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.queryByText('Card')).not.toBeInTheDocument();
  });

  it('should call onComponentSelect when component is clicked', () => {
    const buttonConfig: ComponentBuilderConfig = {
      name: 'Button',
      category: 'atom',
    };

    ComponentRegistry.register('Button', buttonConfig);

    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Button'));

    expect(handleComponentSelect).toHaveBeenCalled();
  });

  it('should show empty state when no components', () => {
    const handleComponentSelect = vi.fn();

    render(
      <AppProvider>
        <ComponentPalette onComponentSelect={handleComponentSelect} />
      </AppProvider>
    );

    expect(screen.getByText('No components found')).toBeInTheDocument();
  });
});
