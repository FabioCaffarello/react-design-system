import { useMemo, useRef, useEffect, memo } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Button } from '../atoms';
import { Card } from '../molecules';
import type { ColorRole } from '../tokens/tokens.factory';
import { SPACING_TOKENS } from '../tokens/spacing';
import { TypographyTokenFactory, type FontSize } from '../tokens/typography';
import {
  PlaygroundLayout,
  ControlGroup,
  TokenSelector,
  CodeDisplay,
} from './shared';
import {
  usePlaygroundState,
  usePlaygroundHistory,
  usePlaygroundURL,
  usePlaygroundExport,
  usePlaygroundCode,
} from './shared/hooks';
import { generateCode } from './shared/utils/codeGenerator';
import type { TokenOption } from './shared/PlaygroundControls/TokenSelector';

/**
 * Theme Playground Component
 * 
 * Interactive playground for experimenting with theme tokens in real-time.
 * Uses shared playground components for consistent UX.
 * 
 * @example
 * ```tsx
 * <ThemePlayground />
 * ```
 */
export const ThemePlayground = memo(function ThemePlayground() {
  const { theme, colors } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const initialState = {
    colorRole: 'primary' as ColorRole,
    spacing: 'base' as keyof typeof SPACING_TOKENS,
    fontSize: 'base' as FontSize,
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'theme-playground-state',
    validate: (config) => {
      if (!config.colorRole || !config.spacing || !config.fontSize) {
        return 'All fields are required';
      }
      return true;
    },
  });

  // History management
  const history = usePlaygroundHistory({
    initialState,
    maxHistorySize: 50,
  });

  // URL synchronization
  const urlState = usePlaygroundURL({
    initialState,
    serialize: (config) => ({
      colorRole: String(config.colorRole),
      spacing: String(config.spacing),
      fontSize: String(config.fontSize),
    }),
    deserialize: (params) => ({
      colorRole: (params.get('colorRole') || initialState.colorRole) as ColorRole,
      spacing: (params.get('spacing') || initialState.spacing) as keyof typeof SPACING_TOKENS,
      fontSize: (params.get('fontSize') || initialState.fontSize) as FontSize,
    }),
  });

  // Sync URL state with local state on mount
  useEffect(() => {
    if (urlState.state !== state) {
      setState(urlState.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Export/Import
  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'theme',
    state,
  });

  // Code generation
  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'theme',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'theme',
      }),
  });

  const spacingKeys = Object.keys(SPACING_TOKENS) as Array<keyof typeof SPACING_TOKENS>;

  // Token options
  const colorRoleOptions: TokenOption<ColorRole>[] = useMemo(() => {
    const colorRoles: ColorRole[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];
    return colorRoles.map((role) => ({
        value: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
        description: `Primary ${role} color`,
        preview: (
          <div
            className="w-4 h-4 rounded border"
            style={{
              backgroundColor: colors[role].DEFAULT.hex,
              borderColor: theme === 'dark' ? '#555' : '#ddd',
            }}
          />
        ),
      }));
  }, [colors, theme]);

  const spacingOptions: TokenOption<keyof typeof SPACING_TOKENS>[] = useMemo(
    () =>
      spacingKeys.map((key) => ({
        value: key,
        label: key,
        description: `${SPACING_TOKENS[key].px} (${SPACING_TOKENS[key].rem})`,
        preview: (
          <div
            className="h-4 rounded"
            style={{
              width: SPACING_TOKENS[key].px,
              backgroundColor: colors.primary.DEFAULT.hex,
            }}
          />
        ),
      })),
    [spacingKeys, colors]
  );

  const fontSizeOptions: TokenOption<FontSize>[] = useMemo(() => {
    const fontSizes: FontSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
    return fontSizes.map((size) => {
        const typo = TypographyTokenFactory.create(size);
        return {
          value: size,
          label: size,
          description: `${typo.fontSize.px} (${typo.fontSize.rem})`,
          preview: (
            <span style={{ fontSize: typo.fontSize.px }}>Aa</span>
          ),
      };
    });
  }, []);

  const selectedColor = useMemo(() => {
    return colors[state.colorRole];
  }, [colors, state.colorRole]);

  const selectedSpacingValue = useMemo(() => {
    return SPACING_TOKENS[state.spacing];
  }, [state.spacing]);

  const selectedTypography = useMemo(() => {
    return TypographyTokenFactory.create(state.fontSize);
  }, [state.fontSize]);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      setState(imported.config as typeof initialState);
    } catch (err) {
      console.error('Failed to import:', err);
      alert(`Failed to import: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };


  const handleShare = () => {
    const url = exportToURL();
    navigator.clipboard.writeText(url);
    alert('Share URL copied to clipboard!');
  };

  return (
    <>
      <PlaygroundLayout
      title="Theme Playground"
      description="Experiment with theme tokens in real-time"
      sidebarContent={
        <>
          <ControlGroup
            title="Colors"
            description="Select and preview color roles"
          >
            <TokenSelector
              label="Color Role"
              options={colorRoleOptions}
              value={state.colorRole}
              onChange={(value) => updateState('colorRole', value)}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded border shrink-0"
                  style={{
                    backgroundColor: selectedColor.light.hex,
                    borderColor: theme === 'dark' ? '#555' : '#ddd',
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Light</div>
                  <div className="text-xs font-mono text-gray-500">{selectedColor.light.hex}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded border shrink-0"
                  style={{
                    backgroundColor: selectedColor.DEFAULT.hex,
                    borderColor: theme === 'dark' ? '#555' : '#ddd',
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Default</div>
                  <div className="text-xs font-mono text-gray-500">{selectedColor.DEFAULT.hex}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded border shrink-0"
                  style={{
                    backgroundColor: selectedColor.dark.hex,
                    borderColor: theme === 'dark' ? '#555' : '#ddd',
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Dark</div>
                  <div className="text-xs font-mono text-gray-500">{selectedColor.dark.hex}</div>
                </div>
              </div>
            </div>
          </ControlGroup>

          <ControlGroup
            title="Spacing"
            description="Select spacing scale value"
          >
            <TokenSelector
              label="Spacing Scale"
              options={spacingOptions}
              value={state.spacing}
              onChange={(value) => updateState('spacing', value)}
            />
            <div className="text-xs text-gray-500">
              Value: {selectedSpacingValue.px} ({selectedSpacingValue.rem})
            </div>
          </ControlGroup>

          <ControlGroup
            title="Typography"
            description="Select font size"
          >
            <TokenSelector
              label="Font Size"
              options={fontSizeOptions}
              value={state.fontSize}
              onChange={(value) => updateState('fontSize', value)}
            />
            <div className="text-xs text-gray-500">
              Size: {selectedTypography.fontSize.px} ({selectedTypography.fontSize.rem})
            </div>
          </ControlGroup>
        </>
      }
      previewContent={
        <>
          <Card>
            <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Color Preview
              </h3>
            </div>
            <div className="p-4">
              <div
                className="rounded-lg text-center"
                style={{
                  padding: selectedSpacingValue.px,
                  backgroundColor: selectedColor.DEFAULT.hex,
                  color: selectedColor.contrast.hex,
                }}
              >
                <div style={{ fontSize: selectedTypography.fontSize.px }}>
                  {state.colorRole.toUpperCase()} Color
                </div>
                <div className="text-xs mt-1">{selectedColor.DEFAULT.hex}</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Spacing Preview
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div
                  className="rounded"
                  style={{
                    width: selectedSpacingValue.px,
                    height: selectedSpacingValue.px,
                    backgroundColor: selectedColor.DEFAULT.hex,
                  }}
                />
                <div>
                  <div className="font-semibold">
                    {state.spacing} = {selectedSpacingValue.px}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedSpacingValue.rem} • Tailwind: {selectedSpacingValue.tailwind}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Typography Preview
              </h3>
            </div>
            <div className="p-4">
              <div
                style={{
                  fontSize: selectedTypography.fontSize.px,
                  lineHeight: selectedTypography.lineHeight.value,
                  fontWeight: selectedTypography.fontWeight.value,
                  color: selectedColor.DEFAULT.hex,
                }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Component Preview
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2" style={{ gap: selectedSpacingValue.px }}>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: selectedColor.DEFAULT.hex,
                    color: selectedColor.contrast.hex,
                  }}
                >
                  Primary Button
                </Button>
              </div>
            </div>
          </Card>

          <CodeDisplay
            code={code}
            format="typescript"
            title="Generated Code"
            showCopyButton
          />
        </>
      }
      onReset={reset}
      onExport={() => exportToJSON()}
      onImport={() => fileInputRef.current?.click()}
      onShare={handleShare}
      isDirty={history.historyIndex > 0}
    />
    <input
      ref={fileInputRef}
      type="file"
      accept=".json"
      onChange={handleFileImport}
      style={{ display: 'none' }}
      aria-label="Import playground configuration"
      />
    </>
  );
});

