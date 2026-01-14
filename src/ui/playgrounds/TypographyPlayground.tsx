import { useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Input } from '../atoms';
import { Card } from '../molecules';
import { TypographyTokenFactory, type FontSize, type LineHeight, type FontWeight, FONT_FAMILY_TOKENS, FONT_WEIGHT_TOKENS } from '../tokens/typography';
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

type FontFamily = 'sans' | 'serif' | 'mono';

interface TypographyState {
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontWeight: FontWeight;
  fontFamily: FontFamily;
  sampleText: string;
}

/**
 * Typography Playground Component
 * 
 * Interactive playground for experimenting with typography tokens.
 * Uses shared playground components for consistent UX.
 * 
 * @example
 * ```tsx
 * <TypographyPlayground />
 * ```
 */
export function TypographyPlayground() {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: TypographyState = {
    fontSize: 'base',
    lineHeight: 'normal',
    fontWeight: 'normal',
    fontFamily: 'sans',
    sampleText: 'The quick brown fox jumps over the lazy dog',
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'typography-playground-state',
  });

  const history = usePlaygroundHistory({
    initialState,
    maxHistorySize: 50,
  });

  const urlState = usePlaygroundURL({
    initialState,
    serialize: (config) => ({
      fontSize: String(config.fontSize),
      lineHeight: String(config.lineHeight),
      fontWeight: String(config.fontWeight),
      fontFamily: String(config.fontFamily),
      sampleText: String(config.sampleText),
    }),
    deserialize: (params) => ({
      fontSize: (params.get('fontSize') || initialState.fontSize) as FontSize,
      lineHeight: (params.get('lineHeight') || initialState.lineHeight) as LineHeight,
      fontWeight: (params.get('fontWeight') || initialState.fontWeight) as FontWeight,
      fontFamily: (params.get('fontFamily') || initialState.fontFamily) as FontFamily,
      sampleText: params.get('sampleText') || initialState.sampleText,
    }),
  });

  useEffect(() => {
    if (urlState.state !== state) {
      setState(urlState.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'typography',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'typography',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'typography',
      }),
  });

  const typography = useMemo(() => {
    return TypographyTokenFactory.create(state.fontSize, state.lineHeight, state.fontWeight);
  }, [state.fontSize, state.lineHeight, state.fontWeight]);

  const fontFamily = useMemo(() => {
    return FONT_FAMILY_TOKENS[state.fontFamily];
  }, [state.fontFamily]);

  // Define font sizes array as a constant to reuse in multiple places
  const fontSizes: FontSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

  const fontSizeOptions: TokenOption<FontSize>[] = useMemo(() => {
    return fontSizes.map((size) => {
      const typo = TypographyTokenFactory.create(size);
      return {
        value: size,
        label: size,
        description: `${typo.fontSize.px} (${typo.fontSize.rem})`,
        preview: <span style={{ fontSize: typo.fontSize.px }}>Aa</span>,
      };
    });
  }, [fontSizes]);

  const lineHeightOptions: TokenOption<LineHeight>[] = useMemo(() => {
    const lineHeights: LineHeight[] = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'];
    return lineHeights.map((height) => ({
      value: height,
      label: height,
      description: `Line height: ${height}`,
    }));
  }, []);

  const fontWeightOptions: TokenOption<FontWeight>[] = useMemo(() => {
    const fontWeights: FontWeight[] = ['light', 'normal', 'medium', 'semibold', 'bold'];
    return fontWeights.map((weight) => ({
      value: weight,
      label: weight,
      description: `${FONT_WEIGHT_TOKENS[weight].value}`,
    }));
  }, []);

  const fontFamilyOptions: TokenOption<FontFamily>[] = useMemo(() => {
    const fontFamilies: FontFamily[] = ['sans', 'serif', 'mono'];
    return fontFamilies.map((family) => ({
      value: family,
      label: family,
      description: fontFamily.name,
      preview: <span style={{ fontFamily: fontFamily.stack }}>Aa</span>,
    }));
  }, [fontFamily]);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      setState(imported.config as TypographyState);
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
        title="Typography Playground"
        description="Experiment with typography tokens"
        sidebarContent={
          <>
            <ControlGroup title="Font Size" description="Select font size">
              <TokenSelector
                label="Font Size"
                options={fontSizeOptions}
                value={state.fontSize}
                onChange={(value) => updateState('fontSize', value)}
              />
            </ControlGroup>

            <ControlGroup title="Line Height" description="Select line height">
              <TokenSelector
                label="Line Height"
                options={lineHeightOptions}
                value={state.lineHeight}
                onChange={(value) => updateState('lineHeight', value)}
              />
            </ControlGroup>

            <ControlGroup title="Font Weight" description="Select font weight">
              <TokenSelector
                label="Font Weight"
                options={fontWeightOptions}
                value={state.fontWeight}
                onChange={(value) => updateState('fontWeight', value)}
              />
            </ControlGroup>

            <ControlGroup title="Font Family" description="Select font family">
              <TokenSelector
                label="Font Family"
                options={fontFamilyOptions}
                value={state.fontFamily}
                onChange={(value) => updateState('fontFamily', value)}
              />
            </ControlGroup>

            <ControlGroup title="Sample Text" description="Enter custom text">
              <Input
                type="text"
                value={state.sampleText}
                onChange={(e) => updateState('sampleText', e.target.value)}
                placeholder="Enter sample text..."
              />
            </ControlGroup>
          </>
        }
        previewContent={
          <>
            <Card>
              <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                  Preview
                </h3>
              </div>
              <div className="p-6">
                <div
                  style={{
                    fontSize: typography.fontSize.px,
                    lineHeight: typography.lineHeight.value,
                    fontWeight: typography.fontWeight.value,
                    fontFamily: fontFamily.stack,
                  }}
                >
                  {state.sampleText}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b" style={{ borderColor: theme === 'dark' ? '#333' : '#e5e5e5' }}>
                <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                  All Font Sizes
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {fontSizes.map((size) => {
                  const typo = TypographyTokenFactory.create(size);
                  return (
                    <div key={size} className="flex items-baseline gap-4">
                      <div className="w-16 text-xs text-gray-500">{size}</div>
                      <div
                        style={{
                          fontSize: typo.fontSize.px,
                          lineHeight: typo.lineHeight.value,
                          fontFamily: fontFamily.stack,
                        }}
                      >
                        {state.sampleText}
                      </div>
                      <div className="ml-auto text-xs text-gray-500">{typo.fontSize.px}</div>
                    </div>
                  );
                })}
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
