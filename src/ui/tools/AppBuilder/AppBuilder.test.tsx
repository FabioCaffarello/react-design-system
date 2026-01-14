import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppBuilder } from './AppBuilder';
import type { AppConfig } from './types';
import { AppProvider } from '../../providers/AppProvider';

describe('AppBuilder', () => {
  const mockAppConfig: AppConfig = {
    name: 'Test App',
    description: 'Test application',
    features: [],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };

  it('should render with empty app', () => {
    render(
      <AppProvider>
        <AppBuilder />
      </AppProvider>
    );

    expect(screen.getByText('App Builder')).toBeInTheDocument();
  });

  it('should render with initial config', () => {
    render(
      <AppProvider>
        <AppBuilder initialAppConfig={mockAppConfig} />
      </AppProvider>
    );

    expect(screen.getByDisplayValue('Test App')).toBeInTheDocument();
  });

  it('should handle app name change', () => {
    render(
      <AppProvider>
        <AppBuilder initialAppConfig={mockAppConfig} />
      </AppProvider>
    );

    const nameInput = screen.getByPlaceholderText('App name');
    fireEvent.change(nameInput, { target: { value: 'New App Name' } });

    expect(nameInput).toHaveValue('New App Name');
  });

  it('should switch view modes', () => {
    render(
      <AppProvider>
        <AppBuilder />
      </AppProvider>
    );

    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);

    expect(previewButton).toHaveClass(/primary/i);
  });

  it('should toggle component palette', () => {
    render(
      <AppProvider>
        <AppBuilder />
      </AppProvider>
    );

    const toggleButton = screen.getByText('Show Palette');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Hide Palette')).toBeInTheDocument();
  });
});
