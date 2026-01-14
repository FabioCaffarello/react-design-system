'use client';

import React from 'react';
import type { GlobalTokensConfig } from '../../types';
import { SideNavbar } from '../../../../organisms/SideNavbar';
import { Form } from '../../../../molecules/Form';
import { Button } from '../../../../atoms';
import { TypographyConfig } from './TypographyConfig';
import { ColorsConfig } from './ColorsConfig';
import { SpacingConfig } from './SpacingConfig';
import { ShadowsConfig } from './ShadowsConfig';
import { RadiusConfig } from './RadiusConfig';
import { SideNavbarConfig } from './SideNavbarConfig';
import { useGlobalConfigForm } from '../../hooks/useGlobalConfigForm';

export interface GlobalConfigSidebarProps {
  mode: 'setup' | 'edit';
  initialConfig?: Partial<GlobalTokensConfig>;
  onAccordionChange?: (activeId: string | null) => void;
  onConfigChange?: (config: GlobalTokensConfig) => void; // For real-time preview
  onCreateApp?: (config: GlobalTokensConfig) => void; // Modo setup
  onSave?: (config: GlobalTokensConfig) => void; // Modo edit
  hideHeaderFooter?: boolean; // When true, only renders content without Header/Footer
  onCreateAppRef?: React.MutableRefObject<(() => void) | undefined>; // Ref to trigger create app from outside
}

/**
 * GlobalConfigSidebar
 * 
 * Main sidebar component for configuring global tokens.
 * Uses Form with react-hook-form and Sidebar Groups with Accordions.
 */
export function GlobalConfigSidebar({
  mode,
  initialConfig,
  onAccordionChange: onAccordionChangeProp,
  onConfigChange,
  onCreateApp,
  onSave,
  hideHeaderFooter = false,
  onCreateAppRef,
}: GlobalConfigSidebarProps) {
  const { form, watchedValues, isValid, validationErrors, reset, handleSubmit } = useGlobalConfigForm({
    initialConfig,
    mode,
    onConfigChange,
  });

  const handleCreateApp = handleSubmit((data) => {
    onCreateApp?.(data);
  });

  const handleSave = handleSubmit((data) => {
    onSave?.(data);
  });

  const handleReset = () => {
    reset();
  };

  // Expose handleCreateApp via ref if provided
  React.useEffect(() => {
    if (onCreateAppRef) {
      onCreateAppRef.current = handleCreateApp;
    }
  }, [handleCreateApp, onCreateAppRef]);

  const groupsContent = (
    <Form form={form} onSubmit={() => {}}>
      {/* Typography Group (Required) */}
      <SideNavbar.Sidebar.Group id="typography" title="Typography">
        <TypographyConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>

      {/* Colors Group (Required) */}
      <SideNavbar.Sidebar.Group id="colors" title="Colors">
        <ColorsConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>

      {/* Spacing Group (Required) */}
      <SideNavbar.Sidebar.Group id="spacing" title="Spacing">
        <SpacingConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>

      {/* Shadows Group (Optional) */}
      <SideNavbar.Sidebar.Group id="shadows" title="Shadows">
        <ShadowsConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>

      {/* Radius Group (Optional) */}
      <SideNavbar.Sidebar.Group id="radius" title="Radius">
        <RadiusConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>

      {/* SideNavbar Group (Optional) */}
      <SideNavbar.Sidebar.Group id="sideNavbar" title="SideNavbar">
        <SideNavbarConfig
          onAccordionChange={onAccordionChangeProp}
        />
      </SideNavbar.Sidebar.Group>
    </Form>
  );

  // If hideHeaderFooter is true, only return groups content (without Sidebar wrapper)
  // The groups will be rendered inside the parent Sidebar.Content
  if (hideHeaderFooter) {
    return <>{groupsContent}</>;
  }

  // Otherwise, return full Sidebar with Header and Footer
  return (
    <SideNavbar.Sidebar>
      <SideNavbar.Sidebar.Header
        title={mode === 'setup' ? 'App Setup' : 'Global Configuration'}
      />
      <SideNavbar.Sidebar.Content>{groupsContent}</SideNavbar.Sidebar.Content>
      <SideNavbar.Sidebar.Footer>
        <div className="flex flex-col gap-2 p-4">
          {!isValid && validationErrors.length > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mb-2">
              {validationErrors[0]}
            </div>
          )}
          <div className="flex gap-2">
            {mode === 'setup' ? (
              <>
                <Button
                  onClick={handleCreateApp}
                  disabled={!isValid}
                  className="flex-1"
                >
                  Create App
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </SideNavbar.Sidebar.Footer>
    </SideNavbar.Sidebar>
  );
}
