import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatureManager } from './FeatureManager';
import type { FeatureConfig } from './types';
import { AppProvider } from '../../providers/AppProvider';

describe('FeatureManager', () => {
  const mockFeatures: FeatureConfig[] = [
    {
      id: 'feature-1',
      name: 'Feature 1',
      description: 'First feature',
      category: 'page',
      components: [],
      layout: {
        type: 'container',
        config: {},
      },
    },
    {
      id: 'feature-2',
      name: 'Feature 2',
      description: 'Second feature',
      category: 'module',
      components: [],
      layout: {
        type: 'container',
        config: {},
      },
    },
  ];

  it('should render with features', () => {
    const handleFeaturesChange = vi.fn();
    const handleFeatureSelect = vi.fn();

    render(
      <AppProvider>
        <FeatureManager
          features={mockFeatures}
          onFeaturesChange={handleFeaturesChange}
          onFeatureSelect={handleFeatureSelect}
        />
      </AppProvider>
    );

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('should call onFeatureSelect when feature is clicked', () => {
    const handleFeaturesChange = vi.fn();
    const handleFeatureSelect = vi.fn();

    render(
      <AppProvider>
        <FeatureManager
          features={mockFeatures}
          onFeaturesChange={handleFeaturesChange}
          onFeatureSelect={handleFeatureSelect}
        />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Feature 1'));
    expect(handleFeatureSelect).toHaveBeenCalledWith('feature-1');
  });

  it('should add new feature when Add button is clicked', () => {
    const handleFeaturesChange = vi.fn();
    const handleFeatureSelect = vi.fn();

    render(
      <AppProvider>
        <FeatureManager
          features={[]}
          onFeaturesChange={handleFeaturesChange}
          onFeatureSelect={handleFeatureSelect}
        />
      </AppProvider>
    );

    const addButton = screen.getByText('+ Add');
    fireEvent.click(addButton);

    expect(handleFeaturesChange).toHaveBeenCalled();
    const newFeatures = handleFeaturesChange.mock.calls[0][0];
    expect(newFeatures.length).toBe(1);
    expect(newFeatures[0].name).toBe('New Feature');
  });

  it('should show templates when Templates button is clicked', () => {
    const handleFeaturesChange = vi.fn();
    const handleFeatureSelect = vi.fn();

    render(
      <AppProvider>
        <FeatureManager
          features={[]}
          onFeaturesChange={handleFeaturesChange}
          onFeatureSelect={handleFeatureSelect}
        />
      </AppProvider>
    );

    const templatesButton = screen.getByText('Templates');
    fireEvent.click(templatesButton);

    expect(screen.getByText('Feature Templates')).toBeInTheDocument();
  });

  it('should show empty state when no features', () => {
    const handleFeaturesChange = vi.fn();
    const handleFeatureSelect = vi.fn();

    render(
      <AppProvider>
        <FeatureManager
          features={[]}
          onFeaturesChange={handleFeaturesChange}
          onFeatureSelect={handleFeatureSelect}
        />
      </AppProvider>
    );

    expect(screen.getByText('No features yet')).toBeInTheDocument();
  });
});
