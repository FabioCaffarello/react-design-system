import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LayoutEditor } from './LayoutEditor';
import type { FeatureLayout, FeatureComponent } from './types';
import { AppProvider } from '../../providers/AppProvider';

describe('LayoutEditor', () => {
  const mockLayout: FeatureLayout = {
    type: 'container',
    config: {
      maxWidth: 'xl',
      padding: 'base',
    },
  };

  const mockComponents: FeatureComponent[] = [
    {
      id: 'comp-1',
      type: 'atom',
      name: 'Button',
      props: {},
    },
  ];

  it('should render layout editor', () => {
    const handleLayoutChange = vi.fn();

    render(
      <AppProvider>
        <LayoutEditor
          layout={mockLayout}
          onLayoutChange={handleLayoutChange}
          components={mockComponents}
        />
      </AppProvider>
    );

    expect(screen.getByText('Layout Configuration')).toBeInTheDocument();
  });

  it('should change layout type', () => {
    const handleLayoutChange = vi.fn();

    render(
      <AppProvider>
        <LayoutEditor
          layout={mockLayout}
          onLayoutChange={handleLayoutChange}
          components={mockComponents}
        />
      </AppProvider>
    );

    const select = screen.getByLabelText('Layout Type');
    fireEvent.change(select, { target: { value: 'grid' } });

    expect(handleLayoutChange).toHaveBeenCalled();
    const newLayout = handleLayoutChange.mock.calls[0][0];
    expect(newLayout.type).toBe('grid');
  });

  it('should show grid config when grid is selected', () => {
    const gridLayout: FeatureLayout = {
      type: 'grid',
      config: {
        columns: 3,
        rows: 'auto',
        gap: 'md',
      },
    };

    render(
      <AppProvider>
        <LayoutEditor
          layout={gridLayout}
          onLayoutChange={vi.fn()}
          components={mockComponents}
        />
      </AppProvider>
    );

    expect(screen.getByLabelText('Columns')).toBeInTheDocument();
    expect(screen.getByLabelText('Rows')).toBeInTheDocument();
    expect(screen.getByLabelText('Gap')).toBeInTheDocument();
  });

  it('should show flex config when flex is selected', () => {
    const flexLayout: FeatureLayout = {
      type: 'flex',
      config: {
        direction: 'row',
        justify: 'start',
        align: 'start',
        wrap: 'wrap',
      },
    };

    render(
      <AppProvider>
        <LayoutEditor
          layout={flexLayout}
          onLayoutChange={vi.fn()}
          components={mockComponents}
        />
      </AppProvider>
    );

    expect(screen.getByLabelText('Direction')).toBeInTheDocument();
    expect(screen.getByLabelText('Justify Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Align Items')).toBeInTheDocument();
  });
});
