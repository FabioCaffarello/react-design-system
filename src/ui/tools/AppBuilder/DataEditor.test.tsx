import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataEditor } from './DataEditor';
import type { FeatureContextData } from './types';
import { AppProvider } from '../../providers/AppProvider';

describe('DataEditor', () => {
  const mockContextData: FeatureContextData = {
    providerName: 'ThemeProvider',
    data: {
      defaultTheme: 'light',
    },
    config: {
      enabled: true,
      mergeWithDefault: true,
    },
  };

  it('should render data editor', () => {
    const handleContextDataChange = vi.fn();

    render(
      <AppProvider>
        <DataEditor
          contextData={mockContextData}
          onContextDataChange={handleContextDataChange}
          providerTypes={[]}
        />
      </AppProvider>
    );

    expect(screen.getByText('Context Provider Data')).toBeInTheDocument();
  });

  it('should allow editing JSON data', async () => {
    const handleContextDataChange = vi.fn();

    render(
      <AppProvider>
        <DataEditor
          contextData={mockContextData}
          onContextDataChange={handleContextDataChange}
          providerTypes={[]}
        />
      </AppProvider>
    );

    const textarea = screen.getByLabelText('Data (JSON)');
    const newData = JSON.stringify({ defaultTheme: 'dark' }, null, 2);
    
    fireEvent.change(textarea, { target: { value: newData } });

    await waitFor(() => {
      expect(handleContextDataChange).toHaveBeenCalled();
    });
  });

  it('should show validation errors for invalid JSON', async () => {
    const handleContextDataChange = vi.fn();

    render(
      <AppProvider>
        <DataEditor
          contextData={mockContextData}
          onContextDataChange={handleContextDataChange}
          providerTypes={[]}
        />
      </AppProvider>
    );

    const textarea = screen.getByLabelText('Data (JSON)');
    fireEvent.change(textarea, { target: { value: 'invalid json{' } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid JSON/i)).toBeInTheDocument();
    });
  });

  it('should load template when Load Template button is clicked', () => {
    const handleContextDataChange = vi.fn();

    render(
      <AppProvider>
        <DataEditor
          contextData={mockContextData}
          onContextDataChange={handleContextDataChange}
          providerTypes={[]}
        />
      </AppProvider>
    );

    const loadTemplateButton = screen.getByText('Load Template');
    fireEvent.click(loadTemplateButton);

    expect(handleContextDataChange).toHaveBeenCalled();
  });
});
