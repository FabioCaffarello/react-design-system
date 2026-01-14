import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preview } from './Preview';
import type { AppConfig } from './types';
import { AppProvider } from '../../providers/AppProvider';

describe('Preview', () => {
  const mockAppConfig: AppConfig = {
    name: 'Test App',
    description: 'Test application',
    features: [
      {
        id: 'feature-1',
        name: 'Dashboard',
        description: 'Dashboard feature',
        category: 'page',
        components: [
          {
            id: 'comp-1',
            type: 'atom',
            name: 'Button',
            props: { children: 'Click me' },
          },
        ],
        layout: {
          type: 'container',
          config: {
            maxWidth: 'xl',
            padding: 'base',
          },
        },
      },
    ],
  };

  it('should render preview with selected feature', () => {
    render(
      <AppProvider>
        <Preview
          appConfig={mockAppConfig}
          selectedFeatureId="feature-1"
        />
      </AppProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should show message when no feature selected', () => {
    render(
      <AppProvider>
        <Preview
          appConfig={mockAppConfig}
          selectedFeatureId={undefined}
        />
      </AppProvider>
    );

    expect(screen.getByText('No feature selected')).toBeInTheDocument();
  });

  it('should show empty state when feature has no components', () => {
    const appConfig: AppConfig = {
      name: 'Test App',
      description: 'Test',
      features: [
        {
          id: 'feature-1',
          name: 'Empty Feature',
          description: '',
          category: 'page',
          components: [],
          layout: {
            type: 'container',
            config: {},
          },
        },
      ],
    };

    render(
      <AppProvider>
        <Preview
          appConfig={appConfig}
          selectedFeatureId="feature-1"
        />
      </AppProvider>
    );

    expect(screen.getByText('No components in this feature')).toBeInTheDocument();
  });
});
