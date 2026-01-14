import { useMemo, useRef, useEffect, memo } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Badge } from '../atoms';
import { Card } from '../molecules';
import type { ColorRole } from '../tokens/colors';
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
import { calculateContrastResult } from './shared/utils/contrastCalculator';
import type { TokenOption } from './shared/PlaygroundControls/TokenSelector';

type ViewMode = 'palette' | 'contrast' | 'usage';

interface ColorsState {
  colorRole: ColorRole;
  viewMode: ViewMode;
}

/**
 * Colors Playground Component
 * 
 * Interactive playground for experimenting with color tokens.
 * Uses shared playground components for consistent UX.
 * 
 * @example
 * ```tsx
 * <ColorsPlayground />
 * ```
 */
export const ColorsPlayground = memo(function ColorsPlayground() {
  const { theme, colors } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: ColorsState = {
    colorRole: 'primary',
    viewMode: 'palette',
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'colors-playground-state',
  });

  const history = usePlaygroundHistory({
    initialState,
    maxHistorySize: 50,
  });

  const urlState = usePlaygroundURL({
    initialState,
    serialize: (config) => ({
      colorRole: String(config.colorRole),
      viewMode: String(config.viewMode),
    }),
    deserialize: (params) => ({
      colorRole: (params.get('colorRole') || initialState.colorRole) as ColorRole,
      viewMode: (params.get('viewMode') || initialState.viewMode) as ViewMode,
    }),
  });

  useEffect(() => {
    if (urlState.state !== state) {
      setState(urlState.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'colors',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'colors',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'colors',
      }),
  });

  const selectedColor = useMemo(() => {
    return colors[state.colorRole];
  }, [colors, state.colorRole]);

  const contrastResult = useMemo(() => {
    return calculateContrastResult(selectedColor.DEFAULT.hex, selectedColor.contrast.hex);
  }, [selectedColor]);

  const colorRoleOptions: TokenOption<ColorRole>[] = useMemo(() => {
    const colorRoles: ColorRole[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];
    return colorRoles.map((role) => {
      const color = colors[role];
      return {
        value: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
        description: color.DEFAULT.hex,
        preview: (
          <div
            className="w-6 h-6 rounded border"
            style={{
              backgroundColor: color.DEFAULT.hex,
              borderColor: theme === 'dark' ? '#555' : '#ddd',
            }}
          />
        ),
      };
    });
  }, [colors, theme]);

  const viewModeOptions: TokenOption<ViewMode>[] = useMemo(() => {
    return (['palette', 'contrast', 'usage'] as const).map((mode) => ({
      value: mode,
      label: mode.charAt(0).toUpperCase() + mode.slice(1),
      description: `View ${mode} mode`,
    }));
  }, []);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      setState(imported.config as ColorsState);
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
        title="Colors Playground"
        description="Explore color palettes and test contrast"
        sidebarContent={
          <>
            <ControlGroup
              title="Color Roles"
              description="Select a color role to explore"
            >
              <TokenSelector
                label="Color Role"
                options={colorRoleOptions}
                value={state.colorRole}
                onChange={(value) => updateState('colorRole', value)}
              />
            </ControlGroup>

            <ControlGroup
              title="View Mode"
              description="Select view mode"
            >
              <TokenSelector
                label="Mode"
                options={viewModeOptions}
                value={state.viewMode}
                onChange={(value) => updateState('viewMode', value)}
              />
            </ControlGroup>

            <ControlGroup
              title="Color Info"
              description="Color information"
            >
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Default:</span>
                  <span className="font-mono text-xs">{selectedColor.DEFAULT.hex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">RGB:</span>
                  <span className="font-mono text-xs">{selectedColor.DEFAULT.rgb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Contrast:</span>
                  <Badge
                    variant={contrastResult.passesAA ? 'success' : 'warning'}
                    size="sm"
                  >
                    {contrastResult.ratio.toFixed(2)}:1
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">WCAG:</span>
                  <Badge
                    variant={contrastResult.passesAA ? 'success' : 'error'}
                    size="sm"
                  >
                    {contrastResult.level}
                  </Badge>
                </div>
              </div>
            </ControlGroup>
          </>
        }
        previewContent={
          <>
            {state.viewMode === 'palette' && (
              <Card>
                <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                  <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                    {state.colorRole.charAt(0).toUpperCase() + state.colorRole.slice(1)} Palette
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-2">
                    {(['light', 'DEFAULT', 'dark', 'contrast'] as const).map((shade) => {
                      const color = selectedColor[shade];
                      return (
                        <div
                          key={shade}
                          className="rounded border min-h-[120px] flex flex-col justify-between p-4"
                          style={{
                            backgroundColor: color.hex,
                            color: shade === 'contrast' ? selectedColor.DEFAULT.hex : color.hex,
                            borderColor: theme === 'dark' ? '#555' : '#ddd',
                          }}
                        >
                          <div
                            className="px-2 py-1 rounded text-xs font-semibold capitalize"
                            style={{
                              backgroundColor: shade === 'contrast' ? selectedColor.DEFAULT.hex : 'rgba(0,0,0,0.1)',
                              color: shade === 'contrast' ? selectedColor.contrast.hex : color.hex,
                            }}
                          >
                            {shade}
                          </div>
                          <div className="text-xs font-mono" style={{ color: shade === 'contrast' ? selectedColor.DEFAULT.hex : color.hex }}>
                            {color.hex}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {state.viewMode === 'contrast' && (
              <Card>
                <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                  <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                    Contrast Testing
                  </h3>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div
                    className="rounded-lg p-6"
                    style={{
                      backgroundColor: selectedColor.DEFAULT.hex,
                      color: selectedColor.contrast.hex,
                    }}
                  >
                    <div className="text-2xl font-bold mb-2">Large Text (24px+)</div>
                    <div className="text-base mb-2">Regular Text (16px)</div>
                    <div className="text-sm">Small Text (14px)</div>
                    <div className="mt-4 px-2 py-1 rounded bg-black/10 text-xs">
                      Contrast Ratio: {contrastResult.ratio.toFixed(2)}:1
                      {contrastResult.passesAA ? (
                        <Badge variant="success" className="ml-2">
                          WCAG AA ✓
                        </Badge>
                      ) : (
                        <Badge variant="error" className="ml-2">
                          Not Accessible
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {state.viewMode === 'usage' && (
              <Card>
                <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                  <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                    Usage Examples
                  </h3>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div>
                    <h4 className="m-0 mb-2 text-base">Button</h4>
                    <button
                      className="px-4 py-2 rounded border-none cursor-pointer text-sm font-semibold"
                      style={{
                        backgroundColor: selectedColor.DEFAULT.hex,
                        color: selectedColor.contrast.hex,
                      }}
                    >
                      {state.colorRole.charAt(0).toUpperCase() + state.colorRole.slice(1)} Button
                    </button>
                  </div>

                  <div>
                    <h4 className="m-0 mb-2 text-base">Badge</h4>
                    <Badge
                      variant={state.colorRole === 'primary' ? 'primary' : state.colorRole === 'success' ? 'success' : 'secondary'}
                      style={{
                        backgroundColor: selectedColor.DEFAULT.hex,
                        color: selectedColor.contrast.hex,
                      }}
                    >
                      {state.colorRole.charAt(0).toUpperCase() + state.colorRole.slice(1)} Badge
                    </Badge>
                  </div>

                  <div>
                    <h4 className="m-0 mb-2 text-base">Card with Border</h4>
                    <div
                      className="p-6 rounded border-2"
                      style={{
                        borderColor: selectedColor.DEFAULT.hex,
                        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
                      }}
                    >
                      <div className="font-semibold mb-1">Card Title</div>
                      <div className="text-sm text-gray-500">
                        This card uses {state.colorRole} color for the border.
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

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
