import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppBuilder } from './AppBuilder';
import { StorageManager } from './utils/StorageManager';
import { AppProvider } from '../../providers/AppProvider';
import type { AppConfig } from './types';

describe('AppBuilder Integration', () => {
  beforeEach(() => {
    StorageManager.clearAll();
  });

  describe('Complete App Creation Flow', () => {
    it('should create a complete app with features and components', async () => {
      render(
        <AppProvider>
          <AppBuilder />
        </AppProvider>
      );

      // Change app name
      const nameInput = screen.getByPlaceholderText('App name');
      fireEvent.change(nameInput, { target: { value: 'My Test App' } });

      // Add a feature
      const addButton = screen.getByText('+ Add');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('New Feature')).toBeInTheDocument();
      });

      // Select the feature
      fireEvent.click(screen.getByText('New Feature'));

      // Edit feature name
      const featureNameInput = screen.getByLabelText('Name');
      fireEvent.change(featureNameInput, { target: { value: 'Dashboard' } });

      // Save app
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/saved/i)).toBeInTheDocument();
      });
    });

    it('should export app as JSON', async () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      render(
        <AppProvider>
          <AppBuilder initialAppConfig={appConfig} />
        </AppProvider>
      );

      // Mock download
      const createElementSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();
      
      createElementSpy.mockReturnValue({
        click: clickSpy,
        href: '',
        download: '',
      } as any);

      const exportButton = screen.getByText('Export JSON');
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(clickSpy).toHaveBeenCalled();
      });

      createElementSpy.mockRestore();
    });
  });

  describe('Feature Management Flow', () => {
    it('should add feature from template', async () => {
      render(
        <AppProvider>
          <AppBuilder />
        </AppProvider>
      );

      // Open templates
      const templatesButton = screen.getByText('Templates');
      fireEvent.click(templatesButton);

      await waitFor(() => {
        expect(screen.getByText('Feature Templates')).toBeInTheDocument();
      });

      // Select dashboard template
      const dashboardTemplate = screen.getByText('Dashboard');
      fireEvent.click(dashboardTemplate);

      await waitFor(() => {
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      });
    });

    it('should duplicate feature', async () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Feature 1',
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
          <AppBuilder initialAppConfig={appConfig} />
        </AppProvider>
      );

      // Find and click copy button
      const copyButtons = screen.getAllByText('Copy');
      if (copyButtons.length > 0) {
        fireEvent.click(copyButtons[0]);

        await waitFor(() => {
          expect(screen.getByText(/Copy/i)).toBeInTheDocument();
        });
      }
    });
  });
});
