'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AppBuilder } from '../tools/AppBuilder';
import type { AppConfig } from '../tools/AppBuilder/types';
import { useToast } from '../organisms/Toast/useToast';
import { ToastContainer } from '../organisms/Toast/ToastContainer';
import { SideNavbar, SidebarSlotProvider } from '../organisms/SideNavbar';
import { Button } from '../atoms';
import {
  FolderOpen,
  Layers,
  FileStack,
  Settings,
  Plus,
  Save,
  Download,
  Palette,
} from 'lucide-react';
import { useAppBuilderNavigation } from './hooks/useAppBuilderNavigation';
import { AppsSlot } from './components/AppsSlot';
import { TemplatesSlot } from './components/TemplatesSlot';
import { FeaturesSlot } from './components/FeaturesSlot';
import { SettingsSlot } from './components/SettingsSlot';
import { StorageManager } from '../tools/AppBuilder/utils/StorageManager';
import { FeatureConfigSidebar } from '../tools/AppBuilder/components/FeatureConfigSidebar';
import { GlobalConfigSidebar } from '../tools/AppBuilder/components/GlobalConfig/GlobalConfigSidebar';
import { GlobalConfigPreview } from '../tools/AppBuilder/components/GlobalConfig/GlobalConfigPreview';
import type { AppBuilderState } from '../tools/AppBuilder/AppBuilder';
import type { GlobalTokensConfig } from '../tools/AppBuilder/types';
import { GlobalConfigCache } from '../tools/AppBuilder/utils/GlobalConfigCache';

/**
 * Sample app configurations for quick start
 */
const SAMPLE_APPS: Record<string, AppConfig> = {
  dashboard: {
    name: 'Dashboard App',
    description: 'A sample dashboard application with cards and metrics',
    features: [
      {
        id: 'dashboard-main',
        name: 'Main Dashboard',
        description: 'Main dashboard view with overview cards',
        category: 'page',
        components: [
          {
            id: 'welcome-card',
            type: 'molecule',
            name: 'Card',
            props: {
              children: 'Welcome to the Dashboard',
            },
          },
          {
            id: 'action-btn',
            type: 'atom',
            name: 'Button',
            props: {
              variant: 'primary',
              children: 'Get Started',
            },
          },
        ],
        layout: {
          type: 'stack',
          config: {
            spacing: 'base',
          },
        },
        metadata: {
          tags: ['dashboard'],
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      },
    ],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  },
  form: {
    name: 'Form App',
    description: 'A sample form application with input fields',
    features: [
      {
        id: 'contact-form',
        name: 'Contact Form',
        description: 'Contact form with name and email fields',
        category: 'module',
        components: [
          {
            id: 'name-input',
            type: 'atom',
            name: 'Input',
            props: {
              placeholder: 'Enter your name',
              type: 'text',
            },
          },
          {
            id: 'email-input',
            type: 'atom',
            name: 'Input',
            props: {
              placeholder: 'Enter your email',
              type: 'email',
            },
          },
          {
            id: 'submit-btn',
            type: 'atom',
            name: 'Button',
            props: {
              variant: 'primary',
              children: 'Submit',
            },
          },
        ],
        layout: {
          type: 'stack',
          config: {
            spacing: 'sm',
          },
        },
        metadata: {
          tags: ['form', 'contact'],
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      },
    ],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  },
  landing: {
    name: 'Landing Page',
    description: 'A simple landing page with hero section',
    features: [
      {
        id: 'hero-section',
        name: 'Hero Section',
        description: 'Hero section with title and CTA',
        category: 'pattern',
        components: [
          {
            id: 'hero-badge',
            type: 'atom',
            name: 'Badge',
            props: {
              variant: 'primary',
              children: 'New',
            },
          },
          {
            id: 'hero-card',
            type: 'molecule',
            name: 'Card',
            props: {
              children: 'Build amazing applications with our design system',
            },
          },
          {
            id: 'cta-btn',
            type: 'atom',
            name: 'Button',
            props: {
              variant: 'primary',
              size: 'lg',
              children: 'Start Building',
            },
          },
        ],
        layout: {
          type: 'container',
          config: {
            maxWidth: 'lg',
            padding: 'lg',
          },
        },
        metadata: {
          tags: ['landing', 'hero'],
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      },
    ],
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  },
};

interface SavedApp {
  key: string;
  config: AppConfig;
  savedAt: string;
}

/**
 * AppBuilderPlayground
 *
 * Interactive playground for building applications using the design system.
 * Features saved projects, sample templates, and full-featured app builder.
 * Uses SideNavbar for professional layout with navigation and configuration.
 */
export function AppBuilderPlayground() {
  const [currentApp, setCurrentApp] = useState<AppConfig | undefined>();
  const [appBuilderState, setAppBuilderState] = useState<AppBuilderState | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [globalConfig, setGlobalConfig] = useState<GlobalTokensConfig | null>(null);
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);
  const toast = useToast();
  const navigation = useAppBuilderNavigation({ initialSection: 'apps' });
  const createAppRef = useRef<(() => void) | undefined>(undefined);

  // Convert SAMPLE_APPS to templates format
  const templates = useMemo(() => {
    return Object.entries(SAMPLE_APPS).map(([key, config]) => ({
      key,
      config,
    }));
  }, []);

  const handleNewApp = useCallback(() => {
    setCurrentApp(undefined);
    setIsSetupMode(true);
    navigation.setActiveSection('global-config');
    // Load from cache if available
    const cached = GlobalConfigCache.load();
    if (cached) {
      setGlobalConfig(cached);
      toast.info('Cache loaded', 'Restored previous configuration');
    } else {
      // Initialize with empty config - will use defaults in GlobalConfigSidebar
      setGlobalConfig(null);
    }
  }, [navigation, toast]);

  const handleLoadTemplate = useCallback(
    (template: { key: string; config: AppConfig }) => {
      const loadedApp = {
        ...template.config,
        name: `${template.config.name} (Copy)`,
        metadata: {
          ...template.config.metadata,
          createdAt: new Date().toISOString(),
        },
      };
      setCurrentApp(loadedApp);
      setIsSetupMode(false);
      if (loadedApp.globalTokens) {
        setGlobalConfig(loadedApp.globalTokens);
      }
      navigation.setActiveSection('features');
      toast.success('Template loaded', `${template.config.name} loaded successfully`);
    },
    [navigation, toast]
  );

  const handleLoadSavedApp = useCallback(
    (app: SavedApp) => {
      setCurrentApp(app.config);
      setIsSetupMode(false);
      if (app.config.globalTokens) {
        setGlobalConfig(app.config.globalTokens);
      }
      navigation.setActiveSection('features');
      toast.success('App loaded', `${app.config.name} loaded successfully`);
    },
    [navigation, toast]
  );

  const handleDeleteSavedApp = useCallback(
    (key: string, name: string) => {
      if (confirm(`Delete "${name}"? This cannot be undone.`)) {
        StorageManager.deleteApp(key);
        if (currentApp?.name === name) {
          setCurrentApp(undefined);
        }
        toast.success('Deleted', `${name} has been deleted`);
      }
    },
    [currentApp, toast]
  );

  const handleSave = useCallback(
    (config: AppConfig) => {
      setCurrentApp(config);
      try {
        StorageManager.saveApp(config, config.name);
        toast.success('Saved', `${config.name} saved successfully`);
      } catch {
        toast.error('Save failed', 'Failed to save app');
      }
    },
    [toast]
  );

  const handleExport = useCallback(() => {
    if (!currentApp) {
      toast.warning('No app', 'Please create or load an app first');
      return;
    }
    // Export logic will be handled by AppBuilder
    toast.info('Export', 'Use Export button in the toolbar');
  }, [currentApp, toast]);

  const handleFeaturesChange = useCallback(
    (features: typeof currentApp.features) => {
      if (currentApp) {
        setCurrentApp({ ...currentApp, features });
      }
    },
    [currentApp]
  );

  const handleFeatureSelect = useCallback(
    (featureId: string) => {
      navigation.setActiveFeatureId(featureId);
    },
    [navigation]
  );

  const handleCreateApp = useCallback(
    (config: GlobalTokensConfig) => {
      const newApp: AppConfig = {
        name: 'New Application',
        description: '',
        features: [],
        globalTokens: config,
        globalTokensRequired: ['typography', 'colors', 'spacing'],
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      };
      setCurrentApp(newApp);
      setIsSetupMode(false);
      setGlobalConfig(config);
      GlobalConfigCache.clear();
      // Save the new app
      try {
        StorageManager.saveApp(newApp, newApp.name);
      } catch {
        // Ignore save errors on creation
      }
      navigation.setActiveSection('features');
      toast.success('App created', 'Application created with global configuration');
    },
    [navigation, toast]
  );

  const handleSaveGlobalConfig = useCallback(
    (config: GlobalTokensConfig) => {
      if (currentApp) {
        const updatedApp: AppConfig = {
          ...currentApp,
          globalTokens: config,
        };
        setCurrentApp(updatedApp);
        try {
          StorageManager.saveApp(updatedApp, updatedApp.name);
          toast.success('Saved', 'Global configuration saved');
        } catch {
          toast.error('Save failed', 'Failed to save global configuration');
        }
      }
    },
    [currentApp, toast]
  );

  const handleAccordionChange = useCallback((id: string | null) => {
    setActiveAccordionId(id);
  }, []);

  // Initialize globalConfig when app is loaded
  useEffect(() => {
    if (currentApp?.globalTokens && !globalConfig) {
      setGlobalConfig(currentApp.globalTokens);
    }
  }, [currentApp, globalConfig]);

  const handleGlobalConfigChange = useCallback((config: GlobalTokensConfig) => {
    setGlobalConfig(config);
    // Update current app if it exists
    if (currentApp && !isSetupMode) {
      setCurrentApp({
        ...currentApp,
        globalTokens: config,
      });
    }
  }, [currentApp, isSetupMode]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <ToastContainer />

      <SideNavbar
        mode="full"
        variant="elevated"
        width="320px"
        navigationWidth="56px"
        responsive
        mobileBreakpoint={768}
        defaultCollapsed={false}
        storageKey="app-builder-playground-sidebar"
      >
        {/* Navbar - Navigation Macro */}
        <SideNavbar.Navbar labelMode="tooltip">
          <SideNavbar.Navbar.Item
            id="apps"
            icon={<FolderOpen className="w-5 h-5" />}
            label="Apps"
            active={navigation.isSectionActive('apps')}
            onClick={() => navigation.navigateToSection('apps', 'apps')}
          />
          <SideNavbar.Navbar.Item
            id="features"
            icon={<Layers className="w-5 h-5" />}
            label="Features"
            active={navigation.isSectionActive('features')}
            onClick={() => navigation.navigateToSection('features', 'features')}
          />
          <SideNavbar.Navbar.Item
            id="templates"
            icon={<FileStack className="w-5 h-5" />}
            label="Templates"
            active={navigation.isSectionActive('templates')}
            onClick={() => navigation.navigateToSection('templates', 'templates')}
          />
          <SideNavbar.Navbar.Separator />
          <SideNavbar.Navbar.Item
            id="global-config"
            icon={<Palette className="w-5 h-5" />}
            label="Global Config"
            active={navigation.isSectionActive('global-config') || isSetupMode}
            onClick={() => {
              if (!currentApp && !isSetupMode) {
                handleNewApp();
              } else {
                navigation.navigateToSection('global-config', 'global-config');
              }
            }}
          />
          <SideNavbar.Navbar.Item
            id="settings"
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={navigation.isSectionActive('settings')}
            onClick={() => navigation.navigateToSection('settings', 'settings')}
          />
          <SideNavbar.Navbar.Separator />
          {/* Quick Actions */}
          <SideNavbar.Navbar.Item
            id="new-app"
            icon={<Plus className="w-5 h-5" />}
            label="New App"
            onClick={handleNewApp}
          />
          <SideNavbar.Navbar.Item
            id="save"
            icon={<Save className="w-5 h-5" />}
            label="Save"
            onClick={() => currentApp && handleSave(currentApp)}
            disabled={!currentApp}
          />
          <SideNavbar.Navbar.Item
            id="export"
            icon={<Download className="w-5 h-5" />}
            label="Export"
            onClick={handleExport}
            disabled={!currentApp}
          />
        </SideNavbar.Navbar>

        {/* Sidebar - Dynamic Content */}
        <SidebarSlotProvider>
          <SideNavbar.Sidebar>
            {/* Header - Only show when creating new app */}
            {isSetupMode && (
              <SideNavbar.Sidebar.Header
                title="Create New App"
                subtitle="Configure global tokens to get started"
              />
            )}

            <SideNavbar.Sidebar.Slot id="apps" />
            <SideNavbar.Sidebar.Slot id="templates" />
            <SideNavbar.Sidebar.Slot id="features" />
            <SideNavbar.Sidebar.Slot id="settings" />
            <SideNavbar.Sidebar.Slot id="global-config" />
            <SideNavbar.Sidebar.Slot id="feature-config" />
            <SideNavbar.Sidebar.SlotContent>
              {/* Show GlobalConfigSidebar in setup mode or when navigating to global-config */}
              {(isSetupMode || navigation.sidebarSlot === 'global-config') ? (
                isSetupMode ? (
                  <SideNavbar.Sidebar.Content>
                    <GlobalConfigSidebar
                      mode="setup"
                      initialConfig={globalConfig || undefined}
                      onAccordionChange={handleAccordionChange}
                      onConfigChange={handleGlobalConfigChange}
                      onCreateApp={handleCreateApp}
                      onSave={handleSaveGlobalConfig}
                      hideHeaderFooter={true}
                      onCreateAppRef={createAppRef}
                    />
                  </SideNavbar.Sidebar.Content>
                ) : (
                  <GlobalConfigSidebar
                    mode="edit"
                    initialConfig={currentApp?.globalTokens || undefined}
                    onAccordionChange={handleAccordionChange}
                    onConfigChange={handleGlobalConfigChange}
                    onCreateApp={handleCreateApp}
                    onSave={handleSaveGlobalConfig}
                    hideHeaderFooter={false}
                  />
                )
              ) : appBuilderState?.selectedFeature && navigation.activeFeatureId ? (
                <FeatureConfigSidebar
                  selectedFeature={appBuilderState.selectedFeature}
                  selectedComponent={appBuilderState.selectedComponent}
                  availableComponents={appBuilderState.availableComponents}
                  onFeatureChange={appBuilderState.onFeatureChange || (() => {})}
                  onComponentChange={appBuilderState.onComponentChange || (() => {})}
                  onDuplicate={() => {
                    // Duplicate logic
                  }}
                  onDelete={() => {
                    // Delete logic
                  }}
                />
              ) : (
                <>
                  {navigation.sidebarSlot === 'apps' && (
                    <AppsSlot
                      currentApp={currentApp}
                      onAppSelect={handleLoadSavedApp}
                      onAppDelete={handleDeleteSavedApp}
                      onNewApp={handleNewApp}
                    />
                  )}
                  {navigation.sidebarSlot === 'templates' && (
                    <TemplatesSlot
                      templates={templates}
                      onTemplateSelect={handleLoadTemplate}
                    />
                  )}
                  {navigation.sidebarSlot === 'features' && currentApp && (
                    <FeaturesSlot
                      features={currentApp.features}
                      selectedFeatureId={navigation.activeFeatureId}
                      onFeaturesChange={handleFeaturesChange}
                      onFeatureSelect={handleFeatureSelect}
                    />
                  )}
                  {navigation.sidebarSlot === 'settings' && (
                    <SettingsSlot />
                  )}
                </>
              )}
            </SideNavbar.Sidebar.SlotContent>

            {/* Footer - Only show when creating new app */}
            {isSetupMode && (
              <SideNavbar.Sidebar.Footer>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsSetupMode(false);
                      setGlobalConfig(null);
                      navigation.setActiveSection('apps');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Trigger create app via ref
                      if (createAppRef.current) {
                        createAppRef.current();
                      }
                    }}
                  >
                    Create App
                  </Button>
                </div>
              </SideNavbar.Sidebar.Footer>
            )}
          </SideNavbar.Sidebar>
        </SidebarSlotProvider>
      </SideNavbar>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Show preview when in setup mode or editing global config */}
        {(isSetupMode || navigation.sidebarSlot === 'global-config') ? (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              {currentApp && !isSetupMode ? (
                <AppBuilder
                  initialAppConfig={currentApp}
                  onSave={handleSave}
                  embedded={true}
                  onStateChange={setAppBuilderState}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {isSetupMode ? 'Configure Your App' : 'Global Configuration'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isSetupMode
                        ? 'Configure global tokens to get started. Preview updates in real-time.'
                        : 'Edit global configuration. Preview updates in real-time.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {globalConfig && (
              <div className="w-96 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
                <GlobalConfigPreview
                  config={globalConfig}
                  activeAccordionId={activeAccordionId}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppBuilder
              initialAppConfig={currentApp}
              onSave={handleSave}
              embedded={true}
              onStateChange={setAppBuilderState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
