import { useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Card } from '../molecules';
import { SPACING_TOKENS } from '../tokens/spacing';
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

type PreviewMode = 'box' | 'gap' | 'padding' | 'margin';

interface SpacingState {
  spacing: keyof typeof SPACING_TOKENS;
  previewMode: PreviewMode;
}

/**
 * Spacing Playground Component
 * 
 * Interactive playground for experimenting with spacing tokens.
 * Uses shared playground components for consistent UX.
 * 
 * @example
 * ```tsx
 * <SpacingPlayground />
 * ```
 */
export function SpacingPlayground() {
  const { theme, colors } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: SpacingState = {
    spacing: 'base',
    previewMode: 'padding',
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'spacing-playground-state',
  });

  const history = usePlaygroundHistory({
    initialState,
    maxHistorySize: 50,
  });

  const urlState = usePlaygroundURL({
    initialState,
    serialize: (config) => ({
      spacing: String(config.spacing),
      previewMode: String(config.previewMode),
    }),
    deserialize: (params) => ({
      spacing: (params.get('spacing') || initialState.spacing) as keyof typeof SPACING_TOKENS,
      previewMode: (params.get('previewMode') || initialState.previewMode) as PreviewMode,
    }),
  });

  useEffect(() => {
    if (urlState.state !== state) {
      setState(urlState.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'spacing',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'spacing',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'spacing',
      }),
  });

  const spacingKeys = Object.keys(SPACING_TOKENS) as Array<keyof typeof SPACING_TOKENS>;
  const selectedSpacingValue = useMemo(() => {
    return SPACING_TOKENS[state.spacing];
  }, [state.spacing]);

  const primaryColor = colors.primary.DEFAULT.hex;
  const secondaryColor = colors.secondary.DEFAULT.hex;

  const spacingOptions: TokenOption<keyof typeof SPACING_TOKENS>[] = useMemo(() => {
    return spacingKeys.map((key) => ({
      value: key,
      label: key,
      description: `${SPACING_TOKENS[key].px} (${SPACING_TOKENS[key].rem})`,
      preview: (
        <div
          className="h-4 rounded"
          style={{
            width: SPACING_TOKENS[key].px,
            backgroundColor: primaryColor,
          }}
        />
      ),
    }));
  }, [spacingKeys, primaryColor]);

  const previewModeOptions: TokenOption<PreviewMode>[] = useMemo(() => {
    return (['box', 'gap', 'padding', 'margin'] as const).map((mode) => ({
      value: mode,
      label: mode.charAt(0).toUpperCase() + mode.slice(1),
      description: `Preview as ${mode}`,
    }));
  }, []);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      setState(imported.config as SpacingState);
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
        title="Spacing Playground"
        description="Visualize and test spacing tokens"
        sidebarContent={
          <>
            <ControlGroup title="Spacing Scale" description="Select spacing value">
              <TokenSelector
                label="Spacing"
                options={spacingOptions}
                value={state.spacing}
                onChange={(value) => updateState('spacing', value)}
              />
              <div className="text-xs text-gray-500">
                Value: {selectedSpacingValue.px} ({selectedSpacingValue.rem})
              </div>
            </ControlGroup>

            <ControlGroup title="Preview Mode" description="Select preview mode">
              <TokenSelector
                label="Mode"
                options={previewModeOptions}
                value={state.previewMode}
                onChange={(value) => updateState('previewMode', value)}
              />
            </ControlGroup>
          </>
        }
        previewContent={
          <>
            <Card>
              <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                  Visual Scale
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-2">
                {spacingKeys.map((key) => {
                  const spacing = SPACING_TOKENS[key];
                  const isSelected = key === state.spacing;
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-20 text-xs text-gray-500">{key}</div>
                      <div
                        className="rounded"
                        style={{
                          width: spacing.px,
                          height: '24px',
                          backgroundColor: isSelected ? primaryColor : secondaryColor,
                          border: isSelected ? `2px solid ${colors.primary.dark.hex}` : 'none',
                        }}
                      />
                      <div className="ml-auto text-xs text-gray-500">{spacing.px}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                  Preview: {state.previewMode.charAt(0).toUpperCase() + state.previewMode.slice(1)}
                </h3>
              </div>
              <div className="p-6">
                {state.previewMode === 'box' && (
                  <div
                    className="rounded flex items-center justify-center text-white text-xs"
                    style={{
                      width: selectedSpacingValue.px,
                      height: selectedSpacingValue.px,
                      backgroundColor: primaryColor,
                    }}
                  >
                    {selectedSpacingValue.px}
                  </div>
                )}

                {state.previewMode === 'gap' && (
                  <div className="flex gap-4 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="rounded flex items-center justify-center text-white text-sm font-semibold"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: primaryColor,
                        }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                )}

                {state.previewMode === 'padding' && (
                  <div
                    className="rounded border-dashed"
                    style={{
                      padding: selectedSpacingValue.px,
                      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                      borderColor: theme === 'dark' ? '#555' : '#ddd',
                    }}
                  >
                    <div
                      className="rounded text-center text-white"
                      style={{
                        padding: selectedSpacingValue.px,
                        backgroundColor: primaryColor,
                      }}
                    >
                      Padding: {selectedSpacingValue.px}
                    </div>
                  </div>
                )}

                {state.previewMode === 'margin' && (
                  <div
                    className="rounded"
                    style={{
                      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                      padding: SPACING_TOKENS.md.px,
                    }}
                  >
                    <div
                      className="rounded text-center text-white"
                      style={{
                        margin: selectedSpacingValue.px,
                        padding: SPACING_TOKENS.md.px,
                        backgroundColor: primaryColor,
                      }}
                    >
                      Margin: {selectedSpacingValue.px}
                    </div>
                  </div>
                )}
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
}
