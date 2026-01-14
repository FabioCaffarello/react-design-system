'use client';

import type { GlobalTokensConfig } from '../../types';
import { TypographyPreview } from './previews/TypographyPreview';
import { ColorsPreview } from './previews/ColorsPreview';
import { SpacingPreview } from './previews/SpacingPreview';
import { ShadowsPreview } from './previews/ShadowsPreview';
import { RadiusPreview } from './previews/RadiusPreview';

export interface GlobalConfigPreviewProps {
  config: GlobalTokensConfig;
  activeAccordionId: string | null;
}

/**
 * GlobalConfigPreview
 * 
 * Dynamic preview component that changes based on the active accordion.
 * Shows specific preview for the accordion item that is currently open.
 */
export function GlobalConfigPreview({
  config,
  activeAccordionId,
}: GlobalConfigPreviewProps) {
  // Parse accordion ID to determine which preview to show
  const getPreviewComponent = () => {
    if (!activeAccordionId) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a configuration section to see preview
            </p>
          </div>
        </div>
      );
    }

    // Parse accordion ID format: "typography-fontSizes", "colors-palette", etc.
    const [category, subcategory] = activeAccordionId.split('-');

    switch (category) {
      case 'typography':
        return (
          <TypographyPreview
            config={config}
            focus={subcategory as 'fontSizes' | 'fontWeights' | 'lineHeights' | 'fontFamilies'}
          />
        );

      case 'colors':
        return (
          <ColorsPreview
            config={config}
            focus={subcategory as 'palette' | 'semantic'}
          />
        );

      case 'spacing':
        return <SpacingPreview config={config} />;

      case 'shadows':
        return <ShadowsPreview config={config} />;

      case 'radius':
        return <RadiusPreview config={config} />;

      case 'sideNavbar':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              SideNavbar Preview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              SideNavbar configuration preview will be shown here.
            </p>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preview not available for this section.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {getPreviewComponent()}
    </div>
  );
}
