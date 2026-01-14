/**
 * Token Configurator Component
 * 
 * Main component for configuring design tokens.
 */

import { useState } from 'react';
import { useTheme } from '../../../../providers/ThemeProvider';
import { Card } from '../../../../molecules';
import { Button } from '../../../../atoms';
import Tabs from '../../../../molecules/Tabs/Tabs';
import { ColorTokenEditor } from './ColorTokenEditor';
import { SpacingTokenEditor } from './SpacingTokenEditor';
import { TypographyTokenEditor } from './TypographyTokenEditor';
import { TokenPreview } from './TokenPreview';
import type { TokenConfig } from '../../types';

export interface TokenConfiguratorProps {
  tokens: TokenConfig;
  onTokensChange: (tokens: Partial<TokenConfig>) => void;
}

export function TokenConfigurator({ tokens, onTokensChange }: TokenConfiguratorProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'spacing' | 'typography' | 'preview'>('colors');

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <Tabs.List>
          <Tabs.Trigger value="colors">Colors</Tabs.Trigger>
          <Tabs.Trigger value="spacing">Spacing</Tabs.Trigger>
          <Tabs.Trigger value="typography">Typography</Tabs.Trigger>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="colors">
          <ColorTokenEditor
            colors={tokens.colors}
            onChange={(colors) => onTokensChange({ colors })}
          />
        </Tabs.Content>

        <Tabs.Content value="spacing">
          <SpacingTokenEditor
            spacing={tokens.spacing}
            onChange={(spacing) => onTokensChange({ spacing })}
          />
        </Tabs.Content>

        <Tabs.Content value="typography">
          <TypographyTokenEditor
            typography={tokens.typography}
            onChange={(typography) => onTokensChange({ typography })}
          />
        </Tabs.Content>

        <Tabs.Content value="preview">
          <TokenPreview tokens={tokens} />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
